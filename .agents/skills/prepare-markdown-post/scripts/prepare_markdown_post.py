#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
import unicodedata
from datetime import date
from pathlib import Path


FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*(?:\n|\Z)", re.DOTALL)
ANCHOR_RE = re.compile(r'^\s*<a\s+id="([^"]+)">\s*</a>\s*$', re.IGNORECASE)
ANCHOR_ANY_RE = re.compile(r'\s*<a\s+id="[^"]+">\s*</a>\s*', re.IGNORECASE)
H2_RE = re.compile(r"^(##)(?!#)\s+(.+?)\s*$")
HEADING_ATTR_RE = re.compile(r"\s+\{#([^{}\s]+)\}\s*$")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
WHITESPACE_RE = re.compile(r"\s+")


def strip_frontmatter(markdown: str) -> str:
    return FRONTMATTER_RE.sub("", markdown, count=1)


def normalize_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def split_body(markdown: str) -> str:
    return strip_frontmatter(normalize_newlines(markdown))


def escape_yaml_double_quoted(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value).strip().lower()
    chars: list[str] = []
    previous_dash = False

    for char in normalized:
        if char.isalnum():
            chars.append(char)
            previous_dash = False
        elif not previous_dash:
            chars.append("-")
            previous_dash = True

    slug = "".join(chars).strip("-")
    return slug or "section"


def unique_slug(base: str, used: set[str]) -> str:
    candidate = base
    index = 2
    while candidate in used:
        candidate = f"{base}-{index}"
        index += 1
    used.add(candidate)
    return candidate


def normalize_blank_lines(body: str) -> str:
    lines = body.split("\n")
    result: list[str] = []
    in_fence = False
    blank_count = 0

    for line in lines:
        if FENCE_RE.match(line):
            in_fence = not in_fence
            result.append(line)
            blank_count = 0
            continue

        if in_fence:
            result.append(line)
            continue

        if line.strip() == "":
            blank_count += 1
            if blank_count <= 1:
                result.append("")
            continue

        blank_count = 0
        result.append(line)

    return "\n".join(result).strip("\n") + "\n"


def existing_anchor_ids(body: str) -> set[str]:
    ids: set[str] = set()
    for line in body.splitlines():
        match = ANCHOR_RE.match(line)
        if match:
            ids.add(match.group(1))
    return ids


def previous_nonblank_is_anchor(lines: list[str]) -> bool:
    for line in reversed(lines):
        if line.strip() == "":
            continue
        return bool(ANCHOR_RE.match(line))
    return False


def replace_previous_nonblank_anchor(lines: list[str], anchor_id: str) -> bool:
    for index in range(len(lines) - 1, -1, -1):
        if lines[index].strip() == "":
            continue
        if ANCHOR_RE.match(lines[index]):
            lines[index] = f'<a id="{anchor_id}"></a>'
            return True
        return False
    return False


def normalize_anchor_markup(body: str) -> str:
    result: list[str] = []
    in_fence = False

    for line in body.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            result.append(line)
            continue

        match = ANCHOR_RE.match(line) if not in_fence else None
        if match:
            result.append(f'<a id="{match.group(1)}"></a>')
            continue

        result.append(line)

    return "\n".join(result).strip("\n") + "\n"


def normalize_h2_heading_attributes(body: str) -> str:
    result: list[str] = []
    in_fence = False

    for line in body.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            result.append(line)
            continue

        match = H2_RE.match(line) if not in_fence else None
        if match:
            heading_text = match.group(2)
            attr_match = HEADING_ATTR_RE.search(heading_text)
            if attr_match:
                anchor_id = attr_match.group(1)
                clean_heading = HEADING_ATTR_RE.sub("", heading_text).rstrip()
                if not replace_previous_nonblank_anchor(result, anchor_id):
                    result.append(f'<a id="{anchor_id}"></a>')
                result.append(f"{match.group(1)} {clean_heading}")
                continue

        result.append(line)

    return "\n".join(result).strip("\n") + "\n"


def add_h2_anchors(body: str) -> str:
    used = existing_anchor_ids(body)
    result: list[str] = []
    in_fence = False

    for line in body.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            result.append(line)
            continue

        match = H2_RE.match(line) if not in_fence else None
        if match and not previous_nonblank_is_anchor(result):
            slug = unique_slug(slugify(match.group(2)), used)
            result.append(f'<a id="{slug}"></a>')

        result.append(line)

    return "\n".join(result).strip("\n") + "\n"


def parse_term_anchor(value: str) -> tuple[str, str]:
    if "::" in value:
        term, custom_slug = value.split("::", 1)
        term = term.strip()
        custom_slug = custom_slug.strip()
    else:
        term = value.strip()
        custom_slug = ""

    if not term:
        raise ValueError("--term-anchor must include a non-empty term")

    return term, custom_slug or slugify(term)


def normalize_definition_line(line: str) -> str:
    stripped = line.strip()
    stripped = re.sub(r"^[*_`]+|[*_`]+$", "", stripped)
    stripped = re.sub(r"^\*\*(.+?)\*\*", r"\1", stripped)
    return stripped


def looks_like_definition(line: str, term: str) -> bool:
    normalized_line = normalize_definition_line(line)
    escaped = re.escape(term)
    patterns = [
        rf"^{escaped}\s*[:\-–—]",
        rf"^{escaped}\s+is\s+",
        rf"^{escaped}\s+means\s+",
        rf"^{escaped}\s+это\s+",
        rf"^{escaped}\s+[–—-]\s+это\s+",
    ]
    return any(re.search(pattern, normalized_line, re.IGNORECASE) for pattern in patterns)


def add_term_anchors(body: str, terms: list[tuple[str, str]]) -> str:
    if not terms:
        return body

    used = existing_anchor_ids(body)
    remaining = list(terms)
    result: list[str] = []
    in_fence = False

    for line in body.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            result.append(line)
            continue

        if not in_fence and remaining and line.strip() and not H2_RE.match(line):
            matched_index = None
            for index, (term, _slug) in enumerate(remaining):
                if looks_like_definition(line, term):
                    matched_index = index
                    break

            if matched_index is not None and not previous_nonblank_is_anchor(result):
                term, requested_slug = remaining.pop(matched_index)
                slug = unique_slug(slugify(requested_slug), used)
                result.append(f'<a id="{slug}"></a>')
            elif matched_index is not None:
                remaining.pop(matched_index)

        result.append(line)

    for term, _slug in remaining:
        print(f"warning: no clear definition found for term anchor: {term}", file=sys.stderr)

    return "\n".join(result).strip("\n") + "\n"


def canonical_frontmatter(description: str, reading_time: int, post_date: str) -> str:
    tags = ", ".join(['""'] * 20)
    safe_description = escape_yaml_double_quoted(description)
    return (
        "---\n"
        'title: ""\n'
        f'date: "{post_date}"\n'
        f'description: "{safe_description}"\n'
        f"tags: [{tags}]\n"
        f"readingTime: {reading_time}\n"
        'ogImage: ""\n'
        "published: false\n"
        "---\n"
    )


def visible_body_text(markdown: str) -> str:
    body = split_body(markdown)
    body = ANCHOR_ANY_RE.sub(" ", body)
    body = HEADING_ATTR_RE.sub("", body)
    body = WHITESPACE_RE.sub(" ", body).strip()
    return body


def find_repo_root(article_path: Path) -> Path:
    starts = [article_path.resolve().parent, Path(__file__).resolve().parent]
    for start in starts:
        for candidate in [start, *start.parents]:
            if (candidate / "scripts" / "calc_reading_time.py").is_file():
                return candidate
    raise SystemExit("Could not find repo root with scripts/calc_reading_time.py")


def calculate_reading_time(markdown: str, repo_root: Path) -> int:
    script_path = repo_root / "scripts" / "calc_reading_time.py"
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        suffix=".md",
        delete=False,
    ) as temp_file:
        temp_file.write(markdown)
        temp_path = Path(temp_file.name)

    try:
        result = subprocess.run(
            [sys.executable, str(script_path), str(temp_path)],
            cwd=repo_root,
            check=True,
            capture_output=True,
            text=True,
        )
    finally:
        temp_path.unlink(missing_ok=True)

    return int(result.stdout.strip())


def transform(markdown: str, description: str, term_anchors: list[tuple[str, str]], repo_root: Path) -> str:
    original_visible = visible_body_text(markdown)
    body = split_body(markdown)
    body = normalize_blank_lines(body)
    body = normalize_anchor_markup(body)
    body = normalize_h2_heading_attributes(body)
    body = add_h2_anchors(body)
    body = add_term_anchors(body, term_anchors)
    post_date = date.today().isoformat()

    provisional = canonical_frontmatter(description, 1, post_date) + body
    reading_time = calculate_reading_time(provisional, repo_root)
    transformed = canonical_frontmatter(description, reading_time, post_date) + body

    if visible_body_text(transformed) != original_visible:
        raise SystemExit("Visible body text changed; aborting.")

    return transformed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare a repo markdown post without changing visible body text."
    )
    parser.add_argument("article_path", help="Path to the markdown article.")
    parser.add_argument("--description", required=True, help="SEO description for frontmatter.")
    parser.add_argument(
        "--term-anchor",
        action="append",
        default=[],
        help='Explicit term definition anchor, e.g. "Agent::agent-definition". Repeat as needed.',
    )
    parser.add_argument("--dry-run", action="store_true", help="Print output without writing.")
    parser.add_argument("--check", action="store_true", help="Exit 1 if the file would change.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    article_path = Path(args.article_path)

    if not article_path.is_file():
        raise SystemExit(f"File not found: {article_path}")

    term_anchors = [parse_term_anchor(value) for value in args.term_anchor]
    markdown = normalize_newlines(article_path.read_text(encoding="utf-8"))
    repo_root = find_repo_root(article_path)
    transformed = transform(markdown, args.description, term_anchors, repo_root)

    if args.dry_run:
        print(transformed, end="")
        return 0

    if args.check:
        if transformed == markdown:
            print("No changes needed.")
            return 0
        print("Changes needed.")
        return 1

    article_path.write_text(transformed, encoding="utf-8", newline="\n")
    print(f"Prepared {article_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

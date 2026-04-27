#!/usr/bin/env python3

from __future__ import annotations

import argparse
import math
import re
from pathlib import Path

FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)
MARKDOWN_IMAGE_RE = re.compile(r"!\[[^\]]*]\([^)]+\)")
HTML_IMAGE_RE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
MARKDOWN_LINK_RE = re.compile(r"\[([^\]]+)]\(([^)]+)\)")
INLINE_CODE_RE = re.compile(r"`([^`]*)`")
FENCE_MARKER_RE = re.compile(r"^```.*?$", re.MULTILINE)
HTML_TAG_RE = re.compile(r"<[^>]+>")
HEADING_RE = re.compile(r"^\s{0,3}#{1,6}\s*", re.MULTILINE)
BLOCKQUOTE_RE = re.compile(r"^\s{0,3}>\s?", re.MULTILINE)
LIST_MARKER_RE = re.compile(r"^\s*([-*+]|\d+\.)\s+", re.MULTILINE)
EMPHASIS_RE = re.compile(r"[*_~]")
WHITESPACE_RE = re.compile(r"\s+")


def strip_frontmatter(markdown: str) -> str:
    return FRONTMATTER_RE.sub("", markdown, count=1)


def count_images(markdown: str) -> int:
    return len(MARKDOWN_IMAGE_RE.findall(markdown)) + len(HTML_IMAGE_RE.findall(markdown))


def markdown_to_readable_text(markdown: str) -> str:
    text = strip_frontmatter(markdown)
    text = MARKDOWN_IMAGE_RE.sub(" ", text)
    text = HTML_IMAGE_RE.sub(" ", text)
    text = FENCE_MARKER_RE.sub("", text)
    text = MARKDOWN_LINK_RE.sub(r"\1", text)
    text = INLINE_CODE_RE.sub(r"\1", text)
    text = HTML_TAG_RE.sub(" ", text)
    text = HEADING_RE.sub("", text)
    text = BLOCKQUOTE_RE.sub("", text)
    text = LIST_MARKER_RE.sub("", text)
    text = EMPHASIS_RE.sub("", text)
    text = text.replace("\\", "")
    text = WHITESPACE_RE.sub(" ", text).strip()
    return text


def calculate_reading_time(char_count: int, image_count: int) -> tuple[float, int]:
    raw_minutes = (char_count / 1500) + (image_count * 0.2)
    whole_minutes = math.floor(raw_minutes)
    fractional = raw_minutes - whole_minutes

    if fractional >= 0.3:
        reading_time = whole_minutes + 1
    else:
        reading_time = whole_minutes

    return raw_minutes, max(1, reading_time)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Calculate post reading time using the repo rule: "
            "1500 readable characters per minute + 0.2 minutes per image."
        )
    )
    parser.add_argument("article_path", help="Path to the markdown article file.")
    parser.add_argument(
        "--details",
        action="store_true",
        help="Print calculation details instead of only the integer reading time.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    article_path = Path(args.article_path)

    if not article_path.exists():
        raise SystemExit(f"File not found: {article_path}")

    if not article_path.is_file():
        raise SystemExit(f"Not a file: {article_path}")

    markdown = article_path.read_text(encoding="utf-8")
    readable_text = markdown_to_readable_text(markdown)
    char_count = len(readable_text)
    image_count = count_images(markdown)
    raw_minutes, reading_time = calculate_reading_time(char_count, image_count)

    if args.details:
        print(f"path: {article_path}")
        print(f"characters: {char_count}")
        print(f"images: {image_count}")
        print(f"raw_minutes: {raw_minutes:.2f}")
        print(f"reading_time: {reading_time}")
    else:
        print(reading_time)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

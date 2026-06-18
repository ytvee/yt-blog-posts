---
name: prepare-markdown-post
description: "Prepare a markdown blog post without rewriting its visible text. Use when Codex must add or replace draft-safe frontmatter with the current YYYY-MM-DD date, remove excessive blank lines between markdown blocks, add invisible H2 and explicit term-definition anchors, write an SEO description in frontmatter, calculate readingTime with the repo script, and verify that the final article matches the original plan without changing body copy."
---

# Prepare Markdown Post

## Role

Act as a repo-bound markdown post preparation editor. Preserve the author's visible article text exactly in meaning and wording. Only edit service markup that is explicitly allowed by the user and this repository.

## Local File Access

When reading local repository instructions, project docs, or the target article for planning and verification, use the configured filesystem MCP tools first, especially `mcp__filesystem__.read_file`, `mcp__filesystem__.list_directory`, and `mcp__filesystem__.list_allowed_directories`. Use shell-based file reads only as a fallback when filesystem MCP is unavailable, blocked, or insufficient.

The helper script still reads and writes the target markdown file directly when the workflow reaches the explicit script execution step.

## Allowed Changes

- Add or replace top frontmatter.
- Normalize excessive blank lines outside fenced code blocks.
- Add invisible HTML anchors before `##` headings.
- Add invisible HTML anchors before explicit term definitions selected by the agent.
- Write the current local date into frontmatter in `YYYY-MM-DD` format.
- Write the generated SEO description into frontmatter.
- Write calculated `readingTime` into frontmatter.

Do not change wording, spelling, punctuation, sentence order, paragraph order, heading text, body copy, image alt text, links, quotes, or examples.

## Required Workflow

1. Read `AGENTS.md`, `.agents/SUMMARY.md`, and `.agents/project/10-post-content-contract.md`.
2. Read the target article completely.
3. State the role for this task and create a concrete action plan before editing. Include:
   - target file
   - exact allowed changes
   - H2 headings that need anchors
   - term definitions that need anchors, if any
   - SEO description approach
   - current local date for frontmatter
   - verification steps
4. Write a concise SEO description from the article's meaning. Do not modify the article body to fit the description.
5. Run the helper script:

```bash
python .agents/skills/prepare-markdown-post/scripts/prepare_markdown_post.py content/<slug>.md --description "<seo description>"
```

Add `--term-anchor "Term::custom-slug"` only for terms whose definition location is clear in the article.

6. If the script reports that visible text changed, stop and fix the tooling or revert only your failed attempt.
7. Run `python scripts/calc_reading_time.py content/<slug>.md --details` after the final edit and confirm the frontmatter value matches.
8. Compare the result against the initial plan and report any skipped item with a concrete reason.

## Frontmatter Contract

Use this draft-safe shape:

```yaml
---
title: ""
date: "<current YYYY-MM-DD>"
description: "<seo description>"
tags: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
readingTime: <calculated integer>
ogImage: ""
published: false
---
```

Use the local date at script runtime. Keep exactly 20 empty tag strings. Do not add frontmatter keys beyond the mirrored contract unless the user explicitly asks and the repo contract allows them.

## Anchor Rules

- Use only explicit HTML `a` tags for anchors: `<a id="custom-id"></a>`.
- Do not use any other anchor format in article bodies, including `{#custom-id}`, `[](){#custom-id}`, named markdown extensions, or heading attributes.
- Add H2 anchors as `<a id="heading-slug"></a>` on the line immediately before the `##` heading.
- Do not add anchors for `#`, `###`, or deeper headings unless the user explicitly changes scope.
- Do not alter heading text to create an anchor.
- Do not use Pandoc-style or MDX-hostile heading attributes such as `## Heading {#custom-id}`.
- If a stable custom anchor is needed, add or preserve a separate `<a id="custom-id"></a>` line before the heading.
- Treat `{#custom-id}` in a markdown heading as a service-markup defect, not as visible author text: move the id into a separate anchor and leave the visible heading text clean.
- Normalize malformed anchors like `<a id="custom-id"> </a>` to `<a id="custom-id"></a>`.
- Generate slugs by lowercasing text, trimming it, replacing punctuation and whitespace with `-`, preserving Unicode letters and digits, and adding `-2`, `-3`, etc. for duplicates.
- For terms, add one anchor only at the definition, not at every mention.
- Do not guess term definitions. If no clear definition exists, do not add a term anchor.

## Helper Script

Use `scripts/prepare_markdown_post.py` for deterministic markup edits. Supported options:

- `--description "<text>"`: required SEO description for frontmatter.
- `--term-anchor "Term::custom-slug"`: optional explicit term anchor; repeat as needed.
- `--dry-run`: print the transformed markdown without writing.
- `--check`: report whether the file would change without writing.

The script must preserve visible body text while ignoring frontmatter, whitespace collapse, and added HTML anchors in its comparison.

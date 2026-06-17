---
name: telegram-post-adapter
description: "Adapt a topic and source article into a standalone Russian Telegram post for SEO distribution in the author's YTDEV voice. Use when the user asks to make a Telegram post, adapt an article for Telegram, create SEO distribution copy, repurpose a blog post for Telegram, or rewrite source material into a channel post with a native source-link placeholder. The skill must apply repo style references and anti-AI gates, rewrite internally until no visible LLM anti-patterns remain, and return the post in the response by default without creating files."
---

# Telegram Post Adapter

## Role

Act as a repo-bound Telegram adaptation editor for YTDEV. Turn a topic and source article into a standalone Telegram post that sounds like the author, not a summary generator.

## Required Inputs

- Topic.
- Source article text or path to `content/<slug>.md`.

If either input is missing, ask for it. If a path is provided, read it from the current repo only.

## Local File Access

When reading a local source article, style references, examples, or repo docs, use the configured filesystem MCP tools first, especially `mcp__filesystem__.read_file`, `mcp__filesystem__.list_directory`, and `mcp__filesystem__.list_allowed_directories`. Use shell-based file reads only as a fallback when filesystem MCP is unavailable, blocked, or insufficient.

## Required References

Read these before drafting:

- `.agents/data/social-platform-telegram.md`
- `.agents/project/40-style-profile.md`
- `.agents/templates/writing-style-guide.md`
- `.agents/data/brand-profile.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- `.agents/data/style-examples-index.md`

Load 2-3 relevant examples from `.agents/data/style-examples/**` or `content/*.md` only when the topic or style risk needs calibration.

## Workflow

1. Extract the article's main thesis, practical value, likely reader, and one useful trade-off or constraint.
2. Pick 2-5 natural SEO terms from the topic and article. Use them where they fit; do not stuff keywords.
3. Choose one main Telegram angle. Do not compress the whole article section by section.
4. Draft in Russian, first person when natural, with authorial position and anti-hype framing.
5. Integrate `TODO(LINK)` as a native source-link sentence inside the post, where it follows from the thought. Do not use a detached `Оригинальная статья: TODO(LINK)` footer unless the user explicitly asks for it.
6. Check for a phrase-center: one sharp line the reader could quote or remember.
7. Run the positive style gate and anti-AI gate.
8. Before final output, check specifically for a smooth explanation ladder, encyclopedia-card rhythm, safe methodical ending, and source-link sentence that feels bolted on.
9. Rewrite internally until there are no visible AI anti-patterns: generic opening, stock transition, teacher voice, polished filler, repeated `not X but Y`, formula ending, uniformly smooth rhythm, universal business phrases without operational edge, repeated `X — это...` definitions, weak personal or practical сцепка, bolted-on source link, or lack of a surprising concrete detail.
10. Return the Telegram post in the response. Do not create a file unless explicitly asked.

## Output Contract

Return only:

```md
<telegram post with TODO(LINK) integrated natively in the text>
```

Do not include QA notes, process notes, or headings around the post unless the user asks for analysis.

## Hard Rules

- Use 1200-2200 characters by default.
- Do not publish a close paraphrase or mechanical compression.
- Do not invent personal experience that is not present in the article or repo style references.
- Do not make the post a teaser ad; it must have standalone value.
- Do not use a detached original-article footer by default; place the source link in a natural sentence.
- Keep SEO wording natural and readable.
- If the draft still feels AI-written, rewrite it before returning.

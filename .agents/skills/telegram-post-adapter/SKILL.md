---
name: telegram-post-adapter
description: "Adapt a topic and source article into a standalone Russian Telegram post for SEO distribution in the author's YTDEV voice. Use when the user asks to make a Telegram post, adapt an article for Telegram, create SEO distribution copy, repurpose a blog post for Telegram, or rewrite source material into a channel post with an original-link placeholder. The skill must apply repo style references and anti-AI gates, rewrite internally until no visible LLM anti-patterns remain, and return the post in the response by default without creating files."
---

# Telegram Post Adapter

## Role

Act as a repo-bound Telegram adaptation editor for YTDEV. Turn a topic and source article into a standalone Telegram post that sounds like the author, not a summary generator.

## Required Inputs

- Topic.
- Source article text or path to `content/<slug>.md`.

If either input is missing, ask for it. If a path is provided, read it from the current repo only.

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
5. End with `Оригинальная статья: TODO(LINK)`.
6. Run the positive style gate and anti-AI gate.
7. Rewrite internally until there are no visible AI anti-patterns: generic opening, stock transition, teacher voice, polished filler, repeated `not X but Y`, formula ending, or uniformly smooth rhythm.
8. Return the Telegram post in the response. Do not create a file unless explicitly asked.

## Output Contract

Return only:

```md
<telegram post>

Оригинальная статья: TODO(LINK)
```

Do not include QA notes, process notes, or headings around the post unless the user asks for analysis.

## Hard Rules

- Use 1200-2200 characters by default.
- Do not publish a close paraphrase or mechanical compression.
- Do not invent personal experience that is not present in the article or repo style references.
- Do not make the post a teaser ad; it must have standalone value.
- Keep SEO wording natural and readable.
- If the draft still feels AI-written, rewrite it before returning.

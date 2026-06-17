---
name: post-checker
description: "Report-only proofreading and fact-checking for markdown blog posts. Use when the user asks to check, proofread, fact-check, verify, review, or validate an article or text for grammar, syntax, typo risks, forbidden ё/Ё usage, and factual accuracy with web-sourced evidence. Also use as the second stage after prepare-markdown-post in article processing flows. This skill must not edit article files unless the user gives a separate explicit approval to apply specific fixes."
---

# Post Checker

## Role

Act as a repo-bound article proofreader and fact-checker. Work only inside the current posts repository. Return findings and proposed fixes; do not edit the markdown file.

## Required Workflow

1. Read `AGENTS.md`, `.agents/SUMMARY.md`, and the target article.
2. State the checking role and create a concrete plan before analysis:
   - target file or provided text
   - grammar and syntax pass
   - `ё`/`Ё` pass
   - factual claims that are worth verifying
   - web-search queries or source types to use
   - final report checks
3. Check grammar, syntax, typos, agreement, awkward punctuation, malformed phrases, and obvious wording defects.
4. Treat every `ё` and `Ё` as a finding. Propose `е` or `Е`.
5. Extract only externally verifiable factual claims. Do not fact-check personal experience, opinion, taste, authorial framing, metaphors, or unverifiable intent.
6. Use web search for factual claims. Prefer primary or authoritative sources, current official docs, research papers, company pages, standards, public documentation, or reputable publications depending on the claim.
7. Include short citations or quoted fragments with source links for every factual issue or confirmation that matters.
8. Do not change the file. If the user asks to apply fixes, ask for explicit confirmation of which fixes to apply unless the approval is already specific.
9. Before returning, verify that the output is either `Все ок.` or a focused report with actionable proposed changes.

## Output Rules

If there are no grammar/syntax issues, no `ё`/`Ё`, and no factual problems, return exactly:

```text
Все ок.
```

If there are findings, use this compact report:

```md
# Post Checker Report

## Грамматика и синтаксис
- Цитата: "..."
  Проблема: ...
  Предложенная правка: "..."

## Буква ё
- Цитата: "..."
  Предложенная правка: "..."

## Достоверность
- Утверждение: "..."
  Статус: confirmed / questionable / unsupported / incorrect
  Источник: ...
  Основание: "..."
  Предложенная правка: "..."

## Не проверялось
- ...
```

Omit empty sections. Keep quotes from the article short and sufficient to identify the issue. Keep source quotes short and compliant.

## Guardrails

- Do not rewrite the author's voice.
- Do not make style improvements unless they fix a concrete grammar, syntax, punctuation, or factual issue.
- Do not invent sources or claim verification without a source.
- Do not use web search for claims that are purely personal or editorial.
- Do not apply suggested corrections to article files in this skill.
- If web access fails, report the blocker and return only the checks that were actually completed.

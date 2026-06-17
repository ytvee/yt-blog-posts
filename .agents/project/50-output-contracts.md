# Output Contracts

Use these strict response formats so the user can review each stage quickly and consistently.

## 1. Topic Shortlist

Format:

```md
# Topic Shortlist

## Selection Context
- Source pool: ...
- Topic fit: ...
- Exclusions applied: ...

## Topics
1. Title
   - Source: ...
   - Why it fits: ...
   - Short summary: ...
   - Risk or caveat: ...

2. Title
   - Source: ...
   - Why it fits: ...
   - Short summary: ...
   - Risk or caveat: ...
```

Rules:

- exactly 20 topics
- each topic must have a source reference
- no hidden rankings beyond the visible order

## 2. Source Article Analysis

Format:

```md
# Source Article Analysis

## Metadata
- Topic: ...
- Source title: ...
- Source URL: ...
- Access date: ...

## Core Thesis
...

## Key Claims
- ...

## Evidence And Examples
- ...

## Structure Notes
- ...

## Translation Risks
- ...

## Adaptation Opportunities
- ...

## Open Questions
- ...
```

## 3. Post Draft

Format:

```md
---
title: ""
date: ""
description: ""
readingTime: 0
published: false
---

## Lead

...
```

Rules:

- frontmatter first
- body starts with `##`
- no review commentary inside the draft

## 4. Revision Application Report

Format:

```md
# Revision Report

## Applied Changes
- User note: ...
  - Action taken: ...

## Not Applied
- User note: ...
  - Reason: ...

## Contract Checks After Revision
- Frontmatter: pass/fail
- Structure: pass/fail
- Tone alignment: pass/fail
- Pattern compliance: pass/fail
- Anti-AI blockers: pass/fail
```

## 5. Final QA Report

Format:

```md
# QA Report

## Blocking Issues
- None

## Gate Results
- Factual sanity: pass/fail
- Language quality: pass/fail
- Pattern compliance: pass/fail
- Anti-AI phrasing: pass/fail
- Structure and readability: pass/fail
- SEO heading structure: pass/fail
- Frontmatter validation: pass/fail
- Media and ogImage checks: pass/fail
- Publish readiness: pass/fail

## Notes
- ...
```

## 6. Final Markdown

Format:

- return only the final markdown post content
- do not include analysis, notes, or QA commentary
- do not include `TODO(USER): ...` in the final publish-ready file

## 7. Post Checker Report

If there are no findings, return exactly:

```text
Все ок.
```

If there are findings, use:

```md
# Post Checker Report

## Примененные безопасные правки
- Цитата: "..."
  Проблема: ...
  Правка: "..."

## Достоверность
- Утверждение: "..."
  Статус: confirmed / questionable / unsupported / incorrect
  Источник: ...
  Основание: "..."
  Предложенная правка: "..."

## Не проверялось
- ...
```

Rules:

- omit empty sections
- keep article and source quotes short
- include source links for factual findings
- safe language fixes may already be applied to local markdown files
- do not apply factual, stylistic, SEO, structural, or meaning changes as part of this report

## 8. Telegram Adaptation

Format:

```md
<telegram post>

Оригинальная статья: TODO(LINK)
```

Rules:

- return the post in the response by default
- use 1200-2200 characters by default, excluding the link line
- do not include QA notes, process notes, or headings around the post
- preserve standalone value; do not make the post only a teaser
- apply valid writing patterns and anti-AI guardrails before returning

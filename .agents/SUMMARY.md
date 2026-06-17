# Agent Documentation Summary

Use this file as the fast navigation map for this posts-only repository.

## Repository Boundary

- This repository stores blog posts, writing instructions, source rules, templates, and agent documentation.
- It is not the blog application repository.
- Work only inside the current workspace.
- Do not inspect sibling repositories or unrelated local folders unless the user explicitly changes scope.

## Minimal Reading By Task

For any post drafting, revision, adaptation, source, or QA task, read:

- `AGENTS.md`
- `.agents/project/00-repo-purpose.md`
- `.agents/project/10-post-content-contract.md`
- `.agents/project/20-writing-workflow.md`
- `.agents/project/50-output-contracts.md`
- `.agents/project/60-final-qa-gates.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`

Then load only the task-specific references below.

## Task Routing

- First analyze the prompt, classify the task, and select matching repo-local skills from `.agents/skills/**/SKILL.md` without waiting for the user to name them.
- Skill authoring: `.agents/skills/create-text-skills/SKILL.md` for creating, updating, auditing, merging, splitting, or refactoring text/editorial workflow skills.
- Markdown post preparation: `.agents/skills/prepare-markdown-post/SKILL.md` for adding draft-safe frontmatter, removing excessive blank lines, adding anchors, writing SEO description, and calculating reading time without rewriting visible text.
- Article checking: `.agents/skills/post-checker/SKILL.md` for `проверь статью`, `проверь текст`, `проверь факты`, `вычитай статью`; it auto-fixes safe language issues in local markdown files, keeps factual changes report-only, and returns findings or `Все ок.`.
- Article processing: for `обработай статью`, `подготовь статью`, `прогони статью`, run plan -> `prepare-markdown-post` -> `post-checker` safe language auto-fix and factual report-only checks -> stage verification.
- Telegram adaptation: `.agents/skills/telegram-post-adapter/SKILL.md` for `сделай пост для телеграма`, `адаптируй статью в телеграм`, `сделай SEO-дистрибуцию`; use `.agents/data/social-platform-telegram.md`, style references, and anti-AI guardrails, then return the post in the response without creating files by default.
- Topic discovery: `.agents/project/22-idea-generation-with-sources.md`, `.agents/project/30-source-research-policy.md`, `.agents/data/source-sites.md`, `.agents/data/blog-categories.md`.
- Source ingestion: `.agents/project/30-source-research-policy.md`, `.agents/templates/source-article-analysis-template.md`.
- Drafting or style adaptation: `.agents/project/40-style-profile.md`, `.agents/templates/writing-style-guide.md`, `.agents/templates/post-draft-template.md`.
- Revision: `.agents/templates/revision-report-template.md`.
- Final QA: `.agents/project/60-final-qa-gates.md`, `.agents/templates/qa-report-template.md`.
- Blog app sync or redeploy docs: `.agents/project/70-sync-with-blog-app.md`, `.agents/project/80-redeploy-workflow.md`.

## Style Guardrail Loading

Always load the two short style gate files first:

- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`

Load focused anti-AI references only when the current text touches that risk:

- `.agents/data/banned-ai-openings-transitions.md`
- `.agents/data/banned-ai-empty-language.md`
- `.agents/data/banned-ai-structure-rhythm.md`
- `.agents/data/banned-ai-endings-self-check.md`

## Output Rule

Final publish-ready markdown must contain only the post content. Keep QA notes, revision notes, unresolved questions, and process commentary outside the final markdown.

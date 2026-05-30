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

- Topic discovery: `.agents/skills/discover-topics/SKILL.md`, `.agents/project/22-idea-generation-with-sources.md`, `.agents/project/30-source-research-policy.md`, `.agents/data/source-sites.md`, `.agents/data/blog-categories.md`.
- Source ingestion: `.agents/skills/ingest-source-article/SKILL.md`, `.agents/project/30-source-research-policy.md`, `.agents/templates/source-article-analysis-template.md`.
- Drafting or style adaptation: `.agents/skills/adapt-to-style/SKILL.md`, `.agents/skills/enforce-writing-style/SKILL.md`, `.agents/project/40-style-profile.md`, `.agents/templates/writing-style-guide.md`, `.agents/templates/post-draft-template.md`.
- Revision: `.agents/skills/revise-draft/SKILL.md`, `.agents/skills/enforce-writing-style/SKILL.md`, `.agents/templates/revision-report-template.md`.
- Final QA: `.agents/skills/final-post-qa/SKILL.md`, `.agents/skills/enforce-writing-style/SKILL.md`, `.agents/templates/qa-report-template.md`.
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

# YTDEV Agent Docs

This directory contains the local agent instruction bundle for the posts-only YTDEV blog repository.

## Directory Map

- `project/` contains repository-specific workflow, content contract, QA, source, sync, and redeploy rules.
- `data/` contains editorial source maps, brand profile, style examples, valid writing patterns, and anti-AI guardrails.
- `templates/` contains output formats for shortlists, source analysis, drafts, revisions, QA, and frontmatter.
- `skills/` contains task workflows that agents should load when the user request matches the skill.

## Fast Start

Agents should start with:

1. `AGENTS.md`
2. `.agents/SUMMARY.md`
3. the relevant skill in `.agents/skills/**`
4. only the project/data/template files required for the task

For writing quality, always load:

- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`

The larger anti-AI reference files are for targeted checks, not for every context window.

## Posts-Only Boundary

These docs describe a content repository. They do not prove or validate behavior in the external blog app.

When app behavior is uncertain, update the mirrored contract docs from user-provided app facts instead of guessing.

## Maintaining This Bundle

- Keep durable reusable writing rules in `data/` or `templates/`.
- Keep task procedures in `skills/`.
- Keep repo-specific workflow and contract rules in `project/`.
- Keep `.agents/SUMMARY.md` short enough to use as a routing map.
- Do not add application architecture instructions here unless the user explicitly changes the repository scope.

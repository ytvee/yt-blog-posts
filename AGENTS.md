# Posts-Only Repo Rules

This repository stores blog posts, writing instructions, source research rules, and publishing workflow documentation. It is not the blog application repository.

## Non-Negotiable Scope Rule

Every prompt must be interpreted only inside the currently open project workspace.

- Work only with files that belong to this repository.
- Do not inspect unrelated local folders, sibling repositories, or random files on the computer.
- Do not silently switch project context because another repository may contain similar files.
- Do not browse for unrelated local context unless the user explicitly changes the project scope.

## Required Reading Order

Read these files before doing content work:

- `.agents/project/00-repo-purpose.md`
- `.agents/project/10-post-content-contract.md`
- `.agents/project/20-writing-workflow.md`
- `.agents/project/22-idea-generation-with-sources.md`
- `.agents/project/40-style-profile.md`
- `.agents/project/50-output-contracts.md`
- `.agents/project/60-final-qa-gates.md`
- `.agents/project/70-sync-with-blog-app.md`
- `.agents/project/80-redeploy-workflow.md`
- `.agents/templates/writing-style-guide.md`
- `.agents/data/brand-profile.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- `.agents/data/blog-categories.md`
- `.agents/data/source-sites.md`
- `.agents/data/style-examples-index.md`

Use these skills when relevant:

- `.agents/skills/discover-topics/SKILL.md`
- `.agents/skills/ingest-source-article/SKILL.md`
- `.agents/skills/build-style-profile/SKILL.md`
- `.agents/skills/adapt-to-style/SKILL.md`
- `.agents/skills/revise-draft/SKILL.md`
- `.agents/skills/final-post-qa/SKILL.md`

## Definition Of Done

A task is done only when all of the following are true:

- the output matches the mirrored post contract in this repo
- the output format matches `.agents/project/50-output-contracts.md`
- the post passes `.agents/project/60-final-qa-gates.md`
- missing user data is left as `TODO(USER): ...` instead of being invented
- no assumptions are made about application code that is not present in this repo
- no work escapes the current repository scope

## Do

- treat this repository as content-only and posts-only
- work only with posts, templates, workflow docs, source lists, and writing instructions in this repo
- treat the app contract documented here as mirrored/manual-sync information
- keep one markdown file per post under `content/`
- leave explicit `TODO(USER): ...` markers where user input is required
- keep outputs practical, reviewable, and easy to edit by hand
- use the brand profile, category map, source map, and style guide for all editorial decisions

## Do Not

- do not assume Next.js code, runtime files, components, or validators exist in this repo
- do not claim you verified application behavior from this repository
- do not invent site sources, style preferences, user defaults, or app behavior
- do not drift into another local repository or search the wider computer for guidance
- do not add build, lint, test, or CI instructions that are not actually present here
- do not add frontmatter keys beyond the mirrored contract

## Authority Model

Use this precedence order when files overlap:

1. `AGENTS.md`
2. `.agents/project/*`
3. `.agents/templates/*`
4. `.agents/data/*`
5. `posts.md` as a pointer only

## Mirrored Contract Note

The blog app contract in this repository is stored in mirrored form based on user-provided information. It may become outdated if the external blog app changes. When the app contract changes, the mirrored files in this repo must be manually synced.

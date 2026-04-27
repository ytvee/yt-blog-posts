# Content-Only Repo Rules

This repository stores blog post content and writing instructions. It is not the blog application repository.

Read these files before doing content work:

- `.agents/project/00-repo-purpose.md`
- `.agents/project/10-post-content-contract.md`
- `.agents/project/20-writing-workflow.md`
- `.agents/project/22-idea-generation-with-sources.md` — how to generate post ideas grounded in source monitoring
- `.agents/project/40-style-profile.md` — detailed style profile based on examples
- `.agents/project/50-output-contracts.md`
- `.agents/project/60-final-qa-gates.md`
- `.agents/project/70-sync-with-blog-app.md`
- `.agents/templates/writing-style-guide.md` — comprehensive guide to your writing voice and post types
- `.agents/data/style-examples-index.md` — index of 8 published posts with analysis

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

## Do

- treat this repository as content-only
- work only with posts, templates, workflow docs, and writing instructions
- treat the app contract documented here as mirrored/manual-sync information
- keep one markdown file per post under `content/`
- leave explicit `TODO(USER): ...` markers where user input is required
- keep outputs practical, reviewable, and easy to edit by hand
- use the brand profile (`.agents/data/brand-profile.md`) and style guide (`.agents/templates/writing-style-guide.md`) for all content decisions

## Do Not

- do not assume Next.js code, runtime files, components, or validators exist in this repo
- do not claim you verified application behavior from this repository
- do not invent site sources, style preferences, user defaults, or app behavior
- do not add essays workflow unless the user explicitly asks for it
- do not add build, lint, test, or CI instructions that are not actually present here
- do not add frontmatter keys beyond the mirrored contract

## Mirrored Contract Note

The blog app contract in this repository is stored in mirrored form based on user-provided information. It may become outdated if the external blog app changes. When the app contract changes, the mirrored files in this repo must be manually synced.

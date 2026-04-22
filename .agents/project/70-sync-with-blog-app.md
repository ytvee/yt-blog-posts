# Sync With Blog App

This repository is separate from the blog application repository.

## Boundary

- The app repository is external to this repository.
- The agent working here cannot automatically inspect or validate external runtime code from this repository.
- Any app-facing rule documented here should be treated as mirrored/manual-sync information unless the user explicitly updates it from the application side.

## What Is Mirrored Here

The following rules are mirrored into this repository for posts workflow:

- file placement under `content/<slug>.md`
- no nested folders under `content/`
- slug derived from file name
- allowed and required frontmatter keys
- date and `readingTime` expectations
- `published` draft behavior
- body must start with `##`
- `ogImage` expectation for published posts
- accepted media path patterns
- file size limit
- parsing and validation failures are blocking

## What Cannot Be Verified Here

- whether the external app still uses the same content loader behavior
- whether media proxying rules still behave the same way
- whether frontmatter parsing rules changed
- whether publication and draft behavior changed in runtime
- whether metadata generation still uses the same fields

## What Needs Periodic Manual Sync

Review and update this repository whenever the external app changes:

- content file discovery rules
- slug derivation rules
- frontmatter schema
- media path handling
- draft and publication behavior
- metadata expectations tied to `description` or `ogImage`
- validation rules or parser strictness
- file size limits

## User Maintenance Responsibility

When the blog app contract changes, the user should manually update at least these files:

- `.agents/project/10-post-content-contract.md`
- `.agents/project/50-output-contracts.md`
- `.agents/project/60-final-qa-gates.md`
- `.agents/project/70-sync-with-blog-app.md`
- `AGENTS.md` if operating rules changed

## Practical Rule

If there is uncertainty about external app behavior, do not guess. Mark the uncertainty clearly and request a manual contract update from the user.

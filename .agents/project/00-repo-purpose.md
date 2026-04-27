# Repo Purpose

This repository is a standalone content-only repository for blog posts.

## What Lives Here

- markdown posts
- agent instructions
- reusable templates
- helper markdown documents for the writing pipeline

## What Does Not Live Here

- blog application runtime code
- Next.js routes or components
- app-side validators
- application loaders, metadata code, or rendering logic

## Agent Responsibility

The agent works on writing, editing, structuring, and validating posts within the mirrored contract documented in this repository.

- create and revise post drafts
- maintain templates and workflow docs
- keep instructions practical for a posts-only pipeline
- flag missing information with `TODO(USER): ...`

## Boundary Rules

- Do not describe app behavior as verified unless the user has separately provided evidence.
- Do not invent application behavior when it is not documented in the mirrored contract.
- Do not add architecture, frontend, or backend guidance for the external blog app.
- Treat all app-facing rules here as mirrored/manual-sync information unless they come from a file stored in this repository.
- Work only inside the currently open repository workspace.
- Do not inspect sibling repositories or unrelated local folders unless the user explicitly changes scope.

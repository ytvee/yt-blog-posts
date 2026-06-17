---
name: create-text-skills
description: "Create, update, audit, merge, split, or refactor repo-local Codex skills for text, writing, editorial, source-ingestion, revision, style-adaptation, platform-adaptation, and QA workflows. Use when a user asks to design a new text workflow skill, consolidate or decompose existing editorial skills, synchronize skill routing instructions, or review whether text-related skills match the posts-only repository rules."
---

# Create Text Skills

## Role Model

Act as a repo-bound senior editorial workflow architect and skill author. Design skills that help future Codex sessions work with text inside this posts-only repository without guessing, duplicating documentation, or escaping workspace scope.

## Workflow

1. Classify the requested text workflow: drafting, revision, style adaptation, source ingestion, topic discovery, QA, platform adaptation, documentation maintenance, or another editorial task.
2. Read the current repo instructions before designing anything: `AGENTS.md`, `.agents/SUMMARY.md`, and the relevant `.agents/project/**`, `.agents/data/**`, and `.agents/templates/**` files.
3. Identify what should live in the skill versus existing repo docs. Keep durable facts in `project/`, `data/`, or `templates/`; keep repeatable task procedure in the skill.
4. Define the trigger surface in the skill frontmatter `description`. Include the specific user requests, task types, and contexts that should invoke the skill.
5. Choose the smallest useful structure:
   - one `SKILL.md` for concise workflows
   - `references/` only for detailed guidance that should load conditionally
   - `scripts/` only for deterministic repeated operations
   - `assets/` only for reusable output resources
6. Write imperative, practical instructions. Prefer short checklists and decision rules over broad explanations.
7. Update repo routing docs when the skill changes how agents should select workflows.
8. Validate the skill with the system `skill-creator` validator before considering the work complete.

## Text Skill Design Rules

- Create skills only for text, writing, editorial, source, QA, documentation, or publishing-workflow tasks in this repository.
- Do not create frontend, backend, app-runtime, deployment, or non-text automation skills unless the user explicitly changes repository scope.
- Do not restore deleted skills or recreate old multi-skill routing unless the user explicitly asks for that.
- Do not add auxiliary `README.md`, `CHANGELOG.md`, quick references, or extra docs inside a skill package.
- Do not duplicate long project rules inside `SKILL.md`; link to the owning repo document instead.
- Leave missing user-specific facts as `TODO(USER): ...`; do not invent source lists, style preferences, platform rules, or app behavior.
- Keep the root `AGENTS.md` and `.agents/SUMMARY.md` aligned with the current skills that actually exist.

## Output Checklist

Before returning the result of a text-skill task, confirm:

- the skill name is lowercase hyphen-case and matches its folder name
- `SKILL.md` has only `name` and `description` in YAML frontmatter
- `agents/openai.yaml` default prompt mentions `$create-text-skills` or the new skill invocation name
- routing docs mention only skills that exist
- validation has passed, or the exact blocker is reported

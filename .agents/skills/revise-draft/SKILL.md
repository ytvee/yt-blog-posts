# revise-draft

## Purpose

Apply user feedback to an existing draft without breaking structure or publication readiness.

## When To Use

- when the user sends corrections or change requests
- after an initial draft exists

## Inputs

- current draft
- user revision notes
- `.agents/project/10-post-content-contract.md`
- `.agents/project/50-output-contracts.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- `.agents/skills/enforce-writing-style/SKILL.md`
- `.agents/templates/revision-report-template.md`

## Outputs

- revised draft
- revision report

## Procedure

1. Read every user note.
2. Map each note to content, tone, structure, frontmatter, or media.
3. Apply requested changes carefully.
4. Re-run the style gate on changed sections and adjacent paragraphs.
5. Re-check headings, frontmatter, and media references.
6. Produce the revision report with pattern compliance and anti-AI blocker status.

## Must Not

- do not silently drop feedback
- do not damage markdown structure while editing prose
- do not leave hidden placeholders in publish-facing fields
- do not return revised prose that fails the mandatory style gate

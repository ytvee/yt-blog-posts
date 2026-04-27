# adapt-to-style

## Purpose

Rewrite source-based Russian material into the user's style while keeping the factual core intact.

## When To Use

- after source article analysis
- after the style profile is filled enough to guide rewriting

## Inputs

- `.agents/project/30-source-research-policy.md`
- `.agents/project/40-style-profile.md`
- `.agents/project/10-post-content-contract.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- `.agents/templates/post-draft-template.md`

## Outputs

- a style-adapted post draft that matches the mirrored post contract

## Procedure

1. Separate source facts from editorial framing.
2. Rewrite the material into Russian according to the style profile.
3. Apply any approved positive patterns when they exist.
4. Exclude banned AI-sounding patterns and rhetorical habits.
5. Keep the draft structurally clean and contract-compliant.
6. Ensure the body starts with `##`.
7. Leave missing user-specific decisions as `TODO(USER): ...` only in non-final working outputs.

## Must Not

- do not write a mechanical translation
- do not invent style traits
- do not break the frontmatter contract

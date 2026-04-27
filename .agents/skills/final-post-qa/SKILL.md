# final-post-qa

## Purpose

Run the last pre-publish review on a post draft.

## When To Use

- after revisions are complete
- before returning final markdown

## Inputs

- final draft candidate
- `.agents/project/10-post-content-contract.md`
- `.agents/project/50-output-contracts.md`
- `.agents/project/60-final-qa-gates.md`
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- `.agents/templates/qa-report-template.md`

## Outputs

- QA report
- final publish-ready markdown if all blocking gates pass

## Procedure

1. Check factual sanity.
2. Check language quality and anti-AI phrasing.
3. Check structure, headings, and readability.
4. Validate frontmatter and media expectations.
5. Report blockers or confirm readiness.

## Must Not

- do not mark a post ready if blocking checks fail
- do not include QA commentary in the final markdown output
- do not ignore placeholder values or invalid dates

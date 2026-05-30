# enforce-writing-style

## Purpose

Apply the mandatory positive-pattern and anti-AI writing gate to drafts, revisions, platform adaptations, and final QA.

## When To Use

- before returning any Russian-language draft
- before returning a revised post
- before adapting a blog post to another platform
- during final QA
- whenever prose sounds generic, over-polished, or machine-generated

## Inputs

- current draft or output candidate
- `.agents/data/valid-writing-patterns.md`
- `.agents/data/banned-ai-patterns.md`
- focused anti-AI reference files listed by `.agents/data/banned-ai-patterns.md` when needed
- `.agents/project/40-style-profile.md`
- `.agents/templates/writing-style-guide.md`

## Outputs

- revised text that follows the positive patterns
- a short style-gate result for QA or revision reports

## Procedure

1. Check the text against `.agents/data/valid-writing-patterns.md`.
2. Check the text against the mandatory quick gate in `.agents/data/banned-ai-patterns.md`.
3. Load focused anti-AI reference files only for visible risks in the current text.
4. Rewrite weak lines instead of only flagging them when the task is to produce or revise prose.
5. Confirm that the final candidate has authorial position, concrete detail, varied rhythm, and no blocked AI-sounding patterns.

## Blocking Failures

- generic opening or ending
- stock LLM transitions
- empty smart-sounding abstractions
- decorative AI metaphors
- teacher voice
- repeated symmetrical rhetoric
- report-like section formula repeated across the post
- final publish-ready markdown containing QA notes, process notes, or unresolved `TODO(USER): ...`

## Must Not

- do not treat anti-AI checks as optional
- do not invent positive style patterns beyond repository evidence
- do not make prose smoother if that removes authorial friction or concrete detail
- do not leave flagged phrases in final output when a rewrite is possible

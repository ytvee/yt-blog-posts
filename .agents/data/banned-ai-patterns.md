# Anti-AI Writing Guardrails

This is the mandatory quick gate for drafting, revision, platform adaptation, and final QA.

Agents must load this file together with `.agents/data/valid-writing-patterns.md` before returning Russian-language prose.

## Main Goal

Write like a live author with experience, taste, and a point of view.

Do not produce text that feels like a smoothed LLM draft: too polished, too safe, impersonal, abstractly "smart", or full of connective tissue without lived observation.

## Blocking Anti-Patterns

Rewrite the text if it contains any of these risks in a visible way:

- generic opening that could fit hundreds of other posts
- stock LLM transition or connector
- empty business or technology abstraction
- decorative metaphor not tied to a concrete observation
- teacher voice instead of authorial position
- repeated `not X, but Y` or `not only X, but also Y` symmetry
- section rhythm that repeats the same thesis/source/interpretation/summary formula
- generic ending that only inflates the article instead of landing the idea
- excessive untranslated English terms when Russian wording is clearer

## Mandatory Quick Check

Before returning any draft, revision, adaptation, or final QA result, answer these checks:

1. Does the opening begin from a concrete observation, experience, tension, number, or precise reframe?
2. Does the text contain enough concrete detail to prove a person is thinking through the topic?
3. Are transitions created by the argument itself rather than generic connector phrases?
4. Do sections vary in rhythm and structure?
5. Does the ending add a concrete landing thought instead of a universal summary?

If two or more answers are weak, rewrite before returning.

## Focused References

Load only the focused references needed for the current risk:

- `.agents/data/banned-ai-openings-transitions.md`
- `.agents/data/banned-ai-empty-language.md`
- `.agents/data/banned-ai-structure-rhythm.md`
- `.agents/data/banned-ai-endings-self-check.md`

## Positive Counterweight

Do not only remove banned phrases. Replace them with the positive patterns in `.agents/data/valid-writing-patterns.md`:

- concrete observation
- lived or operational detail
- real trade-off
- exact inference
- varied rhythm
- authorial stance

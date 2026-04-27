# Idea Generation With Sources

This workflow governs source discovery and topic generation for this repository.

## Scope Rule

- Discover topics only through the source map documented in `.agents/data/source-sites.md`.
- Work only inside the current repository workspace.
- Do not switch repositories or scan unrelated local folders to find source context.

## Goal

Generate strong post ideas that fit the brand, categories, and writing style without drifting into generic trend chasing.

## Inputs

- `.agents/data/source-sites.md`
- `.agents/data/blog-categories.md`
- `.agents/data/brand-profile.md`
- `.agents/project/30-source-research-policy.md`
- `.agents/templates/topic-shortlist-template.md`
- `.agents/templates/source-article-analysis-template.md`
- `.agents/skills/discover-topics/SKILL.md`
- `.agents/skills/ingest-source-article/SKILL.md`

## Discovery Sequence

### 1. Start From Approved Sources

- Scan only approved domains, sections, newsletters, and blogs from `.agents/data/source-sites.md`.
- Prefer primary sources, first-hand operating experience, and high-signal practitioner writing.
- Avoid generic news roundups unless they point to a deeper primary source.

### 2. Capture Candidate Signals

For each candidate idea, note:

- source publication
- source title
- URL
- publication date if available
- core thesis
- why the idea matters now
- which brand category it fits

### 3. Filter For Brand Fit

Keep only ideas that match at least one core category:

- AI for Business
- IT Business and the Digital Market
- Web and Product Through Business and User Behavior
- Breakdowns of Strong Ideas
- Practical Thinking

Reject ideas that are:

- trend-only with no transferable insight
- generic tutorials with no strategic layer
- repetitive of recent posts without a new angle
- too dependent on insider context the current audience will not have

### 4. Score Each Idea

Use a simple editorial score from 1 to 5 for each dimension:

- rarity
- usefulness
- audience fit
- style fit
- source strength

Reject weak candidates before building the shortlist.

### 5. Adapt For A Russian-Speaking Audience

When a source is in English:

- preserve the factual core
- adapt the framing and examples to the target audience
- explain hidden assumptions that may be obvious only in the source ecosystem
- separate source facts from editorial interpretation

Do not publish a close translation as a draft.

### 6. Produce A Reviewable Shortlist

Return the shortlist using `.agents/project/50-output-contracts.md`.

Each topic must include:

- title
- source
- why it fits
- short summary
- risk or caveat

## Editorial Heuristics

### Good Topic Patterns

- a hidden business consequence behind a technical change
- a founder or operator lesson that can be translated into a practical framework
- a technical system explained through business impact
- a rare article that deserves adaptation for a Russian-speaking audience
- a strong observation that can be connected to the author's own operating experience

### Weak Topic Patterns

- hot take with no evidence
- surface-level product launch recap
- generic AI tool list
- empty motivational productivity advice
- article summary with no original framing

## Separation Rule

Keep these layers distinct in notes and drafts:

- source facts
- editorial interpretation
- style decisions based on YTDEV examples

If a line belongs to none of these layers, remove it or flag it for review.

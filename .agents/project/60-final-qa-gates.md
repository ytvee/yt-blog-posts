# Final QA Gates

Use this checklist before returning a final markdown post.

## Factual Sanity

- Are all claims supported by the source material or explicitly framed as editorial interpretation?
- Are names, dates, quotes, and examples accurate?
- Are there any unsupported additions?

## Language Quality

- Does the Russian read naturally?
- Are sentences clear without awkward translation residue?
- Are paragraphs balanced and readable?
- Is repetition controlled?

## Anti-AI Phrasing

- Remove generic polished filler.
- Remove inflated summaries that say little.
- Remove robotic transitions.
- Remove conclusion formulas that sound machine-generated.
- Check against `.agents/data/banned-ai-patterns.md`.

## Structure And Readability

- Does the body begin with `##`?
- Is there no `#` heading inside the body?
- Does the post have a clear opening, development, and ending?
- Are sections and paragraphs easy to scan?
- Is there no technical garbage left in the body?

## SEO Heading Structure

- Is `title` specific and publishable?
- Is `description` a real lead and SEO summary?
- Are section headings useful and non-generic?
- Is heading structure clean and not over-fragmented?

## Frontmatter Validation

- Are all required keys present?
- Are dates valid and in the preferred format?
- Is `readingTime` a positive integer?
- Is `published` correct for the current state?
- Are optional keys limited to the allowed schema?

## Media And OgImage Checks

- Does every inline image have meaningful alt text?
- Are media paths valid according to the mirrored contract?
- Is `ogImage` present for a published post?
- Are there any placeholder or broken image references?

## Publish Readiness

- Are placeholders fully removed?
- Is `updatedAt` set when a published post was materially revised?
- Are links and image references valid?
- Is the post free from editor notes and TODOs?
- Is the file ready to save as `content/<slug>.md` without extra cleanup?

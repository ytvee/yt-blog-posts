# Writing Workflow

This workflow is posts-only. It is designed for a content repository, not for application development.

## Workspace Scope Rule

- Execute the workflow only inside the current repository.
- Do not switch to another local repository to resolve missing context.
- If the current repo lacks required information, leave `TODO(USER): ...` or reference the missing mirrored document.

## Step 1. Fill Source Site List

- Input: user-provided source sites and editorial boundaries
- Action: populate `.agents/data/source-sites.md`
- Output: a usable list of approved source domains and sections
- Stop condition: source list is complete enough to search
- What must not be done: do not invent sites, sections, exclusions, or priorities

## Step 2. Discover 20 Topic Candidates

- Input: approved source sites from `.agents/data/source-sites.md`
- Action: scan allowed sources and collect 20 topic candidates relevant to the blog
- Output: shortlist in the format from `.agents/templates/topic-shortlist-template.md`
- Stop condition: exactly 20 candidate topics are ready for review
- What must not be done: do not fabricate topics without source support; do not pick a final topic without user choice

## Step 3. Present Shortlist To User

- Input: 20 candidates from Step 2
- Action: present titles, short descriptions, source references, and why each topic fits
- Output: reviewable shortlist for user selection
- Stop condition: user selects one topic
- What must not be done: do not start drafting before topic selection

## Step 4. Ingest Source Article

- Input: selected topic and source article
- Action: extract the article's thesis, structure, claims, evidence, useful quotes, and adaptation risks
- Output: article analysis in the format from `.agents/templates/source-article-analysis-template.md`
- Stop condition: the source article is understood well enough to adapt faithfully
- What must not be done: do not hallucinate facts; do not skip unclear points

## Step 5. Translate Core Material To Russian

- Input: source article analysis
- Action: translate factual content and argument flow into Russian notes
- Output: Russian-language working notes for drafting
- Stop condition: the factual core is available in Russian
- What must not be done: do not produce a line-by-line or too-close translation for publication

## Step 6. Adapt To User Style

- Input: Russian working notes and style profile from `.agents/project/40-style-profile.md`
- Action: rewrite the material into the user's style constraints
- Output: style-adapted draft outline or draft body
- Stop condition: the draft reads like an authored post rather than a translated article
- What must not be done: do not invent style preferences; if style data is missing, leave `TODO(USER): ...` and state the gap

## Step 7. Produce Draft For Review

- Input: style-adapted material and post contract
- Action: assemble a markdown post draft using the templates and mirrored contract
- Output: draft in the format from `.agents/templates/post-draft-template.md`
- Stop condition: a reviewable draft exists with valid structure
- What must not be done: do not mark the post final before review; do not leave publish-facing placeholders

## Step 8. Receive User Revisions

- Input: user comments, edits, corrections, and preferences
- Action: map requested changes to content, structure, frontmatter, and tone
- Output: revision plan or applied changes
- Stop condition: every user note is either applied or flagged as blocked
- What must not be done: do not silently ignore requested changes

## Step 9. Revise Draft

- Input: current draft and revision instructions
- Action: update the draft without breaking the contract or markdown structure
- Output: revised draft and revision report
- Stop condition: the draft reflects the user's feedback
- What must not be done: do not damage headings, frontmatter, links, or media while revising

## Step 10. Run Final QA

- Input: revised draft and `.agents/project/60-final-qa-gates.md`
- Action: perform the full pre-publish check
- Action: once the article text is final, calculate `readingTime` with `python3 scripts/calc_reading_time.py content/<slug>.md`
- Output: QA report in the format from `.agents/templates/qa-report-template.md`
- Stop condition: all blocking checks pass or are explicitly flagged
- What must not be done: do not claim readiness if blockers remain

## Step 11. Return Final Markdown Post

- Input: approved draft and passing QA report
- Action: if anything changed after the last calculation, re-run `python3 scripts/calc_reading_time.py content/<slug>.md` and update `readingTime`
- Action: return the final markdown file content
- Output: final post markdown ready to place under `content/<slug>.md`
- Stop condition: final markdown is clean, structured, and publish-ready
- What must not be done: do not include process notes, TODOs, debug text, or QA commentary inside the final post body

# discover-topics

## Purpose

Find and rank 20 candidate post topics from user-approved source sites.

## When To Use

- when the source site list is available
- when the user asks for topic discovery
- before any source article ingestion or drafting

## Inputs

- `.agents/data/source-sites.md`
- `.agents/project/20-writing-workflow.md`
- `.agents/project/30-source-research-policy.md`
- `.agents/templates/topic-shortlist-template.md`

## Outputs

- a 20-topic shortlist in the required template format

## Procedure

1. Read the approved source list.
2. Respect domain, section, priority, and exclusion rules.
3. Collect 20 candidate topics with clear source grounding.
4. Write a short fit summary and one caveat for each topic.
5. Format the result with `.agents/templates/topic-shortlist-template.md`.

## Must Not

- do not invent sources or topics
- do not skip exclusions
- do not start article analysis before the user chooses a topic

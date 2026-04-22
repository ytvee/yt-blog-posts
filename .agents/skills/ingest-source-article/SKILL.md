# ingest-source-article

## Purpose

Analyze the chosen source article before translation and adaptation.

## When To Use

- after the user selects a topic
- before drafting the post

## Inputs

- selected source article
- `.agents/project/20-writing-workflow.md`
- `.agents/project/30-source-research-policy.md`
- `.agents/templates/source-article-analysis-template.md`

## Outputs

- structured source article analysis

## Procedure

1. Read the article carefully.
2. Extract the thesis, claims, examples, and constraints.
3. Identify what is factual and what requires editorial framing.
4. Note translation risks and adaptation opportunities.
5. Fill the output template.

## Must Not

- do not hallucinate missing facts
- do not flatten nuance
- do not treat analysis as a publishable draft

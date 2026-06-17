# Social Platform Profile: Telegram

This file defines default rules for adapting repo articles into Telegram posts for SEO-oriented content distribution.

## Purpose

Create a standalone Telegram post from a topic and source article. The post should distribute the article's core idea without becoming a mechanical summary or ad.

## Default Output

- Return the post in the chat response by default.
- Do not create files unless the user explicitly asks.
- Include the source link natively in the post text using `TODO(LINK)` as the placeholder when the real URL is unknown.
- Do not end with a detached footer like `Оригинальная статья: TODO(LINK)` unless the user explicitly asks for that format.

## Length

Default target: 1200-2200 characters, excluding the `TODO(LINK)` placeholder URL.

Shorter is acceptable when the idea is naturally compact. Longer is acceptable only when clarity would suffer.

## Language And Voice

- Russian by default.
- First-person voice is allowed when it follows from the article or authorial stance.
- Use the YTDEV style profile, writing guide, brand profile, valid patterns, and anti-AI guardrails.
- The post should sound like a practitioner thinking through the topic.

## SEO Distribution Rules

- Use the topic phrase and 2-5 natural semantic keywords from the article.
- Put the core topic signal near the beginning.
- Avoid keyword stuffing.
- SEO clarity must not damage voice, rhythm, or Telegram readability.

## Structure

Prefer:

- concrete observation or tension
- practical reframe
- one useful explanation or implication
- concise takeaway
- native source-link sentence where it naturally fits

Do not reproduce the source article section by section.

For AI/business topics, the post must include at least one concrete work detail: a call, brief, estimate, CRM integration, API call, permission boundary, log, handoff, or person responsible for the result.

If the topic requires authorial judgment, do not turn the post into a neat mini-lesson. The post should have one phrase-center that can be quoted or remembered, not only a clean explanation.

## Source Link Integration

Integrate the original article link as part of a useful sentence, not as a service footer.

Good patterns:

- `Я подробнее разложил это в статье про ...: TODO(LINK)`
- `Если хотите глубже пройтись по разнице между ..., я разобрал это здесь: TODO(LINK)`
- `В полной статье отдельно показываю, где заканчивается ... и начинается ...: TODO(LINK)`

Avoid:

- `Оригинальная статья: TODO(LINK)`
- `Подробнее по ссылке: TODO(LINK)`
- source-link sentences that feel like an ad instead of a natural continuation of the post

## Anti-AI Gate

Before returning, rewrite until these are absent:

- generic opening
- stock transition
- teacher voice
- polished filler
- formulaic ending
- mechanical summary rhythm
- close paraphrase of the source
- too-clean `term -> examples -> classification -> conclusion -> solution` ladder
- repeated encyclopedia-card rhythm like `X — это...`
- universal business phrases without operational edge
- safe methodical ending where a sharper authorial landing is available

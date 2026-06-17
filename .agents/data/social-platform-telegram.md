# Social Platform Profile: Telegram

This file defines default rules for adapting repo articles into Telegram posts for SEO-oriented content distribution.

## Purpose

Create a standalone Telegram post from a topic and source article. The post should distribute the article's core idea without becoming a mechanical summary or ad.

## Default Output

- Return the post in the chat response by default.
- Do not create files unless the user explicitly asks.
- End with: `Оригинальная статья: TODO(LINK)`

## Length

Default target: 1200-2200 characters, excluding the original-link line.

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
- original-link placeholder

Do not reproduce the source article section by section.

## Anti-AI Gate

Before returning, rewrite until these are absent:

- generic opening
- stock transition
- teacher voice
- polished filler
- formulaic ending
- mechanical summary rhythm
- close paraphrase of the source

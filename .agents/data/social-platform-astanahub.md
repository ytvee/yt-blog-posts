# Social Platform Profile: Astana Hub

Last updated: 2026-04-29

## Purpose

This file defines the platform-specific editorial rules for adapting a blog post from `content/<slug>.md` into a short Astana Hub draft.

This is a platform profile only.

- It does not define a skill.
- It does not define a markdown output template.
- It does not change the global writing workflow.

## Confidence Boundary

This profile mixes two kinds of rules:

### 1. Publicly Observed Platform Signals

These rules are grounded in public Astana Hub pages and visible platform structure:

- Astana Hub supports article-like community or blog content rather than only short social updates.
- Publicly visible topic areas include categories such as `AI and Machine Learning`, `Software development`, `IT trends`, `Analytics`, and `Startup`.
- Posts are shown with authorship, a cover image area, social sharing, and discussion or community interaction patterns.

### 2. Editorial Defaults Chosen Here

These rules are internal defaults for this repository because a full public Astana Hub author guide with strict technical limits was not confirmed here:

- preferred post length target
- default language choice
- recommended structure for short adaptations
- image fallback policy
- tone and CTA expectations

Treat these as safe operating defaults, not as official platform limits.

## Platform Role

Use Astana Hub as an expert community or article-post destination.

- not a fast news feed
- not a clickbait surface
- not a hard self-promotion channel

The adapted post should feel like a useful expert note for a startup and tech community audience.

## Audience

Primary audience:

- founders
- builders
- startup and community readers
- technical generalists

Secondary audience:

- product-minded operators
- developers
- people tracking AI, software, and digital market shifts

## Default Language

Default language: Russian (`ru`)

Use Russian unless the user explicitly asks for English or a bilingual output.

## Content Goal

Transform the source blog post into a short, useful Astana Hub adaptation.

The result must be:

- clearly derived from the original post
- materially shorter than the original
- useful on its own
- adapted for Astana Hub readers

The result must not be:

- a full repost of the blog article
- a mechanical compression of every section
- a near-duplicate of the original text

## Length Default

Editorial default target:

- around `700-1600` characters without the final original-link line

This is a working default for this repository, not a confirmed Astana Hub platform limit.

If the topic needs slightly more space to stay clear and useful, clarity wins over strict compression.

## Structure

Recommended structure for the adapted draft:

1. A strong practical lead with the main observation or tension.
2. `2-4` short paragraphs that explain one key idea, trade-off, or implication.
3. One compact closing takeaway for founders, builders, or operators.
4. A soft CTA or reading bridge.
5. A mandatory original-link line at the end.

Do not reproduce the source post section by section.

The draft should carry one main idea, not the full argument tree of the original article.

## Tone

The tone should be:

- calm
- practical
- anti-hype
- useful
- credible
- founder and builder friendly

The tone should not be:

- loud
- promotional
- overly polished
- slogan-driven
- written as engagement bait

Prefer clear observations, operational implications, and honest trade-offs.

## Original Link Rule

Every Astana Hub adaptation must end with a direct original-link line in this exact format:

`Original: https://www.ytdev.me/blog/<slug>`

Rules:

- always place it at the end
- use the source file name as the slug
- include exactly one original blog link
- do not hide the link inside another sentence

## Image Policy

Primary recommendation:

- use `ogImage` from the source post as the preferred image

Fallbacks:

- if there is no `ogImage`, use the first relevant inline image from the source post
- if `ogImage` and the first inline image point to the same file, treat them as one image
- if there is no relevant image, the Astana Hub post is valid without an image

Do not:

- invent new image assets
- duplicate the same image reference twice
- force an image when the source material does not support one

## Category Mapping

Choose one primary Astana Hub category for the draft.

Use these defaults:

- `AI for Business` -> `AI and Machine Learning`
- `IT Business and the Digital Market` -> `Startup` or `IT trends`
- `Web and Product Through Business and User Behavior` -> `Software development` or `Analytics`
- `Breakdowns of Strong Ideas` -> `Analytics` or `IT trends`
- `Practical Thinking` -> `Startup` or `IT trends`

Decision rule:

- choose the category that best matches the main practical value of the adapted post
- prefer one strong primary category over several weak category guesses

Quick selection guide:

- if the draft is mainly about AI adoption, AI workflow, or AI operating trade-offs, prefer `AI and Machine Learning`
- if the draft is mainly about startup execution, founder judgment, or company-level operating choices, prefer `Startup`
- if the draft is mainly about engineering practice, product implementation, or software process, prefer `Software development`
- if the draft is mainly about patterns, signals, metrics, or interpretation, prefer `Analytics`
- if the draft is mainly about market shifts, platform change, or industry direction, prefer `IT trends`

## Adaptation Priorities

When compressing a long blog post into Astana Hub format, preserve in this order:

1. the main thesis
2. the most useful practical implication
3. one memorable example, tension, or finding
4. the reading bridge to the full post

Drop supporting detail before dropping the main practical point.

## Hard Prohibitions

Do not:

- write clickbait
- write a sales pitch
- copy the long blog post almost verbatim
- add several competing external links
- promise unverified outcomes
- inflate weak evidence into certainty
- turn the post into generic motivation

## Practical Use Rule

A future agent should be able to use this file as the Astana Hub platform source of truth together with:

- the source post in `content/<slug>.md`
- the brand and style rules already present in `.agents/data` and `.agents/templates`

No additional Astana Hub-specific decisions should be required for a normal short adaptation.

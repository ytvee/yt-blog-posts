# Publishing Defaults

Last updated: 2026-04-27

## Default Locale

Russian (ru). All posts are written in Russian for CIS audience.

## Default Tags Policy

Tags are optional but encouraged for:
- Technical topics (TypeScript, React, Next.js, AI, UX/design-systems)
- Content pillars (AI, automation, education, entrepreneurship, systems-thinking)
- Topic domains (web-dev, business, learning)

No tags are required. Use tags for discoverability and content organization when relevant.

## OgImage Policy

**For published posts:** `ogImage` is practically required for social sharing and SEO.

**Path pattern:** Relative path from post file, typically `../media/<post-slug>-og.webp` or similar.

Example: post at `content/my-post.md` → ogImage: `../media/my-post-og.webp`

**Image specs (planned):**
TODO(USER): Confirm desired image dimensions, format preferences, design style.

## Date Format

`YYYY-MM-DD` (ISO 8601 format)

Example: `2026-04-22`

## UpdatedAt Policy

Set `updatedAt` when a published post is materially revised.

Material revisions include:
- Significant content rewrites
- Structural changes
- Major factual corrections
- Substantial additions
- Tone/style updates

Minor typo fixes do not require `updatedAt`.

Format: Same as `date` field (`YYYY-MM-DD`).

## Draft Policy

Drafts use `published: false` in frontmatter.

Draft files remain in `content/` during development (not moved to separate folder).

Draft files are never published to public (determined by `published` flag in frontmatter).

Revisions happen in-place before publishing. Once `published: true`, the post is live.

## Source Attribution Policy

**Source attribution in posts:**

For source-driven and opinion posts based on external sources:
- Mention the original idea or source in the post body when relevant
- Include links to source articles where appropriate
- Credit authors and publications respectfully
- No formal attribution section needed unless sourcing entire argument

**Style:** Attribution flows naturally within the narrative, not as separate "Sources" section.

Example: "Я наткнулся на работы Dr. Jeffrey Thompson" or "как я узнал от…"

**For educational content:**
- Cite sources for factual claims
- Link to referenced tools, frameworks, articles
- Give credit to ideas that aren't your own

**General principle:** Transparency about sources, natural integration into text, respect for original thinkers.

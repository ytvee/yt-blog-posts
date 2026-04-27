# Post Content Contract

This file mirrors the blog app content contract and must be manually synced when the app contract changes.

Status: mirrored/manual-sync information based on user-provided contract details.

## File Placement

- Every post must be a single file at `content/<slug>.md`.
- Do not create nested folders inside `content/`.
- One file equals one material.
- Do not mix multiple materials in one markdown file.
- One markdown file must not exceed `5 MiB`.

## Naming And Slug Rules

- File name must be unique.
- File name must use `kebab-case`.
- Route slug is derived from the file name, not from frontmatter.
- Do not change the slug of a published post unless there is an explicit reason and the user approves it.

## Frontmatter Schema

Required keys:

- `title`
- `date`
- `description`
- `readingTime`
- `published`

Allowed optional keys:

- `tags`
- `seoTitle`
- `ogImage`
- `locale`
- `updatedAt`
- `slug`
- `adBanners`

Validation rules:

- `date` must be a valid date.
- `updatedAt` must be a valid date when present.
- Prefer `YYYY-MM-DD` for both fields.
- `readingTime` must be an integer greater than zero.
- Calculate `readingTime` with `python3 scripts/calc_reading_time.py content/<slug>.md`.
- Calculate it only after the article text is final.
- If the article changes materially after the calculation, recalculate `readingTime` before returning the final markdown.
- Reading time formula:
  - count readable characters in the article body after removing frontmatter and markdown-only syntax
  - divide the readable character count by `1500`
  - add `0.2` minutes per image
  - round up only when the fractional part is `0.3` or higher
  - clamp the final value to a minimum of `1`
- `published: false` means draft.
- `description` is a working field for cards, metadata, and the lead paragraph, not decorative filler.
- For published posts, `ogImage` is treated as required in practice.
- Do not add arbitrary frontmatter keys beyond this list.

`adBanners` rule:

- Use `adBanners` only when there is a real need.
- Expected shape is `{ imageSrc, alt, href? }[]`.

## Markdown Body Rules

- Do not use markdown `#` inside the body.
- The body must start with `##`.
- Do not leave placeholder text such as `Draft`, `TBD`, or fake descriptions.
- Do not leave empty code fences, editor notes, JSON dumps, debug blocks, or technical garbage in the body.
- Keep inline image alt text meaningful.
- Treat the post as a strictly typed markdown or MDX-like document, not arbitrary markdown.

## Media Rules

- App-owned images may use `/images/...` if the external app supports them.
- Post assets may use relative paths such as `../media/cover.webp` if the external app proxies them.
- Do not assume other media conventions unless the user documents them.
- For published posts, verify that `ogImage` is present and not a placeholder.

## Publication Rules

- `published: false` means the material is a draft and should not be treated as publish-ready.
- If a published post is materially updated, set `updatedAt`.
- `description` must be a real lead and SEO summary, not a stub.
- Run a pre-publish check before returning final markdown.

## Validation Failures

Treat these as blocking failures:

- broken or malformed frontmatter
- missing required frontmatter keys
- invalid dates
- invalid `readingTime`
- body starts with `#`
- placeholder values in publish-facing fields
- invalid or broken media references
- file placed outside `content/`
- nested folders under `content/`
- file size over `5 MiB`

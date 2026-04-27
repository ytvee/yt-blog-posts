# Post Frontmatter Template

```yaml
---
title: ""
date: ""
description: ""
readingTime: 0
published: false
tags: []
seoTitle: ""
ogImage: ""
locale: ""
updatedAt: ""
slug: ""
adBanners: []
---
```

Notes:

- remove optional keys that are not needed
- do not add keys outside the mirrored contract
- keep `readingTime` temporary while the article is still changing
- calculate `readingTime` with `python3 scripts/calc_reading_time.py content/<slug>.md` only after the article text is final
- for published posts, treat `ogImage` as required
- `adBanners` is allowed only when really needed and should match `{ imageSrc, alt, href? }[]`

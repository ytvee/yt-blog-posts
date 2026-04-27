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
- calculate `readingTime` with `python3 scripts/calc_reading_time.py content/<slug>.md`
- for published posts, treat `ogImage` as required
- `adBanners` is allowed only when really needed and should match `{ imageSrc, alt, href? }[]`

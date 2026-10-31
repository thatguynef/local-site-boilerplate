---
name: og-image
description: Specify or replace the default Open Graph image so share cards stay readable.
---

# Open Graph image

Use this when a new business needs its own share image.

## Requirements

- File: `public/images/og-default.png`
- Size: exactly 1200 by 630 pixels
- `src/config/business.ts` keeps `ogImage`, `ogImageWidth`, and `ogImageHeight` pointed at that file unless the business uses a different path on purpose
- Put the business name, the primary service plus city, and the phone in the center of the image
- Leave a margin so the words are not clipped by a share-card crop
- Use large type on a solid background
- Do not use a photo of a real person, a fake review badge, or a stock handshake
- The important words must be readable without zooming

The layout emits `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, and the matching Twitter Card tags on every page, including the 404 page. Replacing the file is enough. Do not duplicate the tags in each page.

## Check

Run `npm run verify`. The social check reads the PNG header and expects 1200 by 630.

Share cards support Website Scorecard findability. They are not a ranking factor by themselves. Scorecard: https://github.com/thatguynef/website-scorecard

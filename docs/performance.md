# Performance budgets

`npm run performance-check` reads `dist/client` after a build. It also runs inside `npm run verify`. The targets in [DESIGN.md](../DESIGN.md) still describe LCP, INP, CLS, image loading, and self-hosted fonts. This file is the byte limit.

Defaults:

| Key | Default |
| --- | --- |
| `max_client_js_kb` | 60 |
| `max_css_kb` | 120 |
| `max_hero_image_kb` | 300 |
| `max_homepage_image_kb` | 1200 |
| `external_fonts` | false |
| `decorative_video_hero` | false |

Leave `performance` off `client/site-spec.yaml` to use these defaults. Set a key only when the client site needs a higher limit or a real video. The check then uses that value. One high-priority image is allowed on a page. Other images use `loading="lazy"`. A remote font host fails while `external_fonts` is false.

The sample build stays inside the defaults. Raising a number is a client decision recorded in the site spec.

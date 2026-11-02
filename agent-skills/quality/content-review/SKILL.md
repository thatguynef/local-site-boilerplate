---
name: content-review
description: Review page copy for generic language and unsupported claims. The deterministic checks are npm run evaluate:content, which is not part of npm run verify.
---

# Content review

Use this after the build-now pages exist. Run `npm run evaluate:content` first. It reads `dist/client`, so build the site before it. It fails on a phrase that only makes sense next to other text (`click here`, `see above`, `read more`, `as mentioned`, `as stated above`), a repeated FAQ answer on one page, or two service pages or two city pages that share an answer paragraph.

Fix those failures before the written review. The command is not part of `npm run verify`.

Then write one line for each of these. Use `client/facts.yaml`, the page brief, and [docs/client-data.md](../../../docs/client-data.md). Do not invent a differentiator to make the review pass.

- The copy could describe a different company in the same trade with the names swapped.
- Adjectives are doing the work that a fact should do.
- A benefit is vague.
- A keyword or the city is repeated without adding information.
- A paragraph exists for search engines rather than the visitor.
- The wording matches the customer situations in `strategy.yaml`.
- A claim on the page is not publishable.

An empty `positioning.differentiators` list means the page must not invent one. On this repository, do not rewrite Example Plumbing to sound more distinctive.

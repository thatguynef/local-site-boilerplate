# Change policy

Four layers. Client personalization stays in the lower two. A change to a locked contract is an engine change on `local-site-boilerplate`, then a release tag. See [AGENTS.md](../AGENTS.md).

## Layer 1 — Locked

Do not change these while personalizing a client site:

- Verification meaning in `scripts/checks/`, `scripts/run-all.sh`, and `evaluations/`
- Form field names: `name`, `phone`, `email`, `area`, `service`, `preferredTime`, optional `message`, honeypot `company`
- `POST /api/contact/` behavior, including the 400 body (field names, not values) and the 303 to `/thank-you/`
- Honeypot behavior: a filled `company` still redirects and is not forwarded
- The rule that NAP lives only in `src/config/business.ts`
- JSON-LD contracts: types and values must match the visible page
- `noindex` on `/thank-you/` and the 404 page; privacy stays indexable
- Sitemap and `robots.txt` rules, including the thank-you omission
- Required accessibility behavior: `lang`, skip link, labels, visible focus, 44px targets
- Secrets: no `.dev.vars`, webhook URLs, or API keys in git
- Deploy contract: Cloudflare Workers, prerendered pages, contact form as the server route
- Route meaning and trailing slashes
- One H1 per page
- Answer-first blocks and standalone FAQ answers
- Required internal links the checks enforce

If a client site needs one of these to change, stop and treat it as an engine change. Do not fork the checks.

## Layer 2 — Guarded

You may change the implementation if every Layer 1 contract still holds:

- Page layouts and section markup
- Header, footer, and navigation markup
- Service, service-area, FAQ, contact, and trust UI
- Components under `src/components/`
- Internals of `src/lib/schema.ts`, when the emitted graph still matches the checks
- `src/styles/global.css` and `DESIGN.md`

`npm run verify` must exit 0 after the change.

## Layer 3 — Client-customizable

Expected to change in the client repository:

- Business facts in `src/config/business.ts`
- Service and city markdown, plus home, about, FAQ, and privacy copy
- CTA labels, nav labels, and other visible wording the facts support
- Logo, icons, photos the client owns, and `public/site.webmanifest` name
- `site` in `astro.config.mjs` and the Worker `name` in `wrangler.jsonc`
- Profile URLs and analytics ids, only when they are real

Empty trust fields stay empty until they are proven.

## Layer 4 — Creative

Broad freedom after foundation verify passes:

- Page composition and section order
- Hero, cards, type, spacing, and color
- Responsive composition
- How services, reviews, trust, and the service area are presented
- Iconography and client-owned imagery
- Interaction that still meets accessibility and the performance notes in `DESIGN.md`

The Example Plumbing design is scaffolding, not a design target. Do not stop at a recolor.

Refused even here: decorative hero video, scroll-jacking, third-party font hosts, and claims the client did not supply. One self-hosted font pair is allowed. The sample ships the system font stack.

## File matrix

| Path | Layer | Note |
| --- | --- | --- |
| `scripts/checks/`, `scripts/run-all.sh` | Locked | Client builds do not edit these. |
| `evaluations/` | Locked | Criteria stay mapped to the sister scorecards. |
| `src/pages/api/contact.ts`, `src/lib/lead.ts` | Locked | Form and webhook contract. |
| `src/pages/robots.txt.ts`, sitemap filter | Locked | Indexing rules. |
| `src/pages/thank-you.astro`, `src/pages/404.astro` | Locked for `noindex` | Wording may change. Indexing may not. |
| `.github/workflows/verify.yml` | Locked | Same gate as local verify. |
| `src/config/business.ts` | Values are client-customizable | The single-source rule is locked. |
| `src/content/` | Client-customizable | Keep `_example.md`. Do not build files whose names start with `_`. |
| `astro.config.mjs` `site` | Client-customizable | Canonical origin. |
| `wrangler.jsonc` `name` | Client-customizable | Unique Worker name. Leave `compatibility_date` unless a newer Wrangler accepts a later date. |
| `src/layouts/`, `src/components/`, `src/pages/*.astro` | Guarded | Markup and composition may change. Routes may not. |
| `src/lib/schema.ts` | Guarded | Emitted contracts stay. |
| `src/styles/global.css`, `DESIGN.md` | Creative | Sample tokens are not a client requirement. |
| `public/images/`, icons, manifest name | Client-customizable | Keep a 1200×630 share image. |
| `agent-skills/visual/personalize-client-site/` | Project skill | Entry point for the visual pass. |
| `agent-skills/visual/` vendored skills | Locked text | Do not rewrite upstream skill files. Project rules win when they conflict. |
| `client/` | Client-customizable | No secrets. Example files use the sample business. |

## Who changes a layer

| Place | Allowed work |
| --- | --- |
| Boilerplate `main` | Engine fixes, docs, and the Example Plumbing sample. |
| Client repository | Layer 3 and Layer 4, plus Layer 2 when contracts still pass. |
| A release tag merge | How a client repository receives engine fixes. Do not merge `upstream/main`. |

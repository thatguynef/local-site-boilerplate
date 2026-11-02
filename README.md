# local-site-boilerplate

An agent-ready engineering and quality foundation for bespoke local home-service websites.

## Foundation, not visual template

Use this repository to inherit proven architecture, local SEO/GEO/AEO structure, structured data, accessibility, performance, lead handling, conversion primitives, verification, and deployment conventions.

Do not treat Example Plumbing as a visual template.

A client implementation should preserve the foundation's contracts while substantially adapting its visual identity, page composition, content, positioning, imagery, typography, and presentation to the actual business.

Standardize what customers cannot see.
Personalize what customers can see.

The sample business is Example Plumbing in Example City. The phone number (555) 010-0199 is not a real line. It stays on this repository's `main` branch. Replace it in a client repository, not here.

Agents start at [AGENTS.md](AGENTS.md). Working rules are in [docs/principles.md](docs/principles.md). What may change is in [docs/change-policy.md](docs/change-policy.md).

This repository is [MIT licensed](LICENSE). Copyright 2026 Nefer Lopez. Vendored skills in `agent-skills/visual/` keep their own licenses. See [agent-skills/visual/SOURCES.md](agent-skills/visual/SOURCES.md).

## Sister scorecards

Three scorecards decide what "complete" means here. This repo does not copy their rubrics.

- [Website Scorecard](https://github.com/thatguynef/website-scorecard) ([rendered guide](https://thatguynef.github.io/website-scorecard/))
- [Local Visibility Scorecard](https://thatguynef.github.io/local-visibility-scorecard/)
- [GBP Scorecard](https://thatguynef.github.io/gbp-scorecard/)

The journey is discovery, then the Google Business Profile, then the website. Local Visibility asks whether a homeowner can find a page that matches the job and the city. The GBP scorecard asks whether the profile and the site can show the same name, phone, hours, services, and a way to call. The Website Scorecard asks whether that visit explains the work, offers a next step, and can be trusted.

`npm run verify` proves the on-site structure. It does not produce a numeric scorecard score. It does not measure Maps rank, competitor share, live AI citations, profile reviews, profile categories, or profile posts.

## Page plan

Before choosing which service pages and city pages to build, point an agent at [local-page-plan](agent-skills/foundation/local-page-plan/SKILL.md). It orders `/services/<slug>/` and `/service-areas/<slug>/` from local keyword demand through OpenSEO, and from the public URLs when a site is already live. Search Console, Analytics, and the Business Profile are used only when the user already has them. A missing metric stays unknown.

The plan does not score the built site, and `npm run verify` does not call it. It does not forecast a Maps rank or a date. The skill stays in this repository.

## Clone and start

Requires Node.js 22.22.0 or newer.

To work on this boilerplate, clone `main`, keep Example Plumbing, and run the checks:

```bash
git clone https://github.com/thatguynef/local-site-boilerplate.git
cd local-site-boilerplate
npm install
npm run verify
```

A client site does not use that clone. Cut a new repository from a release tag and tailor it there. The steps are in [docs/client-repo.md](docs/client-repo.md). `upstream` stays pointed at this repo so a later tag can be merged. Do not build the client on this `main` branch.

For a client who already has a site, start with [existing-site-facts](agent-skills/foundation/existing-site-facts/SKILL.md), then follow [docs/existing-site.md](docs/existing-site.md). For a client with no site, start with [new-site-intake](agent-skills/foundation/new-site-intake/SKILL.md), then follow [docs/new-site.md](docs/new-site.md).

The site is not ready until `npm run verify` exits 0.

`npm run verify` reads the primary service page from the `primaryServices` href that matches `primaryService`, and the primary city page from the address city. `Example City` is `/service-areas/example-city/`. The home page, the services index, that service page, and that city page must use the city plus a word from `trade` or `primaryService` in the title, the description, and the H1. Words shorter than four characters do not count. A word ending in "ing" also matches its stem, so `plumbing` matches `plumber`.

Deploy the repository you are shipping, either this sample or a client repo, to Cloudflare Workers (not Cloudflare Pages):

```bash
npm run build && npx wrangler deploy
```

`wrangler.jsonc` serves `dist/client` as static assets and the Worker from `@astrojs/cloudflare`. The contact form is the only server route. Marketing pages are prerendered. This repository does not create a Workers project for you.

`compatibility_date` is `2026-10-30` because Wrangler 4.156.0's local runtime rejects a later date. Move it forward when you upgrade Wrangler.

## Files to edit in the client repo

Change these in the client repository from [docs/client-repo.md](docs/client-repo.md), after the fact sheet is accepted. Leave them as the sample on this repo's `main` branch.

| File | What to change |
| --- | --- |
| `astro.config.mjs` | Public site URL. Canonical URLs, Open Graph URLs, robots.txt, and the sitemap use it. |
| `src/config/business.ts` | Name, phone, email, address, geo, hours, service area, services, and trust fields. This is the only NAP source. |
| `src/content/pages/` | Home, about, FAQ, and privacy copy. |
| `src/content/services/` | One markdown file per service. Names that start with `_` are templates and are not built. |
| `src/content/service-areas/` | One markdown file per city. |
| `public/images/og-default.png` | Share image. See below. |
| `public/site.webmanifest` | `name` and `short_name` after you rebrand. |
| `public/favicon.svg` and the PNG icons | Mark, if the client has one. |
| `.dev.vars` | Optional `CONTACT_WEBHOOK_URL`. Copy from `.dev.vars.example`. Do not commit `.dev.vars`. |

Leave `licenseNumber`, `licenses`, `afterHours`, `financing`, `maintenancePlan`, `insurance`, `guarantee`, `reviews`, `startingPrice`, and `ownerName` empty until you can prove them. License, insurance, and guarantee show a placeholder. After-hours, financing, and a maintenance plan stay off the page until they are set. A maintenance plan is shown only on the service page whose slug or title contains "maintenance".

Set `showExampleBanner` to `false` when the sample banner should come down.

`analytics.ga4` and `analytics.gtm` stay empty until you have a real id. The layout injects a snippet only when the id matches `G-…` or `GTM-…`. An empty id loads no tracker.

## Replace the Open Graph image

The default file is `public/images/og-default.png`, 1200 by 630 pixels. It reads "Example Plumbing", "Drain cleaning in Example City", and "Call (555) 010-0199".

Replace that file and keep the same pixel size. Put the business name, the service and city, and the phone in the center, with enough margin that a share card does not crop the words. Do not use a photo of a real person.

Every page picks up the new image from `business.ogImage`. You do not add Open Graph tags by hand. Width and height live next to the path in `src/config/business.ts`.

## Fill schema placeholders

`src/lib/schema.ts` emits one JSON-LD graph per page from `src/config/business.ts`:

- `WebSite` on every page, with no search box
- A local-business subtype (`Plumber` in the sample) with name, telephone, address, geo coordinates, opening hours, and `areaServed`
- `Service` on a service detail page
- `FAQPage` when that page has FAQ entries, using the same words as the visible list
- `BreadcrumbList` on inner pages, not on the home page or the 404 page
- `HowTo` when the page has process steps

Set `geo` to the public location and `openingHours` to the real week. `hoursDisplay` is the sentence visitors read, and it should describe the same days and times. Add profile URLs to `sameAs` only when they are real.

`npm run verify` parses the JSON-LD and compares it with the visible FAQ, process heading, and NAP. Before a production domain goes live, also run [Google's Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/). Those hosted tools are not the local gate.

## Answer-first content

Service and location pages open with a short answer: what the business does, where, and how to reach it. The next headings are questions. A process section says what happens on a visit. An FAQ repeats answers a person can quote without opening another page. Neighborhood names come from the config.

Copy `src/content/services/_example.md` or `src/content/service-areas/_example.md` to a new file that does not start with `_`. Keep the phone number identical to `phoneDisplay`. The [foundation skills](agent-skills/README.md) walk an agent through that pattern.

Water heater repair and leak detection are listed in the sample and link to the contact page until you write a real page for each. That avoids thin duplicates.

## Agent skills

Foundation skills write and review content. Visual skills are a later pass.

Read [agent-skills/README.md](agent-skills/README.md). Point your agent at the `SKILL.md` you need, or copy that folder into the agent's skills directory.

Use `personalize-client-site` before any visual skill. The Example Plumbing design is scaffolding, not a design target. That pass may replace composition, type, color, and imagery. It may not drop the H1, the NAP, the form fields, the schema, or the answer blocks. Follow [docs/change-policy.md](docs/change-policy.md). `overdrive`, scroll-jacking, and decorative hero motion are out. The sample font stack is the system stack. One self-hosted pair is allowed during a client pass.

Run `npm run verify` after a visual pass. The structural suite still has to pass.

## Scripts and evaluations

```bash
npm run verify
```

That builds the site, previews it on `127.0.0.1:4329`, and runs:

| Check | What it confirms |
| --- | --- |
| `scripts/checks/check-404.mjs` | The 404 page exists, uses noindex, links home, and is what a missing path returns |
| `scripts/checks/check-social.mjs` | Open Graph and Twitter Card tags on every HTML file, and a 1200×630 share image |
| `scripts/checks/check-jsonld.mjs` | Local business, FAQ, Service, breadcrumb, and HowTo schema |
| `scripts/checks/check-robots-sitemap.mjs` | `robots.txt`, the sitemap, and noindex on utility pages that must stay out of the index |
| `scripts/checks/check-pages.mjs` | Required URLs, one H1, heading order, internal links |
| `scripts/checks/check-nap.mjs` | One name, address, and phone across the header, footer, and contact page |
| `scripts/checks/check-form.mjs` | Labels, required fields, honeypot, a 400 for an invalid POST, and a 303 to `/thank-you/` for a valid POST |
| `scripts/checks/check-faq.mjs` | The FAQ page, answer blocks, and self-contained answers |
| `scripts/checks/check-html-a11y.mjs` | Language, skip link, labels, focus styles, and touch targets |
| `evaluations/run.mjs` | Pass, fail, or not-applicable rows mapped to the three scorecards |

Evidence is printed and written under `evaluations/results/`, which is gitignored. A pass is structural readiness. Details and the scorecard URLs are in [evaluations/README.md](evaluations/README.md).

GitHub Actions runs the same command on push and pull request (`.github/workflows/verify.yml`).

## What the foundation includes

- Astro static pages and a Cloudflare Worker `POST /api/contact/`
- Home, services, one sample service, service areas, one sample city, about, contact, thank-you, privacy, FAQ, and 404
- Main navigation and a footer with NAP, page links, and the copyright year
- Title, description, canonical, robots, Open Graph, Twitter Card, viewport, charset, favicon set, and web manifest on every page
- JSON-LD for the local business, services, FAQs, breadcrumbs, and process steps
- `robots.txt` and a sitemap that omits the thank-you page
- `noindex` on the 404 page and the thank-you page
- Answer-first service and location copy, process steps, and local neighborhood names
- Contact form: name, phone, email, ZIP or area, service, preferred time, and an optional message
- Click-to-call in the header and footer
- Empty slots for license, insurance, guarantee, reviews, and price
- Mobile-first layout, skip link, visible focus, 44px targets, and lazy-loading defaults
- Foundation skills, vendored visual skills, checks, and evaluations

The form has six required fields plus an optional message. The Website Scorecard gives full points at five required fields or fewer. The ZIP field stays because the business needs to know where the job is. The check records that on purpose.

If `CONTACT_WEBHOOK_URL` is unset, a valid submission redirects to `/thank-you/` and is not stored. A filled honeypot (`company`) takes the same redirect and is not forwarded. Invalid submissions return `400` and a list of field names, not the values. GET is rejected. Turnstile is not wired up. Add it when you have a site key.

## How scorecard criteria map to this repo

| Need | In the site | Skill | Evaluation |
| --- | --- | --- | --- |
| Service, city, and a clear next step | Home H1, answer paragraph, nav, contact link | `generate-service-page`, `review-website-scorecard` | `RL-UND-01` through `RL-UND-07` |
| Same phone, a form, labels | Header, footer, contact form | `check-nap` | `RL-CON-01`, `RL-CON-02`, `RL-CON-04` through `RL-CON-08` |
| Hours, callback promise, thank-you | Contact page and `/thank-you/` | `fill-jsonld` | `RL-RSP-01`, `RL-RSP-02`, `RL-RSP-04`, `RL-RSP-05` |
| License and guarantee without fiction | `Trust` placeholders | `review-website-scorecard` | `RL-TRU-04`, `RL-TRU-05` |
| Phone layout and focus | `src/styles/global.css`, skip link | `personalize-client-site` | `RL-MOB-01`, `RL-MOB-02`, `RL-MOB-03` |
| Titles, canonical, sitemap, schema NAP | `Head`, `robots.txt.ts`, sitemap filter | `og-image`, `fill-jsonld` | `RL-FND-01` through `RL-FND-04` |
| Analytics only when an id exists | `business.analytics` | — | `RL-MSR-01` (not applicable while empty) |
| Unique local URLs and quotable answers | Service and area pages, FAQ | `generate-service-area-page`, `update-faq` | `LV-INTENT`, `LV-UNIQUE`, `LV-FAQ`, `LV-AREA`, `GEO-*` |
| Profile-aligned name, services, phone, hours | Config and footer | `check-nap` | `GBP-NAP`, `GBP-SERVICES`, `GBP-TEL`, `GBP-HOURS` |

Maps rank, competitor share, live AI mentions, Business Profile reviews, categories, and posts are not applicable. They belong to the Local Visibility Scorecard and the GBP Scorecard, not to a file in this repo.

## License

The site, the checks, and the foundation skills are [MIT](LICENSE). Copyright 2026 Nefer Lopez.

`frontend-design` and `impeccable` are Apache-2.0. The four skills from `divyanshu-iitian/agent-website-design-skills` are MIT, copyright 2026 Divyanshu. Attribution and commit pins are in [agent-skills/visual/SOURCES.md](agent-skills/visual/SOURCES.md).

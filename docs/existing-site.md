# Build from an existing website

Use this path when the client already has a site. The current URL is the source of facts and old addresses. Rebuild those facts on this boilerplate. Do not import the old theme, CMS, or page builder.

Build the site in its own repository. Follow [client-repo.md](client-repo.md). Keep client work off `local-site-boilerplate`.

This path inherits the engineering system and then builds a bespoke site. It does not stop when the sample name is replaced. Agents start at [AGENTS.md](../AGENTS.md). Layer rules are in [change-policy.md](change-policy.md). The Example Plumbing design is scaffolding, not a design target.

Requires Node.js 22.22.0 or newer. The site deploys to Cloudflare Workers, not Cloudflare Pages. `npm run verify` must exit 0 before launch. A pass means the on-site structure is in place. It is not a numeric scorecard score, a Maps rank, or proof that an assistant cites the business.

Scorecards, without copying their rubrics:

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

## Locked rules

- Put name, phone, address, hours, service area, and services only in `src/config/business.ts`.
- `phoneDisplay` and `phoneTel` use the same digits.
- Leave `ownerName`, `licenseNumber`, `licenses`, `afterHours`, `financing`, `maintenancePlan`, `insurance`, `guarantee`, `reviews`, and `startingPrice` empty until the reference site or the client shows a value they can prove. After-hours, financing, and a maintenance plan stay off the page until they are set.
- Leave `analytics.ga4` and `analytics.gtm` empty unless the id matches `G-…` or `GTM-…`.
- One H1 per page. On the home page, the services index, each service page, and each city page, the title, the meta description, and the H1 each include a trade word and the city.
- Service and city answers are at least 40 characters and say what the company does, where, and how to book. FAQ answers stand alone. Do not write "click here", "see above", or "read more".
- Do not add a blog in this pass. This boilerplate has no blog.
- Do not rename form fields. Required: `name`, `phone`, `email`, `area`, `service`, `preferredTime`. Optional: `message`. Honeypot: `company`. The form posts to `/api/contact/`.
- Keep `/thank-you/` and the 404 page `noindex`. Keep privacy indexable.
- Files named `_example.md` are templates and are not built.
- A service with no real page links to `/contact/`.
- One page per city the client will actually drive to.
- Visual changes come after the facts and `npm run verify` pass. Use `agent-skills/visual/personalize-client-site/SKILL.md` and [change-policy.md](change-policy.md). Composition, type, color, and imagery may depart from Example Plumbing.

`npm run verify` reads the primary service page from the `primaryServices` href that matches `primaryService`, and the primary city page from the address city (`Corpus Christi` is `/service-areas/corpus-christi/`). The home page, the services index, that service page, and that city page must use the city plus a word from `trade` or `primaryService` in the title, the description, and the H1. Words shorter than four characters do not count. A word ending in "ing" also matches its stem, so `plumbing` matches `plumber`. Do not edit the check scripts for a new business.

## Phase 1 — Permission and the reference URL

Collect the canonical URL, including `https://`. Note whether `www` or the bare domain is canonical. Confirm you may reuse the client's own facts and copy. Ask who can confirm the phone, address, hours, license, and services. The public site is enough to start. Record domain, Business Profile, inbox, or analytics access only when the client has already offered it.

Point an agent at `agent-skills/foundation/existing-site-facts/SKILL.md`. Do not clone until you accept the fact sheet in one sentence, or name the rows you strike.

## Phase 2 — Read the site

The existing-site-facts skill reads the public site, fills the fact sheet, and drafts the URL map used in Phase 3. It does not choose which pages to build.

Use a logo, illustration, or job photo only when the client confirms they own it. Do not copy another company's reviews or badges.

Blog, tag, author, and gallery URLs stay on the URL map as redirects. Do not add a blog to this build.

## Phase 3 — Map old URLs to boilerplate URLs

The new site has this shape:

```text
/
/services/
/services/<service-slug>/
/service-areas/
/service-areas/<city-slug>/
/about/
/faq/
/contact/
/privacy/
/thank-you/          noindex
```

Build a two-column map from each old URL to one of those routes.

- One primary service becomes `/services/<slug>/`. Other real services get their own pages. A service the old site only mentions, with no real explanation, stays a name in `primaryServices` and links to `/contact/`.
- One city they actually drive to becomes `/service-areas/<slug>/`. Do not turn a long footer list of city names into a thin page per city.
- About, contact, FAQ, and privacy map to those same routes.
- Old blog, tag, author, and gallery URLs do not get a new page in this pass. They still need a redirect decision in Phase 8.

Write down the primary service slug and the primary city slug. Verify reads those slugs from the business config. Do not edit the check scripts.

## Phase 4 — Start the client repo and load verified facts

Follow [client-repo.md](client-repo.md). Clone tag `v1.2.0`, keep the git history, and set `upstream` to this boilerplate. Do not delete `.git`.

In that repository, set `site` in `astro.config.mjs` to the `https://` origin you will launch. In `wrangler.jsonc`, change `"name"` from `local-site-boilerplate` to a unique Worker name. Leave `compatibility_date` at `2026-10-30` unless a newer Wrangler runtime accepts a later date.

Fill `src/config/business.ts` from the accepted fact sheet:

- `businessName`, `trade`, `primaryService`, `schemaType`
- `phoneDisplay` and `phoneTel`
- Address, geo coordinates for that public address, hours, and `hoursDisplay`
- `responsePromise` only when the old site states one, or when the client agrees to the sentence before you publish it
- `areaServed` and `neighborhoods` limited to places the new pages will name
- `primaryServices` with the final href for each service
- `sameAs` only for profiles you opened
- Analytics ids only when they match a real `G-…` or `GTM-…` property

Leave owner, license, insurance, guarantee, reviews, and price empty when the site did not prove them. Set `showExampleBanner` to `false` only after the sample sentences are gone. Set `name` and `short_name` in `public/site.webmanifest`.

`schemaType` is a schema.org local-business subtype. The sample is `Plumber`. Use `Electrician`, `HVACBusiness`, `RoofingContractor`, `Locksmith`, `GeneralContractor`, or the closest real subtype for another trade.

## Choose the pages

Before Phase 5, point an agent at `agent-skills/foundation/local-page-plan/SKILL.md`. Give it the accepted services and cities from the fact sheet, plus the canonical domain. It does not run inside `npm run verify`. The plan uses local keyword demand and the public URLs already collected. It does not need Search Console, Analytics, or Business Profile access. A missing metric stays unknown.

Build-now rows with no current URL are new pages. Optimize-first rows are the pages to rebuild with the most care. Do-not-build rows stay out of the new site. Keep those old URLs on the Phase 3 redirect map, pointed at the closest real page or `/contact/`.

The plan compares this client's own services and cities. It does not name a Maps rank or a date.

## Phase 5 — Rewrite the pages

Use the old page as the fact source and the page plan as the build order. Write the new page in the answer-first shape.

For each service file and each city file:

- `title` is the only H1, and it includes the service or trade and the city
- `seoTitle` and `description` do the same
- `answer` is at least 40 characters and names the service or trade, the city, and how to book
- At least two steps for how a visit works
- At least two FAQs whose answers stand alone
- Body headings are questions
- Links go to the matching service page, city page, FAQ, and `/contact/`

Copy `src/content/services/_example.md` or `src/content/service-areas/_example.md` to a new file that does not start with `_`. Delete `src/content/services/drain-cleaning.md` and `src/content/service-areas/example-city.md` once the real pages replace them. Keep the `_example.md` templates.

Rewrite thin or duplicated location copy. Keep a claim only when the reference site or the client stated it.

Home, about, FAQ, and privacy come from `src/content/pages/`. The FAQ page needs at least three questions. Privacy should describe this form: name, phone, email, ZIP or area, service, preferred time, and an optional message. The client should have a qualified person review that page before launch.

An agent writes `agent-skills/content/page-brief/SKILL.md` first, then drafts from `generate-service-page/SKILL.md`, `generate-service-area-page/SKILL.md`, `update-faq/SKILL.md`, and `fill-jsonld/SKILL.md`. Paste the reference URL, the accepted fact sheet, and the brief. Tell it to leave any unproven field blank.

## Phase 6 — Run the checks

The home page must link to the primary service href, the primary city page, `/faq/`, `/about/`, and `/contact/`. Verify reads those URLs from the config. Do not edit the check scripts.

Replace `public/images/og-default.png` with a 1200×630 image. Put the business name, the primary service, the city, and the phone in the center. Use a logo or job photo only when the client owns it. Keep `ogImage`, `ogImageWidth`, and `ogImageHeight` pointed at that file.

Replace `public/favicon.svg` and the PNG icons when the client has a mark.

Run `npm run verify`. Fix every failed line. Then click through home, one service, one city, contact, thank-you, and a missing URL.

## Phase 7 — Personalize the look

Do this after Phase 6 passes.

Give an agent `agent-skills/visual/personalize-client-site/SKILL.md`, the reference URL, the client's logo, real job photos, and any brand colors. The Example Plumbing design is scaffolding, not a design target. Follow [change-policy.md](change-policy.md). That pass may replace composition, type, color, and imagery. It keeps the routes, the single H1, the NAP, the schema contracts, the form field names, and the answer blocks.

Run `npm run verify` again after the visual pass.

## Phase 8 — Review, redirects, and launch

Walk the client through the preview. Correct the phone, address, hours, services, and service area in `src/config/business.ts` or the content files. Run `npm run verify` again.

Before DNS moves:

- Publish a 301 from each old URL that people or search engines already use to the new URL from the Phase 3 map. Unknown old URLs should hit the boilerplate 404, which is `noindex` and links home.
- Set `CONTACT_WEBHOOK_URL` with `npx wrangler secret put` so a real submission is delivered. Copy `.dev.vars.example` to `.dev.vars` for local preview. Do not commit `.dev.vars`.
- Submit one test lead and confirm it arrives. A valid post sends JSON with `name`, `phone`, `email`, `area`, `service`, `preferredTime`, `message`, and `source` set to `website-contact-form`, then redirects to `/thank-you/`.
- Attach the domain to the Worker and make it match `site` in `astro.config.mjs`.
- Deploy with `npx wrangler login` and then `npm run build && npx wrangler deploy`.
- When the client has a Business Profile, the name, phone, address, hours, and service names on it should match the new site.
- Run the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/) on the home page, the primary service page, and the primary city page.

After launch, open the old service and city URLs and confirm each one lands on the new page. When the client has Search Console, they can submit `https://<domain>/sitemap-index.xml`.

This repository does not ship a redirect file. The redirect map is part of the client project, not part of the boilerplate sample.

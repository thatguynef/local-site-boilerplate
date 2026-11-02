# Build a site from scratch

Use this path when the client has no website. Collect the intake checklist, then build from this boilerplate.

Create a new repository from this one. Keep client work off `local-site-boilerplate`.

Requires Node.js 22.22.0 or newer. The site deploys to Cloudflare Workers, not Cloudflare Pages. `npm run verify` must exit 0 on the client's real name, trade, city, and primary service. A pass means the on-site structure is in place. It is not a numeric scorecard score, a Maps rank, or proof that an assistant cites the business.

Scorecards, without copying their rubrics:

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

## Locked rules

- Put name, phone, address, hours, service area, and services only in `src/config/business.ts`.
- `phoneDisplay` and `phoneTel` use the same digits. The sample shape is `(555) 010-0199` and `+15550100199`.
- Leave `ownerName`, `licenseNumber`, `insurance`, `guarantee`, `reviews`, and `startingPrice` empty until the client supplies a value they can prove. The page shows a placeholder.
- Leave `analytics.ga4` and `analytics.gtm` empty unless the id matches `G-…` or `GTM-…`.
- One H1 per page. On the home page, the services index, each service page, and each city page, the title, the meta description, and the H1 each include a trade word and the city.
- Service and city answers are at least 40 characters and say what the company does, where, and how to book. Body headings are questions. FAQ answers stand alone. Do not write "click here", "see above", or "read more".
- Do not add a blog, a booking calendar, or a second language in this pass.
- Do not rename form fields. Required: `name`, `phone`, `email`, `area`, `service`, `preferredTime`. Optional: `message`. Honeypot: `company`. The form posts to `/api/contact/`.
- Keep `/thank-you/` and the 404 page `noindex`. Keep privacy indexable.
- Files named `_example.md` are templates and are not built.
- A service with no real page links to `/contact/`. Do not publish a thin duplicate.
- One page per city the client will actually drive to.
- Visual changes come after the facts and `npm run verify` pass. Use `agent-skills/visual/personalize-client-site/SKILL.md`. That pass may edit `DESIGN.md` and `src/styles/global.css`. It keeps the routes, the single H1, the NAP, the schema, the form field names, and the answer blocks. One self-hosted font pair is allowed. The default is the system font stack.

`npm run verify` reads the primary service page from the `primaryServices` href that matches `primaryService`, and the primary city page from the address city (`Corpus Christi` is `/service-areas/corpus-christi/`). The home page, the services index, that service page, and that city page must use the city plus a word from `trade` or `primaryService` in the title, the description, and the H1. Words shorter than four characters do not count. A word ending in "ing" also matches its stem, so `plumbing` matches `plumber`. Do not edit the check scripts for a new business.

## Phase 1 — Intake

Send the client the checklist at the end of this file. Do not start the repo until the required answers are in. If an optional answer is missing, leave that field blank and build the rest.

Required before writing pages:

- Legal or published business name
- Trade, in the client's words, and the one primary service
- Phone they will answer, and the email for leads
- Street, city, state, postal code, and country of the public business location
- Hours, including which days are closed
- Who calls back after a form or a call, and how soon
- Cities and neighborhoods they will actually serve
- The other services to name now, and which of those get a full page in this pass
- The domain they will launch on
- Where a lead should go: a webhook URL, an inbox tool, or "not decided yet"

Write a one-page brief from the answers: name, trade, primary service, primary city, domain, and lead destination. List every blank optional field so nobody fills it with a guess later.

## Choose the pages

After the intake list is confirmed and before Phase 4, point an agent at `agent-skills/foundation/local-page-plan/SKILL.md`. It does not run inside `npm run verify`.

Give it the services the client performs and the cities they will drive to. The plan uses local keyword demand. A missing metric stays unknown.

Write a page only for a row marked build now. A service marked later stays in `primaryServices` with `href` `/contact/`. A city marked later stays off the site until a later pass. A neighborhood stays a name on its city page.

The client's note about which services should get a page is an input to that plan. The plan orders the list. It does not name a Maps rank or a launch date.

## Phase 2 — Create the client project

```bash
git clone --branch v1.1.0 https://github.com/thatguynef/local-site-boilerplate.git client-site
cd client-site
rm -rf .git
git init
npm install
```

Point `origin` at the client's repository. In `astro.config.mjs`, set `site` to the real `https://` origin. In `wrangler.jsonc`, change `"name"` from `local-site-boilerplate` to a unique Worker name. Leave `compatibility_date` at `2026-10-30` unless a newer Wrangler runtime accepts a later date.

Run `npm run dev` and confirm the sample Example Plumbing site loads.

## Phase 3 — Load the business config

Edit `src/config/business.ts` from the brief.

- `businessName`, `trade`, `primaryService`
- `schemaType`: a schema.org local-business subtype such as `Plumber`, `Electrician`, `HVACBusiness`, `RoofingContractor`, `Locksmith`, or `GeneralContractor`
- `phoneDisplay`, `phoneTel`, `email`, `address`
- `geo.latitude` and `geo.longitude` for the public address
- `serviceArea` as one sentence
- `areaServed` listing every city and neighborhood the pages will name
- `neighborhoods` for the default area block
- `primaryServices`: `name` plus `href`. Use `/services/<slug>/` only when that markdown file exists. Otherwise use `/contact/`.
- `openingHours` with full day names and 24-hour `opens` and `closes`. `hoursDisplay` must describe that same week.
- `responsePromise` from the client's callback answer
- `sameAs` only for profile URLs the client gave
- `locale` and `lang` when they are not `en_US` and `en`
- Trust and review fields only from the optional intake answers
- `showExampleBanner`: `false` after the sample sentences are gone
- Analytics ids only if the client provided a real one

Set `name` and `short_name` in `public/site.webmanifest`.

## Phase 4 — Write the pages

Write the build-now service and city files from the page plan. Leave a later service as a `/contact/` link.

Rewrite `src/content/pages/home.md`, `about.md`, `faq.md`, and `privacy.md`.

Copy a template and remove the leading underscore:

```bash
cp src/content/services/_example.md src/content/services/<service-slug>.md
cp src/content/service-areas/_example.md src/content/service-areas/<city-slug>.md
```

Delete `src/content/services/drain-cleaning.md` and `src/content/service-areas/example-city.md` once the real pages exist. Keep the `_example.md` files.

Each service and city file needs `title`, `seoTitle`, `description`, an `answer` of at least 40 characters, `processTitle`, at least two `steps`, and at least two `faqs`. City files also need `city` and at least one neighborhood. The FAQ page needs at least three questions.

Home must link to the primary service, the primary city, `/faq/`, `/about/`, and `/contact/`.

Privacy must describe this form and say that a request is forwarded only when `CONTACT_WEBHOOK_URL` is set. Ask the client to have a qualified person review that page before launch.

Use these skills if an agent writes the copy:

- `agent-skills/foundation/generate-service-page/SKILL.md`
- `agent-skills/foundation/generate-service-area-page/SKILL.md`
- `agent-skills/foundation/update-faq/SKILL.md`
- `agent-skills/foundation/fill-jsonld/SKILL.md`
- `agent-skills/foundation/check-nap/SKILL.md`

Give the agent the intake brief. Tell it to leave unproven fields blank.

## Phase 5 — Share image, mark, and checks

Replace `public/images/og-default.png` with a 1200×630 PNG. Put the business name, primary service, city, and phone in the center, with enough margin that a share card does not crop the words. Keep `ogImage`, `ogImageWidth`, and `ogImageHeight` pointed at that file. Do not use a photo of a real person unless the client supplied one they own.

Replace `public/favicon.svg` and the PNG icons when the client supplied a mark.

The home page must link to the primary service href, the primary city page, `/faq/`, `/about/`, and `/contact/`. Verify reads those URLs from the config.

Run `npm run verify`. Fix every failed assertion. Then click through home, the primary service, the primary city, contact, thank-you, and a missing URL.

## Phase 6 — Lead delivery

If the client has a webhook, copy `.dev.vars.example` to `.dev.vars` and set `CONTACT_WEBHOOK_URL` for local preview. Do not commit `.dev.vars`. For production:

```bash
npx wrangler secret put CONTACT_WEBHOOK_URL
```

A valid post sends JSON with `name`, `phone`, `email`, `area`, `service`, `preferredTime`, `message`, and `source` set to `website-contact-form`, then redirects to `/thank-you/`. If the webhook is unset, the visitor still reaches `/thank-you/` and nothing is stored. Submit one valid test and one empty test. The empty test returns 400 and a list of field names, not the values.

## Phase 7 — Visual pass

Run this only after Phase 5 passes.

Point an agent at `agent-skills/visual/personalize-client-site/SKILL.md` and give it the trade, city, logo, owned photos, and brand colors. Then run `npm run verify` again.

## Phase 8 — Client review and launch

Walk the client through the preview and correct the phone, address, hours, services, and cities in the config or content files. Verify again.

Before the domain goes live:

- Confirm `site` in `astro.config.mjs` matches the domain attached to the Worker.
- Deploy with `npx wrangler login` and then `npm run build && npx wrangler deploy`.
- Attach the domain to that Worker in Cloudflare.
- Submit one lead on the production URL and confirm it arrives.
- When the client has a Business Profile, the name, phone, address, hours, and service names on it should match the site.
- Run the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/) on the home page, the primary service page, and the primary city page.

There is no old site, so there is no redirect map. Unknown URLs use the boilerplate 404.

After launch, the client can submit `https://<domain>/sitemap-index.xml` if they have Search Console.

## Done when

- The sample business name, sample phone, and Example City are gone from the pages, the share image, and the manifest.
- `showExampleBanner` is `false`.
- Trust fields are filled only with proof the client gave.
- `npm run verify` exits 0.
- A production form submission reaches the client.
- The Business Profile name, phone, address, hours, and services match `src/config/business.ts`.

## Intake checklist

Send this to the client. Leave a line blank when they cannot show proof.

```text
Business name:
Trade:
Primary service (the one job you most want calls for):
Other services to mention now:
Which of those other services should get their own page now:

Phone you answer:
Email for leads:
Public address (street, city, state, postal code, country):
Hours for each day:
What should we tell people about how soon you call back:

Cities you will drive to:
Neighborhoods customers would recognize in the main city:

Domain (example: https://example.com):
Where should form leads go (inbox tool, webhook, or not decided):

Optional — leave blank if you cannot show proof:
Owner or crew name:
License number:
Insurance statement:
Guarantee (what it covers and for how long):
Reviews (site, rating, number of reviews, link):
Starting price and what it includes:
Google Business Profile link:
Other profile links (Facebook, Yelp, Nextdoor):
Analytics ID (GA4 or GTM):
Logo and photos you own (attach files):
Brand colors:
One sentence you want a homeowner to remember:
```

---
name: personalize-client-site
description: Tailor this local-service boilerplate to one client after the business facts are real. Collects trade, city, logo, photos, and brand colors, updates DESIGN.md, and keeps routes, NAP, schema, forms, and answer-first copy intact.
---

# Personalize a client site

Use this skill only when someone asks to tailor the look of a site built from local-site-boilerplate. The default theme stays quiet until then.

## Collect these before editing

Ask for anything not already in `src/config/business.ts` or the content files:

- Trade and primary service
- City and neighborhoods the business will actually drive to
- Logo file, if they have one
- Real job photos, if they have them
- Brand colors, if they have them

If a fact is missing, leave the sample placeholder. Do not invent a license number, insurance claim, review count, price, years in business, or a person's name.

## Write the design down

Update `DESIGN.md` and `src/styles/global.css` together. One self-hosted font pair is allowed. Until those files exist in the repo, keep the system font stack. Do not load fonts from Google or another third-party host.

Prefer `quieter` or a moderate `polish`. Also allowed when they help the brief: `typeset`, `layout`, `colorize`, `critique`, `audit`, `adapt`, `optimize`. The vendored skills are in `agent-skills/visual/`. Read `SOURCES.md` before using one.

## Refuse

- `overdrive`, scroll-jacking, and decorative hero motion
- More than one font pair
- Purple default links, gradient heading text, and animated backgrounds
- Copy changes that add claims the business did not supply
- Removing the example banner until `showExampleBanner` is set to false on purpose

## Locked

Do not change these while you restyle:

- Routes and the trailing slash
- One H1 per page, and the service-plus-city wording on home, service, and location pages
- NAP, which lives only in `src/config/business.ts`
- JSON-LD types and the fields `src/lib/schema.ts` emits
- Contact field names: `name`, `phone`, `email`, `area`, `service`, `preferredTime`, `message`, and the `company` honeypot
- `noindex` on `/thank-you/` and the 404 page
- The answer paragraph and FAQ block on service and location pages
- Click-to-call in the header and footer

## Finish

Run `npm run verify`. If it fails, fix the structure before you keep styling. A visual pass that fails the checks is not done.

Sister scorecards, for what the page still has to support:

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

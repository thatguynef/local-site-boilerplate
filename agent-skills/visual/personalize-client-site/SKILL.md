---
name: personalize-client-site
description: Tailor a client site built from local-site-boilerplate after the facts pass verify. The Example Plumbing design is scaffolding, not a design target. Preserve routes, NAP, schema, forms, and answer-first structure while replacing composition, type, color, and imagery.
---

# Personalize a client site

Use this skill when someone asks to tailor the look of a site built from local-site-boilerplate. Run it in the client repository from `docs/client-repo.md`, after `npm run verify` exits 0. Do not restyle Example Plumbing on `local-site-boilerplate` main.

The Example Plumbing design is scaffolding, not a design target.

Follow the change-policy rules in `docs/change-policy.md`. Read `AGENTS.md` first. Vendored skills in `agent-skills/visual/` are helpers. This skill and the change policy win when they conflict.

## Collect these before editing

Ask for anything not already in `src/config/business.ts`, the content files, or `client/facts.yaml` when that file exists:

- Trade and primary service
- City and neighborhoods the business will actually drive to
- Logo file, if they have one
- Real job photos, if they have them
- Brand colors, if they have them
- How the business should feel, in the client's words

If a fact is missing, leave the field empty. Do not invent a license number, insurance claim, review count, price, years in business, or a person's name.

## Allowed

- Create new components
- Replace existing components
- Rewrite section markup
- Change homepage, service-page, and area-page composition and section order
- Change header and footer layout
- Change typography, spacing, cards, and responsive composition
- Change iconography
- Use images the client owns
- Replace the design tokens in `DESIGN.md` and `src/styles/global.css`
- Depart from Example Plumbing's look

## Required to preserve

- Semantic meaning of each region
- One H1 per page, and the service-plus-city wording the checks require on home, service, and location pages
- Route contracts and trailing slashes
- NAP from `src/config/business.ts` only
- JSON-LD that still matches the visible page
- Form field names: `name`, `phone`, `email`, `area`, `service`, `preferredTime`, `message`, and the `company` honeypot
- The form `POST` contract
- Answer blocks and FAQ relationships on service and location pages
- `noindex` on `/thank-you/` and the 404 page
- Accessibility: skip link, labels, visible focus, 44px targets
- Performance defaults in `DESIGN.md`: no third-party fonts, explicit image dimensions, eager LCP media, lazy loading below the fold
- Click-to-call in the header and footer
- `npm run verify`

## Write the design down

Update `DESIGN.md` and `src/styles/global.css` together so the next agent can see the chosen type, color, and spacing. One self-hosted font pair is allowed. The sample uses the system font stack. Do not load fonts from Google or another third-party host.

Choose type and layout for this business. Do not default to a recolor of the sample.

The vendored skills are in `agent-skills/visual/`. Read `SOURCES.md` before using one. `typeset`, `layout`, `colorize`, `critique`, `audit`, `adapt`, and `optimize` are allowed when they serve the brief.

## Refuse

- `overdrive`, scroll-jacking, and decorative hero motion
- More than one font pair
- A third-party font host
- Purple default links, gradient heading text, and animated backgrounds, unless the client's own brand already uses them and contrast still passes
- Copy changes that add claims the business did not supply
- Removing the example banner until `showExampleBanner` is set to false on purpose
- Stopping after a logo swap and an accent-color change

## Finish

Run `npm run verify`. If it fails, fix the structure before you keep styling. A visual pass that fails the checks is not done.

A useful test: if changing the logo, colors, business name, and phone would make the site suitable for an unrelated contractor, personalization is not done.

Sister scorecards, for what the page still has to support:

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

---
name: generate-service-area-page
description: Write one service-area page with neighborhoods and local proof, using this boilerplate's answer-first pattern.
---

# Generate a service-area page

Use this when a business serves another city and needs a page for that city.

## Which page

When the task is choosing which cities get pages, stop and use `agent-skills/foundation/local-page-plan/SKILL.md`.

Write a page from this skill only for a city the user confirmed from that plan. A neighborhood stays a name on its city page unless that plan gives the neighborhood its own page.

## Read first

- `src/config/business.ts` for `areaServed`, `neighborhoods`, phone, and services
- `src/content/service-areas/example-city.md`
- `src/content/service-areas/_example.md`

## Write

Create `src/content/service-areas/<slug>.md`. The page is `/service-areas/<slug>/`.

Front matter:

- `title` and `seoTitle` include the trade word and the city, for example "Plumber in Example City".
- `description` and `answer` name the city and the neighborhoods on that page.
- `city` is the place name. `neighborhoods` lists names a homeowner would recognize. Do not invent landmarks you cannot confirm.
- `steps` explain how someone confirms the street is served and books.
- `faqs` answer "do you serve …" and "how do I book" in complete sentences.

Add the city to `areaServed` in `src/config/business.ts` so the JSON-LD `areaServed` list matches the pages. Body copy starts at H2, links to each real service page, and links to `/contact/`.

## Do not

- Create a page for a city the business will not drive to
- Repeat the same paragraph with the city name swapped and nothing local
- Hide the phone

## Check

Run `npm run verify`.

This is the on-site piece of the Local Visibility Scorecard (a unique local URL and answer blocks): https://thatguynef.github.io/local-visibility-scorecard/

It does not claim a Maps ranking.

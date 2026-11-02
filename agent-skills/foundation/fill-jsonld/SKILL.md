---
name: fill-jsonld
description: Fill local business JSON-LD from src/config/business.ts without adding fake reviews, prices, or a search box.
---

# Fill JSON-LD

Use this when business details change and the schema should follow.

## Where values live

Edit `client/facts.yaml`, then run `npm run client:generate`. Do not hand-edit `src/config/business.ts`. `src/lib/schema.ts` builds one `application/ld+json` graph for every page from that module:

- `WebSite` with the business name and language. No `SearchAction`.
- The `schemaType` subtype (the sample is `Plumber`) with name, telephone, email, image, postal address, geo, opening hours, and `areaServed`.
- `BreadcrumbList` on inner pages, not on the home page or the 404 page.
- `Service` only when a service page passes `serviceName`.
- `FAQPage` only when the page has FAQ entries. The text must match the visible questions.
- `HowTo` only when the page has steps. The name must match the visible process heading.

Empty optional fields stay omitted. `sameAs` is included only when the array is not empty.

## Fill

- `geo.latitude` and `geo.longitude` are decimal numbers for the public business location.
- `openingHours` uses schema.org day names and 24-hour `opens` / `closes` values. `hoursDisplay` is the sentence people read.
- `phoneTel` is E.164 (`+15550100199`). `phoneDisplay` is what people read. The digits must match.
- `areaServed` lists the same cities and neighborhoods the pages name.
- Set `schemaType` to the schema.org local-business subtype that matches the trade.

## Do not

- Add review markup, `aggregateRating`, or a price until those values are real and also visible on the page
- Add a sitelinks search box
- Hand-write a second JSON-LD block in a page

## Check

Run `npm run verify`. Before a real domain launches, also run Google's Rich Results Test and the Schema Markup Validator. Those hosted tools are not the local gate.

Keep the graph consistent with the Local Visibility Scorecard (https://thatguynef.github.io/local-visibility-scorecard/) and the GBP Scorecard (https://thatguynef.github.io/gbp-scorecard/): same name, phone, address, hours, and service names a Business Profile would show. Do not invent profile reviews or categories here.

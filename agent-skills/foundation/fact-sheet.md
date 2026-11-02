# Fact sheet

Both client paths fill this sheet before `local-page-plan`. A row the user has not accepted is not a fact.

## Where it is written

Do not write this file into the local-site-boilerplate checkout.

Before the client repo exists, return the sheet in the conversation. After the client repo from `docs/client-repo.md` exists, write `docs/fact-sheet.md` there. The existing-site skill also writes `docs/url-map.md` there.

## Rows

One row per field, in this order. Required rows: business name, trade, primary service, other services, phone as printed, phone digits, email, street, city, region, postal code, country, hours, callback promise, drive-to cities, neighborhoods, domain, lead destination.

Optional rows: owner, licenses, after-hours, financing statement, financing URL, maintenance plan, insurance, guarantee, reviews, starting price, profile links, analytics id, logo, photos, colors. Leave an optional row `blank` when nobody can show proof.

`phone as printed` is the visible string. `phone digits` is that number with punctuation removed. `other services` names each service and whether it should have its own page. `drive-to cities` lists only cities the business will drive to. A county is not a city. `neighborhoods` names places that stay on the city page. `analytics id` is a `G-…` or `GTM-…` id the client already has. Do not create a Google Analytics property, a tag, or a Search Console account.

## Columns

| Field | Value | Source | Status |
| --- | --- | --- | --- |
| Business name | blank | | blank |

`Value` is the text, or `blank`. `Source` is the page URL and a short quote, or `client` plus the date. `Status` is `accepted`, `conflict`, or `blank`.

A `conflict` row holds both values and both sources. Do not pick one. A placeholder on a live page, such as a 555 phone, a generic inbox, or a button with no destination, is not a value. The existing-site skill lists those under ignored placeholders.

The user accepts the sheet in one sentence, or names the rows to strike. A struck row goes back to `blank`. Only `accepted` rows are inputs to the page plan and to `src/config/business.ts` in the client repo.

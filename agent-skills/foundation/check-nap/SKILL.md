---
name: check-nap
description: Check that the business name, address, and phone match across the header, footer, contact page, and JSON-LD.
---

# Check NAP consistency

Use this after any edit to the business name, address, or phone.

## Source

`src/config/business.ts` is the only source. The header, footer, contact page, and `src/lib/schema.ts` read it. Markdown may repeat the sample facts only when they match that file.

Compare digits, not punctuation. `(555) 010-0199` and `+15550100199` are the same number when the digits end the same way.

## Look at

- Header `tel:` link and visible phone
- Footer `[data-nap]` name, street, city, region, postal code, phone, and hours
- Contact page address block
- JSON-LD `telephone` and `PostalAddress`
- `public/site.webmanifest` `name`, after a rebrand
- The Open Graph image text, which is a picture and will not update by itself

## Fail the check when

- Two pages show different street lines or phone digits
- A new page hardcodes a phone that is not the config value
- Schema hours and `hoursDisplay` describe different days

Run `npm run verify`. `scripts/checks/check-nap.mjs` records `RL-CON-01`, `GBP-NAP`, and `GBP-TEL`.

The GBP Scorecard cares that the website and the Business Profile can show the same name, phone, and address: https://thatguynef.github.io/gbp-scorecard/

This skill does not log into a Business Profile.

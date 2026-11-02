---
name: new-site-intake
description: Collect the new-site intake checklist and fill the shared fact sheet. Use when the client has no website. Does not search, and does not write the website.
---

# New site intake

Fill [the fact sheet](../fact-sheet.md) from the client's answers. Stop for an accept sentence before `local-page-plan` and before any client repo.

## Steps

1. Send the checklist under "Intake checklist" in `docs/new-site.md`. Do not add questions. Do not search the company name, the phone, or the license.
2. Fill each fact-sheet row from those answers. `Source` is `client` plus the date. An optional row with no proof stays `blank`. There is no URL map.
3. If a required row is still blank, ask once for that row. Then stop. Ask for one sentence: the sheet is accepted, or the rows to strike. Do not call keyword tools. Do not clone this repo.

## Refuse

- Writing any file in the local-site-boilerplate checkout.
- Creating the client repo or editing `src/config/business.ts`.
- Looking up the business, guessing a license, or inventing hours, cities, or services.
- Creating a Google Analytics property, a tag, or a Search Console account. The analytics id row stays `blank` unless the client pasted a `G-…` or `GTM-…` id.

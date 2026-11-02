---
name: existing-site-facts
description: Read an existing local-service website and fill the shared fact sheet. Use when the client already has a URL. Does not write the website.
---

# Existing site facts

Read the company's own website and fill [the fact sheet](../fact-sheet.md). Stop for an accept sentence before `local-page-plan` and before any client repo.

The public site is enough. Record Search Console, Analytics, or Business Profile access only when the client has already said those accounts are connected. Do not ask for them.

## Steps

1. Require the canonical URL, including `https://`. Follow the redirect and record whether `www` or the apex is canonical. Confirm the user may reuse the site's own facts. Ask who can confirm the phone, address, hours, license, and services when that person is not already named.
2. Read home, services, about, contact, FAQ, and privacy when they respond. Record each URL, title, H1, and a one-line note. Record a 404 when the path does not exist.
3. Fill every fact-sheet row from a sentence on those pages. Copy the visible phone exactly. When two phones disagree, set the phone rows to `conflict` and keep both. Copy a license number only when the page prints it. You may open the public license record when the business name and that number match. You may open a profile only from a link on the site.
4. For each service the site names, request `/services/<slug>/` on that origin. For each city the site treats as a place it drives to, request `/service-areas/<slug>/`. Use a lowercase hyphenated slug. Note the HTTP status on that row. A county named as a service area stays out of the drive-to cities row.
5. Draft the URL map. Each old URL gets a target from the route list in `docs/existing-site.md` Phase 3, or `/contact/`. Blog, tag, author, and gallery URLs get a redirect target and no new page.
6. Stop. Ask for one sentence: the sheet is accepted, or the rows to strike. Do not call keyword tools. Do not clone this repo.

## Sections after the fact table

Add these three sections in the sheet output. They are not extra fact rows.

- **Pages read.** URL, title, H1, one-line note.
- **Conflicts and ignored placeholders.** Both values for a conflict. For a placeholder, the URL and the text you ignored.
- **Ask list.** Anything found only on a directory, a review site, or a name search. Those sources do not fill a fact row.

## URL map

Write this table as `docs/url-map.md` only when the fact sheet is being written to a named directory. Otherwise include it with the sheet.

| Old URL | HTTP status | Proposed target | Reason |
| --- | --- | --- | --- |
| | | | |

A 200 on a dedicated service or city URL is a note for `local-page-plan`. A 404 means the new path does not exist yet. Do not choose which pages to build. That is the page plan, after the user accepts this sheet.

## Refuse

- Writing any file in the local-site-boilerplate checkout.
- Creating the client repo, editing `src/config/business.ts`, or copying the old theme.
- Keyword research, `save_keywords`, and calls to Search Console, Analytics, or Business Profile tools.
- Treating a directory listing or a review as proof of a phone, a service, or a city.

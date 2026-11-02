# Changelog

## Unreleased

Added optional `licenses`, `afterHours`, `financing`, and `maintenancePlan` on `src/config/business.ts`. Empty after-hours, financing, and maintenance plan stay off the page. A maintenance plan is shown only on the maintenance service page. Financing is shown only when both the statement and the URL are set.

## 1.1.0 - 2026-11-02

Added `docs/existing-site.md` and `docs/new-site.md`. The first is the path for a client who already has a website. The second is the from-scratch intake and build. Both clone this tag.

Added `agent-skills/foundation/local-page-plan/SKILL.md`. It decides which service and city pages to build or improve first from local keyword demand and the public site. Search Console, Analytics, and Business Profile access are optional. `npm run verify` does not call it.

`npm run verify` reads the primary service page and the primary city page from `src/config/business.ts`. A new trade no longer requires edits to the check scripts. The sample business on this repository stays Example Plumbing.

## 1.0.0 - 2026-10-31

First public release.

The boilerplate is an Astro site for a local home-service business, with a Cloudflare Worker for the contact form. It includes answer-first pages, local JSON-LD, Open Graph and Twitter cards, a 404 page, robots.txt, a sitemap, agent skills, and evaluations mapped to the Website Scorecard, the Local Visibility Scorecard, and the GBP Scorecard.

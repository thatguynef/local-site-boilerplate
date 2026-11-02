# Changelog

## Unreleased

Documented the agent contract. The boilerplate is an engineering foundation, not a visual template. Added `AGENTS.md`, `docs/principles.md`, and `docs/change-policy.md`. The Example Plumbing design is scaffolding, not a design target.

Added `client/*.example.yaml`, JSON Schemas, and `npm run validate:client`. Trust claims need a provenance status. A value with status `unknown` or `conflicting` fails validation. `src/config/business.ts` is still what the site reads.

## 1.2.0 - 2026-11-01

Added optional `licenses`, `afterHours`, `financing`, and `maintenancePlan` on `src/config/business.ts`. Empty after-hours, financing, and maintenance plan stay off the page. A maintenance plan is shown only on the maintenance service page. Financing is shown only when both the statement and the URL are set.

Added `agent-skills/foundation/fact-sheet.md`, `existing-site-facts`, and `new-site-intake`. The existing-site guide starts by reading the live URL into that sheet. The new-site guide starts by sending the intake checklist into the same sheet. `local-page-plan` uses the accepted rows. The boilerplate does not create a Google Analytics property or a Search Console account.

Documented the client repository in `docs/client-repo.md`. Clone release tag `v1.2.0`, keep the git history, and point `upstream` at this repo. Tailor the client repo. Do not delete `.git`, and do not build the client on this repo's `main` branch.

Service and city index pages, the contact page, the thank-you page, and the 404 page read the business name, trade, city, and phone from `src/config/business.ts`. The schema hours check matches `openingHours` instead of a fixed Monday window.

## 1.1.0 - 2026-11-02

Added `docs/existing-site.md` and `docs/new-site.md`. The first is the path for a client who already has a website. The second is the from-scratch intake and build. Both clone this tag.

Added `agent-skills/foundation/local-page-plan/SKILL.md`. It decides which service and city pages to build or improve first from local keyword demand and the public site. Search Console, Analytics, and Business Profile access are optional. `npm run verify` does not call it.

`npm run verify` reads the primary service page and the primary city page from `src/config/business.ts`. A new trade no longer requires edits to the check scripts. The sample business on this repository stays Example Plumbing.

## 1.0.0 - 2026-10-31

First public release.

The boilerplate is an Astro site for a local home-service business, with a Cloudflare Worker for the contact form. It includes answer-first pages, local JSON-LD, Open Graph and Twitter cards, a 404 page, robots.txt, a sitemap, agent skills, and evaluations mapped to the Website Scorecard, the Local Visibility Scorecard, and the GBP Scorecard.

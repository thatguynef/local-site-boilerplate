# Changelog

## 2.0.0 - 2026-11-02

Documented the agent contract. The boilerplate is an engineering foundation, not a visual template. Added `AGENTS.md`, `docs/principles.md`, and `docs/change-policy.md`. The Example Plumbing design is scaffolding, not a design target.

Added `client/*.example.yaml`, JSON Schemas, and `npm run validate:client`. Trust claims need a provenance status. A value with status `unknown` or `conflicting` fails validation.

`npm run client:generate` writes `src/config/business.ts` from the client YAML. `npm run scaffold` creates missing build-now stubs, keeps existing pages, and removes an obsolete Example Plumbing page only for a different business. `npm run doctor` reports workflow readiness. `npm run verify` checks that the generated config, claim provenance, build-now pages, sample strings, secrets, internal links, and image rules still hold. Example Plumbing stays valid on this repository.

Added the build workflow skills: an orchestrator, competitor and market research, search intent, positioning, conversion strategy, site-spec generation, and page briefs. `client/page-briefs.example.yaml` records the sample build-now pages. `strategy.yaml` may store a `research` object. The page skills read a brief before writing copy. `local-page-plan` can mark a service `contact_only` and still does not run inside `npm run verify`.

Added layout primitives in `src/components/primitives/` and `docs/design-primitives.md`. The sample is composed from that grammar and still looks like Example Plumbing. `npm run evaluate:content` and `npm run evaluate:conversion` review copy and the conversion strategy outside `npm run verify`. Visual uniqueness is a written review, so the sample is not failed for being the scaffold.

Added `npm run security-check` and `npm run performance-check`. Both run inside `npm run verify`. Performance defaults live in `docs/performance.md` and can be raised from `site-spec.yaml`. `docs/security.md` says where secrets belong. Production QA, post-launch, and upgrading docs are in place. `fixtures/` holds fake businesses that are not Example Plumbing. Failure-mode tests cover an unsupported license line, cloned city answers, a drifted phone, a logo-and-color swap, a renamed form field, a webhook URL, and a sample string left in the manifest.

`npm run help` lists the commands. `npm run evaluate` runs the content review and then the conversion review. Neither replaces `npm run verify`. The directory map is `docs/architecture.md`. What each gate proves is `docs/quality-gates.md`. The new-site and existing-site guides load facts through client YAML and generate `business.ts`.

This is a major release because client facts now live in `client/*.yaml` and `src/config/business.ts` is generated. Routes, the form contract, and `compatibility_date` `2026-10-30` are unchanged. Clone tag `v2.0.0`. A 1.x client merges that tag and follows `docs/upgrading.md`. `npm run verify` still passes on Example Plumbing. `npm test` scaffolds a fake fixture in a temporary directory. Content, visual uniqueness, deploy, and one production lead stay manual.

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

# Agent operating contract

`local-site-boilerplate` is an engineering and quality foundation for bespoke local home-service websites.

It is not a visual template.

Preserve the foundation's technical contracts while substantially tailoring presentation, content, positioning, imagery, typography, composition, and visual identity to the actual business.

Standardize what customers cannot see. Personalize what customers can see.

Example Plumbing is scaffolding, not a design target. The sample stays on this repository's `main` branch. A client site is a separate repository cut from a release tag. Read [docs/client-repo.md](docs/client-repo.md).

Humans start at [README.md](README.md). This file is the agent entry point.

## Read before you edit

1. Read `AGENTS.md`.
2. Read `client/build-state.yaml` when it exists. On this repository, read `client/build-state.example.yaml` for the shape.
3. Read `client/facts.yaml` when it exists. On this repository, read `client/facts.example.yaml`.
4. Read `client/strategy.yaml` when it exists. On this repository, read `client/strategy.example.yaml`.
5. Read `client/site-spec.yaml` when it exists. On this repository, read `client/site-spec.example.yaml`.
6. Read the `SKILL.md` for the phase you are in.
7. Inspect the implementation you are about to change.
8. Make the smallest coherent set of changes.
9. Run the checks that phase requires.
10. Update `client/build-state.yaml` when it exists.

The YAML files record facts, strategy, the page spec, and workflow state. The site still reads `src/config/business.ts`. Do not invent a second copy of the name, phone, or address. Rules for the files are in [docs/client-data.md](docs/client-data.md). Check them with `npm run validate:client`.

On this repository's `main` branch, leave Example Plumbing in place. Do not turn `main` into a client site.

## Lifecycle

```text
DISCOVERY
   ↓
FACT VALIDATION
   ↓
MARKET RESEARCH
   ↓
POSITIONING
   ↓
CONVERSION STRATEGY
   ↓
PAGE PLAN
   ↓
SITE SPECIFICATION
   ↓
CLIENT SCAFFOLD
   ↓
CONTENT
   ↓
FOUNDATION VERIFY
   ↓
VISUAL SYSTEM
   ↓
BESPOKE IMPLEMENTATION
   ↓
FULL VERIFY
   ↓
CLIENT REVIEW
   ↓
PRODUCTION QA
   ↓
LAUNCH
```

Do not skip fact validation, the page plan, or `npm run verify`. A client site is not finished when the sample name has been replaced.

## Where each phase lives

| Phase | Read now |
| --- | --- |
| Discovery | [new-site-intake](agent-skills/foundation/new-site-intake/SKILL.md) or [existing-site-facts](agent-skills/foundation/existing-site-facts/SKILL.md) |
| Fact validation | [fact-sheet.md](agent-skills/foundation/fact-sheet.md) and [docs/new-site.md](docs/new-site.md) or [docs/existing-site.md](docs/existing-site.md) |
| Market research | No skill yet. Competitors are market intelligence. Do not copy their copy or their design. |
| Positioning | No skill yet. Use only differentiators the business can prove. |
| Conversion strategy | The built actions are click-to-call and `POST /api/contact/`. Do not add booking, chat, a financing calculator, or a membership portal in this pass. |
| Page plan | [local-page-plan](agent-skills/foundation/local-page-plan/SKILL.md). It does not run inside `npm run verify`. |
| Site specification | `client/site-spec.yaml` when it exists, else the accepted fact sheet plus the page plan. `src/config/business.ts` remains the NAP source. |
| Client scaffold | [docs/client-repo.md](docs/client-repo.md). Clone a release tag. Do not clone `main`. |
| Content | [generate-service-page](agent-skills/foundation/generate-service-page/SKILL.md), [generate-service-area-page](agent-skills/foundation/generate-service-area-page/SKILL.md), [update-faq](agent-skills/foundation/update-faq/SKILL.md) |
| Foundation verify | `npm run verify` must exit 0 before visual work. |
| Visual system and bespoke implementation | [personalize-client-site](agent-skills/visual/personalize-client-site/SKILL.md), then [docs/change-policy.md](docs/change-policy.md) |
| Full verify | `npm run verify` again after content or visual edits. |
| Client review | The review section of the guide you started from. |
| Production QA and launch | Deploy only when asked. Confirm one production lead. Rich Results Test and the Schema Markup Validator are manual. |

Principles: [docs/principles.md](docs/principles.md). What you may change: [docs/change-policy.md](docs/change-policy.md).

## What customers do not see

Keep these stable unless you are making an engine change on the boilerplate itself:

- Routes, trailing slashes, and one H1 per page
- Canonical metadata, sitemap, robots, and `noindex` on `/thank-you/` and the 404 page
- NAP only in `src/config/business.ts`
- JSON-LD that matches the visible page
- Contact field names and `POST /api/contact/`
- The `company` honeypot
- Answer-first service and city pages, with standalone FAQ answers
- Required internal links
- Accessibility and the performance defaults in `DESIGN.md`
- `npm run verify` as the structural gate
- Secrets outside the repo

## What customers see

Change these so the site fits the business:

- Visual identity, color, type, spacing, and imagery
- Homepage composition and section order
- Header, footer, cards, hero, and iconography
- Service, review, trust, area, and CTA presentation
- Tone, narrative, and CTA wording that the facts support

If a logo swap, a color swap, and a new phone number would make the site fit an unrelated contractor, personalization is not done.

## Checks

`npm run verify` is the hard structural gate. It proves on-site structure. It does not produce a scorecard score, a Maps rank, or proof that an assistant cites the business.

`npm run validate:client` checks the client YAML files. It does not build the site and it does not replace `npm run verify`.

Do not edit `scripts/checks/` to make a client pass. The checks read the primary service URL and the primary city slug from `src/config/business.ts`.

Sister scorecards stay outside this repo:

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

## Claims and secrets

Leave owner, license, insurance, guarantee, reviews, price, after-hours, financing, and maintenance empty until the client can prove them. Do not publish a claim you inferred. Statuses and the publish rule are in [docs/client-data.md](docs/client-data.md).

Do not commit `.dev.vars`, webhook URLs, or API keys. `CONTACT_WEBHOOK_URL` is a Wrangler secret.

## Engine changes

A change to verification, the form contract, route meaning, schema contracts, or deploy rules is an engine change. Make it on this boilerplate, keep `npm run verify` green, and ship it as a release tag. Client repositories merge that tag. They do not merge `upstream/main`.

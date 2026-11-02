---
name: build-client-site
description: Choose the next action for a client site from client/build-state.yaml. Use when starting or resuming a build. Stops on the Example Plumbing sample.
---

# Build a client site

Use this to choose the next action. The contract is [AGENTS.md](../../../AGENTS.md). What may change is [docs/change-policy.md](../../../docs/change-policy.md). File shapes and claim statuses are [docs/client-data.md](../../../docs/client-data.md).

## Sample checkout

If `client/facts.yaml` and `client/site-spec.yaml` are both absent, this checkout is the Example Plumbing sample. Stop. The next step is to cut a client repository before building a business. Do not personalize `main`. Do not treat `client/build-state.example.yaml` as live state. `npm run doctor` prints the same stop.

## Read state

In a client repository, read `client/build-state.yaml` before choosing work. A step is done when its status is `complete`, `validated`, or `passed`. Read the last `npm run doctor` or recorded verify result. Do not run `npm run verify` only to choose the next step.

`strategy` is one step. It is done only when positioning and conversion are both written in `client/strategy.yaml`.

## Order

Do the first step that is not done.

1. Decide whether the business has a site. No site: [new-site-intake](../../foundation/new-site-intake/SKILL.md). An existing URL: [existing-site-facts](../../foundation/existing-site-facts/SKILL.md).
2. Read `client/build-state.yaml`.
3. Discovery incomplete: run that discovery skill. Facts incomplete: stop and gather facts into `client/facts.yaml`. Run `npm run validate:client`.
4. Research incomplete: run [competitor-research](../../research/competitor-research/SKILL.md), [local-market-analysis](../../research/local-market-analysis/SKILL.md), and [search-intent-analysis](../../research/search-intent-analysis/SKILL.md). Write `strategy.research` once, after all three. Research notes are not claims.
5. Positioning incomplete: [define-positioning](../../strategy/define-positioning/SKILL.md).
6. Conversion incomplete: [define-conversion-strategy](../../strategy/define-conversion-strategy/SKILL.md).
7. Page plan incomplete: [local-page-plan](../../foundation/local-page-plan/SKILL.md). That skill does not run inside `npm run verify`.
8. Site spec missing or not validated: [build-site-spec](../../strategy/build-site-spec/SKILL.md).
9. Scaffold incomplete: `npm run scaffold` in the client repository.
10. Content incomplete: [page-brief](../../content/page-brief/SKILL.md) for every `build_now` and `optimize` page, then the page skills. Do not write a page from a keyword alone.
11. Foundation verification has not passed: fix the foundation issues and run `npm run verify`.
12. Visual work incomplete: only after foundation verification has passed, [personalize-client-site](../../visual/personalize-client-site/SKILL.md). The layout grammar is [docs/design-primitives.md](../../../docs/design-primitives.md). Replacing a primitive is allowed.
13. Quality review incomplete: [visual-uniqueness](../../quality/visual-uniqueness/SKILL.md), [content-review](../../quality/content-review/SKILL.md), and [conversion-review](../../quality/conversion-review/SKILL.md). Do not mark final verification passed while a logo and color swap would still fit an unrelated contractor.
14. Full verification has not passed: fix the issues and run `npm run verify` again.
15. Production QA incomplete: finish the production section of the guide this build started from. Do not deploy unless asked.
16. Every step has passed: stop.

Do not skip facts, the site spec, or verification. Do not start visual work before foundation verification has passed. Do not launch before production QA.

## Refuse

- Writing live `client/*.yaml` on this repository's `main` branch.
- A booking calendar, chat, a financing calculator, a membership portal, or `/services/<service>/<city>/`. The action limits are in AGENTS.md.

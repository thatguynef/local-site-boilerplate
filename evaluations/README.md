# Evaluations

`npm run verify` builds the site, starts the preview, runs `scripts/checks/`, and then runs `node evaluations/run.mjs`.

A pass means the built site has the structure this boilerplate promises. It is not a numeric Website Scorecard score, a Maps rank, or proof that an assistant cites the business.

## Scorecards

These evaluations follow the sister scorecards. They do not copy the rubrics.

- Website Scorecard: https://github.com/thatguynef/website-scorecard and https://thatguynef.github.io/website-scorecard/
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

The journey those scorecards describe is discovery, then the Business Profile, then the website. This repository checks the website.

## What is checked

Criteria live in `evaluations/criteria/`. Each item names the assertion ids the checks must emit. A missing or failed assertion fails the run. Evidence is printed and written to `evaluations/results/summary.json` (that folder is gitignored).

`npm run security-check` and `npm run performance-check` run with the other checks. `npm run evaluate:content` and `npm run evaluate:conversion` are separate. They read the built HTML and do not run inside `npm run verify`. Visual uniqueness is a written review in `agent-skills/quality/visual-uniqueness/SKILL.md`.

A passing check that is not listed in a criterion does not change the pass, fail, or not-applicable count. The same check still fails `npm run verify` when it does not pass. Do not add content, conversion, or uniqueness items to `evaluations/criteria/`.

Rows marked not applicable are off-site: Maps rank, competitor share, live AI mentions, Business Profile reviews, categories, and posts. Empty analytics ids are also not applicable, because the default site loads no tracker.

## Before launch

The local JSON-LD check compares the schema with the visible page. Before a real domain goes live, also run Google's Rich Results Test and the Schema Markup Validator. Those hosted tools are not the local gate.

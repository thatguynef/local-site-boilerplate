# Quality gates

Each command proves one thing. A later review does not replace an earlier one.

| Gate | What it proves |
| --- | --- |
| `npm run verify` | The built site matches the structural contracts: routes, NAP, JSON-LD, the form, accessibility landmarks, security, and the performance budget. It also runs the scorecard mapping in [evaluations/README.md](../evaluations/README.md). |
| `npm run doctor` | Workflow readiness for this checkout: client YAML, missing build-now files, sample strings, and whether visual work and a production lead are still open. |
| `npm run evaluate:content` | Built copy: a dependent phrase, a repeated answer, or a cloned city answer. Build first. |
| `npm run evaluate:conversion` | The built calls to action against `strategy.yaml`. It does not judge layout. Build first. |
| Visual uniqueness | A written review in [visual-uniqueness](../agent-skills/quality/visual-uniqueness/SKILL.md). It stops on this repository. There is no uniqueness script. |
| Production QA | The manual launch list in [production-qa](../agent-skills/launch/production-qa/SKILL.md), including one production lead. |

`npm run evaluate` runs the content review and then the conversion review. It does not replace `npm run verify`.

`npm run security-check` and `npm run performance-check` run inside `npm run verify`. Content review, conversion review, and visual uniqueness stay outside it. Do not add them to `evaluations/criteria/`.

`npm run doctor` does not build the site. On this repository it still says to cut a client repository before building a business.

## What verify does not measure

A pass is not a scorecard score, a Maps rank, or proof that an assistant cites the business. The difference between a structural check and an external measurement is in [evaluations/README.md](../evaluations/README.md).

## What stays manual

`npm test` copies the `plumber-urgent` fixture into a temporary directory and runs scaffold there. That proves generate and scaffold can start a fictional client without writing on this tree. It does not write judgment-heavy copy, deploy, or confirm a lead. A fresh stub is not expected to pass `npm run verify`. Content, visual uniqueness, deploy, and one production lead stay in the build workflow and in production QA.

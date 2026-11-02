# Client data

Structured records for a client repository. The operating contract is [AGENTS.md](../AGENTS.md). `npm run client:generate` writes `src/config/business.ts` and the manifest name from `facts.yaml` and `site-spec.yaml`. Until a client repository has those live files, the command uses the example files and reproduces Example Plumbing. Do not hand-edit `business.ts` after that. Edit the YAML and generate again.

## Files

| Example in this repo | Client repository | Schema |
| --- | --- | --- |
| `client/facts.example.yaml` | `client/facts.yaml` | `schemas/client-facts.schema.json` |
| `client/strategy.example.yaml` | `client/strategy.yaml` | `schemas/client-strategy.schema.json` |
| `client/site-spec.example.yaml` | `client/site-spec.yaml` | `schemas/site-spec.schema.json` |
| `client/build-state.example.yaml` | `client/build-state.yaml` | `schemas/build-state.schema.json` |
| `client/page-briefs.example.yaml` | `client/page-briefs.yaml` | `schemas/page-briefs.schema.json` |

Copy `facts.example.yaml`, `strategy.example.yaml`, and `site-spec.example.yaml`, then remove `.example` from the name. Do not copy the example page briefs or the example build state onto a different business. Those two files describe Example Plumbing. Do not commit webhook URLs, API keys, or `.dev.vars`. Where each value belongs is [security.md](security.md).

`site-spec.yaml` may include a `performance` object. The keys and the defaults are in [performance.md](performance.md). Leave it off to use the defaults.

```bash
npm run validate:client
npm run client:generate
npm run scaffold
npm run doctor
```

`validate:client` checks the example files and, when present, the live `client/*.yaml` files. A spec slug must exist in `facts.yaml`. A page brief must match a `build_now` or `optimize` page. Unknown keys fail. The sample briefs are not compared with a live spec until that repository has its own `page-briefs.yaml`.

`client:generate` rewrites `src/config/business.ts` from the facts and the page statuses. `build_now` and `optimize` point at `/services/<slug>/`. Every other status points at `/contact/`. A claim is copied only when its status is publishable. Financing stays blank, because the page shows it only when both a statement and a URL are set. The manifest name changes only when the business name changed. Running the command twice makes no further diff.

`scaffold` runs that generate step, sets `site` in `astro.config.mjs` from `project.domain`, and sets the Worker name only when `project.worker_name` is present. It creates a missing build-now markdown file as a stub that contains the name, city, and phone and no trust claims. It does not overwrite a page that already exists. It keeps every `_example.md`. It deletes `drain-cleaning.md` or `example-city.md` only when the business is no longer Example Plumbing, the slug is not in the spec, and the file still contains sample markers. On this repository it does not write `client/build-state.yaml`.

`doctor` reports what is still open. It does not replace `npm run verify`.

`npm run verify` also checks that the YAML is valid, that `business.ts` matches the generator, that build-now files exist, that trust fields match claim provenance, and that a non-sample site does not still say Example Plumbing. The sample checkout is allowed to say Example Plumbing while `showExampleBanner` is true.

## Facts and strategy

`facts.yaml` is what the business is: name, phone, address, hours, services, cities, and claims.

`strategy.yaml` is why the site is shaped that way: audience, situations, positioning, and the conversion choice. Differentiators stay empty until the facts support them. Do not copy a competitor.

`strategy.yaml` may include `research`. Those notes are market observations from the research skills. They are not claims, and `client:generate` does not copy them into `business.ts`. Leave `research` off until the notes have a source. Do not invent a competitor, a rank, or a metric.

`page-briefs.yaml` is the reasoning for each `build_now` or `optimize` page before anyone writes the markdown. One brief per such page. `npm run verify` does not require a live briefs file. The page skills refuse to draft from a keyword alone.

`site-spec.yaml` is what to build. Page statuses:

```text
build_now
optimize
later
contact_only
do_not_build
```

Write a page only for `build_now` or `optimize`. `contact_only` stays a link to `/contact/`. Do not add `/services/<service>/<city>/`.

`build-state.yaml` is where the work stopped. Statuses:

```text
not_started
in_progress
blocked
complete
validated
passed
failed
pending
```

Update it after a milestone. The example file sets `example: true` so it is not mistaken for a live client.

## Claims

Every trust claim is an object:

```yaml
license:
  value: ""
  status: unknown
```

Statuses:

| Status | Meaning |
| --- | --- |
| `verified_public` | Seen on a public page the business controls, or another public record. `source` is required. |
| `client_supplied` | The client gave the value, with a document or message. `source` is required. |
| `client_confirmed` | The client confirmed it directly. `source` may be empty. |
| `inferred_nonpublishable` | An agent inferred it. Record it if useful. Do not print it. |
| `unknown` | Nobody has established it. The value must be empty. |
| `conflicting` | Two sources disagree. Do not pick one. The value must be empty. |
| `expired` | It used to be true. Do not print it. |

A value may be published only when the status is `verified_public`, `client_supplied`, or `client_confirmed`.

`npm run validate:client` fails when a claim has a value and the status is `unknown` or `conflicting`. It fails when a publishable status has an empty value. It fails when `verified_public` or `client_supplied` has no source. `inferred_nonpublishable` and `expired` print as `WITHHELD` and do not pass as publishable.

The fact sheet in [agent-skills/foundation/fact-sheet.md](../agent-skills/foundation/fact-sheet.md) still uses `accepted`, `conflict`, and `blank`. Map them when you fill `facts.yaml`:

- `accepted` from a public page → `verified_public`
- `accepted` from the client → `client_supplied` or `client_confirmed`
- `conflict` → `conflicting`
- `blank` → empty value, status `unknown`

## CTA types

```text
phone
request_service
request_quote
request_estimate
book_consultation
book_inspection
schedule_service
directions
```

A type does not add a feature. `phone` is the click-to-call link. `request_service`, `request_quote`, and `request_estimate` use the existing contact form. The other types are labels only until this engine has that action. Do not invent a scheduler, a financing form, or a chat widget to match a label.

## What the sample is allowed to claim

The example files describe Example Plumbing. The only publishable claim is the sample callback sentence, marked `client_supplied` from the sample home page. License, insurance, reviews, price, owner, financing, after-hours, and emergency service stay empty. The sample strategy has no `research` block. The sample briefs cover drain cleaning and Example City only.

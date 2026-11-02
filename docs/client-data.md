# Client data

Structured records for a client repository. The operating contract is [AGENTS.md](../AGENTS.md). The site still reads `src/config/business.ts`. These files do not replace it.

## Files

| Example in this repo | Client repository | Schema |
| --- | --- | --- |
| `client/facts.example.yaml` | `client/facts.yaml` | `schemas/client-facts.schema.json` |
| `client/strategy.example.yaml` | `client/strategy.yaml` | `schemas/client-strategy.schema.json` |
| `client/site-spec.example.yaml` | `client/site-spec.yaml` | `schemas/site-spec.schema.json` |
| `client/build-state.example.yaml` | `client/build-state.yaml` | `schemas/build-state.schema.json` |

Copy the example, then remove `.example` from the name. Do not commit webhook URLs, API keys, or `.dev.vars`.

```bash
npm run validate:client
```

The command checks the example files and, when present, the live `client/*.yaml` files. A `build_now` or other spec slug must exist in `facts.yaml`. Unknown keys fail. `npm run verify` is still the structural gate for the built site.

## Facts and strategy

`facts.yaml` is what the business is: name, phone, address, hours, services, cities, and claims.

`strategy.yaml` is why the site is shaped that way: audience, situations, positioning, and the conversion choice. Differentiators stay empty until the facts support them. Do not copy a competitor.

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

The example files describe Example Plumbing. The only publishable claim is the sample callback sentence, marked `client_supplied` from the sample home page. License, insurance, reviews, price, owner, financing, after-hours, and emergency service stay empty.

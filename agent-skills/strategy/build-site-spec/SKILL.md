---
name: build-site-spec
description: Write client/site-spec.yaml from validated facts, strategy, and the confirmed page plan. Does not invent pages or claims.
---

# Build the site spec

Use this after the page plan is confirmed. The file shape and the fixed fields are `schemas/site-spec.schema.json`. Page statuses are in [docs/client-data.md](../../../docs/client-data.md).

## Read first

- `client/facts.yaml`
- `client/strategy.yaml`, including conversion and any `research` notes
- The confirmed page plan. A row the user has not confirmed does not go in the spec.

Stop if facts, positioning, or conversion are incomplete.

## Write `client/site-spec.yaml`

- `project.domain` is the accepted `https` origin with no trailing slash. Leave `project.worker_name` unset unless the user supplies a name the schema accepts.
- `brand.personality`, `visual_direction`, and `avoid` come from what the client said and from `positioning.desired_perception`. Do not invent a visual system.
- `conversion.primary` and `conversion.secondary` are copies of `strategy.conversion`.
- `pages.services` and `pages.service_areas` use slugs from the facts. Status and `primary_intent` come from the confirmed plan. A service in the facts with no page is `contact_only` unless the plan says `later` or `do_not_build`.
- `content_strategy.answer_first` is `true`. Use `plain` unless the client asked for `technical`.
- `visual.design_freedom` is `high`. `visual.preserve_foundation_contracts` is `true`.
- `sample_banner` is `true` only while the business is still the Example Plumbing sample.

There is no `/services/<service>/<city>/` page. A neighborhood stays on its city page unless the plan gave it a city slug that exists in the facts.

Run `npm run validate:client`. Do not run `npm run client:generate` until the scaffold step is the next action in the client repository.

## Refuse

- A slug that is not in `facts.yaml`
- A page the plan marked `do_not_build`
- Setting `worker_name` on the sample spec
- Editing `src/config/business.ts` by hand

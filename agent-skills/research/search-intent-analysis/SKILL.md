---
name: search-intent-analysis
description: Classify queries the user or the page plan already has. Records intent groups and high-intent services. Does not invent keywords or choose URLs.
---

# Search intent analysis

Use this with the other research skills. URL choice stays in [local-page-plan](../../foundation/local-page-plan/SKILL.md).

## Read first

The query list the user supplied, or the queries `local-page-plan` already returned. If that list does not exist, stop and say so. Do not invent keywords to classify.

## Classify

Each query becomes one `intent_groups` row:

- `intent`: `hire`, `compare`, `price`, `symptom`, `informational`, or `navigational`
- `home`: `service_page`, `city_page`, `faq`, `existing_page`, or `do_not_build`

`home` is where the query belongs. It is not a page status and it is not a new URL. `do_not_build` here means the query should not have its own page.

`high_intent_services` lists confirmed services whose queries are `hire`, and only those services. A service the business does not offer stays off the list.

Fill only `high_intent_services` and `intent_groups`. Write `strategy.research` once, with the other research skills. The allowed values are in `schemas/client-strategy.schema.json`.

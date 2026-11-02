---
name: local-market-analysis
description: Record local gaps, customer fears, and content opportunities for the confirmed cities. Does not assign page statuses or invent demand.
---

# Local market analysis

Use this with the other research skills, after facts are validated. Keyword demand and page status stay in [local-page-plan](../../foundation/local-page-plan/SKILL.md). This skill does not call OpenSEO.

## Read first

- `client/facts.yaml` for drive-to cities, neighborhoods, and services
- `client/strategy.yaml` when `audience` and `customer_situations` already exist
- The fact-sheet URL map or `docs/url-map.md` when the client repo has one

## Look

Stay inside the cities the business will drive to. Note when a city is treated publicly as a neighborhood of a larger city. Note fears a homeowner in those situations would have, in your own words, such as a no-show, a wider scope than they asked for, or not knowing whether their street is served.

Fill only these keys:

- `gaps` — a confirmed job or neighborhood the visible local results do not explain
- `customer_fears` — what could stop the visit
- `content_opportunities` — topics that belong on a page this business can actually support from its facts

Do not assign `build_now` or any other page status. Do not invent a population, a drive time, or a search volume. If the question is which URL to publish, stop and use the page plan.

Write `strategy.research` once, with the other research skills. The shape is the `research` object in `schemas/client-strategy.schema.json`.

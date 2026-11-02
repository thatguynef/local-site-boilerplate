---
name: competitor-research
description: Record what competing local-service pages show for the confirmed services and cities. Observations go into strategy.research. Does not copy their sentences or invent ranks.
---

# Competitor research

Use this after facts are validated and before positioning. You are collecting market observations, not writing the site.

## Read first

- `client/facts.yaml` for the services and cities the business actually has
- [docs/client-data.md](../../../docs/client-data.md) for the `research` object

A service or city that is not in the facts is out of scope. Do not add one because a competitor offers it.

## Look

Open the public pages that already rank or advertise for those service and city pairs. Use pages the user gathered when they exist. Prefer the business's own competitors over directories.

For each page you open, record a `sources` entry with the `https` URL and a note about the page type. Then fill only these keys:

- `conventions` — page types, proof blocks, and offers that repeat across those pages
- `common_offers` — offers you saw, described in your own words
- `conversion_patterns` — how those pages ask the visitor to act
- `trust_requirements` — proof those pages treat as normal, which this business still has to substantiate
- `sources`

Leave `gaps`, `customer_fears`, `high_intent_services`, and `content_opportunities` for the other research skills. Write `strategy.research` only when all three skills have finished, as one object. The schema in `schemas/client-strategy.schema.json` is the shape.

## Refuse

- Copying a competitor's sentences into the note or onto the site
- A rank, volume, rating, or review count you did not see on the page or in a tool result
- Treating an observation as a claim in `facts.yaml`

---
name: define-conversion-strategy
description: Choose the primary and secondary CTA in client/strategy.yaml. A CTA type does not add a feature.
---

# Define conversion strategy

Use this after positioning. The CTA rules are the CTA section of [docs/client-data.md](../../../docs/client-data.md). Follow them. This skill only decides which allowed type the business should use.

## Write

Set `strategy.conversion`:

- `primary` and `secondary` — a type from that list, plus the label a caller would see
- `mobile.sticky_action` — the same set of types
- `emergency.prioritize_phone` — `true` only when `claims.emergency_service` is publishable
- `response_expectation.enabled` — `true` only when `claims.response_time` is publishable

Copy `primary` and `secondary` into the site spec later. [build-site-spec](../build-site-spec/SKILL.md) does that. Do not add a field to `src/config/business.ts` from this skill.

## Refuse

- A booking calendar, chat widget, financing calculator, or membership portal because the label sounds like one
- An emergency phone treatment when emergency service is not a publishable claim
- A response promise when `response_time` is empty or not publishable

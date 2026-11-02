---
name: define-positioning
description: Write audience, situations, and positioning in client/strategy.yaml from validated facts. Never invents a differentiator.
---

# Define positioning

Use this after research notes exist and before the conversion strategy. Answer these from `client/facts.yaml` and `strategy.research`. If a fact is missing, leave the field empty or ask. Do not fill it with a guess.

1. Who is the ideal customer?
2. What situation triggers them?
3. What problem matters most?
4. Why should they choose this business instead?
5. What proof supports that?
6. What should this business avoid saying?
7. What should the homepage communicate first?

## Write

Update `client/strategy.yaml`:

- `audience.primary` — who the business serves, from the facts
- `customer_situations.urgent` and `considered` — the triggers you can point at
- `positioning.core` — the problem and the true reason to call
- `positioning.desired_perception` — what the homepage may communicate first
- `positioning.avoid_positioning` — claims and postures the business should not use
- `positioning.differentiators` — only a reason `facts.yaml` can publish. Statuses are in [docs/client-data.md](../../../docs/client-data.md)

Put an unsupported opportunity in `research.differentiation`. Leave it out of `positioning.differentiators`. An empty `differentiators` list is a finished answer when the facts do not support a stronger one.

A callback sentence, a service list, and a city are not differentiators unless the facts show something a caller can verify.

## Refuse

- A superlative, a year count, a review line, or a credential that is not publishable
- Copying a competitor's positioning
- Marking strategy complete while conversion is still unwritten. That step is [define-conversion-strategy](../define-conversion-strategy/SKILL.md).

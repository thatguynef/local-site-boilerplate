---
name: visual-uniqueness
description: Review whether a client site still looks like the Example Plumbing scaffold. A written review. It does not run inside npm run verify and it does not restyle the sample.
---

# Visual uniqueness

Use this after [personalize-client-site](../../visual/personalize-client-site/SKILL.md), in the client repository. Read `client/strategy.yaml`, `client/site-spec.yaml` `brand`, and `DESIGN.md`.

On this repository, stop. The Example Plumbing design is scaffolding, not a design target. A uniqueness failure on `main` is expected. Do not restyle `main` to satisfy this review.

Write one line for each question, then a verdict. Do not score it. Do not edit the site inside this skill unless the user asked you to fix the review.

- Does the homepage keep the sample composition?
- Does the hero look like a lightly edited sample?
- Are the visual tokens unchanged without a reason from the brief?
- Is the type chosen for this business?
- Is the layout chosen for this business?
- Does the imagery match the trade and the market, using assets the client owns when they exist?
- Does the page communicate the positioning in `strategy.yaml`?
- Would a logo, color, name, and phone swap make this site fit an unrelated contractor?

The last question is the same test the personalization skill uses. If the answer is yes, personalization is not done.

This review is not part of `npm run verify`.

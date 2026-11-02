---
name: page-brief
description: Write a page brief for every build-now or optimize page before any page copy. The brief is reasoning, not the markdown page.
---

# Page brief

Use this after `client/site-spec.yaml` validates and before [generate-service-page](../../foundation/generate-service-page/SKILL.md) or [generate-service-area-page](../../foundation/generate-service-area-page/SKILL.md).

One brief per `build_now` or `optimize` page. Do not brief `later`, `contact_only`, or `do_not_build`. Do not write a brief from a keyword that is not already a page in the spec.

## Write `client/page-briefs.yaml`

The shape is `schemas/page-briefs.schema.json`. For each page record:

- `path`, `kind`, and `slug` match the spec row
- `search_intent` is the `primary_intent` from the spec, in the customer's words
- `visitor_situation` is the moment they open the page
- `primary_answer` is the first sentence the page must give, using the business name, the service or city, and the phone from `facts.yaml`
- `primary_cta` matches `strategy.conversion.primary`
- `supporting_proof` names the fact and, for a trust claim, its status. Publishing rules are in [docs/client-data.md](../../../docs/client-data.md)
- `objections` and `questions` are what that visitor still needs answered
- `related` lists the other service and city slugs the page should acknowledge
- `internal_links` lists real paths, including `/contact/`
- `avoid` lists claims and page types this page must not create

`supporting_proof` is what the page needs. It is not permission to print it. The page skill publishes a claim only when its status is publishable.

Run `npm run validate:client`. A brief slug that is not a `build_now` or `optimize` page fails that check.

On this repository, `client/page-briefs.example.yaml` documents the sample. Do not treat it as a request to rewrite Example Plumbing, and do not write `client/page-briefs.yaml` on `main`.

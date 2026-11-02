---
name: generate-service-page
description: Write one local service page in the answer-first pattern used by this boilerplate.
---

# Generate a service page

Use this when adding a real service to a site built from local-site-boilerplate.

## Which page

When the task is choosing which services get pages, stop and use `agent-skills/foundation/local-page-plan/SKILL.md`.

Write a page from this skill only for a `build_now` or `optimize` slug that already has a brief in `client/page-briefs.yaml` (on this repository, `client/page-briefs.example.yaml`). If that brief is missing, stop and use `agent-skills/content/page-brief/SKILL.md`. Do not write the page from a keyword alone. A service with no page stays a `/contact/` link.

## Read first

- The page brief for this slug
- `src/config/business.ts` for the name, city, phone, neighborhoods, and hours
- `src/content/services/drain-cleaning.md` for the pattern
- `src/content/services/_example.md` for the empty shape

Files whose names start with `_` are not built. Publish a claim only when [docs/client-data.md](../../../docs/client-data.md) says its status is publishable. The brief's proof list is not permission to print it.

## Write

Create `src/content/services/<slug>.md`. The slug becomes `/services/<slug>/`.

Front matter:

- `title` and `seoTitle` include the service and the city. The title is the H1.
- `description` is one or two sentences a person can use without opening the page. Include a service word and the city.
- `answer` is at least 40 characters, names the service and the city, and states how to reach the business.
- `processTitle` is a question or a "How … works" heading.
- `steps` has at least two steps. Each step says what the customer does and what the company does.
- `faqs` has at least two questions whose answers stand alone. Do not write "click here", "see above", or "read more".

Body copy starts at H2. Phrase headings as questions. Use the brief's questions, objections, and internal links. Mention neighborhoods from `business.ts` only.

Set that service to `build_now` or `optimize` in `client/site-spec.yaml`, then run `npm run client:generate` so its `href` becomes `/services/<slug>/`. Do not hand-edit `src/config/business.ts`. Until a page exists, the generator points the service at `/contact/`.

## Optional facts

Read `afterHours`, `financing`, and `maintenancePlan` from `src/config/business.ts`. Leave them out of the page when they are empty. When `maintenancePlan` is set, that sentence is shown only on the service page whose slug or title contains "maintenance". Do not copy it onto another service page.

## Do not

- Paste the phone or address anywhere except content that must match `business.ts`
- Add a second H1 in the markdown body

## Check

Run `npm run verify`.

The page should satisfy Website Scorecard understanding and findability (a clear service, a city, one H1, a next step) and give Local Visibility a unique URL. Service names should stay consistent with what the business would put on its Google Business Profile: https://thatguynef.github.io/gbp-scorecard/

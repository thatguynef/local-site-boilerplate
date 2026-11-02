---
name: local-page-plan
description: Decide which local service pages and service-area pages to build or optimize first from local keyword demand and the public site. Search Console, Analytics, and the Business Profile are optional.
---

# Local page plan

## Goal

Decide which service pages and service-area pages a local home-service business should publish or improve first. The result is an ordered page plan for paths shaped like `/services/<slug>/` and `/service-areas/<slug>/`.

This skill lives in local-site-boilerplate. The usual client is a site the operator does not own. Rank from local keyword demand through OpenSEO, and from the public URLs when a site is already live. Search Console, Google Analytics, and the Google Business Profile are used only when the user says those accounts are already connected. Do not ask for access. This is a prioritization workflow. It does not write the website or forecast a Maps rank or a date.

Use OpenSEO `keyword-research` when the user wants a keyword list. Use `keyword-clustering` when they already have keywords and want clusters. Use `local-seo` when the question is Maps visibility around a storefront.

## Required inputs

- An OpenSEO `projectId`
- The trade and the services the business actually performs
- The cities the business will drive to, and which city is primary
- Optional: the live domain, when one exists
- Optional: an accepted fact sheet from `agent-skills/foundation/fact-sheet.md`. Use its `accepted` services and drive-to cities. A `blank` or `conflict` row is not a service or a city.

If a service or city is missing, ask once. Confirm the list before any paid call. Keyword ideas do not add a service the business does not perform. Search volume does not add a city the business will not drive to.

## Project context

The OpenSEO project-context tools are free and shared with the app and other agents.

1. Call `get_project_context` first and ground the plan in it — the business, the markets, and any key pages already saved.
2. This skill needs `business_overview` with the services and the cities. If it is empty, run a minimal inline setup: ask, or infer from the site and confirm, write it back with `update_project_context`, then continue. Never front-load the full interview; suggest `seo-project-setup` at the end for the rest.
3. Before spending credits, check the research log. If the same seeds and locations ran within the last 30 days, reuse that result and say so.
4. On finish, write proposed build-now paths with `update_project_context` (`addKeyPages`, role `money`, notes `proposed` until the URL is live) and append a research log entry: `{ appendResearchLog: { summary: "Local page plan: <services/cities>. Verdict: <conclusion>" } }`.

## Deliver as a report

When the OpenSEO `seo-report` skill is available, deliver through it and save with `skill: "local-page-plan"`. When it is not available, use the output format in this file. Do not stop.

## OpenSEO MCP tools

- `search_serp_locations`: resolve each confirmed city. Pass the returned `locationName` verbatim on later keyword calls.
- `research_keywords`: 1–5 seeds per call. Leave `resultLimit` at the default 150. Do not set `includeClickstreamData`. For local demand, set `locationName` on each seed. Volume, CPC, and competition become local; keyword ideas, keyword difficulty, and intent stay national.
- `get_keyword_metrics`: one batch, only for exact service and city phrases the research rows did not already return. Up to 700 keywords. Include Search Console queries only when those rows exist.
- `get_serp_results`: the build-now shortlist only, with the same `locationName`, when intent is ambiguous.
- `get_local_serp_results`: at most one call, for the leading city and the primary service, and only when a local pack would change which city is first. State the cost first.
- `save_keywords`: only after explicit confirmation.

Call these only when the user says the account is already connected. Do not call them to discover access, and do not ask the user to connect them.

- `get_search_console_performance`: striking distance uses `minPosition: 5`, `maxPosition: 20`, `minImpressions: 50`. The query-to-page map uses `dimensions: ["query","page"]`. Free.
- `get_google_analytics_organic_landing_pages`: organic sessions, engagement, and key events by landing page. Free. No extra inputs.
- `get_google_analytics_key_events`: pass `breakdown: "event_and_landing_page"`. Free.

If the user said an account was connected and the tool says it is not, record that and continue on keyword demand. Do not call `get_local_rank_grid`. A Maps grid belongs to `local-seo`, and only after this plan has named the city worth gridding.

## Workflow

1. Resolve the project. Read context. Confirm services, cities, and the primary city in one question when they are not already confirmed.
2. Rank on local keyword demand. When a live site exists, list its public service and city URLs and match each candidate to one. Call Search Console or Analytics only when the user says those accounts are already connected.
3. Count the paid seeds and say the count before calling `research_keywords`:
   - One seed per confirmed service, each with the primary city's `locationName`.
   - One seed per confirmed city, each the primary service with that city's `locationName`.
   - Batch at most 5 seeds per call.
   - When the total exceeds 10 seeds, run the primary city plus the services the user names as the money set (at most 4 more seeds), then ask before the rest.
4. Drop terms for services the business does not perform, brand-only queries, and duplicates.
5. Group by intent. One commercial or transactional intent becomes one service page. Symptom and price queries join that service page's FAQ and do not get their own URL. A query that names the primary service and a city supports that city's page. Other services stay on their own `/services/<slug>/` page and are linked from the city page. This plan has no `/services/<service>/<city>/` path.
6. A neighborhood stays on its city page unless it has its own local volume and the business treats it as a separate place it drives to.
7. Hydrate missing exact phrases with one `get_keyword_metrics` call. Include striking-distance queries only when Search Console returned rows.
8. Spot-check SERPs only for rows that might be build now. Use one local-pack lookup only when the tool list above allows it.
9. Assign each candidate using the decisions below.
10. Present the plan and ask before `save_keywords`. Suggest tags `topic:<service>` and `page:/services/<slug>/` or `page:/service-areas/<slug>/`.

## Decisions

Compare candidates only inside this business's confirmed set. A missing metric is `unknown`. Unknown is not zero, and it does not outrank a known weaker term.

**Build now — service.** The business performs it. Intent is commercial or transactional (hire, repair, replace, install). Local volume is in the stronger half of this service set, or the business named it as a primary money service and volume is unknown. Keyword difficulty is outside the hardest band of this set. When Search Console rows exist, a query at position 5–20 with at least 50 impressions is also build now. A checked SERP is local service pages or a local pack. A SERP of retailers, manufacturers, or DIY publishers is not a service page.

**Build now — city.** The business will drive there. Local volume for the primary service in that city is in the stronger half of the confirmed cities. Keyword difficulty is in the easier half of that city list. When Search Console rows exist, a city query in striking distance is also build now. Publish the first row first. This order is comparative. It is not a rank position and not a time-to-rank.

**Optimize first.** A public URL already covers this confirmed service or city. Rebuild that URL before adding a new one. When Search Console or Analytics rows exist, position 5–20 with at least 50 impressions, a weaker key-event rate than the business's other service or city pages, or the same query sending impressions to two URLs, means keep and improve the specific service or city URL.

**Later.** The business offers it or drives there, and volume is low or difficulty is in the hardest band.

**Do not build.** The business does not sell it, the intent is informational only, the place is a neighborhood of a city page, or the intent already belongs to a page in this plan. On the site, a service with no page links to `/contact/`.

## Output format

`title` and `h1`: `Local Page Plan — MMM D, YYYY`. The byline names the business.

If a report template applies (see `seo-report`), its sections and tone replace this list.

Sections in this order:

1. **The plan** — a bullet list: how many service pages to build now, how many city pages, which city is first, and whether an existing page should be optimized before any new page. One fact per line.
2. **Service pages** — a table of page, primary keyword, local volume, keyword difficulty, and decision.
3. **Service areas** — a table of city, primary keyword, local volume, keyword difficulty, and order. The first row is the city to publish first.
4. **Why this order** — one finding each for the first service, the first city, and any optimize-first page. State the evidence (the numbers, or `unknown`), the path to create or the URL to improve, and why it comes before the next candidate. The expected effect is a hypothesis about fit inside this set. Do not name a rank position or a date.
5. **Optimize these first** — a table of URL, evidence, and action. Omit the section when no public URL matches a candidate and no first-party rows were used.
6. **Do not build** — a short table of the term or place and the reason. Omit when empty.
7. **What to do next** — an ordered list. After the user confirms the build-now rows, draft those pages with `generate-service-page` and `generate-service-area-page` in the client repo cloned from this boilerplate. Do not draft them on local-site-boilerplate main. Offer `local-seo` only if a Maps grid for the first city would change the order. Ask before saving keywords.
8. **How this report was made** — name this skill, `agent-skills/foundation/local-page-plan/SKILL.md`, then which tools returned what. State that the order came from local keyword demand and, when a site was live, its public URLs. State that keyword difficulty and intent stayed national, and that local volume used `locationName`. Name Search Console or Analytics only when those tools were called.

Add one bar chart of local volume for the build-now shortlist when at least two volumes are known. Print every bar's number in the table too.

## Guardrails

- Do not invent a metric, a service, a city, a rank, or a date.
- Do not create website files or call `save_keywords` without confirmation.
- Do not run a rank grid, a 300 or 500 `resultLimit`, or clickstream volumes.
- Do not treat national difficulty as a Maps rank.

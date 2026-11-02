# Agent skills

These instructions are for Claude, Cursor, Codex, Grok, and other agents that can read a `SKILL.md` file. Point the agent at the file, or copy the folder into the agent's skills directory.

Start at [AGENTS.md](../AGENTS.md). What a client build may change is in [docs/change-policy.md](../docs/change-policy.md). Claims, page statuses, and the YAML files are in [docs/client-data.md](../docs/client-data.md). The Example Plumbing design is scaffolding, not a design target. Vendored skills in `visual/` are helpers. `personalize-client-site` and the change policy win when a vendored skill conflicts with them.

## Workflow

On a client repository, start at `orchestration/build-client-site/SKILL.md`. It reads `client/build-state.yaml` and names the next unfinished phase. On this repository it stops. The checkout is the Example Plumbing sample.

| Phase | File |
| --- | --- |
| Discovery, no site | `foundation/new-site-intake/SKILL.md` |
| Discovery, existing site | `foundation/existing-site-facts/SKILL.md` |
| Competitor research | `research/competitor-research/SKILL.md` |
| Local market | `research/local-market-analysis/SKILL.md` |
| Search intent | `research/search-intent-analysis/SKILL.md` |
| Positioning | `strategy/define-positioning/SKILL.md` |
| Conversion | `strategy/define-conversion-strategy/SKILL.md` |
| Page plan | `foundation/local-page-plan/SKILL.md` |
| Site spec | `strategy/build-site-spec/SKILL.md` |
| Page brief | `content/page-brief/SKILL.md` |
| Service page | `foundation/generate-service-page/SKILL.md` |
| Service-area page | `foundation/generate-service-area-page/SKILL.md` |
| Visual pass | `visual/personalize-client-site/SKILL.md` |

`foundation/existing-site-facts/SKILL.md` reads a live site. `foundation/new-site-intake/SKILL.md` asks the checklist and does not search. Accept the fact sheet before the page plan. The page plan reads facts and strategy when those files exist. It does not need Search Console, Analytics, or Business Profile access. None of these skills run inside `npm run verify`.

## Also used while building

| Skill | File |
| --- | --- |
| Fact sheet columns | `foundation/fact-sheet.md` |
| JSON-LD | `foundation/fill-jsonld/SKILL.md` |
| FAQ | `foundation/update-faq/SKILL.md` |
| Website Scorecard review | `foundation/review-website-scorecard/SKILL.md` |
| NAP consistency | `foundation/check-nap/SKILL.md` |
| Open Graph image | `foundation/og-image/SKILL.md` |

Those skills tell the agent to run `npm run verify` and point at the sister scorecards where that work shows up.

## Quality review

Use these after the visual pass, in the client repository. On this repository, uniqueness review stops. The sample is the scaffold.

| Review | File |
| --- | --- |
| Visual uniqueness | `quality/visual-uniqueness/SKILL.md` |
| Content | `quality/content-review/SKILL.md` |
| Conversion | `quality/conversion-review/SKILL.md` |

`npm run evaluate:content` and `npm run evaluate:conversion` are the deterministic checks for the last two. They are not part of `npm run verify`.

## Visual pass

Do this later, when a client is ready to tailor the look.

Start with `visual/personalize-client-site/SKILL.md`. It collects the trade, city, logo, photos, and colors, writes `DESIGN.md`, and may replace composition, type, and imagery. It refuses decorative motion and claims the business did not supply.

Then the vendored skills in `visual/` can help with type, color, layout, and QA. Sources, commits, and licenses are in `visual/SOURCES.md`.

Copy a skill folder into the harness if it only loads skills from its own directory. For Claude Code that is `.claude/skills/<name>/`. For Codex, use the project's skill path. The instructions themselves do not depend on one product.

After visual edits, `npm run verify` still has to exit 0.

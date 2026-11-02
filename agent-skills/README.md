# Agent skills

These instructions are for Claude, Cursor, Codex, Grok, and other agents that can read a `SKILL.md` file. Point the agent at the file, or copy the folder into the agent's skills directory.

Start at [AGENTS.md](../AGENTS.md). What a client build may change is in [docs/change-policy.md](../docs/change-policy.md). The Example Plumbing design is scaffolding, not a design target. Vendored skills in `visual/` are helpers. `personalize-client-site` and the change policy win when a vendored skill conflicts with them.

## Foundation

Use these while the content and business facts are still being filled in.

| Skill | File |
| --- | --- |
| Existing site facts | `foundation/existing-site-facts/SKILL.md` |
| New site intake | `foundation/new-site-intake/SKILL.md` |
| Local page plan | `foundation/local-page-plan/SKILL.md` |
| Service page | `foundation/generate-service-page/SKILL.md` |
| Service-area page | `foundation/generate-service-area-page/SKILL.md` |
| JSON-LD | `foundation/fill-jsonld/SKILL.md` |
| FAQ | `foundation/update-faq/SKILL.md` |
| Website Scorecard review | `foundation/review-website-scorecard/SKILL.md` |
| NAP consistency | `foundation/check-nap/SKILL.md` |
| Open Graph image | `foundation/og-image/SKILL.md` |

Run the matching fact skill first. `foundation/existing-site-facts/SKILL.md` reads a live site. `foundation/new-site-intake/SKILL.md` asks the checklist and does not search. Accept the fact sheet, then run `foundation/local-page-plan/SKILL.md` before the two page skills. The page plan chooses which service and city pages to build from local keyword demand and the public site. It does not need Search Console, Analytics, or Business Profile access. None of these skills run inside `npm run verify`.

The other foundation skills tell the agent to run `npm run verify` and point at the sister scorecards where that work shows up.

## Visual pass

Do this later, when a client is ready to tailor the look.

Start with `visual/personalize-client-site/SKILL.md`. It collects the trade, city, logo, photos, and colors, writes `DESIGN.md`, and may replace composition, type, and imagery. It refuses decorative motion and claims the business did not supply.

Then the vendored skills in `visual/` can help with type, color, layout, and QA. Sources, commits, and licenses are in `visual/SOURCES.md`.

Copy a skill folder into the harness if it only loads skills from its own directory. For Claude Code that is `.claude/skills/<name>/`. For Codex, use the project's skill path. The instructions themselves do not depend on one product.

After visual edits, `npm run verify` still has to exit 0.

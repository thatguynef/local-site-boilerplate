# Agent skills

These instructions are for Claude, Cursor, Codex, Grok, and other agents that can read a `SKILL.md` file. Point the agent at the file, or copy the folder into the agent's skills directory.

## Foundation

Use these while the content and business facts are still being filled in.

| Skill | File |
| --- | --- |
| Service page | `foundation/generate-service-page/SKILL.md` |
| Service-area page | `foundation/generate-service-area-page/SKILL.md` |
| JSON-LD | `foundation/fill-jsonld/SKILL.md` |
| FAQ | `foundation/update-faq/SKILL.md` |
| Website Scorecard review | `foundation/review-website-scorecard/SKILL.md` |
| NAP consistency | `foundation/check-nap/SKILL.md` |
| Open Graph image | `foundation/og-image/SKILL.md` |

Each one tells the agent to run `npm run verify` and points at the sister scorecards where that work shows up.

## Visual pass

Do this later, when a client is ready to tailor the look.

Start with `visual/personalize-client-site/SKILL.md`. It collects the trade, city, logo, photos, and colors, writes `DESIGN.md`, and refuses motion and claims that do not belong on this site.

Then the vendored skills in `visual/` can help with type, color, layout, and QA. Sources, commits, and licenses are in `visual/SOURCES.md`.

Copy a skill folder into the harness if it only loads skills from its own directory. For Claude Code that is `.claude/skills/<name>/`. For Codex, use the project's skill path. The instructions themselves do not depend on one product.

After visual edits, `npm run verify` still has to exit 0.

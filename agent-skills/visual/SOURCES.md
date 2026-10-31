# Visual skill sources

These skills are for a later client pass. The default theme in `DESIGN.md` stays quiet until someone asks for that pass. After any visual edit, run `npm run verify`. Structural checks still have to pass.

`agent-skills/visual/personalize-client-site/SKILL.md` is written for this repository. It is the gate for the vendored skills below.

## Vendored

| Skill | Upstream | Pin | License |
| --- | --- | --- | --- |
| frontend-design | https://github.com/anthropics/skills `skills/frontend-design` | `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f` | Apache-2.0 (`frontend-design/LICENSE.txt`) |
| impeccable | https://github.com/pbakaus/impeccable, npm package `impeccable@4.8.0` | skill text installed from 4.8.0; engine version in `impeccable/scripts/VERSION` | Apache-2.0 (`impeccable/LICENSE.txt`). Copyright Paul Bakaus and contributors. |
| web-visual-direction | https://github.com/divyanshu-iitian/agent-website-design-skills | `77961873e9ee996afe7aa5cd4223b09a2360ed9c` | MIT, Copyright (c) 2026 Divyanshu (`agent-website-design-skills-LICENSE`) |
| web-design-system | same repository and commit | same | MIT |
| conversion-accessibility-polish | same repository and commit | same | MIT |
| responsive-ui-qa | same repository and commit | same | MIT |

The four MIT skills include their `references/` files. Impeccable's platform binary is not committed. Its launcher downloads the pinned engine on first use. `npx impeccable` from the devDependency is the supported way to run the detector.

Commands that fit this boilerplate, when the personalize skill allows a visual pass: `typeset`, `layout`, `colorize`, `quieter`, `polish`, `critique`, `audit`, `adapt`, `optimize`. Do not use `overdrive` on a client site from this boilerplate.

## Not included

These were considered and left out: unslop (optional CC-BY alternative only; not installed), ui-ux-pro-max, taste-skill, incredibly-pretty-websites, stylekit, uxkin/no-ui-slop, ux-ui-skills, and web-design-skill (jseanj).

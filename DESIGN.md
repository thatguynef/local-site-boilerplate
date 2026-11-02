# Design

Sample theme for Example Plumbing. It is quiet on purpose so the boilerplate is easy to read. This file is scaffolding, not a design target.

A client visual pass may replace the tokens in this file and in `src/styles/global.css`, and it may replace layout and composition. It may not change routes, the single H1, NAP, schema contracts, form field names, or noindex rules. Permissions are in [docs/change-policy.md](docs/change-policy.md). The pass starts at `agent-skills/visual/personalize-client-site/SKILL.md`.

Layout pieces live in `src/components/primitives/`. They are described in [docs/design-primitives.md](docs/design-primitives.md). Replacing them is part of a client visual pass.

## Tone

Local home-service site. The page should be easy to scan on a phone and easy to call from. No decorative motion, no scroll-jacking, no gradient text, no purple links.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#f4f7f8` | Page background |
| `--surface` | `#ffffff` | Header, cards |
| `--ink` | `#142028` | Body text |
| `--muted` | `#3d4c55` | Secondary text |
| `--line` | `#d5e0e4` | Borders |
| `--accent` | `#0c4a4a` | Links, buttons, theme color |
| `--accent-ink` | `#f4f7f8` | Text on accent |
| `--focus` | `#9a3412` | Focus outline |
| `--banner` | `#e7f2f2` | Example-content banner |

## Type

System fonts only, until a client pass adds one self-hosted pair.

- Body: Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif
- UI: Avenir Next, Segoe UI, sans-serif

Do not load fonts from a third-party host.

## Targets

Core Web Vitals for the mobile site: LCP at or under 2.5s, INP at or under 200ms, CLS at or under 0.1. The default build ships no web font and no page JavaScript. A hero image needs width, height, `loading="eager"`, and `fetchpriority="high"`. Other images use `loading="lazy"` and `decoding="async"`.

## Interaction

- Skip link targets `#main`.
- `:focus-visible` is a 3px outline with a 3px offset.
- Navigation, phone links, buttons, and fields use at least 44px of block size.
- `prefers-reduced-motion: reduce` removes smooth scrolling.

## Locked structure

Visual edits stop at presentation. Keep one H1, the footer NAP attributes, the contact field names, `noindex` on `/thank-you/` and the 404 page, and the answer paragraph at the top of service and location pages. Run `npm run verify` after any visual edit.

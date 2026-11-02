# Architecture

This is the repository as it is. Do not add a directory to match a diagram.

## Tree

```text
agent-skills/     Skills the agent reads. The orchestrator is orchestration/build-client-site/.
client/           Example YAML on this repository. A client repo uses the same names without `.example`.
docs/             Principles, the change policy, client data, security, performance, and the two build paths.
evaluations/      Scorecard criteria and the runner. Results are gitignored.
fixtures/         Fake businesses for `npm test`. Not client repositories.
public/           Manifest, icons, and the share image.
schemas/          JSON Schema for the client YAML.
scripts/          Checks, generate, scaffold, doctor, security, performance, and quality reviews.
src/components/   Page components. The layout grammar is in primitives/.
src/config/       business.ts. Pages read this file. A client repo generates it.
src/content/      Markdown for pages, services, and cities. A file that starts with `_` is a template.
src/layouts/      Base and Page.
src/lib/          Lead delivery, offers, and JSON-LD.
src/pages/        Routes. The only server route is POST /api/contact/.
src/styles/       global.css.
```

Marketing pages are prerendered. The contact form is the Worker route.

## Where to look

| Question | Read |
| --- | --- |
| What may change | [change-policy.md](change-policy.md) |
| How a fact becomes the NAP module | [client-data.md](client-data.md) |
| What each command proves | [quality-gates.md](quality-gates.md) |
| Which check maps to a scorecard row | [evaluations/README.md](../evaluations/README.md) |
| The next build step | [build-client-site](../agent-skills/orchestration/build-client-site/SKILL.md) |

Research notes live on `strategy.yaml` under `research`. There is no `knowledge/` tree. Criteria live in `evaluations/criteria/`. There is no `evaluations/structural/` directory.

Example Plumbing stays on this repository's `main` branch. A client site is a separate repository. See [client-repo.md](client-repo.md).

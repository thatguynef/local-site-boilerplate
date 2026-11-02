# Design primitives

Layout grammar for pages built from this boilerplate. A client visual pass may replace every component here. None of them is a page template, and none of them names a trade.

The sample still looks like Example Plumbing. These pieces only replace repeated layout markup. Permissions are in [change-policy.md](change-policy.md). The visual pass starts at `agent-skills/visual/personalize-client-site/SKILL.md`.

| Component | Use |
| --- | --- |
| `Container` | The shared measure. Renders the `wrap` class. |
| `Cluster` | A wrapping row. Pass `gap` when the row needs a specific gap. |
| `Stack` | A vertical gap for a new composition. It does not remove child margins. Do not wrap a heading that already has margin. |
| `Grid` | Equal tracks. The sample service and city indexes add `card-list`. |
| `Split` | One column, then side by side from 48rem. Pass `columns` for the wide ratio. |
| `Section` | A titled region. `marker` sets `data-process`, `data-faq`, `data-trust`, or `data-service-area`. |
| `Callout` | A short notice. The sample banner is a callout with the `banner` class. |
| `ContactAction` | A phone link or a link to `/contact/`. `tone="header"` keeps the `header-phone` class the checks require. |
| `CardLink` | A title, one sentence, and one link. Use it for a service or a city. Do not make a trade-specific hero. |
| `TrustMetric` | One label and a value, or the empty prompt. |
| `Media` | An image with `alt`, `width`, and `height`. `priority` marks the one eager image. |

Do not add `PlumberHero`, `HVACHero`, or any other trade hero.

FAQ entries stay an `h3` and a paragraph. A disclosure widget would break the FAQ heading contract. There is no review-quote component. A review line is rendered only from publishable review fields, in `Trust.astro`.

`npm run verify` still has to pass after a primitive is replaced.

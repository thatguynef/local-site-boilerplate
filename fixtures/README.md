# Fixtures

Fake businesses used by `npm test`. They are not client repositories, and `npm run validate:client` does not read this folder unless you pass a file path.

Each directory has `facts.yaml`, `strategy.yaml`, and `site-spec.yaml`. None of them is Example Plumbing. None of them includes a logo, reviews, a license, financing, after-hours service, an analytics id, or a webhook URL.

| Directory | What it pins |
| --- | --- |
| `plumber-urgent` | One service and one city. The urgent situation is a clogged drain. Emergency service stays unpublished. |
| `hvac-replacement` | Several services, one city, and a publishable maintenance plan. |
| `electrician-service-area` | One service and four cities. Spanish-speaking customers are recorded on the strategy. `lang` stays `en`. This pass does not build a second language. |
| `roofer-estimate` | The secondary action is `request_estimate`. |
| `minimal-new-business` | The smallest profile: one service, one city, empty claims. |

A thin city page is not a fixture. The content review flags two city pages that share an answer. See `scripts/failure-modes.test.mjs`.

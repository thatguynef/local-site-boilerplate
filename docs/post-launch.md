# After launch

Use this in the client repository after [production QA](../agent-skills/launch/production-qa/SKILL.md) and one production lead has arrived. The client repository receives later engine fixes by merging a release tag. See [upgrading.md](upgrading.md). Do not merge `upstream/main`.

- Search Console: when the client has access, submit `https://<domain>/sitemap-index.xml` and watch coverage for the home page, the service pages, and the city pages.
- Business Profile: the name, phone, address, hours, and service names match `src/config/business.ts`.
- Analytics: confirm the real `G-` or `GTM-` id, when one is set, loads on the production origin. An empty id stays empty.
- Form delivery: send a lead on a schedule the client chooses and confirm it reaches the webhook. `CONTACT_WEBHOOK_URL` stays a Cloudflare secret. See [security.md](security.md).
- Links: open the primary service page, the primary city page, and the contact page on a phone. Header and footer phone links use the same `tel:` value.
- Schema: re-run Rich Results Test and the Schema Markup Validator after a content change.
- Dependencies: `npm install` from the lockfile. Do not force-upgrade a transitive package to clear an audit warning.
- Performance: `npm run verify` includes the budgets in [performance.md](performance.md).
- Later pages: run the page plan again when the client is ready to add a service or a city they actually serve. Do not add a thin city page.
- Engine updates: merge the next release tag, then run `npm run validate:client`, `npm run verify`, and `npm run doctor`.

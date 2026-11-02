# Security

`npm run security-check` reads tracked files. It also runs inside `npm run verify`. A pass means the repository does not contain a secret file, a webhook URL, a private key, a logged form value, or an `http://` link in `src/` or `public/`. It does not prove the live Worker is configured.

`CONTACT_WEBHOOK_URL` as a name is allowed. An assignment is allowed only when the URL host is `example.com`, which is the placeholder in `.dev.vars.example`.

## Where each value belongs

| Value | Home |
| --- | --- |
| Public business facts, including the business email | `client/facts.yaml`, then generated `src/config/business.ts` |
| Positioning, page plan, and optional performance budgets | `client/strategy.yaml` and `client/site-spec.yaml` |
| `CONTACT_WEBHOOK_URL` | Cloudflare secret: `npx wrangler secret put CONTACT_WEBHOOK_URL` |
| Local Worker secret for preview | `.dev.vars`, copied from `.dev.vars.example`. Git ignores it. |
| Analytics ids | `client/facts.yaml`, and only a real `G-` or `GTM-` id |
| Worker name and compatibility date | `wrangler.jsonc`. No secrets. |
| Customer form submissions | The webhook destination. Do not commit a lead export. |

The contact route forwards the lead as JSON and does not write it to the log. A 400 response lists field names, not the values.

Form field names and the honeypot stay as they are. See [change-policy.md](change-policy.md).

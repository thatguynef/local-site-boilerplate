---
name: production-qa
description: Check a client site on its production domain before calling it launched. One production lead has to arrive. Deploy only when asked.
---

# Production QA

Use this in the client repository after `npm run verify` passes on the real business. The launch steps in [docs/new-site.md](../../../docs/new-site.md) or [docs/existing-site.md](../../../docs/existing-site.md) still apply. Deploy only when asked.

`npm run security-check` and `npm run performance-check` already run inside `npm run verify`. Where secrets belong is [docs/security.md](../../../docs/security.md). Byte limits are [docs/performance.md](../../../docs/performance.md).

On the production origin, confirm:

- The domain is HTTPS and matches `site` in `astro.config.mjs`.
- Canonicals, `robots.txt`, and the sitemap load.
- The title, description, share image, favicons, and manifest name are this business.
- JSON-LD matches the visible page. Then run Rich Results Test and the Schema Markup Validator.
- One form submission reaches the destination. `CONTACT_WEBHOOK_URL` is a Cloudflare secret.
- `/thank-you/` and the 404 page behave as the checks require.
- The header phone is a `tel:` link, and the page is usable on a phone.
- Analytics loads only when a real `G-` or `GTM-` id is set.
- Profile links, when set, open the client's own profiles.
- The Business Profile name, address, phone, and hours match the site.

Manual accessibility, after the automated checks:

- Contrast of text, buttons, and the focus outline.
- Keyboard path through the header, the form, and the footer.
- Errors name the fields and do not echo the values.
- Required fields are marked by more than color.
- Text still fits at 200% zoom.
- Reduced motion is respected.
- Targets stay at least 44px.

Do not mark launch complete until that production lead arrives. After launch, follow [docs/post-launch.md](../../../docs/post-launch.md).

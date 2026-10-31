---
name: review-website-scorecard
description: Review one built page against the Website Scorecard categories this boilerplate can prove on-site.
---

# Review a page against the Website Scorecard

Use this for a structural review of a page in this repo. Do not invent a numeric score. The scorecard's weights and full rubric stay on the scorecard site.

- Website Scorecard: https://github.com/thatguynef/website-scorecard
- Rendered guide: https://thatguynef.github.io/website-scorecard/
- Local Visibility Scorecard: https://thatguynef.github.io/local-visibility-scorecard/
- GBP Scorecard: https://thatguynef.github.io/gbp-scorecard/

Run `npm run verify` and read the evidence. Then open the built HTML for the page you were asked about.

## Look for

- Understand: one H1, the service and the city, an answer paragraph, a way to take the next step, services in the nav, a real area page.
- Contact: the same phone digits in the header, footer, and contact page; a `tel:` link; a POST form with labels.
- Respond and book: the response promise, the hours, a thank-you page that says what happens next, and form fields for service, area, message, and preferred time.
- Trust: license and guarantee slots are visible. Empty placeholders are correct until the business supplies proof. Do not mark a blank license as a failure of honesty.
- Mobile and technical: viewport, skip link, visible focus, 44px targets.
- Findability: title, description, and H1 carry the service and city on home, service, and location pages; canonical URL; 404 and thank-you are noindex; schema matches the NAP.
- Measurement: no analytics script when `analytics.ga4` and `analytics.gtm` are empty.

## Say clearly

- What passed, with the assertion id and the evidence line
- What failed, and the file to edit
- What is not applicable because it lives on Google Maps, in a Business Profile, or in an assistant's answer

Do not copy rubric text into the repo. Do not claim the site ranks or that an assistant cites it.

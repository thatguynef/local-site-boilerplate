---
name: update-faq
description: Add or revise FAQ entries so the visible answers and FAQPage schema stay the same text.
---

# Update FAQ sections

Use this when the questions on the FAQ page or a service page should change.

## Where they live

- Site FAQ: `src/content/pages/faq.md` front matter `faqs`, plus the answer paragraph.
- Service FAQ: `faqs` on that service file.
- Location FAQ: `faqs` on that service-area file.

`FaqList` renders each question as an H3 and each answer as a paragraph. The JSON-LD `FAQPage` uses that same text. Do not put a different answer in the body than in `faqs`.

## Write

- Keep at least three questions on the FAQ page.
- Each answer is self-contained. Name the business, the city, or the phone when the question needs it.
- Phrase the question the way a homeowner would ask it. On a service or city page, start from that page's brief when one exists.
- Say what happens next: who calls, during which hours, and what the person should have ready.
- If you do not know a fact (license, price, same-day promise), say it is not set yet or leave the question out. Do not guess.

Avoid "click here", "see above", "as mentioned", and "read more". A descriptive link is fine.

## Check

Run `npm run verify`. The FAQ check compares visible text with the schema.

This supports Website Scorecard understanding and the GEO/AEO checks in `evaluations/criteria/geo-aeo.json`. Generative engines can quote the answer only if the sentence is complete on its own. Scorecard: https://github.com/thatguynef/website-scorecard

# Principles

Short rules for every client site built from this boilerplate. The operating steps are in [AGENTS.md](../AGENTS.md). The file permissions are in [change-policy.md](change-policy.md).

## 1. Foundation, not template

Shared engineering does not require a shared appearance. Example Plumbing shows that the system works. It is not the look of the next site.

## 2. Facts before copy

Write from accepted facts. Leave a trust field empty when the business cannot prove it. Do not invent a license, a review count, a price, years in business, a guarantee, after-hours service, financing, or a person's name. Claim statuses are in [client-data.md](client-data.md).

## 3. Evidence over adjectives

Show the proof you have. Do not fill the gap with generic trust language.

## 4. Intent before page count

Build a service page or a city page because a customer is looking for that job in that place. Do not publish a thin page that only swaps the city name. Do not add `/services/<service>/<city>/`.

## 5. One source of truth

Name, phone, address, hours, and the service list live in `src/config/business.ts`. Pages read that module. `phoneDisplay` and `phoneTel` use the same digits.

## 6. Deterministic where possible

Use a script for a repeated mechanical task. Use an agent for positioning, page choice, copy, and visual judgment. Do not weaken `npm run verify` to avoid a judgment call.

## 7. Answer first

A service or city page opens with what the company does, where, and what to do next. FAQ answers stand alone. A visitor or an answer engine should not need the previous paragraph.

## 8. Mobile conversion matters

Many visitors are on a phone and already have a problem. The phone number is tappable. The next step is visible without a hunt.

## 9. Local relevance must be real

Name cities the business will drive to and neighborhoods that belong to those cities. A county is not a city page unless the business treats it as a place it serves on its own.

## 10. Creativity above the contracts

Change composition, type, color, imagery, and section order when the business calls for it. Keep the routes, the form, the schema, the NAP source, accessibility, and `npm run verify` intact.

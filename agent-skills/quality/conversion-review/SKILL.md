---
name: conversion-review
description: Review whether the pages match client/strategy.yaml conversion choices. The deterministic checks are npm run evaluate:conversion, which is not part of npm run verify.
---

# Conversion review

Use this after content exists and the conversion strategy is written. Run `npm run evaluate:conversion` first. It reads `dist/client` and `client/strategy.yaml` (the example file on this repository).

The command checks the action type, not the layout. A phone action needs a `tel:` link. A request or booking label needs a link to `/contact/`. `directions` does not add a map. An enabled response expectation needs the publishable `response_time` sentence on `/contact/` and `/thank-you/`. Emergency phone treatment requires a publishable `emergency_service` claim. Financing markup requires a financing statement. Phrases in `avoid_positioning` must not appear. It does not require a sticky bar.

Fix those failures before the written review. The command is not part of `npm run verify`. CTA types are in [docs/client-data.md](../../../docs/client-data.md).

Then write one line for each of these. Do not prescribe one layout.

- The primary action is the easiest next step on the homepage and on a service page.
- The action matches the urgent or considered situation in `strategy.yaml`.
- On a phone, the primary action can be found without hunting. A sticky bar is optional.
- The form still uses only the locked fields.
- Proof the business can publish appears before the ask.
- Emergency language appears only when that claim is publishable.
- Financing and reviews appear only when their claims are publishable.
- `/thank-you/` says what happens next.

On this repository, the sample strategy is the input. Do not restyle Example Plumbing from this review.

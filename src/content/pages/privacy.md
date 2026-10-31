---
title: Privacy policy
seoTitle: Privacy policy for Example Plumbing
description: How the Example Plumbing sample site handles the name, phone, email, and job details you send with a visit request.
answer: The contact form collects your name, phone, email, area, service, preferred time, and an optional message. This sample site does not store that information unless CONTACT_WEBHOOK_URL is set.
---

This is a sample policy for a local service site. It is not legal advice. Have a qualified person review it before a real business publishes it.

## What the form collects

The contact form asks for your name, phone number, email address, ZIP code or area, the service you need, the time you prefer to be called, and an optional message. A hidden company field is there to catch automated submissions. Leave it blank.

## What happens to a request

If `CONTACT_WEBHOOK_URL` is not set, the site checks the form and sends you to the thank-you page. It does not save the request and it does not email it. If that address is set, the site forwards the fields as JSON to that address and then shows the thank-you page.

The thank-you page is marked so search engines do not index it.

## How else you can reach the company

You can call (555) 010-0199 instead of using the form. The number, address, and hours shown on this site come from `src/config/business.ts`.

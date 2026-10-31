# Contributing

Thanks for helping this boilerplate stay complete.

## Setup

Use Node.js 22.22.0 or newer. Run `npm install`, then `npm run verify`. A change is not ready until that command exits 0.

## Rules

- Put the business name, phone, address, hours, and service list in `src/config/business.ts` only. Pages read that module. Do not paste a second copy of the NAP into a layout.
- Keep the sample business synthetic. Example Plumbing, Example City, and (555) 010-0199 stay in the default branch. Do not add a real license number, review count, price, or a real person's name.
- Do not index `/thank-you/` or the 404 page. Privacy stays indexable.
- The contact form posts to `/api/contact/`. Do not change it to GET.
- Leave trust fields empty until a real business can prove them.
- Visual polish is a later pass. It does not remove the answer paragraph, the single H1, the form labels, or the schema.
- Third-party skills in `agent-skills/visual/` keep their upstream license and text. Put new project instructions in a new file rather than rewriting those skills.

## Pull requests

Describe what a new site would gain, and paste the summary line from `npm run verify`. Do not commit `dist/`, `node_modules/`, `.dev.vars`, or `evaluations/results/`.

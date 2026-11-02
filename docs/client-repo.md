# Where a client site lives

`local-site-boilerplate` is the product. Example Plumbing stays on its `main` branch. A real business gets its own repository. You tailor that repository.

The boilerplate is an engineering foundation, not a visual template. Agents start at [AGENTS.md](../AGENTS.md). What may change is in [change-policy.md](change-policy.md). The Example Plumbing design is scaffolding, not a design target. Principles are in [principles.md](principles.md).

The client repository is a full copy of one release tag. It contains the pages, the checks, the form, and the skills from that tag. `upstream` points back at this boilerplate so a later tag can be merged. The client repository is not a submodule, and it does not import this repo as a package.

## Start the client repo

Create an empty Git repository for the business. Do not add a README or a license there. Then:

```bash
git clone --branch v1.2.0 https://github.com/thatguynef/local-site-boilerplate.git client-site
cd client-site
git checkout -b main
git remote rename origin upstream
git remote add origin git@github.com:OWNER/client-site.git
npm install
git push -u origin main
```

`v1.2.0` is the current release tag. Clone a tag. Do not clone `main`.

`upstream` is this boilerplate. `origin` is the client's repository. Day-to-day commits go to `origin`.

Requires Node.js 22.22.0 or newer. The site deploys to Cloudflare Workers, not Cloudflare Pages.

Accept the fact sheet before this step. For a business that already has a site, follow [existing-site.md](existing-site.md). For a business with no site, follow [new-site.md](new-site.md).

## Client state files

After the repo exists, copy `client/*.example.yaml` to the same names without `.example`. `facts.yaml` holds accepted facts and claim provenance. `strategy.yaml`, `site-spec.yaml`, `page-briefs.yaml`, and `build-state.yaml` hold the decisions that follow. Run `npm run validate:client`. Do not put secrets in those files. Write a page brief before writing a service or city page.

Then run `npm run client:generate` and `npm run scaffold`. Generate writes `src/config/business.ts` from the YAML. Scaffold creates missing build-now stubs and does not invent trust claims. See [client-data.md](client-data.md). Do not hand-edit `business.ts` after generating it.

## What you change there

After the page plan says which rows to build, edit the client repo:

- `src/config/business.ts` holds the name, phone, address, hours, services, and cities from accepted rows. Leave a trust field empty when you cannot prove it.
- `src/content/pages/`, `src/content/services/`, and `src/content/service-areas/` hold the build-now pages. Delete the sample service and city files once the real ones exist.
- `astro.config.mjs` holds the public `https://` origin.
- `wrangler.jsonc` gets a unique Worker `name`. Leave `compatibility_date` at `2026-10-30` unless a newer Wrangler accepts a later date.
- `public/site.webmanifest`, the share image, and the icons change when you have the real name and a mark the client owns.
- `docs/fact-sheet.md` stores the accepted sheet. An existing site also keeps `docs/url-map.md`.
- Visual work starts after `npm run verify` exits 0. Use `agent-skills/visual/personalize-client-site/SKILL.md` and [change-policy.md](change-policy.md). Composition, type, color, and imagery may depart from Example Plumbing. Routes, the form, NAP, and schema contracts stay.

`npm run verify` must exit 0 on the client's name, trade, city, and primary service before that visual pass and again before launch.

Paste a `G-…` or `GTM-…` id only when the client already has one. This setup does not create a Google Analytics property or a Search Console account.

## What you leave alone

Leave the routes, the contact form field names, and the check scripts as they are. Leave Example Plumbing on `local-site-boilerplate` `main`. This build does not add a blog, a financing calculator, or a membership portal.

## Take a later boilerplate release

When you want the fixes from a newer tag:

```bash
git fetch upstream tag v1.3.0
git merge v1.3.0
```

Use the real tag name. Merge a tag. Do not merge `upstream/main`. Keep the client's pages and `src/config/business.ts` when the merge overlaps them. Run `npm run verify` after the merge.

Keep `.git`. That history is how the next tag merges.

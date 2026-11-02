# Upgrade a client repository

A client repository merges a release tag from this boilerplate. It does not merge `upstream/main`. Day-to-day commits stay on the client `origin`. The remote setup is in [client-repo.md](client-repo.md).

## Categories

PATCH is a bug fix, a schema correction, or a verification improvement.

MINOR is an optional capability, a layout primitive, or an evaluation. Existing client YAML still validates.

MAJOR is a route change, a client schema change, or a form contract change. Read the changelog before merging.

## Merge a tag

```bash
git fetch upstream tag vX.Y.Z
git merge vX.Y.Z
npm install
npm run validate:client
npm run verify
npm run doctor
```

Use the real tag. `v2.0.0` is the current release. Clone that tag for a new client repository. Do not clone `main`.

## From 1.x

`2.0.0` is a major release because the client data workflow changed. Routes, the form contract, and `compatibility_date` `2026-10-30` did not change.

A 1.x site stored facts by hand in `src/config/business.ts`. In 2.0.0 the source is `client/*.yaml`. `npm run client:generate` writes `business.ts`. Do not keep hand-editing that file after the merge.

```bash
git fetch upstream tag v2.0.0
git merge v2.0.0
npm install
```

Then, in the client repository:

1. Copy `client/facts.example.yaml`, `client/strategy.example.yaml`, and `client/site-spec.example.yaml` to the same names without `.example`.
2. Fill `facts.yaml` from the existing `business.ts`. Copy only claims the old file already showed. Leave a trust field empty when it was empty. Do not invent a license, a review count, a price, or a person's name.
3. Fill `site-spec.yaml` from the pages that already exist. Mark a service or city `build_now` only when its markdown file is already in the repo.
4. Do not copy `page-briefs.example.yaml` or `build-state.example.yaml`. Those files describe Example Plumbing. Write briefs for this business before you expect the brief check to pass. Let `npm run scaffold` create `build-state.yaml` only when you want that file and you have read the deletion rule below.
5. Run `npm run validate:client`, then `npm run client:generate`. Generate rewrites `business.ts` and keeps the page copy.
6. Run `npm run verify`.

`npm run scaffold` does not overwrite a page that already exists. It deletes `drain-cleaning.md` or `example-city.md` only when the business is no longer Example Plumbing, the spec does not keep that slug, and the file still contains sample markers. Skip scaffold on a migration until those two files are either rewritten or listed in the spec.

Content, visual uniqueness, deploy, and one production lead stay manual after the foundation is in place. What each command proves is in [quality-gates.md](quality-gates.md).

## Files that usually conflict

Keep the client copy of:

- `client/*.yaml`
- `src/content/`
- `DESIGN.md`
- `src/styles/global.css`
- components the client replaced

`src/config/business.ts` should match the generator. After a schema change, run `npm run client:generate` instead of hand-editing the conflict.

Take the upstream copy of `scripts/checks/`, `evaluations/`, and `src/pages/api/contact.ts` unless the changelog says the form contract changed.

Do not merge `upstream/main`.

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

Use the real tag. `v1.2.0` is the current release. Clone that tag for a new client repository. Do not clone `main`.

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

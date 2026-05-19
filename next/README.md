# Revue de presse — Next.js 15 app

A Next.js 15 (App Router) port of the Nuxt 3 app at `../nuxt/`. Both apps
coexist and share the same design-system output.

## Prerequisites

[pnpm](https://pnpm.io/) on PATH (the Makefile delegates installs to it).
Node version pinned in `.nvmrc`.

## Running

```bash
make install   # delegates to `pnpm install`
make dev       # http://localhost:3000
```

`make help` lists every target.

## Env vars

| Next key            | Nuxt equivalent          | Purpose                                                         |
| ------------------- | ------------------------ | --------------------------------------------------------------- |
| `API_BASE_URL`      | `NUXT_API_BASE_URL`      | Upstream highlights API host                                    |
| `API_CLIENT_SECRET` | `NUXT_API_CLIENT_SECRET` | Long-lived shared secret used to mint Bearer tokens server-side |

Both are server-only (no `NEXT_PUBLIC_` prefix). The browser hits
`/api/highlights`, which proxies upstream with a server-minted Bearer.
Copy `.env.example` to `.env` and fill in values for local dev.

## Public assets

Copied from `../nuxt/public/`. The two diverge over time; do not symlink.

## Trusted Web Activity (Android)

Same Bubblewrap workflow as the Nuxt app — `twa-manifest.json.dist` +
`scripts/twa.sh` produce the Android project; the real `twa-manifest.json`
and keystore live outside git (see `.gitignore`).

```bash
make install-bubblewrap   # npm i -g @bubblewrap/cli (one-time)
make update-twa           # regenerate the Android project
make build-twa            # compile + sign the APK
                          # (set BUBBLEWRAP_KEYSTORE_PASSWORD + BUBBLEWRAP_KEY_PASSWORD)
```

## Deploy

No CI deploy is wired for this app yet (Nuxt is the production target;
see `../nuxt/README.md`). `make build` verifies the `.well-known` assets
are present in `public/` so they're served correctly when a deploy target
is added.

# Revue de presse — Nuxt 3 app

A minimal Nuxt 3 application that mounts the
`@revue-de-presse/design-system` Vue components directly from
`../design-system/output/vue/src` (no publish step — the design system
regenerates them via `pnpm --filter design-system build:mitosis`).

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

| Key                      | Purpose                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| `NUXT_API_BASE_URL`      | Upstream highlights API host                                                |
| `NUXT_API_CLIENT_SECRET` | Long-lived shared secret used to mint short-lived Bearer tokens server-side |

Both are server-only — the secret never reaches the browser. Copy
`.env.example` to `.env` and fill in values for local dev.

## How it works

- `nuxt.config.ts` aliases `@design-system`, `@tokens`, and `@icons` at the
  emitted Vue tree, the foundation tokens, and the icon sprite.
- `plugins/sprite.client.ts` injects the SVG sprite into `<body>` on client
  mount so Mitosis-emitted `<use href="#name" />` references resolve.
- `composables/useSampleData.ts` provides a small fixture of sample posts and
  lists used by `app.vue`.
- `app.vue` mounts the `<App>` organism, switches `layout` between `mobile`
  and `desktop` based on a `matchMedia('(max-width: 600px)')` listener, and
  forwards date picks back into a local ref so the bottom-fixed dock and the
  in-sheet calendar stay in sync.

## What's wired

- AppHeader (logo + wordmark; the "Mon espace" + account icon are off by
  default).
- Sidebar on the left containing the calendar (action bar + month/year
  picker + day grid) and the dark `BannerAbout` outro.
- Publication list on the right (sample posts).
- Click any of `Privacy policy / Nous contacter / Nous soutenir / Sources des
  brèves` in the outro to swap the publication list for the corresponding
  page; "← Retour aux publications" returns home.
- Mobile (≤600 px viewport) flips to a single column with a fixed-bottom
  calendar dock; tapping the dock pill opens the calendar in sheet mode.

## Trusted Web Activity (Android)

`store_icon.png` (512×512) and `twa-manifest.json.dist` are the two
inputs Bubblewrap needs to regenerate the Android app. The real
`twa-manifest.json` lives outside git (see `.gitignore`).

```bash
make install-bubblewrap   # npm i -g @bubblewrap/cli (one-time)
make update-twa           # cp twa-manifest.json.dist → twa-manifest.json
                          # (if missing) and run `bubblewrap update`
make build-twa            # compile + sign the APK
                          # (set BUBBLEWRAP_KEYSTORE_PASSWORD + BUBBLEWRAP_KEY_PASSWORD)
```

`scripts/twa.sh` carries the `install_bubblewrap` / `update_twa` /
`build_twa` helpers invoked by the Makefile targets above.

## Deploying to Netlify

The root `netlify.toml` configures Netlify to build via `make build` and
publish from `nuxt/dist` (Nitro's `netlify` preset publish dir).

### One-off deploy from the CLI

```bash
npm i -g netlify-cli           # install once
netlify login                  # browser auth

cd nuxt
netlify init                   # → "Create & configure a new site" or "Link existing"

netlify deploy --build         # push a draft URL
netlify deploy --build --prod  # promote to production
```

`netlify deploy --build` runs the command from `netlify.toml`, then
uploads `nuxt/dist`. The first `netlify init` writes the site ID to
`nuxt/.netlify/state.json`; subsequent `netlify deploy` calls reuse it.

### Continuous deploys via GitHub

1. Push this repo to GitHub.
2. In the Netlify UI choose **Add new site → Import from Git**, pick
   the repo, and set the **Base directory** to `nuxt/`. Netlify reads the
   root `netlify.toml` automatically — leave the build command and publish
   directory blank.
3. Set the runtime env vars under **Site settings → Environment**:
   - `NUXT_API_BASE_URL=https://api.revue-de-presse.org`
   - `NUXT_API_CLIENT_SECRET=…`
4. Trigger the first build with **Deploys → Trigger deploy**. Every
   subsequent push to `main` (or the branch you select) auto-rebuilds.

### TWA digital-asset-link redirect

`netlify.toml` includes the `/.well-known/assetlinks.json` redirect.
Drop the asset-link JSON under `nuxt/public/well-known/assetlinks.json`;
Netlify rewrites `/.well-known/assetlinks.json` to it on the deployed site
so Android can verify the package signature.

## Glossary

**Design tokens** (referenced via the `@tokens` alias): the design
system's foundation values — colour palette, spacing scale, typography
— stored as CSS custom properties (`--color-brand`, `--separation-1`,
…). They live in `../design-system/src/tokens/`:

- `tokens.css` — the runtime form: one `:root { --color-brand: #006663; … }`
  block that components consume via `var(--color-brand)`.
- `tokens.json` — the same values in structured JSON for tooling
  (`scripts/sync-tokens.mjs` keeps the two in sync).

The Nuxt app wires them in two steps in `nuxt.config.ts`:

1. `'@tokens': fileURLToPath(new URL('../design-system/src/tokens', …))` —
   an import alias so anything in the app or in emitted design-system
   components can write `@tokens/tokens.css`.
2. `css: ['@tokens/tokens.css']` — pulls that file into the global
   stylesheet so every `var(--*)` lookup resolves on first paint.

Tokens are the single source of truth for the brand's look-and-feel,
sourced verbatim from the live site so the Vue / React / Svelte / etc.
ports render identically.

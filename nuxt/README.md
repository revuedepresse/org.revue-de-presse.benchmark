# Revue de presse — Nuxt 3 app

A minimal Nuxt 3 application that mounts the
`@revue-de-presse/design-system` Vue components directly from
`../design-system/output/vue/src` (no publish step needed — the design system
regenerates them via `pnpm --filter design-system build:mitosis`).

## Running

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

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
make install-bubblewrap   # one-time: npm i -g @bubblewrap/cli
make update-twa           # cp twa-manifest.json.dist → twa-manifest.json
                          # (if missing) and run `bubblewrap update`
```

`scripts/twa.sh` carries the same `install_bubblewrap` / `update_twa`
helpers ported from `legacy/fun.sh`.

## Deploying to Netlify

`netlify.toml` configures Netlify to build the static Nuxt output and
serve it from `.output/public`:

```toml
[build]
  publish = ".output/public"
  command = "pnpm build && pnpm exec nuxt generate"
```

### One-off deploy from the CLI

```bash
# Install once
npm i -g netlify-cli

# Authenticate the CLI (browser flow)
netlify login

# From nuxt/, link the local checkout to a Netlify site (creates one if
# none is selected)
cd nuxt
netlify init        # → "Create & configure a new site" or "Link existing"

# Build + push to a draft URL for review
netlify deploy --build

# Promote the latest draft to production
netlify deploy --build --prod
```

`netlify deploy --build` runs the command from `netlify.toml`, then
uploads `publish` (`.output/public`). The first `netlify init` writes
the chosen site ID to `nuxt/.netlify/state.json`; subsequent
`netlify deploy` calls reuse it.

### Continuous deploys via GitHub

1. Push this repo to GitHub.
2. In the Netlify UI choose **Add new site → Import from Git**, pick
   the repo, and set the **Base directory** to `nuxt/`. Netlify reads
   `nuxt/netlify.toml` automatically — leave the build command and
   publish directory blank.
3. Set the runtime env vars under **Site settings → Environment**:
   - `NUXT_API_BASE_URL=https://api.revue-de-presse.org` (your upstream
     highlights API host)
   - `NUXT_API_AUTH_TOKEN=…` (the upstream `x-auth-token`)
4. Trigger the first build with **Deploys → Trigger deploy**. Every
   subsequent push to `main` (or the branch you select) auto-rebuilds.

### TWA digital-asset-link redirect

`netlify.toml` includes the same `/.well-known/assetlinks.json`
redirect the legacy site uses. When you generate the asset-link JSON
for your TWA, drop it under `nuxt/public/well-known/assetlinks.json`;
Netlify rewrites `/.well-known/assetlinks.json` to it on the deployed
site so Android can verify the package signature.

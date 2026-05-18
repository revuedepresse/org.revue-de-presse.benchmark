# @revue-de-presse/e2e

Cross-app Playwright Test suite covering both `nuxt/` and `next/`. See
`docs/superpowers/specs/2026-05-18-playwright-e2e-design.md` for the design.

## One-time setup

```bash
cd e2e
pnpm install
pnpm install-browsers
```

`install-browsers` downloads ~140 MB of Chromium and system libs.

## Running

Build both apps first (the suite runs against production builds, not dev):

```bash
pnpm --filter @revue-de-presse/nuxt-app build
pnpm --filter @revue-de-presse/next-app build
```

Then from `e2e/`:

```bash
pnpm test                  # everything: functional + perf
pnpm test:functional       # functional only (~3-5 min)
pnpm test:perf             # perf only (~15-30 min)
pnpm test:ui               # Playwright UI mode — best for debugging
pnpm test:headed           # watch the browser
```

Filtering by project:

```bash
pnpm test --project='nuxt-*'        # Nuxt only
pnpm test --project='next-*'        # Next only
pnpm test --project='*-desktop-*'   # Desktop only
pnpm test --project='*-mobile-*'    # Mobile only
```

Seed override for calendar traversal:

```bash
E2E_SEED=99 pnpm test:functional
```

## Env vars

The mock intercepts `/api/highlights` in the browser before the apps reach
upstream, so no real credentials are needed. Both apps still require
`API_BASE_URL` and `API_CLIENT_SECRET` to be set at boot (Next refuses to
start without them). The Playwright `webServer` config sets these to
`http://unused.test` / `unused` automatically.

## Design-system dependency

The suite selects on `data-testid` attributes that live in the Mitosis
source. If those attributes go missing from the generated output, the
suite breaks. See `docs/superpowers/specs/2026-05-18-playwright-e2e-design.md`
§6.2 for the list.

## Reports

`reports/` (gitignored) holds per-run web-vitals and Lighthouse output
keyed by `{app, viewport, route}`. CI uploads these as workflow artifacts
on failure.

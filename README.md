# Revue de presse — benchmark

Open-source companion app for [Revue de presse](https://revue-de-presse.org).
A daily curated digest of the 10 French press publications most relayed on
Bluesky, packaged as:

- a framework-agnostic **design system** (Mitosis source → Vue, React,
  Svelte, Solid, Lit, Preact, Qwik, Stencil, Alpine, Angular)
- a **Nuxt 3 app** that consumes the Vue output and proxies the upstream
  Bluesky highlights API
- a **Trusted Web Activity (TWA)** wrapper that ships the Nuxt app on the
  Google Play Store via Bubblewrap

## Repository layout

```
design-system/   Mitosis source + 10 emitted framework targets + tests
nuxt/            Nuxt 3 app, TWA tooling, Netlify deploy config
next/            Next.js 15 (App Router) port — same UI, separate stack
e2e/             Playwright suite exercising both apps via a single webServer
social/bluesky/  daily Bluesky thread CLI (lead + 3 replies, top 3 publications)
social/linkedin/ daily LinkedIn auto-post CLI (top 10, organization page)
social/tiktok/   daily TikTok 9:16 scroll-capture publisher CLI
Makefile         top-level orchestration (delegates to per-workspace Makefiles)
LICENSE          GNU GPL v3.0
```

## Prerequisites

[pnpm](https://pnpm.io/) on PATH — the Makefiles delegate every install
to it. Node version is pinned per workspace in `<workspace>/.nvmrc`.

## Quick start

```bash
make install            # install nuxt + next + e2e deps via pnpm
make nuxt-dev           # http://localhost:3000  (or `make next-dev`)
```

`make help` (run from the repo root or any workspace) lists every target.
Before `make nuxt-dev` / `make next-dev`, copy each app's `.env.example`
to `.env` and fill in `*_API_BASE_URL` + `*_API_CLIENT_SECRET`.

The design system has no Makefile yet — invoke `pnpm` directly:

```bash
cd design-system
pnpm install
pnpm build:mitosis      # regenerate the 10 framework outputs
pnpm test               # 363 unit tests (Vitest)
```

The Nuxt and Next apps read the design system's pre-emitted Vue/React
components directly from `../design-system/output/<framework>/src` (no
publish step).

## Testing

Unit tests live next to each app; the e2e suite (Playwright) lives in
`e2e/` and exercises both apps simultaneously via a `webServer` config.

```bash
make test                  # nuxt unit + next unit + full e2e

# First e2e run needs Playwright's Chromium installed:
make e2e-install-browsers  # one-time; pulls chromium + system deps
make e2e-test-functional   # functional specs against nuxt + next
make e2e-test-perf         # lighthouse + web-vitals projects
make e2e-show-report       # open the last HTML report in a browser
```

CI (`.github/workflows/test.yml`) runs the unit, functional, and perf
suites on every push.

## Deploy

The Nuxt app deploys to Netlify with the Nitro `netlify` preset; the
publish directory is `nuxt/dist` (Nitro's actual public output for that
preset). See `nuxt/README.md` for the full Netlify + TWA workflow. The
Next app has no deploy target wired yet — see `next/README.md`.

## Social publishers

Three daily auto-posters consume the same upstream highlights API and
publish them to social platforms. The LinkedIn and TikTok publishers
run on a GitHub Actions schedule and rotate their long-lived OAuth
refresh token back into a repository secret via `gh secret set` after
each run; the Bluesky publisher runs from a cron entry on the
production server (file-based session, rotated in place by
`@atproto/oauth-client-node`).

### Bluesky (`social/bluesky/`)

Posts a 4-post thread (lead + 3 replies, one per outlet) of the
previous day's top-3 most-relayed publications to
[`@revue-de-presse.org`](https://bsky.app/profile/revue-de-presse.org)
via the atproto API with OAuth 2.1 + DPoP + PKCE. Each reply mentions
the outlet's verified Bluesky handle when resolvable. Two safety gates
(per-day check via `getAuthorFeed`, content check via local state file)
prevent duplicate posts. See `social/bluesky/README.md` for the
bootstrap procedure (interactive + headless production variants), exit
codes, env-mode workflow, and the `BLUESKY_ROTATED_STATE_FILE`
mechanism for CI deployments.

### LinkedIn (`social/linkedin/`)

Posts the previous day's top-10 as a text update to the
[Revue de Presse organization page](https://www.linkedin.com/company/75720423/).
The CLI calls the versioned LinkedIn REST API (`/rest/posts`). It runs
from a daily cron on the production server (see `social/linkedin/README.md`
for the crontab entry, local bootstrap, the required credentials
(`LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `API_CLIENT_SECRET`), and
the annual re-auth procedure).

### TikTok (`social/tiktok/`)

Renders a 9:16 scroll capture of the day's top-10 publications with
Playwright + ffmpeg and posts it to
[`@revue_2_presse`](https://www.tiktok.com/@revue_2_presse) via the
Content Posting API. CI runs via `.github/workflows/tiktok-publish.yml`.
See `social/tiktok/README.md` for the auth bootstrap, `inbox` vs `direct`
publish modes, exit-code reference, and operational runbook.

## Contributing

Issues and pull requests welcome on GitHub. Run `make test` (or at least
`pnpm test` inside `design-system/`) before sending changes.

## License

[GNU General Public License v3.0](LICENSE) — same license the legacy
Revue de presse site has used since 2019.

## Third-party licenses

This repository redistributes the following third-party assets:

- **Roboto** (`*/public/fonts/roboto-regular.woff2`) — © Google, licensed
  under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
- **Signika** (`*/public/fonts/signika-regular.woff2`) — © Anna Giedryś,
  licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/).
  "Signika" is a Reserved Font Name under the OFL; modified versions must
  not use that name.
- **Bluesky butterfly logo** (`design-system/assets/bluesky-logo.png`) —
  trademark of Bluesky Social PBC, displayed unmodified as nominative
  attribution for the upstream data source. This project is not
  affiliated with or endorsed by Bluesky Social PBC.

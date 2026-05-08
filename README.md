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
LICENSE          GNU GPL v3.0 (matches the legacy site's license)
```

`legacy/`, `tmp/`, and `docs/` are gitignored — `legacy/` is a private
checkout of the previous Nuxt 2 site kept for reference only.

## Quick start

```bash
# Design system
cd design-system
pnpm install
pnpm build:mitosis      # regenerate the 10 framework outputs
pnpm test               # 363 unit tests (Vitest)

# Nuxt 3 app
cd ../nuxt
pnpm install
cp .env.example .env    # set NUXT_API_BASE_URL + NUXT_API_AUTH_TOKEN
pnpm dev                # http://localhost:3000
```

The Nuxt app reads the design system's pre-emitted Vue components
directly from `../design-system/output/vue/src` (no publish step).

## Deploy

The Nuxt app deploys to Netlify with the Nitro `netlify` preset; the
publish directory is `nuxt/dist` (Nitro's actual public output for that
preset). See `nuxt/README.md` for the full Netlify + TWA workflow.

## Contributing

Issues and pull requests welcome on GitHub. Please run `pnpm test` in
the `design-system/` workspace before sending changes there; the Nuxt
side has no automated tests yet.

## License

[GNU General Public License v3.0](LICENSE) — same license the legacy
Revue de presse site has used since 2019.

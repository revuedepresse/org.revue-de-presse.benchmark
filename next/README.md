# @revue-de-presse/next-app

Next.js 15 (App Router) port of the Nuxt 3 app at `../nuxt/`. Both apps coexist; see (internal design notes).

## Env vars (renamed from Nuxt)

| Nuxt key            | Next key            |
| ------------------- | ------------------- |
| NUXT_API_BASE_URL   | API_BASE_URL        |
| NUXT_API_CLIENT_SECRET | API_CLIENT_SECRET |

Both are server-only (no NEXT_PUBLIC_ prefix). The browser hits `/api/highlights`, which proxies upstream with a server-minted Bearer.

## Scripts

- `pnpm dev` — dev server on :3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm test` — Vitest watch mode
- `pnpm test:run` — Vitest single run (CI)
- `pnpm lint` — `next lint`

## Public assets

Copied from `../nuxt/public/`. The two diverge over time; do not symlink.

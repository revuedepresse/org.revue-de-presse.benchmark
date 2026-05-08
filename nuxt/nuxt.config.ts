import { fileURLToPath } from 'node:url';

// The design-system ships pre-emitted Vue SFCs in
// ../design-system/output/vue/src — we alias straight at that tree so any
// regen of the design system flows into this app without a publish step.
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: true,

  // Server-only secrets. NUXT_API_BASE_URL + NUXT_API_AUTH_TOKEN come from
  // .env (see .env.example) and stay on Nitro — the browser only ever talks
  // to /api/highlights, which the proxy resolves with the auth-token attached.
  runtimeConfig: {
    apiBaseUrl: '',
    apiAuthToken: '',
  },

  // Nuxt 3.21 + Vite 7 + pnpm sometimes fails to register the `#app-manifest`
  // virtual when pnpm doesn't hoist Nuxt's runtime under the project's
  // `node_modules/`. Disabling the manifest skips that virtual entirely.
  experimental: {
    appManifest: false,
  },

  alias: {
    '@design-system': fileURLToPath(new URL('../design-system/output/vue/src', import.meta.url)),
    '@tokens': fileURLToPath(new URL('../design-system/src/tokens', import.meta.url)),
    '@icons': fileURLToPath(new URL('../design-system/src/icons', import.meta.url)),
  },

  css: ['@tokens/tokens.css'],

  vite: {
    server: {
      fs: {
        // Allow Vite to serve files from the parent design-system folder.
        allow: [
          fileURLToPath(new URL('..', import.meta.url)),
        ],
      },
    },
  },

  app: {
    head: {
      title: 'Revue de presse',
      htmlAttrs: { lang: 'fr-FR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Revue de presse — actualités relayées sur Bluesky.' },
      ],
    },
  },
});

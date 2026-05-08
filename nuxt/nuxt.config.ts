import { fileURLToPath } from 'node:url';

const baseURL = 'https://revue-de-presse.org';
const description =
  'Chaque jour, une revue de presse des 10 publications des médias les plus marquantes';
const title = 'Revue de presse - revue-de-presse.org';
const banner = `${baseURL}/revue-de-presse-banner.jpg`;
const icon = '/logo-revue-de-presse.png';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: true,

  runtimeConfig: {
    apiBaseUrl: '',
    apiAuthToken: '',
  },

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
        allow: [fileURLToPath(new URL('..', import.meta.url))],
      },
    },
  },

  router: {
    options: {
      strict: true,
    },
  },

  app: {
    head: {
      title,
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'author', content: '@revue_2_presse' },
        { name: 'theme-color', content: '#006663' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: baseURL },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: banner },
        { property: 'og:site_name', content: title },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@revue_2_presse' },
        { name: 'twitter:creator', content: '@revue_2_presse' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: banner },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: title },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: title },
        { name: 'msapplication-TileColor', content: '#006663' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-revue-de-presse.svg' },
        { rel: 'icon', type: 'image/png', href: icon },
        { rel: 'shortcut icon', href: icon },
        { rel: 'apple-touch-icon', href: '/revue-de-presse_512x512_006663.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        {
          rel: 'preload',
          href: '/fonts/signika-regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/roboto-regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
      noscript: [
        {
          children:
            'Revue de presse nécessite JavaScript pour son bon fonctionnement.',
        },
      ],
    },
  },
});

// Injects the JS-disabled fallback banner as a direct child of <body>.
//
// Going through `app.head.noscript` lands the content in <head>, where the
// inner <div> banner is invalid HTML and gets dropped by the parser. The
// `render:html` hook is the canonical place to append raw body markup —
// Nuxt's config-level `nitro.hooks` doesn't reliably register for this hook,
// so we register from a Nitro server plugin.

import { defineNitroPlugin } from 'nitropack/runtime/plugin';

const NOSCRIPT_BANNER_HTML = `<noscript>
  <style>
    body > *:not(noscript) { display: none !important; }
    .rdp-noscript-banner {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      margin: 0; padding: 24px;
      background: #006663; color: #fff;
      font: 16px/1.5 'Roboto', system-ui, -apple-system, sans-serif;
      text-align: center;
    }
    .rdp-noscript-banner-inner { max-width: 560px; }
    .rdp-noscript-banner h1 {
      margin: 0 0 12px;
      font: 600 1.5rem/1.3 'Signika', system-ui, sans-serif;
    }
    .rdp-noscript-banner p { margin: 0; opacity: 0.92; }
  </style>
  <div class="rdp-noscript-banner" role="alert" aria-live="polite">
    <div class="rdp-noscript-banner-inner">
      <h1>JavaScript requis</h1>
      <p>Revue de presse nécessite JavaScript pour son bon fonctionnement.</p>
    </div>
  </div>
</noscript>`;

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyAppend.push(NOSCRIPT_BANNER_HTML);
  });
});

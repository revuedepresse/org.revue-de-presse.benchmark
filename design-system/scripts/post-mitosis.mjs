#!/usr/bin/env node
// After `mitosis build`:
//  1. Copy shared modules (utils, locales, types) into each output/<target>/src/
//     so the emitted components can resolve relative imports like `../utils/i18n`.
//  2. Patch the Svelte emit: Mitosis 0.13's Svelte adapter drops inline `<style>`
//     content and emits a malformed `{@html `<${'style'}  >${}<${'/style'}>`}`
//     that fails to compile. We strip that block so Svelte compiles cleanly.
//     The per-component CSS rules are lost on Svelte until upstream fix —
//     foundation tokens still apply via the shared tokens.css.
//
// Known limitation (not patched here): Mitosis 0.13's Lit adapter strips
// `class="..."` from inner elements and emits invalid `class={template-literal}`
// on the outermost element. The CSS rules in the `<style>` block are correct,
// but the HTML elements lack the classes the rules target — so a Lit consumer
// renders DiscuterPage (and most other components) unstyled. Nuxt consumes the
// Vue target, so production is unaffected; the Lit emit is kept in TARGETS for
// parity testing only.
// Idempotent.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outputDir = join(root, 'output');

if (!existsSync(outputDir)) {
  console.log('post-mitosis: no output/ dir yet; skipping.');
  process.exit(0);
}

const targets = readdirSync(outputDir).filter((entry) => {
  const full = join(outputDir, entry);
  return statSync(full).isDirectory();
});

const SHARED = [
  ['src/utils', 'src/utils'],
  ['src/locales', 'src/locales'],
  ['src/types.ts', 'src/types.ts'],
];

for (const target of targets) {
  for (const [source, dest] of SHARED) {
    const from = join(root, source);
    const to = join(outputDir, target, dest);
    if (!existsSync(from)) continue;
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to, { recursive: true });
  }
  console.log(`post-mitosis: ${target} hydrated with utils/locales/types`);
}

// Patch Vue's inline-style emit so SSR hydration matches the client.
// Mitosis 0.13 emits `<component :is="'style'">{{ `...CSS...` }}</component>`,
// which routes the CSS through Vue's text interpolation. That HTML-escapes
// any special character in the CSS (`>` -> `&gt;`, `"` -> `&quot;`, `'` ->
// `&#39;`, `&` -> `&amp;`) on the server but not on the client, producing
// "Hydration text mismatch" warnings in every browser console. Rewriting the
// node to `<component :is="'style'" v-html="`...CSS...`"></component>`
// makes Vue emit the CSS raw on both sides (innerHTML, not escaped text).
//
// The substitution is anchored on the exact Mitosis emit shape; if Mitosis
// changes its template for `<style>` in a future release, this will silently
// no-op and the count below will go to zero — at which point delete the block.
const vueComponentsDir = join(outputDir, 'vue', 'src', 'components');
if (existsSync(vueComponentsDir)) {
  const STYLE_INTERP_RE = /<component :is="'style'">\{\{\s*\n?([\s\S]*?)\n?\s*\}\}<\/component>/g;
  let patched = 0;
  for (const file of readdirSync(vueComponentsDir).filter((f) => f.endsWith('.vue'))) {
    const path = join(vueComponentsDir, file);
    const original = readFileSync(path, 'utf8');
    let touched = false;
    const next = original.replace(STYLE_INTERP_RE, (_, body) => {
      touched = true;
      // The body is a JS expression that evaluates to the CSS string — usually
      // a template literal. Quote-escape it for the attribute value.
      const expr = body.trim().replace(/"/g, '&quot;');
      return `<component :is="'style'" v-html="${expr}"></component>`;
    });
    if (touched) {
      writeFileSync(path, next);
      patched++;
    }
  }
  if (patched > 0) console.log(`post-mitosis: rewrote ${patched} Vue style block(s) to v-html (fixes SSR hydration)`);
}

// Patch Svelte's broken inline-style emit.
const svelteComponentsDir = join(outputDir, 'svelte', 'src', 'components');
if (existsSync(svelteComponentsDir)) {
  const BROKEN_STYLE_RE = /\{@html\s+`<\$\{'style'\}\s*>\$\{\}<\$\{'\/style'\}>`\}/g;
  let patched = 0;
  for (const file of readdirSync(svelteComponentsDir).filter((f) => f.endsWith('.svelte'))) {
    const path = join(svelteComponentsDir, file);
    const original = readFileSync(path, 'utf8');
    if (BROKEN_STYLE_RE.test(original)) {
      writeFileSync(path, original.replace(BROKEN_STYLE_RE, ''));
      patched++;
    }
  }
  if (patched > 0) console.log(`post-mitosis: stripped broken @html style block from ${patched} svelte component(s)`);
}

// Extract per-component CSS from .lite.tsx sources into a single shared
// stylesheet. Svelte's emit drops inline styles (see above); other targets
// inline them as expected. To keep cosmetic parity across targets we publish
// one components.css that any demo can import alongside tokens.css.
const srcComponentsDir = join(root, 'src', 'components');
const styleBlockRe = /<style>\{`([\s\S]*?)`\}<\/style>/g;
const cssChunks = [];
for (const file of readdirSync(srcComponentsDir).filter((f) => f.endsWith('.lite.tsx'))) {
  const source = readFileSync(join(srcComponentsDir, file), 'utf8');
  const componentName = file.replace(/\.lite\.tsx$/, '');
  let match;
  while ((match = styleBlockRe.exec(source)) !== null) {
    cssChunks.push(`/* ${componentName} */\n${match[1].trim()}`);
  }
}
if (cssChunks.length > 0) {
  const banner = '/* Auto-generated by post-mitosis.mjs from src/components/*.lite.tsx — do not edit. */\n\n';
  writeFileSync(join(outputDir, 'components.css'), banner + cssChunks.join('\n\n') + '\n');
  console.log(`post-mitosis: wrote output/components.css with ${cssChunks.length} component block(s)`);
}

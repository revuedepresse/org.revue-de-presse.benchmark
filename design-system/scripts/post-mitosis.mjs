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

// Inline `<template v-if="…">{{ expr }}</template>` blocks emitted across
// multiple lines so Vue's `whitespace: 'condense'` mode doesn't insert a
// leading/trailing space inside the text segment. Without this, a paragraph
// like "(mediapart.fr)" renders as "( @mediapart.fr )" because the text
// segments holding "(" and ")" each get padded with a space.
//
// Pattern is narrow on purpose — only touches templates whose body is a
// single `{{ … }}` expression with nothing else between the tags.
if (existsSync(join(outputDir, 'vue', 'src', 'components'))) {
  const dir = join(outputDir, 'vue', 'src', 'components');
  const INLINE_INTERP_RE = /(<template\s+[^>]*>)\s*\n\s*(\{\{[^}]+\}\})\s*\n\s*(<\/template>)/g;
  let patched = 0;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.vue'))) {
    const path = join(dir, file);
    const original = readFileSync(path, 'utf8');
    const next = original.replace(INLINE_INTERP_RE, '$1$2$3');
    if (next !== original) {
      writeFileSync(path, next);
      patched++;
    }
  }
  if (patched > 0) console.log(`post-mitosis: inlined single-interpolation <template> in ${patched} Vue file(s) (avoids whitespace padding)`);
}

// Strip Vue's inline-style emit. Mitosis 0.13 emits
//   <component :is="'style'">{{ `...CSS...` }}</component>
// which routes the CSS through Vue's text-interpolation. SSR HTML-escapes
// any of >, ", ', & in the CSS but the client renders the raw template
// literal, producing a "Hydration text mismatch in <style>" warning per
// component on every page load. We can't rewrite to a real <style> tag
// (Vue's compiler rejects them in component templates with "Tags with
// side effect are ignored"), and v-html on the dynamic <component> wrapper
// does not bind innerHTML to the rendered style node.
//
// So instead: strip the wrappers entirely. The same per-component CSS is
// already collected into output/components.css further down, and the Nuxt
// app imports that file once. Zero hydration warnings, all CSS still applies.
const vueComponentsDir = join(outputDir, 'vue', 'src', 'components');
if (existsSync(vueComponentsDir)) {
  const STYLE_INTERP_RE = /<component :is="'style'">\{\{\s*\n?([\s\S]*?)\n?\s*\}\}<\/component>/g;
  let patched = 0;
  for (const file of readdirSync(vueComponentsDir).filter((f) => f.endsWith('.vue'))) {
    const path = join(vueComponentsDir, file);
    const original = readFileSync(path, 'utf8');
    if (STYLE_INTERP_RE.test(original)) {
      writeFileSync(path, original.replace(STYLE_INTERP_RE, ''));
      patched++;
    }
  }
  if (patched > 0) console.log(`post-mitosis: stripped ${patched} Vue inline-style block(s) (now served via shared output/components.css)`);
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

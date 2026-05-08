#!/usr/bin/env node
// Build src/icons/sprite.svg from the legacy SVG icons in
// ../org.revue-de-presse/assets/icons/. Renames .a/.b/.c/.d classes
// to .{iconName}-a/.{iconName}-b/etc. so symbols don't clobber each
// other's styles, then wraps each in <symbol id="..." viewBox="...">.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const designSystemRoot = join(__dirname, '..');
const legacyIconsDir = join(designSystemRoot, '..', '..', 'org.revue-de-presse', 'assets', 'icons');
const outFile = join(designSystemRoot, 'src', 'icons', 'sprite.svg');

const SCOPE_CHARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

function parseSvg(svgText, iconId) {
  // Extract viewBox; fall back to "0 0 width height" if missing.
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  let viewBox;
  if (viewBoxMatch) {
    viewBox = viewBoxMatch[1];
  } else {
    const w = svgText.match(/\swidth="(\d+)"/)?.[1];
    const h = svgText.match(/\sheight="(\d+)"/)?.[1];
    if (!w || !h) throw new Error(`no viewBox and no width/height in ${iconId}`);
    viewBox = `0 0 ${w} ${h}`;
  }

  // Strip Inkscape / dublin-core / RDF metadata that some icons carry.
  let cleaned = svgText
    .replace(/<\?xml[^?]*\?>/g, '')
    .replace(/<metadata\b[\s\S]*?<\/metadata>/g, '')
    .replace(/<sodipodi:namedview\b[\s\S]*?\/>/g, '')
    .replace(/<sodipodi:namedview\b[\s\S]*?<\/sodipodi:namedview>/g, '')
    .replace(/\s+(inkscape|sodipodi|rdf|dc|cc):[\w-]+="[^"]*"/g, '')
    .replace(/\s+id="(metadata|namedview|defs|style|rect|path|svg|g|circle)\d+"/g, '')
    .replace(/\s+xmlns:(svg|sodipodi|inkscape|dc|cc|rdf)="[^"]*"/g, '');

  // Extract <defs>...</defs> if present (now possibly empty after metadata strip).
  const defsMatch = cleaned.match(/<defs[^>]*>[\s\S]*?<\/defs>/);
  let defs = defsMatch ? defsMatch[0] : '';
  // Drop self-closing defs/empty defs.
  if (defs.replace(/<defs[^>]*>|<\/defs>|\s+/g, '').length === 0) defs = '';

  // Extract everything between (after) <svg ...> and </svg>
  let body = cleaned.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  if (defsMatch) {
    body = body.replace(defsMatch[0], '');
  }
  body = body.replace(/^\s+|\s+$/g, '').replace(/>\s+</g, '><');

  // Rename `.a`/`.b`/... → `.{iconId}-a`/`-b`/... in BOTH defs style content AND body class refs.
  for (const ch of SCOPE_CHARS) {
    const styleClassRe = new RegExp(`\\.${ch}\\b`, 'g');
    const classAttrRe = new RegExp(`\\bclass="${ch}"`, 'g');
    defs = defs.replace(styleClassRe, `.${iconId}-${ch}`);
    body = body.replace(classAttrRe, `class="${iconId}-${ch}"`);
  }

  // Nav-arrow icons in the legacy library hardcode the chevron path fill to
  // black/none. Inject `fill="currentColor"` on un-classed paths so consumers
  // can recolour the chevron via the CSS `color` property. Circle backgrounds
  // (carrying a class) are left at their original colour.
  const RECOLOURABLE_CHEVRON = new Set([
    'previous-item',
    'next-item',
    'previous-day',
    'next-day',
    'pick-day',
    'pick-item',
    'pick-list',
  ]);
  if (RECOLOURABLE_CHEVRON.has(iconId)) {
    body = body.replace(/<path\b(?![^>]*\bfill=)/g, '<path fill="currentColor"');
  }

  // Vanity-metric icons (retweet glyph + like-metric heart). The legacy SVGs
  // ship a hard white circle background plus a black/styled glyph; in the
  // app we render them inside a tinted container, so the inner white circle
  // would obscure the tint. Strip those classed circles, then make the
  // active path follow `currentColor` and bump its stroke for legibility.
  const VANITY_METRIC = new Set([
    'retweet',
    'like-metric',
    'like-clicked',
    'like-intent',
    'reply',
    'share',
    'sharing',
  ]);
  if (VANITY_METRIC.has(iconId)) {
    // 1. Knock the inner white circle group out of the body so the parent
    //    container colour shows through unobstructed.
    body = body.replace(/<g[^>]*class="[^"]*"[^>]*>(?:<circle[^/]*\/?>(?:<\/circle>)?)+<\/g>/g, '');
    // 2. Drop classed strokes/fills so they don't override our CSS hooks.
    defs = defs.replace(/fill\s*:\s*#fff(?:fff)?/gi, 'fill:none');
    defs = defs.replace(/stroke\s*:\s*#fff(?:fff)?/gi, 'stroke:none');
    defs = defs.replace(/stroke\s*:\s*rgba\(0,0,0,0\)/gi, 'stroke:currentColor');
    // 3. Inject currentColor on the un-classed glyph path.
    body = body.replace(/<path\b(?![^>]*\bfill=)/g, '<path fill="currentColor"');
    // 4. Add a stroke-width hook on every path so CSS can crank up the
    //    glyph weight (`stroke-width: var(--rdp-icon-weight)` etc).
    body = body.replace(
      /<path\b/g,
      '<path stroke="currentColor" stroke-width="0.4"',
    );
  }

  return { viewBox, defs, body };
}

function nameFromFile(filename) {
  return basename(filename, '.svg').replace(/^icon-/, '');
}

const files = readdirSync(legacyIconsDir)
  .filter((f) => f.endsWith('.svg'))
  // Skip the standalone logo file — we already ship assets/logo.svg shipped via Logo.lite.tsx.
  .filter((f) => f !== 'logo-revue-de-presse.svg')
  .sort();

const symbols = files.map((f) => {
  const id = nameFromFile(f);
  const text = readFileSync(join(legacyIconsDir, f), 'utf8');
  const { viewBox, defs, body } = parseSvg(text, id);
  return `  <symbol id="${id}" viewBox="${viewBox}">${defs}${body.trim()}</symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
${symbols.join('\n')}
</svg>
`;

writeFileSync(outFile, sprite);
console.log(`Wrote ${files.length} legacy icons to ${outFile}`);
console.log(`IDs: ${files.map(nameFromFile).join(', ')}`);

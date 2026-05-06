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

#!/usr/bin/env node
// Compares src/tokens/tokens.css and src/tokens/tokens.json.
// --check (default): exits non-zero on drift.
// --write: regenerates tokens.json from tokens.css.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, '../src/tokens/tokens.css');
const jsonPath = join(__dirname, '../src/tokens/tokens.json');
const args = new Set(process.argv.slice(2));

function parseCssVars(css) {
  const out = {};
  const re = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim;
  for (const m of css.matchAll(re)) out[m[1]] = m[2].trim();
  return out;
}

function flatten(obj, prefix = '--') {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (typeof v === 'string') return { ...acc, [`${prefix}${k}`]: v };
    return { ...acc, ...flatten(v, `${prefix}${k}-`) };
  }, {});
}

const css = readFileSync(cssPath, 'utf8');
const cssVars = parseCssVars(css);

if (args.has('--write')) {
  // Naive nesting: flat tokens are grouped by their first dash-segment.
  // The hand-maintained tokens.json structure is preferred — this --write mode
  // is a fallback for someone who prefers regenerating from CSS.
  console.error('--write mode: falling back to overwriting tokens.json with a flat tree under "tokens" key.');
  writeFileSync(jsonPath, JSON.stringify({ tokens: cssVars }, null, 2) + '\n');
  process.exit(0);
}

const json = JSON.parse(readFileSync(jsonPath, 'utf8'));
const jsonVars = flatten(json);

const cssKeys = new Set(Object.keys(cssVars));
const jsonKeys = new Set(Object.keys(jsonVars));
const missingInJson = [...cssKeys].filter((k) => !jsonKeys.has(k));
const missingInCss = [...jsonKeys].filter((k) => !cssKeys.has(k));
const valueDiffs = [...cssKeys].filter((k) => jsonKeys.has(k) && cssVars[k] !== jsonVars[k]);

if (missingInJson.length || missingInCss.length || valueDiffs.length) {
  if (missingInJson.length) console.error('Missing in tokens.json:', missingInJson);
  if (missingInCss.length) console.error('Missing in tokens.css:', missingInCss);
  if (valueDiffs.length)
    console.error(
      'Value drift:',
      valueDiffs.map((k) => ({ k, css: cssVars[k], json: jsonVars[k] }))
    );
  process.exit(1);
}
console.log(`tokens.css ↔ tokens.json: ${cssKeys.size} tokens, in sync`);

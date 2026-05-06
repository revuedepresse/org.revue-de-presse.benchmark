#!/usr/bin/env node
// After `mitosis build`, copy shared modules (utils, locales, types) into each
// output/<target>/src/ so the emitted components can resolve relative imports
// like `../utils/i18n`. Idempotent.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
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

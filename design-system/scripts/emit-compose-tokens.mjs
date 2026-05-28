// design-system/scripts/emit-compose-tokens.mjs
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const HERE = dirname(fileURLToPath(import.meta.url));

function kebabToPascal(s) {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function colorLiteral(hex) {
  // "#fff" → "0xFFFFFFFF", "#006663" → "0xFF006663"
  let h = hex.replace('#', '').toLowerCase();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) throw new Error(`unexpected color literal: ${hex}`);
  return `0xFF${h.toUpperCase()}`;
}

function pxValue(v) {
  const m = v.match(/^(\d+(?:\.\d+)?)px$/);
  if (!m) throw new Error(`expected Npx, got ${v}`);
  return m[1];
}

function renameColorKey(k) {
  // border-color → Border (drop trailing -color)
  return kebabToPascal(k.replace(/-color$/, ''));
}

export function generate(tokens) {
  const lines = [];
  lines.push(`// AUTO-GENERATED from design-system/research/live-tokens.json`);
  lines.push(`// captured: ${tokens.captured} — DO NOT EDIT`);
  lines.push(`package org.revue_2_presse.design`);
  lines.push(``);
  lines.push(`import androidx.compose.ui.graphics.Color`);
  lines.push(`import androidx.compose.ui.unit.dp`);
  lines.push(`import androidx.compose.ui.unit.sp`);
  lines.push(``);

  lines.push(`object RdpColors {`);
  for (const [k, v] of Object.entries(tokens.color)) {
    lines.push(`    val ${renameColorKey(k).padEnd(24)} = Color(${colorLiteral(v)})`);
  }
  lines.push(`}`);
  lines.push(``);

  for (const section of ['spacing', 'radius', 'size']) {
    const objName = { spacing: 'RdpSpacing', radius: 'RdpRadii', size: 'RdpSizes' }[section];
    lines.push(`object ${objName} {`);
    for (const [k, v] of Object.entries(tokens[section])) {
      lines.push(`    val ${kebabToPascal(k).padEnd(28)} = ${pxValue(v)}.dp`);
    }
    lines.push(`}`);
    lines.push(``);
  }

  lines.push(`object RdpType {`);
  for (const [k, v] of Object.entries(tokens.type)) {
    if (k === 'line-height-base') {
      const m = v.match(/^(\d+(?:\.\d+)?)em$/);
      if (!m) throw new Error(`expected Nem for line-height-base, got ${v}`);
      lines.push(`    val ${kebabToPascal(k).padEnd(28)} = ${m[1]}f`);
    } else {
      lines.push(`    val ${kebabToPascal(k).padEnd(28)} = ${pxValue(v)}.sp`);
    }
  }
  lines.push(`}`);

  return lines.join('\n') + '\n';
}

function main() {
  const { values } = parseArgs({
    options: { out: { type: 'string', default: '.' } },
  });
  const tokens = JSON.parse(readFileSync(join(HERE, '..', 'research', 'live-tokens.json'), 'utf8'));
  const out = generate(tokens);
  const dir = join(values.out, 'org', 'revue_2_presse', 'design');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'RdpTokens.kt'), out);
  console.log(`wrote ${join(dir, 'RdpTokens.kt')} (${out.length} bytes)`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

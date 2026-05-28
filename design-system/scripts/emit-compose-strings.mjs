// design-system/scripts/emit-compose-strings.mjs
import { readFileSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const HERE = dirname(fileURLToPath(import.meta.url));

function kebabDotsToPascal(s) {
  // "actions.quit.label" → "ActionsQuitLabel"
  // "errors.password.too-short" → "ErrorsPasswordTooShort"
  return s.split(/[.\-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function kotlinString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function assertKeysMatch(fr, en) {
  const f = new Set(Object.keys(fr));
  const e = new Set(Object.keys(en));
  const missingInEn = [...f].filter(k => !e.has(k));
  const missingInFr = [...e].filter(k => !f.has(k));
  if (missingInEn.length || missingInFr.length) {
    throw new Error(`key set mismatch — missing in en: ${missingInEn.join(',')} | missing in fr: ${missingInFr.join(',')}`);
  }
}

function assertAllFrameworkOutputsIdentical(refPath, refJson) {
  const outputs = join(HERE, '..', 'output');
  const targets = readdirSync(outputs).filter(d => d !== 'components.css');
  for (const target of targets) {
    for (const locale of ['en-GB', 'fr-FR']) {
      const p = join(outputs, target, 'src', 'locales', `${locale}.json`);
      try {
        const j = JSON.parse(readFileSync(p, 'utf8'));
        if (JSON.stringify(j) !== JSON.stringify(refJson[locale])) {
          throw new Error(`locale drift between ${refPath} and ${p}`);
        }
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    }
  }
}

export function generate({ fr, en }) {
  assertKeysMatch(fr, en);
  const keys = Object.keys(fr).sort();

  const lines = [];
  lines.push(`// AUTO-GENERATED from design-system/output/vue/src/locales/{en-GB,fr-FR}.json — DO NOT EDIT`);
  lines.push(`package org.revue_2_presse.domain.i18n`);
  lines.push(``);
  lines.push(`object RdpStrings {`);
  lines.push(`    enum class Key(val raw: String) {`);
  for (const k of keys) {
    lines.push(`        ${kebabDotsToPascal(k)}("${k}"),`);
  }
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    fun get(locale: RdpLocale, key: Key, vararg args: Pair<String, Any>): String {`);
  lines.push(`        val template = when (locale) {`);
  lines.push(`            RdpLocale.FR_FR -> fr[key.raw] ?: en[key.raw] ?: key.raw`);
  lines.push(`            RdpLocale.EN_GB -> en[key.raw] ?: fr[key.raw] ?: key.raw`);
  lines.push(`        }`);
  lines.push(`        return interpolate(template, args)`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    private fun interpolate(t: String, args: Array<out Pair<String, Any>>): String =`);
  lines.push(`        args.fold(t) { acc, (k, v) -> acc.replace("{" + k + "}", v.toString()) }`);
  lines.push(``);
  lines.push(`    private val fr: Map<String, String> = mapOf(`);
  for (const k of keys) lines.push(`        "${k}" to "${kotlinString(fr[k])}",`);
  lines.push(`    )`);
  lines.push(``);
  lines.push(`    private val en: Map<String, String> = mapOf(`);
  for (const k of keys) lines.push(`        "${k}" to "${kotlinString(en[k])}",`);
  lines.push(`    )`);
  lines.push(`}`);

  return lines.join('\n') + '\n';
}

function main() {
  const { values } = parseArgs({ options: { out: { type: 'string', default: '.' } } });
  const vueLocales = join(HERE, '..', 'output', 'vue', 'src', 'locales');
  const fr = JSON.parse(readFileSync(join(vueLocales, 'fr-FR.json'), 'utf8'));
  const en = JSON.parse(readFileSync(join(vueLocales, 'en-GB.json'), 'utf8'));
  assertAllFrameworkOutputsIdentical(vueLocales, { 'fr-FR': fr, 'en-GB': en });
  const out = generate({ fr, en });
  const dir = join(values.out, 'org', 'revue_2_presse', 'domain', 'i18n');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'RdpStrings.kt'), out);
  console.log(`wrote ${join(dir, 'RdpStrings.kt')} (${out.length} bytes)`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

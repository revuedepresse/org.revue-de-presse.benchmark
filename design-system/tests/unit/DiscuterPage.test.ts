import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('DiscuterPage (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/DiscuterPage.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }

  it('wires the discuter.* i18n keys for every UI state into the Vue output', () => {
    const vue = readFileSync(
      join(root, 'output/vue/src/components/DiscuterPage.vue'),
      'utf-8',
    );
    const required = [
      'discuter.title',
      'discuter.lede',
      'discuter.unauthenticated.body',
      'discuter.unauthenticated.cta',
      'discuter.authenticating',
      'discuter.composer.label',
      'discuter.composer.placeholder',
      'discuter.composer.send',
      'discuter.composer.cancel',
      'discuter.sources.title',
      'discuter.error.retry',
    ];
    for (const key of required) {
      expect(vue, `expected ${key} reference in DiscuterPage.vue`).toContain(key);
    }
  });

  it('lists every error code as a key in fr-FR.json', () => {
    const fr = JSON.parse(
      readFileSync(join(root, 'src/locales/fr-FR.json'), 'utf-8'),
    ) as Record<string, string>;
    for (const code of [
      'rate_limited_user',
      'rate_limited_global',
      'providers_exhausted',
      'truncated',
    ]) {
      expect(fr[`discuter.error.${code}`], `missing French copy for ${code}`).toBeTruthy();
    }
  });
});

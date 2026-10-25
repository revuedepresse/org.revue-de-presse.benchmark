import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('App (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/App.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

describe('App newsletter views', () => {
  const vue = () => readFileSync(join(root, 'output/vue/src/components/App.vue'), 'utf8');

  it('opens /lettre-quotidienne on both letters and /lettre-quotidienne-coop-medias on Coop Médias', () => {
    const src = vue();
    // Once per layout (desktop, mobile).
    expect(src.match(/currentView === 'newsletter'"[\s\S]*?edition="both"/g)).toHaveLength(2);
    expect(src.match(/currentView === 'newsletter-coop-medias'"[\s\S]*?edition="coop-medias"/g)).toHaveLength(2);
  });
});

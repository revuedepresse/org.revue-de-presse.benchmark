import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('Icon sprite', () => {
  it('contains every M1 glyph', () => {
    const path = join(root, 'src/icons/sprite.svg');
    const svg = readFileSync(path, 'utf8');
    for (const id of [
      'chevron-up',
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'eye',
      'share',
      'heart',
      'bell',
      'x',
      'user',
    ]) {
      expect(svg).toContain(`id="${id}"`);
    }
  });
});

describe('Icon (post-Mitosis emit)', () => {
  it('emits a Vue component that uses <use href>', () => {
    const path = join(root, 'output/vue/src/components/Icon.vue');
    expect(existsSync(path)).toBe(true);
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/<use[^>]*href/);
  });

  it('emits a React component that uses <use href>', () => {
    const path = join(root, 'output/react/src/components/Icon.tsx');
    expect(existsSync(path)).toBe(true);
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/<use[^>]*href/);
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('Icon sprite', () => {
  it('contains every legacy icon', () => {
    const path = join(root, 'src/icons/sprite.svg');
    const svg = readFileSync(path, 'utf8');
    // 19 icons sourced from org.revue-de-presse/assets/icons via scripts/build-sprite.mjs.
    for (const id of [
      'funding',
      'github',
      'heart',
      'introducing',
      'like-clicked',
      'like-intent',
      'like-metric',
      'next-day',
      'next-item',
      'pick-day',
      'pick-item',
      'pick-list',
      'previous-day',
      'previous-item',
      'reply',
      'retweet',
      'share',
      'sharing',
      'warning',
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

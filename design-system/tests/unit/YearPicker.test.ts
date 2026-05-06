import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('YearPicker (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid', 'lit'] as const) {
    it(`emits a ${target} component`, () => {
      const ext =
        target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : target === 'lit' ? 'ts' : 'tsx';
      const path = join(root, `output/${target}/src/components/YearPicker.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

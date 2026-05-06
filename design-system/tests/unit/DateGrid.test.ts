import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('DateGrid (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid', 'lit'] as const) {
    it(`emits a ${target} component referencing weekdays`, () => {
      const ext =
        target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : target === 'lit' ? 'ts' : 'tsx';
      const path = join(root, `output/${target}/src/components/DateGrid.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/weekday/i);
    });
  }
});

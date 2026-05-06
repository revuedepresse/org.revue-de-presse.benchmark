import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('CalendarActionBar (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react', 'svelte', 'solid', 'lit'] as const) {
    it(`emits a ${target} component with prev/next handlers`, () => {
      const ext =
        target === 'vue' ? 'vue' : target === 'svelte' ? 'svelte' : target === 'lit' ? 'ts' : 'tsx';
      const path = join(root, `output/${target}/src/components/CalendarActionBar.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/onPrev|on-prev|onClick.*Prev/);
    });
  }
});

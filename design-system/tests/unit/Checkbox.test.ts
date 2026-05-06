import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('Checkbox (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react'] as const) {
    it(`emits a ${target} component supporting labelChildren slot`, () => {
      const ext = target === 'vue' ? 'vue' : 'tsx';
      const path = join(root, `output/${target}/src/components/Checkbox.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/labelChildren/);
      expect(src).toMatch(/type=["']?checkbox/);
    });
  }
});

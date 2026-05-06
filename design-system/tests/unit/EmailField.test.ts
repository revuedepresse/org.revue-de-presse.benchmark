import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('EmailField (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react'] as const) {
    it(`emits a ${target} component using type=email`, () => {
      const ext = target === 'vue' ? 'vue' : 'tsx';
      const path = join(root, `output/${target}/src/components/EmailField.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/type=["']?email/);
      // React emits camelCase `autoComplete`, Vue keeps lowercase.
      expect(src).toMatch(/auto[Cc]omplete=["']?email/);
    });
  }
});

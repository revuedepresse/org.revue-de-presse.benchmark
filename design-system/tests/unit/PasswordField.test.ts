import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('PasswordField (post-Mitosis emit)', () => {
  for (const target of ['vue', 'react'] as const) {
    it(`emits a ${target} component with mode prop`, () => {
      const ext = target === 'vue' ? 'vue' : 'tsx';
      const path = join(root, `output/${target}/src/components/PasswordField.${ext}`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, 'utf8');
      expect(src).toMatch(/mode/);
      expect(src).toMatch(/type=["']?password/);
    });
  }
});

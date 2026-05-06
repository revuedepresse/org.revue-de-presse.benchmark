import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('AppHeader (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/AppHeader.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

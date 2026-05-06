import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('Logo (post-Mitosis emit)', () => {
  it('emits a Vue component', () => {
    const path = join(root, 'output/vue/src/components/Logo.vue');
    expect(existsSync(path)).toBe(true);
    const src = readFileSync(path, 'utf8');
    expect(src).toContain('<template>');
    expect(src).toMatch(/Revue de presse/i);
  });

  it('emits a React component', () => {
    const path = join(root, 'output/react/src/components/Logo.tsx');
    expect(existsSync(path)).toBe(true);
    const src = readFileSync(path, 'utf8');
    // Mitosis 0.13 emits `function Logo(...)` followed by `export default Logo;`.
    expect(src).toMatch(/(export\s+(default\s+)?function\s+Logo|function\s+Logo\b[\s\S]*export\s+default\s+Logo)/);
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('NewsletterPage (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/NewsletterPage.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }

  const vue = () => readFileSync(join(root, 'output/vue/src/components/NewsletterPage.vue'), 'utf8');

  it('posts a plain form to the API sign-up endpoint by default', () => {
    const src = vue();
    expect(src).toMatch(/method="post"/);
    expect(src).toContain('https://api.revue-de-presse.org/newsletter/subscribe');
  });

  it('sends the address in an `email` field', () => {
    expect(vue()).toMatch(/type="email"[\s\S]*?name="email"|name="email"[\s\S]*?type="email"/);
  });

  it('includes the `website` honeypot hidden from people and keyboard focus', () => {
    const src = vue();
    expect(src).toContain('name="website"');
    expect(src).toMatch(/tabindex="-1"/);
    expect(src).toMatch(/aria-hidden="true"/);
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('BannerAbout (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/BannerAbout.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

describe('BannerAbout newsletter invitation', () => {
  const vue = () => readFileSync(join(root, 'output/vue/src/components/BannerAbout.vue'), 'utf8');

  it('links to the newsletter page right after the Google Play badge', () => {
    const src = vue();
    const badge = src.indexOf('rdp-banner-about__play-store-badge');
    const invite = src.indexOf('rdp-banner-about__newsletter-link');
    expect(badge).toBeGreaterThan(-1);
    expect(invite).toBeGreaterThan(badge);
    expect(src).toContain("'/lettre-quotidienne'");
    expect(src).toContain('footer.newsletter.label');
  });
});

describe('BannerAbout newsletter invitation (server-rendered)', () => {
  const componentPath = join(root, 'output/vue/src/components/BannerAbout.vue');

  async function render(props: Record<string, unknown> = {}): Promise<string> {
    const { createSSRApp, h } = await import('vue');
    const { renderToString } = await import('vue/server-renderer');
    const component = (await import(/* @vite-ignore */ componentPath)).default;
    return renderToString(createSSRApp({ render: () => h(component, props) }));
  }

  it('shows the invitation with showNewsletter=true', async () => {
    const html = await render({ showNewsletter: true });
    expect(html).toContain('rdp-banner-about__newsletter-link');
    expect(html).toContain('href="/lettre-quotidienne"');
    expect(html).toContain('rdp-banner-about__play-store-badge');
  });

  it('leaves no trace of the newsletter otherwise, keeping the Google Play badge', async () => {
    for (const html of [await render(), await render({ showNewsletter: false })]) {
      expect(html).not.toContain('rdp-banner-about__newsletter');
      expect(html).not.toContain('lettre-quotidienne');
      expect(html).toContain('rdp-banner-about__play-store-badge');
    }
  });
});

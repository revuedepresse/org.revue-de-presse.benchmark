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

describe('NewsletterPage editions (server-rendered)', () => {
  const componentPath = join(root, 'output/vue/src/components/NewsletterPage.vue');

  async function render(props: Record<string, unknown> = {}): Promise<string> {
    const { createSSRApp, h } = await import('vue');
    const { renderToString } = await import('vue/server-renderer');
    const component = (await import(/* @vite-ignore */ componentPath)).default;
    const html = await renderToString(createSSRApp({ render: () => h(component, props) }));
    // Only the entities Vue escapes in this page's text, so assertions read as French.
    return html.replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  }

  const hiddenEdition = (html: string) =>
    html.match(/<input[^>]*type="hidden"[^>]*name="edition"[^>]*value="([^"]*)"/)?.[1];
  const heading = (html: string) => html.match(/<h1>([^<]*)<\/h1>/)?.[1];
  const crossLink = (html: string) =>
    html.match(/<a[^>]*class="rdp-newsletter-page__other-edition-link"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);

  it('defaults to the French media edition', async () => {
    const html = await render();
    expect(hiddenEdition(html)).toBe('fr');
    expect(heading(html)).toBe("La lettre d'information des médias français");
  });

  it('French media edition: sends edition=fr and links to the Coop Médias edition', async () => {
    const html = await render({ edition: 'fr' });
    expect(hiddenEdition(html)).toBe('fr');
    expect(heading(html)).toBe("La lettre d'information des médias français");
    expect(html).toContain('top 10 des publications des médias français les plus relayées sur Bluesky la veille');
    const link = crossLink(html);
    expect(link?.[1]).toBe('/lettre-quotidienne-coop-medias');
    expect(link?.[2]).toBe("S'abonner à la lettre d'information de Coop Médias");
    expect(html).toContain('Vous préférez la sélection des médias membres de Coop Médias');
  });

  it('Coop Médias edition: sends edition=coop-medias and links to the French media edition', async () => {
    const html = await render({ edition: 'coop-medias' });
    expect(hiddenEdition(html)).toBe('coop-medias');
    expect(heading(html)).toBe("La lettre d'information de Coop Médias");
    expect(html).toContain(
      'top 10 des publications des médias membres de Coop Médias les plus relayées sur Bluesky la veille',
    );
    const link = crossLink(html);
    expect(link?.[1]).toBe('/lettre-quotidienne');
    expect(link?.[2]).toBe("S'abonner à la lettre d'information des médias français");
    expect(html).toContain("Vous préférez la sélection de l'ensemble des médias français");
  });

  it('both editions post to the same endpoint and explain the confirmation step', async () => {
    for (const edition of ['fr', 'coop-medias']) {
      const html = await render({ edition });
      expect(html).toContain('action="https://api.revue-de-presse.org/newsletter/subscribe"');
      expect(html).toContain('Confirmez votre adresse e-mail');
      expect(html).toContain('name="website"');
    }
  });

  it('honours a custom endpoint and cross-link href', async () => {
    const html = await render({
      edition: 'coop-medias',
      action: 'https://api.example.org/newsletter/subscribe',
      otherEditionHref: '/autre',
    });
    expect(html).toContain('action="https://api.example.org/newsletter/subscribe"');
    expect(crossLink(html)?.[1]).toBe('/autre');
  });
});

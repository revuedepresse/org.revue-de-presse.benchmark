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

  // Radio buttons named `edition`, in order, with the checked one marked.
  const radios = (html: string) =>
    [...html.matchAll(/<input[^>]*type="radio"[^>]*>/g)].map((m) => ({
      name: m[0].match(/name="([^"]*)"/)?.[1],
      value: m[0].match(/value="([^"]*)"/)?.[1],
      checked: /\schecked(=|\s|>|\/)/.test(m[0]),
    }));
  const checkedEdition = (html: string) => radios(html).find((r) => r.checked)?.value;
  const heading = (html: string) => html.match(/<h1>([^<]*)<\/h1>/)?.[1];

  it('offers French media, Coop Médias or both, as one `edition` field', async () => {
    const html = await render();
    expect(radios(html).map((r) => [r.name, r.value])).toEqual([
      ['edition', 'fr'],
      ['edition', 'coop-medias'],
      ['edition', 'both'],
    ]);
    expect(html).toContain('Quelle lettre souhaitez-vous recevoir ?');
    expect(html).toContain('Médias français');
    expect(html).toContain('Coop Médias');
    expect(html).toContain('Les deux');
    // No hidden `edition` left over: the radio choice is the only value posted.
    expect(html).not.toMatch(/type="hidden"[^>]*name="edition"/);
  });

  it('checks both letters by default', async () => {
    const html = await render();
    expect(checkedEdition(html)).toBe('both');
    expect(radios(html).filter((r) => r.checked)).toHaveLength(1);
    expect(heading(html)).toBe("Les lettres d'information des médias français et de Coop Médias");
    expect(html).toContain('Deux lettres par jour, une par sélection.');
  });

  it('checks the edition it is opened with', async () => {
    for (const edition of ['fr', 'coop-medias', 'both']) {
      expect(checkedEdition(await render({ edition }))).toBe(edition);
    }
    expect(heading(await render({ edition: 'coop-medias' }))).toBe("La lettre d'information de Coop Médias");
    expect(heading(await render({ edition: 'fr' }))).toBe("La lettre d'information des médias français");
    expect(checkedEdition(await render({ edition: 'unknown' }))).toBe('both');
  });

  it('explains the single confirmation, two letters a day and per-letter unsubscribe', async () => {
    const html = await render();
    expect(html).toContain('Confirmez votre adresse e-mail');
    expect(html).toContain('Un seul e-mail de confirmation, même si vous choisissez les deux lettres.');
    expect(html).toContain('Avec les deux lettres, vous en recevez deux par jour.');
    expect(html).toContain('Chaque lettre a son propre lien de désabonnement');
  });

  it('posts every choice to the same endpoint, honeypot included', async () => {
    for (const edition of ['fr', 'coop-medias', 'both']) {
      const html = await render({ edition });
      expect(html).toContain('action="https://api.revue-de-presse.org/newsletter/subscribe"');
      expect(html).toContain('name="website"');
    }
  });

  it('honours a custom endpoint', async () => {
    const html = await render({ action: 'https://api.example.org/newsletter/subscribe' });
    expect(html).toContain('action="https://api.example.org/newsletter/subscribe"');
  });
});

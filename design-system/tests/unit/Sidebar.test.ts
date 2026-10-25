import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('Sidebar (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/Sidebar.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

describe('Sidebar pickers and newsletter invitation (server-rendered)', () => {
  const componentPath = join(root, 'output/vue/src/components/Sidebar.vue');
  const RANKINGS = [
    { id: 'fin-de-journee', label: 'Fin de journée' },
    { id: 'premiere-mesure', label: 'Première mesure' },
  ];

  async function render(props: Record<string, unknown>): Promise<string> {
    const { createSSRApp, h } = await import('vue');
    const { renderToString } = await import('vue/server-renderer');
    const component = (await import(/* @vite-ignore */ componentPath)).default;
    return renderToString(
      createSSRApp({
        render: () =>
          h(component, {
            selectedDate: new Date(2026, 4, 1),
            yearRange: { min: 2025, max: 2026 },
            rankings: RANKINGS,
            selectedRankingId: 'fin-de-journee',
            ...props,
          }),
      }),
    );
  }

  it('without the preview: the ranking picker only, no list picker, no newsletter invitation', async () => {
    const html = await render({ lists: [{ id: 'fr', label: 'Médias français' }], selectedListId: 'fr' });
    expect(html).toContain('Fin de journée');
    expect(html).toContain('Première mesure');
    expect(html).not.toContain('Médias français');
    expect(html).not.toContain('rdp-banner-about__newsletter');
  });

  it('in preview: the list picker with its three lists, the ranking picker and the newsletter invitation', async () => {
    const html = await render({
      lists: [
        { id: 'fr', label: 'Médias français' },
        { id: 'coop-medias', label: 'Coop Médias' },
        { id: 'fr-coop-medias', label: 'Médias français + Coop Médias' },
      ],
      selectedListId: 'fr',
      showNewsletter: true,
    });
    for (const label of ['Médias français', 'Coop Médias', 'Médias français + Coop Médias', 'Fin de journée', 'Première mesure']) {
      expect(html).toContain(label);
    }
    expect(html).toContain('rdp-banner-about__newsletter-link');
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { TARGETS } from './_targets';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

describe('FiltersSheet (post-Mitosis emit)', () => {
  for (const { name, ext } of TARGETS) {
    it(`emits a ${name} component`, () => {
      const path = join(root, `output/${name}/src/components/FiltersSheet.${ext}`);
      expect(existsSync(path)).toBe(true);
    });
  }
});

describe('FiltersSheet (mobile filters)', () => {
  const vue = () => readFileSync(join(root, 'output/vue/src/components/FiltersSheet.vue'), 'utf8');

  it('shows the list picker and the ranking picker in one sheet', () => {
    expect(vue()).toContain('rdp-filters-sheet');
    expect(vue()).toContain('ranking-list.heading');
  });

  it('can be dismissed from its scrim', () => {
    expect(vue()).toContain('rdp-filters-sheet__scrim');
  });
});

describe('CalendarActionBar (filters button)', () => {
  it('offers a filters button when asked for', () => {
    const bar = readFileSync(join(root, 'output/vue/src/components/CalendarActionBar.vue'), 'utf8');
    expect(bar).toContain('rdp-calendar-action-bar__filters');
    expect(bar).toContain('actions.pick-filters.aria-label');
  });
});

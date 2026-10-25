import { describe, expect, it } from 'vitest';
import { PUBLISHER_LISTS, firstDayOf, publisherListFromQuery, withinList } from './publisher-lists';

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe('publisher lists', () => {
  it('offers French media first, then Coop Médias, then both lists together', () => {
    expect(PUBLISHER_LISTS.map((l) => l.id)).toEqual(['fr', 'coop-medias', 'fr-coop-medias']);
    expect(PUBLISHER_LISTS[2].label).toBe('Médias français + Coop Médias');
  });

  it('reads the list from ?liste=, falling back to French media', () => {
    expect(publisherListFromQuery(undefined)).toBe('fr');
    expect(publisherListFromQuery('coop-medias')).toBe('coop-medias');
    expect(publisherListFromQuery('fr-coop-medias')).toBe('fr-coop-medias');
    expect(publisherListFromQuery('unknown')).toBe('fr');
    expect(publisherListFromQuery(['coop-medias'])).toBe('fr');
  });

  it('starts each list on its first collected day', () => {
    expect(firstDayOf('fr')).toEqual(day(2025, 3, 4));
    expect(firstDayOf('coop-medias')).toEqual(day(2025, 3, 4));
    expect(firstDayOf('fr-coop-medias')).toEqual(day(2025, 3, 4));
  });

  it('moves a day before the list began to the list first day', () => {
    expect(withinList(day(2025, 1, 1), 'coop-medias')).toEqual(day(2025, 3, 4));
    expect(withinList(day(2026, 10, 1), 'coop-medias')).toEqual(day(2026, 10, 1));
    expect(withinList(day(2025, 1, 1), 'fr')).toEqual(day(2025, 3, 4));
    expect(withinList(day(2025, 1, 1), 'fr-coop-medias')).toEqual(day(2025, 3, 4));
  });

  it('keeps a day the list covers', () => {
    expect(withinList(day(2026, 10, 30), 'coop-medias')).toEqual(day(2026, 10, 30));
    expect(withinList(day(2026, 10, 1), 'fr')).toEqual(day(2026, 10, 1));
  });
});

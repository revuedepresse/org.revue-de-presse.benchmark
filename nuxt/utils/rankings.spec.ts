import { describe, expect, it } from 'vitest';
import { rankingFromQuery } from './rankings';

describe('rankings', () => {
  it('maps ?classement= to the API ranking', () => {
    expect(rankingFromQuery('premiere-mesure')).toBe('first-sighting');
    expect(rankingFromQuery('fin-de-journee')).toBe('end-of-day');
  });

  it('leaves the choice to the API default otherwise', () => {
    expect(rankingFromQuery(undefined)).toBeUndefined();
    expect(rankingFromQuery('unknown')).toBeUndefined();
    expect(rankingFromQuery(['fin-de-journee'])).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { RANKING_CHOICES, rankingFromQuery, selectedRankingChoice } from './rankings';

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

describe('ranking picker', () => {
  it('offers the end-of-day ranking first, then the first measurement', () => {
    expect(RANKING_CHOICES).toEqual([
      { id: 'fin-de-journee', label: 'Fin de journée' },
      { id: 'premiere-mesure', label: 'Première mesure' },
    ]);
  });

  it('selects the ranking asked for in the address', () => {
    expect(selectedRankingChoice('premiere-mesure', 'end-of-day')).toBe('premiere-mesure');
    expect(selectedRankingChoice('fin-de-journee', 'first-sighting')).toBe('fin-de-journee');
  });

  it('selects the configured default otherwise', () => {
    expect(selectedRankingChoice(undefined, 'first-sighting')).toBe('premiere-mesure');
    expect(selectedRankingChoice('unknown', 'end-of-day')).toBe('fin-de-journee');
    expect(selectedRankingChoice(undefined, 'not-a-ranking')).toBe('premiere-mesure');
  });
});

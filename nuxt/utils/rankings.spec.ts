import { describe, expect, it } from 'vitest';
import { DEFAULT_RANKING, RANKING_CHOICES, rankingFromQuery, requestedRanking, selectedRankingChoice } from './rankings';

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
    expect(selectedRankingChoice(undefined, 'not-a-ranking')).toBe('fin-de-journee');
  });

  it('defaults to the end-of-day ranking, like the API', () => {
    expect(DEFAULT_RANKING).toBe('end-of-day');
    expect(selectedRankingChoice(undefined)).toBe('fin-de-journee');
    expect(selectedRankingChoice(undefined, '')).toBe('fin-de-journee');
  });
});

describe('ranking asked of the API', () => {
  it('leaves the default ranking to the API, so the default view has one cache key', () => {
    expect(requestedRanking(undefined)).toBeUndefined();
    expect(requestedRanking('fin-de-journee')).toBeUndefined();
    expect(requestedRanking('fin-de-journee', 'end-of-day')).toBeUndefined();
  });

  it('asks for the other ranking explicitly', () => {
    expect(requestedRanking('premiere-mesure')).toBe('first-sighting');
    expect(requestedRanking('fin-de-journee', 'first-sighting')).toBe('end-of-day');
    expect(requestedRanking('unknown')).toBeUndefined();
  });
});

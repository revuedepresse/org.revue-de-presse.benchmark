// Rankings the API serves, selected on the site with ?classement=<value>:
// "premiere-mesure" ranks posts on their first measurement, "fin-de-journee"
// on their counts at the end of the day. Without it, the API's configured
// default applies.

export type Ranking = 'first-sighting' | 'end-of-day';

const BY_QUERY_VALUE: Record<string, Ranking> = {
  'premiere-mesure': 'first-sighting',
  'fin-de-journee': 'end-of-day',
};

// The API's default ranking in production (end of day), which the site
// assumes when NUXT_PUBLIC_DEFAULT_RANKING is not set.
export const DEFAULT_RANKING: Ranking = 'end-of-day';

export function rankingFromQuery(value: unknown): Ranking | undefined {
  return typeof value === 'string' ? BY_QUERY_VALUE[value] : undefined;
}

export type RankingChoice = { id: 'fin-de-journee' | 'premiere-mesure'; label: string };

// Options of the ranking picker, keyed by their ?classement= value.
export const RANKING_CHOICES: RankingChoice[] = [
  { id: 'fin-de-journee', label: 'Fin de journée' },
  { id: 'premiere-mesure', label: 'Première mesure' },
];

// The option to show as selected: the one in the address, or else the one the
// API applies by default (NUXT_PUBLIC_DEFAULT_RANKING, end of day if unset or
// unknown).
export function selectedRankingChoice(queryValue: unknown, defaultRanking: string = DEFAULT_RANKING): RankingChoice['id'] {
  if (rankingFromQuery(queryValue)) return queryValue as RankingChoice['id'];
  return defaultRanking === 'first-sighting' ? 'premiere-mesure' : 'fin-de-journee';
}

// Ranking to ask the API for: none when the address asks for the default one,
// so that the default view of a day has a single request (and cache key)
// whether or not ?classement= spells it out.
export function requestedRanking(queryValue: unknown, defaultRanking: string = DEFAULT_RANKING): Ranking | undefined {
  const ranking = rankingFromQuery(queryValue);
  return ranking === defaultRanking ? undefined : ranking;
}

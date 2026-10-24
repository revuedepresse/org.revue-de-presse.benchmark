// Rankings the API serves, selected on the site with ?classement=<value>:
// "premiere-mesure" ranks posts on their first measurement, "fin-de-journee"
// on their counts at the end of the day. Without it, the API's configured
// default applies.

export type Ranking = 'first-sighting' | 'end-of-day';

const BY_QUERY_VALUE: Record<string, Ranking> = {
  'premiere-mesure': 'first-sighting',
  'fin-de-journee': 'end-of-day',
};

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
// API applies by default (NUXT_PUBLIC_DEFAULT_RANKING, first sighting if unset).
export function selectedRankingChoice(queryValue: unknown, defaultRanking: string): RankingChoice['id'] {
  if (rankingFromQuery(queryValue)) return queryValue as RankingChoice['id'];
  return defaultRanking === 'end-of-day' ? 'fin-de-journee' : 'premiere-mesure';
}

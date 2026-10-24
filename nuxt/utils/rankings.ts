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

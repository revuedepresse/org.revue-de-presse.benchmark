// Publisher lists the API ranks into a daily top 10, selected on the site with
// ?liste=<id>. Each list starts on the first day its members were collected for
// a whole day, so the calendar never offers a day the list cannot have.

export type PublisherListId = 'fr' | 'coop-medias' | 'fr-coop-medias';

export type PublisherList = {
  id: PublisherListId;
  label: string;
  firstDay: [year: number, month: number, day: number];
};

export const PUBLISHER_LISTS: PublisherList[] = [
  { id: 'fr', label: 'Médias français', firstDay: [2025, 3, 4] },
  { id: 'coop-medias', label: 'Coop Médias', firstDay: [2025, 3, 4] },
  // Members of either list, each post counted once.
  { id: 'fr-coop-medias', label: 'Médias français + Coop Médias', firstDay: [2025, 3, 4] },
];

export function publisherListFromQuery(value: unknown): PublisherListId {
  return typeof value === 'string' && PUBLISHER_LISTS.some((l) => l.id === value)
    ? (value as PublisherListId)
    : 'fr';
}

export function firstDayOf(id: PublisherListId): Date {
  const list = PUBLISHER_LISTS.find((l) => l.id === id) ?? PUBLISHER_LISTS[0];
  const [y, m, d] = list.firstDay;
  return new Date(y, m - 1, d);
}

// The given day, or the list's first day when the list had not started yet.
export function withinList(date: Date, id: PublisherListId): Date {
  const first = firstDayOf(id);
  return date.getTime() < first.getTime() ? first : date;
}

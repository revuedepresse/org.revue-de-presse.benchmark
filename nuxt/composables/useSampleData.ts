import type { BlueskyPost } from '@design-system/components/BlueskyPostCard.vue';

export type SnapshotItem = { id: string; label: string };

export function useSampleData() {
  const baseDate = new Date(2026, 4, 1); // 1 May 2026

  const lists: SnapshotItem[] = [
    { id: 'agile', label: 'Agile' },
    { id: 'medias-francais', label: 'Médias français' },
    { id: 'machine-learning', label: 'Machine learning' },
  ];

  const posts: BlueskyPost[] = [
    {
      id: 'post-1',
      authorName: 'France Culture',
      authorHandle: 'franceculture.fr',
      body: 'On pense au muguet, aux jours fériés… mais le 1er mai commence surtout par une bombe à Chicago.',
      publishedAt: baseDate,
      metrics: { replies: 80, reposts: 127, likes: 312 },
      hasMedia: false,
    },
    {
      id: 'post-2',
      authorName: 'Le Monde',
      authorHandle: 'lemonde.fr',
      body: "Manifestations du 1er mai : retour sur la mobilisation des syndicats à travers la France.",
      publishedAt: baseDate,
      metrics: { replies: 64, reposts: 188, likes: 542 },
      hasMedia: true,
    },
    {
      id: 'post-3',
      authorName: 'Mediapart',
      authorHandle: 'mediapart.fr',
      body: 'Enquête : ce que change la nouvelle législation européenne sur les services numériques.',
      publishedAt: baseDate,
      metrics: { replies: 39, reposts: 112, likes: 271 },
      hasMedia: false,
    },
  ];

  return { baseDate, lists, posts, yearRange: { min: 2018, max: 2026 } };
}

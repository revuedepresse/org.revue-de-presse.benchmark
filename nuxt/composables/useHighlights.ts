import type { Ref } from 'vue';
import type { BlueskyPost } from '@design-system/components/BlueskyPostCard.vue';
import { cleanText } from '../utils/clean-text';

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Shape returned by /api/twitter/highlights — observed payload:
//   { aggregates: [], statuses: [...], version: "v3.7.1" }
// Each status item:
//   {
//     screen_name: "franceculture.fr",
//     reposts: 80,
//     likes: 127,
//     avatar_url: "https://cdn.bsky.app/...",
//     text: "\"On pense au muguet…\"",   ← wrapped in literal quotes
//     publication_id: "at://did:plc:.../...",
//     date: "2026-05-01T04:00:00",
//     url: "https://bsky.app/profile/.../post/...",
//     status: { ...same fields again }
//   }
type RawStatus = {
  screen_name?: string;
  reposts?: number;
  likes?: number;
  replies?: number;
  avatar_url?: string;
  text?: string;
  publication_id?: string;
  date?: string;
  url?: string;
  status?: RawStatus;
};

function deriveAuthorName(handle?: string): string {
  if (!handle) return 'Inconnu';
  // "franceculture.fr" → "France Culture"; rough but readable for fallbacks.
  const stem = handle.replace(/\.[a-z.]+$/i, '');
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function mapStatus(raw: RawStatus, fallbackDate: string): BlueskyPost {
  // Upstream nests the same fields under .status; flatten so the client can
  // address either shape.
  const item = raw.status ?? raw;
  const handle = item.screen_name ?? '';
  const id = item.publication_id ?? item.url ?? Math.random().toString(36).slice(2);
  return {
    id,
    authorName: deriveAuthorName(handle),
    authorHandle: handle,
    authorAvatarUrl: item.avatar_url,
    body: cleanText(item.text ?? ''),
    publishedAt: new Date(item.date ?? fallbackDate),
    metrics: {
      replies: item.replies ?? 0,
      reposts: item.reposts ?? 0,
      likes: item.likes ?? 0,
    },
    hasMedia: false,
    publicationUrl: item.url,
  };
}

export function useHighlights(date: Ref<Date>) {
  // Hits the Nitro proxy at /api/highlights — it forwards to
  // `${NUXT_API_BASE_URL}/api/twitter/highlights` with x-auth-token attached.
  const { data, pending, error, refresh } = useFetch<unknown>('/api/highlights', {
    query: computed(() => {
      const day = formatYmd(date.value);
      return { startDate: day, endDate: day };
    }),
    default: () => null,
    watch: [date],
  });

  const posts = computed<BlueskyPost[]>(() => {
    const raw = data.value as { statuses?: RawStatus[] } | RawStatus[] | null;
    if (!raw) return [];
    const items: RawStatus[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.statuses)
        ? raw.statuses
        : [];
    return items.map((s) => mapStatus(s, formatYmd(date.value)));
  });

  return { posts, loading: pending, error, refresh };
}

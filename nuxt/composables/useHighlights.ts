import type { Ref } from 'vue';
import type { BlueskyPost } from '@design-system/components/BlueskyPostCard.vue';

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

function cleanText(text: string): string {
  if (!text) return '';
  let out = text;
  // 1. Strip the literal straight quotes the upstream wraps every status in.
  if (out.startsWith('"') && out.endsWith('"')) {
    out = out.slice(1, -1);
  }
  // 2. Convert literal `\n` (backslash-n in the JSON payload) into actual
  //    line feeds so paragraph breaks render in the post body.
  out = out.replace(/\\n/g, '\n');
  // 3. Decode escaped quotes the upstream still ships in body text:
  //    `L\'Espagne` → `L'Espagne`, `\"Atlantique\"` → `"Atlantique"`.
  out = out.replace(/\\'/g, "'").replace(/\\"/g, '"');
  // 4. Decode `\xNN[\]` hex escapes (e.g. `1er\xa0\mai` — a hex-escaped
  //    non-breaking space followed by a stray backslash). nbsp becomes a
  //    regular space; other printable ASCII codepoints decode to the char;
  //    everything else is dropped.
  out = out.replace(/\\x([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 0xa0) return ' ';
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  // 5. CSS-style hex escapes that travel without the `x` prefix
  //    (e.g. `\2f\` → `/`, `\3a\` → `:`). Only resolve printable ASCII.
  out = out.replace(/\\([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  // 6. Drop ambiguous 4-digit runs (year-shaped artefacts).
  out = out.replace(/\\[0-9]{4}\\?/g, '');
  // 7. Strip Unicode variation selectors (U+FE0E, U+FE0F) and zero-width
  //    spaces that travel with emoji and obscure the text rendering.
  out = out.replace(/[​-‍︎️⁠]/g, '');
  // 8. Final safety net: any remaining bare backslash is an upstream
  //    encoding artefact (real newlines / quotes are already decoded above).
  out = out.replace(/\\/g, '');
  // 9. Collapse runs of spaces left by step 4 so the body doesn't show
  //    suspicious whitespace gaps where `\xa0\` stood.
  out = out.replace(/[ \t]{2,}/g, ' ');
  return out.trim();
}

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

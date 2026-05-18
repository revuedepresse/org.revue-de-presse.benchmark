'use client';

import { useEffect, useRef, useState } from 'react';
import type { BlueskyPost } from '@design-system/components/BlueskyPostCard';
import { cleanText } from '@/lib/cleanText';

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

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
  const stem = handle.replace(/\.[a-z.]+$/i, '');
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function mapStatus(raw: RawStatus, fallbackDate: string): BlueskyPost {
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

export function useHighlights(date: Date): { posts: BlueskyPost[]; loading: boolean } {
  const [posts, setPosts] = useState<BlueskyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const controller = new AbortController();
    const day = formatYmd(date);

    setLoading(true);
    fetch(`/api/highlights?startDate=${day}&endDate=${day}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((raw: { statuses?: RawStatus[] } | RawStatus[] | null) => {
        if (id !== requestId.current) return;
        const items: RawStatus[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.statuses)
            ? raw.statuses
            : [];
        setPosts(items.map((s) => mapStatus(s, day)));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (id !== requestId.current) return;
        setPosts([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [date.getTime()]);

  return { posts, loading };
}

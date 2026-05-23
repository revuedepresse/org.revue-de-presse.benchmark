// Extracted from route.ts because Next App Router forbids non-HTTP-method
// exports from a route file (the build fails with "X is not a valid Route
// export field"). The route handler imports from this file; the spec
// imports from here too.

import { cleanForFeed } from '@/lib/cleanText';

export type RawStatus = {
  screen_name?: string;
  publication_id?: string;
  url?: string;
  avatar_url?: string;
  text?: string;
  date?: string;
  status?: RawStatus;
};

export type FeedItem = {
  title: string;
  id: string;
  link: string;
  description: string;
  image: string;
  date: Date;
};

export const mapStatusToFeedItem = (raw: RawStatus): FeedItem => {
  const s = raw.status ?? raw;
  return {
    title: cleanForFeed(s.screen_name ?? ''),
    id: s.publication_id ?? s.url ?? '',
    link: s.url ?? '',
    description: cleanForFeed(s.text ?? ''),
    image: cleanForFeed(s.avatar_url ?? ''),
    date: s.date ? new Date(s.date) : new Date(),
  };
};

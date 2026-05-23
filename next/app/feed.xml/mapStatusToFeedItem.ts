// Extracted from route.ts because Next App Router forbids non-HTTP-method
// exports from a route file (the build fails with "X is not a valid Route
// export field"). The route handler imports from this file; the spec
// imports from here too.

import { find } from 'linkifyjs';
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
  content: string;
  date: Date;
};

// On-site Bluesky post card renders the avatar at 48×48 (see
// design-system/src/components/BlueskyPostCard.lite.tsx). Keep the inline
// <img> in <content:encoded> at the same dimensions so feed readers show
// it consistently with the site.
const AVATAR_PX = 48;

// Bluesky CDN serves avatars in two sizes:
//   /img/avatar/plain/...           ~1000px, 150-300KB
//   /img/avatar_thumbnail/plain/... ~150px,  <15KB
// The feed only needs a small inline image, so we route to the thumbnail.
// Non-Bluesky URLs are passed through unchanged.
export const shrinkBlueskyAvatar = (url: string): string =>
  url.replace('cdn.bsky.app/img/avatar/', 'cdn.bsky.app/img/avatar_thumbnail/');

// Bluesky handles are domain-shaped (@franceculture.fr, @user.bsky.social),
// which linkifyjs's built-in mention plugin (Twitter-style @name) does not
// recognise. We detect handles with a small regex and let linkifyjs.find()
// take care of URL and email detection in the surrounding text. The
// `(?<!\w)` lookbehind keeps "foo@bar.com" out of handle detection so
// linkifyjs sees it as email instead.
const HANDLE_RE =
  /(?<!\w)@[a-zA-Z0-9][a-zA-Z0-9-]*(?:\.[a-zA-Z0-9][a-zA-Z0-9-]*)+/g;

const htmlEscape = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Wraps URLs (bare or with scheme), emails, and Bluesky handles in <a> tags
// so they render as clickable links inside <content:encoded>. Handles target
// https://bsky.app/profile/{handle}; URL detection is delegated to linkifyjs.
// Plain text segments are HTML-escaped.
export const linkifyForFeed = (text: string): string => {
  if (!text) return '';

  type Span = { start: number; end: number; html: string };
  const spans: Span[] = [];

  let hm: RegExpExecArray | null;
  HANDLE_RE.lastIndex = 0;
  while ((hm = HANDLE_RE.exec(text)) !== null) {
    const handle = hm[0];
    spans.push({
      start: hm.index,
      end: hm.index + handle.length,
      html: `<a href="https://bsky.app/profile/${handle.slice(1)}">${handle}</a>`,
    });
  }

  for (const t of find(text)) {
    if (!t.isLink || t.start === undefined || t.end === undefined) continue;
    if (spans.some((s) => t.start! < s.end && t.end! > s.start)) continue;
    spans.push({
      start: t.start,
      end: t.end,
      html: `<a href="${htmlEscape(t.href)}">${htmlEscape(t.value)}</a>`,
    });
  }

  spans.sort((a, b) => a.start - b.start);

  let out = '';
  let pos = 0;
  for (const s of spans) {
    out += htmlEscape(text.slice(pos, s.start));
    out += s.html;
    pos = s.end;
  }
  out += htmlEscape(text.slice(pos));
  return out;
};

export const mapStatusToFeedItem = (raw: RawStatus): FeedItem => {
  const s = raw.status ?? raw;
  const text = cleanForFeed(s.text ?? '');
  const avatar = shrinkBlueskyAvatar(cleanForFeed(s.avatar_url ?? ''));
  const img = avatar
    ? `<img src="${htmlEscape(avatar)}" width="${AVATAR_PX}" height="${AVATAR_PX}" alt="" /> `
    : '';
  return {
    title: cleanForFeed(s.screen_name ?? ''),
    id: s.publication_id ?? s.url ?? '',
    link: s.url ?? '',
    description: text,
    content: img + linkifyForFeed(text),
    date: s.date ? new Date(s.date) : new Date(),
  };
};

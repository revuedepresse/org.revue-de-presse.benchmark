// Nitro plugin that populates /feed.xml. nuxt-module-feed fires `feed:generate`
// for every configured source; we dispatch by options.path.
//
// Field mapping:
//   title       ← screen_name
//   id          ← publication_id
//   link        ← url
//   description ← text                       (plain-text fallback for RSS 2.0 readers)
//   content     ← linkifyForFeed(text)       (HTML in <content:encoded>: clickable URLs + handles)
//   image       ← shrinkBlueskyAvatar(avatar_url)  (<enclosure type="image/..."/>)
//
// Errors are swallowed (legacy used logger.error noop). On any failure the
// feed still renders with channel metadata and zero items rather than 5xx.

import { defineNitroPlugin } from 'nitropack/runtime/plugin';
import type { NitroCtx } from 'nuxt-module-feed';
import { find } from 'linkifyjs';
import { cleanForFeed } from '../../utils/clean-text';

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
  image: string;
  date: Date;
};

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
  return {
    title: cleanForFeed(s.screen_name ?? ''),
    id: s.publication_id ?? s.url ?? '',
    link: s.url ?? '',
    description: text,
    content: linkifyForFeed(text),
    image: shrinkBlueskyAvatar(cleanForFeed(s.avatar_url ?? '')),
    date: s.date ? new Date(s.date) : new Date(),
  };
};

const formatYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const yesterdayYmd = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatYmd(d);
};

export default defineNitroPlugin((nitroApp) => {
  // nuxt-module-feed serves /feed.xml as `application/rss+xml` without a
  // charset; some readers default to Latin-1 and mojibake every accent
  // (`é` -> `Ã©`). Pin charset=utf-8 just before the response flushes.
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (event.path === '/feed.xml') {
      event.node.res.setHeader(
        'content-type',
        'application/rss+xml; charset=utf-8',
      );
    }
  });

  nitroApp.hooks.hook('feed:generate', async (ctx: NitroCtx) => {
    if (ctx.options.path !== '/feed.xml') return;

    const { feed } = ctx;

    feed.options = {
      id: 'https://revue-de-presse.org',
      link: 'https://revue-de-presse.org',
      title: 'Revue de presse',
      description:
        'Retrouver chaque jour les 10 publications médias ayant été les plus relayés au cours de la journée.',
      copyright: '',
    };

    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl as string | undefined;

    if (!apiBaseUrl) {
      console.warn('[feed.xml] NUXT_API_BASE_URL is not set; emitting empty feed.');
      return;
    }

    const day = yesterdayYmd();
    const url = new URL('/api/highlights', apiBaseUrl);
    url.searchParams.set('distinctSources', '1');
    url.searchParams.set('includeRetweets', '1');
    url.searchParams.set('excludeMedia', '0');
    url.searchParams.set('startDate', day);
    url.searchParams.set('endDate', day);

    const callOnce = async (token: string) =>
      $fetch<any>(url.toString(), {
        headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
      });

    let upstream: any;
    try {
      const { getApiToken, refreshApiToken } = await import('../utils/apiToken');
      try {
        upstream = await callOnce(await getApiToken());
      } catch (err: any) {
        if (err?.statusCode === 401) {
          upstream = await callOnce(await refreshApiToken());
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.warn('[feed.xml] upstream fetch failed:', (err as Error).message);
      return;
    }

    // Adapt Hydra collection → legacy RawStatus[] so mapStatusToFeedItem stays unchanged.
    const members = Array.isArray(upstream?.['hydra:member'])
      ? upstream['hydra:member']
      : Array.isArray(upstream?.member)
        ? upstream.member
        : null;
    const statuses: RawStatus[] = members !== null
      ? members.map((h: any): RawStatus => ({
          screen_name: h.screenName,
          publication_id: h.publicationId,
          url: h.url,
          avatar_url: h.avatarUrl ?? null,
          text: h.text,
          date: h.date,
        }))
      : (upstream?.statuses ?? []);

    for (const raw of statuses) {
      feed.addItem(mapStatusToFeedItem(raw));
    }
  });
});

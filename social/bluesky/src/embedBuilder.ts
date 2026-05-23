import sharp from 'sharp';
import { logger } from './logger.ts';

const UA = 'revue-de-presse-bluesky/1.0 (+https://revue-de-presse.org)';
const FETCH_TIMEOUT_MS = 10_000;
const HTML_MAX_BYTES = 5 * 1024 * 1024;
const IMG_MAX_BYTES_BEFORE = 8 * 1024 * 1024;
const BLOB_TARGET_BYTES = 950 * 1024;
const THUMB_MAX_W = 1200;
const THUMB_MAX_H = 630;
const TITLE_MAX_GRAPHEMES = 300;
const DESC_MAX_GRAPHEMES = 1000;

const META_RE = /<meta\s+([^>]+?)\/?>/gi;
const TITLE_RE = /<title>([^<]*)<\/title>/i;

function attrs(attrString: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of attrString.matchAll(/(\w[\w:-]*)\s*=\s*"([^"]*)"/g)) {
    out[m[1].toLowerCase()] = m[2];
  }
  return out;
}

function pickMeta(html: string): { ogTitle?: string; ogDesc?: string; ogImg?: string; twTitle?: string; twImg?: string; metaDesc?: string } {
  const r: { ogTitle?: string; ogDesc?: string; ogImg?: string; twTitle?: string; twImg?: string; metaDesc?: string } = {};
  for (const m of html.matchAll(META_RE)) {
    const a = attrs(m[1]);
    const key = (a.property ?? a.name ?? '').toLowerCase();
    const v = a.content;
    if (!v) continue;
    if (key === 'og:title') r.ogTitle = v;
    else if (key === 'og:description') r.ogDesc = v;
    else if (key === 'og:image' || key === 'og:image:url' || key === 'og:image:secure_url') r.ogImg = v;
    else if (key === 'twitter:title') r.twTitle = v;
    else if (key === 'twitter:image' || key === 'twitter:image:src') r.twImg = v;
    else if (key === 'description') r.metaDesc = v;
  }
  return r;
}

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
function clampGraphemes(s: string, max: number): string {
  let n = 0;
  const out: string[] = [];
  for (const seg of segmenter.segment(s)) {
    if (n + 1 > max) break;
    out.push(seg.segment);
    n += 1;
  }
  return out.join('');
}

export function extractOg(html: string, pageUrl: string): { title: string; description?: string; image?: string } {
  const m = pickMeta(html);
  const titleTag = TITLE_RE.exec(html)?.[1]?.trim();
  let title = m.ogTitle ?? m.twTitle ?? titleTag;
  if (!title) {
    try { title = new URL(pageUrl).hostname; } catch { title = pageUrl; }
  }
  const description = m.ogDesc ?? m.metaDesc;
  let image = m.ogImg ?? m.twImg;
  if (image) {
    try { image = new URL(image, pageUrl).toString(); } catch { image = undefined; }
  }
  return {
    title: clampGraphemes(title, TITLE_MAX_GRAPHEMES),
    description: description ? clampGraphemes(description, DESC_MAX_GRAPHEMES) : undefined,
    image,
  };
}

async function fetchWithCap(url: string, init: RequestInit, maxBytes: number): Promise<{ buf: Buffer; contentType: string } | null> {
  const ctl = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctl, redirect: 'follow' });
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    const buf = Buffer.from(ab);
    if (buf.byteLength > maxBytes) return null;
    return { buf, contentType: res.headers.get('content-type') ?? '' };
  } catch {
    return null;
  }
}

export async function resizeImage(input: Buffer): Promise<Buffer> {
  let q = 90;
  let out = await sharp(input).resize({ width: THUMB_MAX_W, height: THUMB_MAX_H, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
  while (out.byteLength > BLOB_TARGET_BYTES && q > 50) {
    q -= 10;
    out = await sharp(input).resize({ width: THUMB_MAX_W, height: THUMB_MAX_H, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
  }
  if (out.byteLength > BLOB_TARGET_BYTES) {
    throw new Error(`resizeImage: could not get below ${BLOB_TARGET_BYTES} bytes (final=${out.byteLength}, q=${q})`);
  }
  return out;
}

export type Embed = {
  $type: 'app.bsky.embed.external';
  external: { uri: string; title: string; description: string; thumb?: unknown };
};

export type BlobUploader = {
  uploadBlob: (buf: Buffer, opts: { encoding: string }) => Promise<{ data: { blob: unknown } }>;
};

export type EmbedBuilder = { build: (url: string) => Promise<Embed | null> };

export function createEmbedBuilder(deps: {
  agent: BlobUploader;
  resizeImage?: unknown;
}): EmbedBuilder {
  const resize: (buf: Buffer) => Promise<Buffer> =
    (deps.resizeImage as ((buf: Buffer) => Promise<Buffer>) | undefined) ?? resizeImage;
  return {
    async build(url: string): Promise<Embed | null> {
      const fetched = await fetchWithCap(url, { headers: { 'user-agent': UA, 'accept-language': 'fr' } }, HTML_MAX_BYTES);
      if (!fetched) {
        logger.warn({ url }, 'embedBuilder: OG fetch failed; reply will render without an embed');
        return null;
      }
      const og = extractOg(fetched.buf.toString('utf8'), url);

      let thumb: unknown | undefined;
      if (og.image) {
        const img = await fetchWithCap(og.image, { headers: { 'user-agent': UA, 'accept-language': 'fr' } }, IMG_MAX_BYTES_BEFORE);
        if (!img) {
          logger.warn({ url, image: og.image }, 'embedBuilder: og:image fetch failed; embed will render without thumb');
        } else {
          try {
            const resized = await resize(img.buf);
            const uploaded = await deps.agent.uploadBlob(resized, { encoding: 'image/jpeg' });
            thumb = uploaded.data.blob;
          } catch (err) {
            logger.warn({ url, image: og.image, err }, 'embedBuilder: resize or uploadBlob failed; embed will render without thumb');
          }
        }
      }

      return {
        $type: 'app.bsky.embed.external',
        external: {
          uri: url,
          title: og.title,
          description: og.description ?? '',
          thumb,
        },
      };
    },
  };
}

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { extractOg, createEmbedBuilder } from '../src/embedBuilder.ts';

const HTML_FULL = `
<html><head>
  <meta property="og:title" content="Le grand titre">
  <meta property="og:description" content="Une accroche détaillée.">
  <meta property="og:image" content="https://cdn.example.org/hero.jpg">
</head><body></body></html>`;

const HTML_TWITTER_FALLBACK = `
<html><head>
  <title>Page title</title>
  <meta name="twitter:image" content="/img/cover.png">
  <meta name="description" content="Body description">
</head></html>`;

describe('extractOg', () => {
  it('extracts og:title, og:description, og:image from full OG tags', () => {
    const og = extractOg(HTML_FULL, 'https://example.org/page');
    expect(og.title).toBe('Le grand titre');
    expect(og.description).toBe('Une accroche détaillée.');
    expect(og.image).toBe('https://cdn.example.org/hero.jpg');
  });

  it('falls back to <title> and twitter:image (resolved against page URL)', () => {
    const og = extractOg(HTML_TWITTER_FALLBACK, 'https://example.org/page');
    expect(og.title).toBe('Page title');
    expect(og.description).toBe('Body description');
    expect(og.image).toBe('https://example.org/img/cover.png');
  });

  it('falls back to hostname when no title is present', () => {
    const og = extractOg('<html></html>', 'https://example.org/path');
    expect(og.title).toBe('example.org');
  });
});

describe('createEmbedBuilder', () => {
  type FetchMock = ReturnType<typeof vi.fn>;
  let fetchMock: FetchMock;
  let uploadBlob: ReturnType<typeof vi.fn>;
  let resize: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    uploadBlob = vi.fn().mockResolvedValue({ data: { blob: { $type: 'blob', mimeType: 'image/jpeg', size: 42, ref: { $link: 'bafy' } } } });
    resize = vi.fn().mockResolvedValue(Buffer.from('jpeg-bytes'));
  });

  it('returns external embed with thumb on the happy path', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(HTML_FULL, { status: 200, headers: { 'content-type': 'text/html' } }))
      .mockResolvedValueOnce(new Response(Buffer.from('img'), { status: 200, headers: { 'content-type': 'image/jpeg' } }));
    const builder = createEmbedBuilder({ agent: { uploadBlob } as never, resizeImage: resize });
    const e = await builder.build('https://example.org/page');
    expect(e?.$type).toBe('app.bsky.embed.external');
    expect(e?.external.title).toBe('Le grand titre');
    expect(e?.external.uri).toBe('https://example.org/page');
    expect(e?.external.thumb).toBeDefined();
    expect(uploadBlob).toHaveBeenCalledTimes(1);
  });

  it('returns embed without thumb when og:image is absent', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('<html><head><title>T</title></head></html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    );
    const builder = createEmbedBuilder({ agent: { uploadBlob } as never, resizeImage: resize });
    const e = await builder.build('https://example.org/page');
    expect(e?.external.thumb).toBeUndefined();
    expect(uploadBlob).not.toHaveBeenCalled();
  });

  it('returns embed without thumb when og:image fetch fails', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(HTML_FULL, { status: 200, headers: { 'content-type': 'text/html' } }))
      .mockResolvedValueOnce(new Response('', { status: 500 }));
    const builder = createEmbedBuilder({ agent: { uploadBlob } as never, resizeImage: resize });
    const e = await builder.build('https://example.org/page');
    expect(e?.external.title).toBe('Le grand titre');
    expect(e?.external.thumb).toBeUndefined();
  });

  it('returns embed without thumb when resize throws', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(HTML_FULL, { status: 200, headers: { 'content-type': 'text/html' } }))
      .mockResolvedValueOnce(new Response(Buffer.from('img'), { status: 200, headers: { 'content-type': 'image/jpeg' } }));
    const failingResize = vi.fn().mockRejectedValue(new Error('unsupported image'));
    const builder = createEmbedBuilder({ agent: { uploadBlob } as never, resizeImage: failingResize });
    const e = await builder.build('https://example.org/page');
    expect(e?.external.thumb).toBeUndefined();
  });

  it('returns null embed when the OG fetch itself fails', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 504 }));
    const builder = createEmbedBuilder({ agent: { uploadBlob } as never, resizeImage: resize });
    const e = await builder.build('https://example.org/page');
    expect(e).toBeNull();
  });
});

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publishVideo } from '../src/tiktok/publish.ts';
import {
  TikTokInitError,
  TikTokPublishFailedError,
} from '../src/tiktok/types.ts';

function mp4Path(): string {
  const dir = mkdtempSync(join(tmpdir(), 'pub-'));
  const path = join(dir, 'x.mp4');
  writeFileSync(path, Buffer.alloc(1024, 0));
  return path;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('publishVideo', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('inbox mode: init -> upload -> status -> INBOX_DELIVERED', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p1', upload_url: 'https://upload.example/u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: 'SEND_TO_USER_INBOX' } }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await publishVideo({
      accessToken: 'at',
      mp4Path: mp4Path(),
      caption: '',
      mode: 'inbox',
      pollIntervalMs: 1,
      pollTimeoutMs: 5000,
    });
    expect(result.publishId).toBe('p1');
    expect(result.finalStatus).toBe('INBOX_DELIVERED');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/inbox\/video\/init/);

    // Init body has source_info but no post_info in inbox mode.
    const initBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(initBody.source_info.source).toBe('FILE_UPLOAD');
    expect(initBody.post_info).toBeUndefined();
  });

  it('direct mode: init has post_info with title + video_cover_timestamp_ms=23500', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p2', upload_url: 'https://upload.example/u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: 'PUBLISH_COMPLETE' } }));
    vi.stubGlobal('fetch', fetchMock);

    const r = await publishVideo({
      accessToken: 'at',
      mp4Path: mp4Path(),
      caption: 'hello',
      mode: 'direct',
      pollIntervalMs: 1,
      pollTimeoutMs: 5000,
    });
    expect(r.finalStatus).toBe('PUBLISHED');

    const initBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/post\/publish\/video\/init/);
    expect(initBody.post_info.title).toBe('hello');
    expect(initBody.post_info.video_cover_timestamp_ms).toBe(23500);
    expect(initBody.post_info.privacy_level).toBe('PUBLIC_TO_EVERYONE');
    expect(initBody.source_info.source).toBe('FILE_UPLOAD');
  });

  it('direct mode PUBLISH_COMPLETE returns postUrls built from publicaly_available_post_id', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p3', upload_url: 'https://upload.example/u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({
        data: { status: 'PUBLISH_COMPLETE', publicaly_available_post_id: ['7400000000000000001'] },
      }));
    vi.stubGlobal('fetch', fetchMock);

    const r = await publishVideo({
      accessToken: 'at',
      mp4Path: mp4Path(),
      caption: 'hello',
      mode: 'direct',
      pollIntervalMs: 1,
      pollTimeoutMs: 5000,
    });
    expect(r.postUrls).toEqual([
      'https://www.tiktok.com/@revue_2_presse/video/7400000000000000001',
    ]);
  });

  it('inbox mode INBOX_DELIVERED leaves postUrls undefined', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p4', upload_url: 'https://upload.example/u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: 'SEND_TO_USER_INBOX' } }));
    vi.stubGlobal('fetch', fetchMock);

    const r = await publishVideo({
      accessToken: 'at',
      mp4Path: mp4Path(),
      caption: '',
      mode: 'inbox',
      pollIntervalMs: 1,
      pollTimeoutMs: 5000,
    });
    expect(r.postUrls).toBeUndefined();
  });

  it('upload PUT sets video/mp4 + Content-Range', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p', upload_url: 'https://upload.example/u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: 'SEND_TO_USER_INBOX' } }));
    vi.stubGlobal('fetch', fetchMock);
    await publishVideo({ accessToken: 'at', mp4Path: mp4Path(), caption: '', mode: 'inbox', pollIntervalMs: 1, pollTimeoutMs: 5000 });
    const uploadInit = fetchMock.mock.calls[1][1];
    expect(String(fetchMock.mock.calls[1][0])).toBe('https://upload.example/u');
    expect(uploadInit.method).toBe('PUT');
    expect(uploadInit.headers['Content-Type']).toBe('video/mp4');
    expect(uploadInit.headers['Content-Range']).toBe('bytes 0-1023/1024');
  });

  it('throws TikTokInitError on non-2xx init', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('boom', { status: 500 })));
    await expect(publishVideo({
      accessToken: 'at', mp4Path: mp4Path(), caption: '', mode: 'inbox',
      pollIntervalMs: 1, pollTimeoutMs: 1000,
    })).rejects.toBeInstanceOf(TikTokInitError);
  });

  it('throws TikTokPublishFailedError when status -> FAILED', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse({ data: { publish_id: 'p', upload_url: 'https://u' } }))
      .mockResolvedValueOnce(new Response('', { status: 201 }))
      .mockResolvedValueOnce(jsonResponse({ data: { status: 'FAILED', fail_reason: 'too_short' } })));
    await expect(publishVideo({
      accessToken: 'at', mp4Path: mp4Path(), caption: '', mode: 'inbox',
      pollIntervalMs: 1, pollTimeoutMs: 5000,
    })).rejects.toBeInstanceOf(TikTokPublishFailedError);
  });
});

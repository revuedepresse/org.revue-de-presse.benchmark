import { readFile, stat } from 'node:fs/promises';
import { TIKTOK } from './endpoints.ts';
import {
  InitResponseSchema,
  StatusResponseSchema,
  TikTokInitError,
  TikTokUploadError,
  TikTokPublishFailedError,
  TikTokStatusTimeoutError,
} from './types.ts';
import { CHOREO_TOTAL_MS } from '../render/scrollChoreo.ts';

export interface PublishOpts {
  accessToken: string;
  mp4Path: string;
  caption: string;
  mode: 'inbox' | 'direct';
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
}

export interface PublishResult {
  publishId: string;
  finalStatus: 'INBOX_DELIVERED' | 'PUBLISHED';
}

export async function publishVideo(opts: PublishOpts): Promise<PublishResult> {
  const stats = await stat(opts.mp4Path);
  const bytes = stats.size;

  // 1. init
  const initUrl = opts.mode === 'inbox' ? TIKTOK.inboxInit : TIKTOK.directInit;
  const initBody =
    opts.mode === 'inbox'
      ? {
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: bytes,
            chunk_size: bytes,
            total_chunk_count: 1,
          },
        }
      : {
          post_info: {
            title: opts.caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
            video_cover_timestamp_ms: CHOREO_TOTAL_MS,
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: bytes,
            chunk_size: bytes,
            total_chunk_count: 1,
          },
        };

  const initRes = await fetch(initUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${opts.accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(initBody),
  });
  const initText = await initRes.text();
  if (!initRes.ok) {
    throw new TikTokInitError(`init ${initRes.status}: ${initText}`);
  }
  const init = InitResponseSchema.parse(JSON.parse(initText));
  const { publish_id, upload_url } = init.data;

  // 2. upload
  const mp4 = await readFile(opts.mp4Path);
  const upRes = await fetch(upload_url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes 0-${bytes - 1}/${bytes}`,
    },
    body: mp4,
  });
  if (!upRes.ok) {
    throw new TikTokUploadError(`upload ${upRes.status}: ${await upRes.text()}`);
  }

  // 3. poll
  const interval = opts.pollIntervalMs ?? 3000;
  const timeout = opts.pollTimeoutMs ?? 90_000;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const sRes = await fetch(TIKTOK.publishStatus, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${opts.accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id }),
    });
    const sText = await sRes.text();
    if (!sRes.ok) {
      throw new TikTokPublishFailedError(`status ${sRes.status}: ${sText}`);
    }
    const status = StatusResponseSchema.parse(JSON.parse(sText)).data;
    if (status.status === 'SEND_TO_USER_INBOX') {
      return { publishId: publish_id, finalStatus: 'INBOX_DELIVERED' };
    }
    if (status.status === 'PUBLISH_COMPLETE') {
      return { publishId: publish_id, finalStatus: 'PUBLISHED' };
    }
    if (status.status === 'FAILED') {
      throw new TikTokPublishFailedError(
        `publish FAILED: ${status.fail_reason ?? 'unknown'}`,
      );
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new TikTokStatusTimeoutError(`status poll exceeded ${timeout}ms`);
}

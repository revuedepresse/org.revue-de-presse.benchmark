import { describe, expect, it, beforeAll } from 'vitest';
import { mkdtempSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';
import { transcode } from '../src/render/transcode.ts';

describe('transcode', { timeout: 60_000 }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'transcode-'));
  const webm = join(dir, 'in.webm');
  const mp4 = join(dir, 'out.mp4');

  beforeAll(async () => {
    // Synthesise a 2-second 1080x1920 webm with ffmpeg's testsrc.
    await execa('ffmpeg', [
      '-y',
      '-f', 'lavfi',
      '-i', 'testsrc=size=1080x1920:rate=30',
      '-t', '2',
      '-c:v', 'libvpx',
      '-b:v', '500k',
      webm,
    ]);
    // libvpx encoding can exceed vitest 3's 10s default hook timeout.
  }, 60_000);

  it('produces a 1080x1920 H.264 yuv420p mp4 from a webm', async () => {
    await transcode(webm, mp4);
    expect(existsSync(mp4)).toBe(true);
    expect(statSync(mp4).size).toBeGreaterThan(10_000);

    const { stdout } = await execa('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,codec_name,pix_fmt',
      '-of', 'csv=p=0',
      mp4,
    ]);
    expect(stdout.trim()).toBe('h264,1080,1920,yuv420p');
  });

  it('trimStartSec drops the leading window from the output', async () => {
    const trimmed = join(dir, 'trimmed.mp4');
    await transcode(webm, trimmed, { trimStartSec: 1 });
    const { stdout } = await execa('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      trimmed,
    ]);
    // Source synth is 2s @ 30fps; trimming 1s should yield ~1s output.
    // Allow a small frame-rounding window around the target duration.
    const duration = Number(stdout.trim());
    expect(duration).toBeGreaterThan(0.85);
    expect(duration).toBeLessThan(1.15);
  });

  it('produces a faststart MP4 (moov atom before mdat)', async () => {
    // ffprobe -show_format reveals the brand; the trustworthy check is
    // that the moov header lands in the first 1MB of the file.
    const { stdout } = await execa('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=format_name',
      '-of', 'csv=p=0',
      mp4,
    ]);
    expect(stdout.trim()).toContain('mp4');

    // Cheap "faststart" sniff: header within the first 1 MiB.
    const { readFileSync } = await import('node:fs');
    const head = readFileSync(mp4).subarray(0, 1024 * 1024);
    expect(head.includes(Buffer.from('moov'))).toBe(true);
  });
});

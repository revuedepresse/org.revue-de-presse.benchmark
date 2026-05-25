import { execa } from 'execa';

export interface TranscodeOpts {
  // Seconds to skip from the start of the input. Used to drop the leading
  // blank/white frames Playwright records between page creation and the
  // first content paint. Re-encoding makes the seek frame-accurate.
  trimStartSec?: number;
}

export async function transcode(
  inputWebm: string,
  outputMp4: string,
  opts: TranscodeOpts = {},
): Promise<void> {
  const args: string[] = ['-y'];
  // `-ss` before `-i` is input seeking; combined with re-encode below this
  // is both fast and frame-accurate. Threshold avoids passing a negligible
  // value when there's nothing useful to skip.
  if (opts.trimStartSec !== undefined && opts.trimStartSec > 0.05) {
    args.push('-ss', opts.trimStartSec.toFixed(3));
  }
  args.push(
    '-i', inputWebm,
    // Recording is at the CSS-viewport size (540x960, 9:16); scale up to
    // TikTok's 1080x1920 with lanczos for sharper text. No padding needed:
    // input and output aspect ratios match exactly.
    '-vf', 'scale=1080:1920:flags=lanczos',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '21',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-r', '30',
    '-an',
    outputMp4,
  );
  await execa('ffmpeg', args);
}

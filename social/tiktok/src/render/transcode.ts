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
    '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
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

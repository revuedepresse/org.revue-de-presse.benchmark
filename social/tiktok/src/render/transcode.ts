import { execa } from 'execa';

export async function transcode(inputWebm: string, outputMp4: string): Promise<void> {
  await execa('ffmpeg', [
    '-y',
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
  ]);
}

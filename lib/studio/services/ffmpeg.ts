import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export interface VideoTrack {
  id: string;
  type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY' | 'TRANSITION';
  assetId?: string;
  startTime: number;
  endTime: number;
  volume: number;
  filePath?: string;
  url?: string;
}

export interface CompileVideoOptions {
  tracks: VideoTrack[];
  outputPath: string;
  format: 'mp4' | 'webm';
  width?: number;
  height?: number;
  fps?: number;
}

/**
 * Compile video from tracks using FFmpeg
 */
export async function compileVideo(
  options: CompileVideoOptions
): Promise<string> {
  const {
    tracks,
    outputPath,
    format,
    width = 1920,
    height = 1080,
    fps = 30,
  } = options;

  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // Set output format
    if (format === 'mp4') {
      command.format('mp4').videoCodec('libx264').audioCodec('aac');
    } else {
      command.format('webm').videoCodec('libvpx-vp9').audioCodec('libopus');
    }

    // Set video dimensions and FPS
    command
      .size(`${width}x${height}`)
      .fps(fps)
      .outputOptions(['-pix_fmt yuv420p']);

    // Add video and audio tracks
    const videoTracks = tracks.filter((t) => t.type === 'VIDEO');
    const audioTracks = tracks.filter((t) => t.type === 'AUDIO' || t.type === 'MUSIC');

    // Add video inputs
    videoTracks.forEach((track) => {
      if (track.filePath) {
        command.input(track.filePath);
      }
    });

    // Add audio inputs
    audioTracks.forEach((track) => {
      if (track.filePath) {
        command.input(track.filePath);
      }
    });

    // Complex filter for overlaying tracks
    const filters: string[] = [];
    let videoIndex = 0;
    let audioIndex = 0;

    videoTracks.forEach((track, index) => {
      if (track.filePath) {
        if (index === 0) {
          filters.push(
            `[${videoIndex}:v]scale=${width}:${height},setpts=PTS-STARTPTS[v${index}]`
          );
        } else {
          filters.push(
            `[${videoIndex}:v]scale=${width}:${height},setpts=PTS-STARTPTS[v${index}];[v${index - 1}][v${index}]overlay=0:0[v${index}]`
          );
        }
        videoIndex++;
      }
    });

    audioTracks.forEach((track, index) => {
      if (track.filePath) {
        const volume = Math.max(0, Math.min(1, track.volume));
        filters.push(
          `[${videoIndex + index}:a]volume=${volume},adelay=${Math.floor(track.startTime * 1000)}|${Math.floor(track.startTime * 1000)}[a${index}]`
        );
      }
    });

    if (filters.length > 0) {
      command.complexFilter(filters);
    }

    // Set output
    command.output(outputPath);

    // Execute
    command
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      const duration = metadata.format?.duration;
      if (duration === undefined) {
        reject(new Error('Could not determine video duration'));
        return;
      }
      resolve(duration);
    });
  });
}

/**
 * Extract audio from video
 */
export async function extractAudio(
  videoPath: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}


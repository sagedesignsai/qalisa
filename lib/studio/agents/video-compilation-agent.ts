import { Experimental_Agent as Agent } from 'ai';
import { google } from '@ai-sdk/google';
import { compileVideo } from '../services/ffmpeg';
import type { VideoTrack } from '../types';
import { uploadMedia } from '../services/appwrite';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Agent that coordinates video compilation
 */
export const videoCompilationAgent = new Agent({
  model: google('gemini-2.5-flash'),
  system: `You are a video compilation coordinator. Your job is to compile video tracks into a final video file using FFmpeg.`,
});

export interface CompileVideoResult {
  fileId: string;
  url: string;
  duration: number;
  format: string;
}

/**
 * Compile video from tracks and upload to Appwrite
 */
export async function compileAndUploadVideo(
  tracks: VideoTrack[],
  format: 'mp4' | 'webm' = 'mp4',
  quality: string = '1080p'
): Promise<CompileVideoResult> {
  // Determine resolution from quality
  const resolution = quality === '1080p' ? { width: 1920, height: 1080 } :
                     quality === '720p' ? { width: 1280, height: 720 } :
                     { width: 1920, height: 1080 };

  // Create temporary output file
  const outputFilename = `video-${Date.now()}.${format}`;
  const outputPath = join(tmpdir(), outputFilename);

  try {
    // Download tracks if needed (if they're URLs, download them first)
    const tracksWithPaths = await Promise.all(
      tracks.map(async (track) => {
        if (track.filePath) {
          return track;
        }
        if (track.url) {
          // Download file from URL
          const response = await fetch(track.url);
          const buffer = await response.arrayBuffer();
          const tempPath = join(tmpdir(), `track-${track.id}-${Date.now()}`);
          await writeFile(tempPath, Buffer.from(buffer));
          return { ...track, filePath: tempPath };
        }
        return track;
      })
    );

    // Compile video
    await compileVideo({
      tracks: tracksWithPaths.filter((t) => t.filePath) as VideoTrack[],
      outputPath,
      format,
      ...resolution,
    });

    // Read compiled video
    const videoBuffer = await import('fs').then((fs) => fs.promises.readFile(outputPath));

    // Upload to Appwrite
    const { fileId, url } = await uploadMedia(
      videoBuffer,
      outputFilename,
      format === 'mp4' ? 'video/mp4' : 'video/webm',
      'exports'
    );

    // Cleanup temporary files
    await unlink(outputPath);
    for (const track of tracksWithPaths) {
      if (track.filePath && track.filePath.startsWith(tmpdir())) {
        try {
          await unlink(track.filePath);
        } catch {
          // Ignore cleanup errors
        }
      }
    }

    // Calculate duration from tracks
    const duration = Math.max(...tracks.map((t) => t.endTime), 0);

    return {
      fileId,
      url,
      duration,
      format,
    };
  } catch (error) {
    // Cleanup on error
    try {
      await unlink(outputPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}


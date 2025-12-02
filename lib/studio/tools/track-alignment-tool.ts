import { tool } from 'ai';
import { z } from 'zod';
import type { VideoScript } from './script-generation-tool';

export interface AlignedTrack {
  sceneId: string;
  assetId: string;
  type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY';
  startTime: number;
  endTime: number;
  volume: number;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface TrackAlignmentResult {
  tracks: AlignedTrack[];
  totalDuration: number;
  synchronized: boolean;
}

/**
 * Tool to align video tracks with precise timing based on audio duration
 */
export const trackAlignmentTool = tool({
  description: 'Align video tracks with precise timing, ensuring audio-visual synchronization. Calculates start/end times based on audio duration and scene order.',
  inputSchema: z.object({
    script: z.object({
      scenes: z.array(z.object({
        id: z.string(),
        order: z.number(),
        duration: z.number(),
        text: z.string(),
        narrationText: z.string(),
      })),
      estimatedDuration: z.number(),
    }).describe('Video script with scenes'),
    assets: z.object({
      audioFiles: z.array(z.object({
        fileId: z.string(),
        url: z.string(),
        sceneId: z.string(),
        duration: z.number().optional().describe('Audio duration in seconds'),
      })),
      imageFiles: z.array(z.object({
        fileId: z.string(),
        url: z.string(),
        sceneId: z.string(),
      })),
      musicFile: z.object({
        fileId: z.string(),
        url: z.string(),
        duration: z.number().optional(),
      }).optional(),
    }).describe('Generated media assets'),
  }),
  execute: async ({ script, assets }) => {
    try {
      const tracks: AlignedTrack[] = [];
      let currentTime = 0;
      let trackOrder = 0;

      // Process each scene in order
      for (const scene of script.scenes.sort((a, b) => a.order - b.order)) {
        const audioAsset = assets.audioFiles.find(a => a.sceneId === scene.id);
        const imageAsset = assets.imageFiles.find(a => a.sceneId === scene.id);

        // Use actual audio duration if available, otherwise use scene duration
        const audioDuration = audioAsset?.duration || scene.duration;
        const sceneStartTime = currentTime;
        const sceneEndTime = currentTime + audioDuration;

        // Create audio track
        if (audioAsset) {
          tracks.push({
            sceneId: scene.id,
            assetId: audioAsset.fileId,
            type: 'AUDIO',
            startTime: sceneStartTime,
            endTime: sceneEndTime,
            volume: 1.0,
            order: trackOrder++,
            metadata: {
              sceneOrder: scene.order,
              narrationText: scene.narrationText,
            },
          });
        }

        // Create video track (image) - aligned with audio
        if (imageAsset) {
          tracks.push({
            sceneId: scene.id,
            assetId: imageAsset.fileId,
            type: 'VIDEO',
            startTime: sceneStartTime,
            endTime: sceneEndTime,
            volume: 1.0,
            order: trackOrder++,
            metadata: {
              sceneOrder: scene.order,
              sceneText: scene.text,
            },
          });
        }

        // Create text overlay track for narration (optional, can be added later)
        if (scene.narrationText) {
          tracks.push({
            sceneId: scene.id,
            assetId: `text-${scene.id}`,
            type: 'TEXT_OVERLAY',
            startTime: sceneStartTime,
            endTime: sceneEndTime,
            volume: 1.0,
            order: trackOrder++,
            metadata: {
              sceneOrder: scene.order,
              text: scene.narrationText,
              style: 'subtitles',
            },
          });
        }

        currentTime = sceneEndTime;
      }

      // Add background music track if available
      if (assets.musicFile) {
        const musicDuration = assets.musicFile.duration || script.estimatedDuration;
        tracks.push({
          sceneId: 'music',
          assetId: assets.musicFile.fileId,
          type: 'MUSIC',
          startTime: 0,
          endTime: Math.max(musicDuration, currentTime),
          volume: 0.3, // Lower volume for background music
          order: trackOrder++,
          metadata: {
            isBackground: true,
          },
        });
      }

      // Calculate total duration
      const totalDuration = Math.max(
        currentTime,
        script.estimatedDuration,
        ...tracks.map(t => t.endTime)
      );

      // Verify synchronization
      const synchronized = tracks.every(track => {
        if (track.type === 'AUDIO' || track.type === 'VIDEO') {
          const sceneTracks = tracks.filter(t => t.sceneId === track.sceneId);
          const audioTrack = sceneTracks.find(t => t.type === 'AUDIO');
          const videoTrack = sceneTracks.find(t => t.type === 'VIDEO');
          
          if (audioTrack && videoTrack) {
            return Math.abs(audioTrack.startTime - videoTrack.startTime) < 0.1 &&
                   Math.abs(audioTrack.endTime - videoTrack.endTime) < 0.1;
          }
        }
        return true;
      });

      return {
        success: true,
        tracks,
        totalDuration,
        synchronized,
        trackCount: tracks.length,
      } as TrackAlignmentResult;
    } catch (error) {
      throw new Error(`Track alignment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


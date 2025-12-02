import { tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { AlignedTrack } from './track-alignment-tool';
import { DEFAULT_COMPOSITION } from '../services/remotion';
import { secondsToFrames } from '../services/remotion';

export interface RemotionScene {
  id: string;
  from: number; // frame
  durationInFrames: number;
  tracks: Array<{
    type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY';
    assetId: string;
    startTime: number;
    endTime: number;
    volume: number;
    metadata?: Record<string, unknown>;
  }>;
}

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'none';
  duration: number; // frames
  fromScene: string;
  toScene: string;
}

export interface EffectConfig {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation';
  value: number;
  sceneId?: string;
}

export interface RemotionCompositionConfig {
  id: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  scenes: RemotionScene[];
  transitions?: TransitionConfig[];
  effects?: EffectConfig[];
}

/**
 * Tool to generate Remotion composition configuration and optional component code
 */
export const remotionCompositionTool = tool({
  description: 'Generate Remotion composition configuration from aligned tracks. Creates both structured config data and optional React component code for Remotion.',
  inputSchema: z.object({
    tracks: z.array(z.object({
      sceneId: z.string(),
      assetId: z.string(),
      type: z.enum(['VIDEO', 'AUDIO', 'MUSIC', 'TEXT_OVERLAY']),
      startTime: z.number(),
      endTime: z.number(),
      volume: z.number(),
      order: z.number(),
      metadata: z.record(z.unknown()).optional(),
    })).describe('Aligned video tracks'),
    totalDuration: z.number().describe('Total video duration in seconds'),
    generateComponentCode: z.boolean().optional().default(false).describe('Whether to generate React component code'),
    compositionSettings: z.object({
      fps: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }).optional().describe('Custom composition settings'),
  }),
  execute: async ({ tracks, totalDuration, generateComponentCode = false, compositionSettings }) => {
    try {
      const fps = compositionSettings?.fps || DEFAULT_COMPOSITION.fps;
      const width = compositionSettings?.width || DEFAULT_COMPOSITION.width;
      const height = compositionSettings?.height || DEFAULT_COMPOSITION.height;
      const durationInFrames = secondsToFrames(totalDuration, fps);

      // Group tracks by scene
      const sceneMap = new Map<string, AlignedTrack[]>();
      for (const track of tracks) {
        if (!sceneMap.has(track.sceneId)) {
          sceneMap.set(track.sceneId, []);
        }
        sceneMap.get(track.sceneId)!.push(track as AlignedTrack);
      }

      // Create scenes from grouped tracks
      const scenes: RemotionScene[] = Array.from(sceneMap.entries()).map(([sceneId, sceneTracks]) => {
        const sortedTracks = sceneTracks.sort((a, b) => a.order - b.order);
        const startTime = Math.min(...sortedTracks.map(t => t.startTime));
        const endTime = Math.max(...sortedTracks.map(t => t.endTime));
        const from = secondsToFrames(startTime, fps);
        const durationInFrames = secondsToFrames(endTime - startTime, fps);

        return {
          id: sceneId,
          from,
          durationInFrames,
          tracks: sortedTracks.map(track => ({
            type: track.type,
            assetId: track.assetId,
            startTime: track.startTime,
            endTime: track.endTime,
            volume: track.volume,
            metadata: track.metadata,
          })),
        };
      });

      // Generate transitions between scenes
      const transitions: TransitionConfig[] = [];
      const sortedScenes = scenes.sort((a, b) => a.from - b.from);
      for (let i = 0; i < sortedScenes.length - 1; i++) {
        const currentScene = sortedScenes[i];
        const nextScene = sortedScenes[i +1];
        
        transitions.push({
          type: 'fade',
          duration: Math.floor(fps * 0.5), // 0.5 second fade
          fromScene: currentScene.id,
          toScene: nextScene.id,
        });
      }

      // Create composition config
      const config: RemotionCompositionConfig = {
        id: 'studio-video',
        fps,
        width,
        height,
        durationInFrames,
        scenes,
        transitions,
      };

      // Generate component code if requested
      let componentCode: string | undefined;
      if (generateComponentCode) {
        const codePrompt = `Generate a Remotion React component that renders this video composition:

Composition Config:
- FPS: ${fps}
- Dimensions: ${width}x${height}
- Duration: ${durationInFrames} frames
- Scenes: ${scenes.length}
- Transitions: ${transitions.length}

Scenes:
${scenes.map(s => `- Scene ${s.id}: frames ${s.from} to ${s.from + s.durationInFrames}, ${s.tracks.length} tracks`).join('\n')}

Generate a complete Remotion component that:
1. Uses Sequence components for each scene
2. Handles transitions between scenes
3. Renders video tracks (images), audio tracks, and text overlays
4. Properly synchronizes audio with video
5. Uses AbsoluteFill for layout
6. Imports necessary Remotion components (Sequence, AbsoluteFill, useVideoConfig, etc.)

Return only the React component code, no markdown formatting.`;

        const codeResult = await generateText({
          model: google('gemini-2.5-pro'),
          prompt: codePrompt,
        });

        componentCode = codeResult.text;
      }

      return {
        success: true,
        config,
        componentCode,
        sceneCount: scenes.length,
        transitionCount: transitions.length,
      };
    } catch (error) {
      throw new Error(`Remotion composition generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


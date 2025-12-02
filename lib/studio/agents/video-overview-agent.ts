import { Experimental_Agent as Agent, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { scriptGenerationTool } from '../tools/script-generation-tool';
import { trackAlignmentTool } from '../tools/track-alignment-tool';
import { remotionCompositionTool } from '../tools/remotion-composition-tool';
import { ttsTool } from '../tools/tts-tool';
import { imageGenerationTool } from '../tools/image-generation-tool';
import { musicGenerationTool } from '../tools/music-generation-tool';
import type { VideoScript } from '../tools/script-generation-tool';
import type { GeneratedMedia } from './media-generation-agent';
import type { AlignedTrack } from '../tools/track-alignment-tool';
import type { RemotionCompositionConfig } from '../tools/remotion-composition-tool';

export interface VideoOverviewAgentResult {
  script: VideoScript;
  assets: GeneratedMedia;
  tracks: AlignedTrack[];
  remotionConfig: RemotionCompositionConfig;
  remotionComponentCode?: string;
}

export interface VideoOverviewAgentInput {
  messages: any[];
  projectContext?: {
    title?: string;
    description?: string;
  };
  includeMusic?: boolean;
  generateComponentCode?: boolean;
}

/**
 * Unified video overview agent that orchestrates the entire video generation workflow
 * 
 * This agent:
 * 1. Generates video script from chat messages
 * 2. Generates all media assets (TTS, images, music)
 * 3. Aligns tracks with precise timing
 * 4. Creates Remotion composition configuration
 * 5. Optionally generates Remotion component code
 */
export const videoOverviewAgent = new Agent({
  model: google('gemini-2.5-pro'),
  system: `You are an expert video production coordinator. Your job is to create comprehensive video overviews by:

1. Analyzing conversation content and generating structured video scripts
2. Coordinating media generation (text-to-speech, images, background music)
3. Aligning audio-visual tracks with precise timing
4. Creating Remotion-compatible video compositions

Work systematically through each step:
- First, generate a detailed script with scenes and timing
- Then generate all required media assets (TTS for narration, images for visuals, optional music)
- Align all tracks to ensure perfect synchronization
- Finally, create Remotion composition configuration for video editing

Ensure all outputs are production-ready and properly structured.`,
  tools: {
    generateScript: scriptGenerationTool,
    generateTTS: ttsTool,
    generateImage: imageGenerationTool,
    generateMusic: musicGenerationTool,
    alignTracks: trackAlignmentTool,
    createRemotionComposition: remotionCompositionTool,
  },
  stopWhen: stepCountIs(20), // Allow up to 20 steps for complex workflows
});

/**
 * Generate complete video overview using the unified agent
 */
export async function generateVideoOverview(
  input: VideoOverviewAgentInput
): Promise<VideoOverviewAgentResult> {
  const { messages, projectContext, includeMusic = false, generateComponentCode = false } = input;

  // Step 1: Generate script
  const scriptResult = await scriptGenerationTool.execute({
    messages,
    projectContext,
  });

  if (!scriptResult.success || !scriptResult.script) {
    throw new Error('Failed to generate video script');
  }

  const script = scriptResult.script;

  // Step 2: Generate media assets
  const audioFiles: Array<{ fileId: string; url: string; sceneId: string; duration?: number }> = [];
  const imageFiles: Array<{ fileId: string; url: string; sceneId: string }> = [];

  // Generate TTS for each scene
  for (const scene of script.scenes) {
    try {
      const ttsResult = await ttsTool.execute({
        text: scene.narrationText,
        voiceName: 'Kore',
      });

      audioFiles.push({
        fileId: ttsResult.fileId,
        url: ttsResult.url,
        sceneId: scene.id,
        duration: scene.duration, // Use scene duration as estimate
      });
    } catch (error) {
      console.error(`Failed to generate TTS for scene ${scene.id}:`, error);
      throw error;
    }
  }

  // Generate images for each scene
  for (const scene of script.scenes) {
    if (scene.imagePrompt) {
      try {
        const imageResult = await imageGenerationTool.execute({
          prompt: scene.imagePrompt,
          aspectRatio: '16:9',
        });

        if (imageResult.images && imageResult.images.length > 0) {
          imageFiles.push({
            fileId: imageResult.images[0].fileId,
            url: imageResult.images[0].url,
            sceneId: scene.id,
          });
        }
      } catch (error) {
        console.error(`Failed to generate image for scene ${scene.id}:`, error);
        throw error;
      }
    }
  }

  // Generate music if requested
  let musicFile: { fileId: string; url: string; duration?: number } | undefined;
  if (includeMusic) {
    try {
      const musicResult = await musicGenerationTool.execute({
        style: 'upbeat',
        duration: script.estimatedDuration,
        mood: 'professional',
      });

      if (musicResult.fileId) {
        musicFile = {
          fileId: musicResult.fileId,
          url: musicResult.url!,
          duration: script.estimatedDuration,
        };
      }
    } catch (error) {
      console.error('Failed to generate music:', error);
      // Don't throw - music is optional
    }
  }

  const assets: GeneratedMedia = {
    audioFiles,
    imageFiles,
    musicFile,
  };

  // Step 3: Align tracks
  const alignmentResult = await trackAlignmentTool.execute({
    script,
    assets: {
      audioFiles,
      imageFiles,
      musicFile,
    },
  });

  if (!alignmentResult.success || !alignmentResult.tracks) {
    throw new Error('Failed to align video tracks');
  }

  const tracks = alignmentResult.tracks;

  // Step 4: Create Remotion composition
  const remotionResult = await remotionCompositionTool.execute({
    tracks,
    totalDuration: alignmentResult.totalDuration,
    generateComponentCode,
  });

  if (!remotionResult.success || !remotionResult.config) {
    throw new Error('Failed to generate Remotion composition');
  }

  return {
    script,
    assets,
    tracks,
    remotionConfig: remotionResult.config,
    remotionComponentCode: remotionResult.componentCode,
  };
}


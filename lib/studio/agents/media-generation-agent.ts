import { Experimental_Agent as Agent, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { ttsTool } from '../tools/tts-tool';
import { imageGenerationTool } from '../tools/image-generation-tool';
import { musicGenerationTool } from '../tools/music-generation-tool';
import type { VideoPlan } from './content-generation-agent';

export interface GeneratedMedia {
  audioFiles: Array<{ fileId: string; url: string; sceneId: string }>;
  imageFiles: Array<{ fileId: string; url: string; sceneId: string }>;
  musicFile?: { fileId: string; url: string };
}

/**
 * Agent that orchestrates media generation (TTS, images, music)
 */
export const mediaGenerationAgent = new Agent({
  model: google('gemini-2.5-pro'),
  system: `You are a media generation coordinator. Your job is to generate all required media assets for a video project:
- Generate TTS audio for each scene's script
- Generate images based on scene prompts
- Optionally generate background music

Work systematically through each scene, generating all required assets.`,
  tools: {
    generateTTS: ttsTool,
    generateImage: imageGenerationTool,
    generateMusic: musicGenerationTool,
  },
  stopWhen: stepCountIs(20), // Allow multiple tool calls
});

/**
 * Generate all media assets for a video plan
 */
export async function generateMediaAssets(
  videoPlan: VideoPlan,
  includeMusic: boolean = false
): Promise<GeneratedMedia> {
  const audioFiles: Array<{ fileId: string; url: string; sceneId: string }> = [];
  const imageFiles: Array<{ fileId: string; url: string; sceneId: string }> = [];

  // Generate TTS for each scene
  for (const scene of videoPlan.scenes) {
    try {
      const ttsResult = await ttsTool.execute({
        text: scene.text,
        voiceName: 'Kore',
      });

      audioFiles.push({
        fileId: ttsResult.fileId,
        url: ttsResult.url,
        sceneId: scene.id,
      });
    } catch (error) {
      console.error(`Failed to generate TTS for scene ${scene.id}:`, error);
    }
  }

  // Generate images for each scene
  for (const scene of videoPlan.scenes) {
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
      }
    }
  }

  // Generate music if requested
  let musicFile: { fileId: string; url: string } | undefined;
  if (includeMusic) {
    try {
      const musicResult = await musicGenerationTool.execute({
        style: 'upbeat',
        duration: videoPlan.estimatedDuration,
        mood: 'professional',
      });
      
      // Note: Currently returns placeholder, will be implemented when Lyria is available
      if (musicResult.fileId) {
        musicFile = {
          fileId: musicResult.fileId,
          url: musicResult.url!,
        };
      }
    } catch (error) {
      console.error('Failed to generate music:', error);
    }
  }

  return {
    audioFiles,
    imageFiles,
    musicFile,
  };
}


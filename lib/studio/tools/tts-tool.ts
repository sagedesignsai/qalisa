import { tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { uploadMedia } from '../services/appwrite';

const AVAILABLE_VOICES = [
  'Kore',
  'Puck',
  'Zephyr',
  'Fenrir',
  'Charon',
  'Leda',
  'Orus',
  'Aoede',
  'Autonoe',
  'Enceladus',
] as const;

/**
 * Tool to generate text-to-speech audio using Gemini TTS
 */
export const ttsTool = tool({
  description: 'Generate text-to-speech audio from text using Gemini TTS. Returns the Appwrite file ID and URL.',
  inputSchema: z.object({
    text: z.string().describe('Text to convert to speech'),
    voiceName: z.enum(AVAILABLE_VOICES as [string, ...string[]]).default('Kore').describe('Voice name to use'),
  }),
  execute: async ({ text, voiceName = 'Kore' }) => {
    try {
      const result = await generateText({
        model: google('gemini-2.5-flash-preview-tts'),
        prompt: text,
        providerOptions: {
          google: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        },
      });

      // Extract audio file from result
      const audioFile = result.files.find((f) => f.mediaType.startsWith('audio/'));
      if (!audioFile) {
        throw new Error('No audio file generated');
      }

      // Convert Uint8Array to Buffer
      const audioBuffer = Buffer.from(audioFile.uint8Array);

      // Upload to Appwrite
      const filename = `tts-${Date.now()}.wav`;
      const { fileId, url } = await uploadMedia(
        audioBuffer,
        filename,
        audioFile.mediaType,
        'audio'
      );

      return {
        fileId,
        url,
        mimeType: audioFile.mediaType,
        size: audioBuffer.length,
        voiceName,
        textLength: text.length,
      };
    } catch (error) {
      throw new Error(`TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


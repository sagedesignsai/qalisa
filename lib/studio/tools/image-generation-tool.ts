import { tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { uploadMedia } from '../services/appwrite';

/**
 * Tool to generate images using Gemini Imagen
 */
export const imageGenerationTool = tool({
  description: 'Generate images from text prompts using Gemini Imagen. Returns the Appwrite file ID and URL.',
  inputSchema: z.object({
    prompt: z.string().describe('Text prompt describing the image to generate'),
    aspectRatio: z.enum(['1:1', '3:4', '4:3', '9:16', '16:9']).optional().describe('Aspect ratio for the image'),
  }),
  execute: async ({ prompt, aspectRatio }) => {
    try {
      const result = await generateText({
        model: google('gemini-2.5-flash-image-preview'),
        prompt,
      });

      // Extract image files from result
      const imageFiles = result.files.filter((f) => f.mediaType.startsWith('image/'));
      if (imageFiles.length === 0) {
        throw new Error('No images generated');
      }

      // Upload all generated images
      const uploadedImages = await Promise.all(
        imageFiles.map(async (imageFile, index) => {
          const imageBuffer = Buffer.from(imageFile.uint8Array);
          const filename = `image-${Date.now()}-${index}.${imageFile.mediaType.split('/')[1] || 'png'}`;
          
          const { fileId, url } = await uploadMedia(
            imageBuffer,
            filename,
            imageFile.mediaType,
            'images'
          );

          return {
            fileId,
            url,
            mimeType: imageFile.mediaType,
            size: imageBuffer.length,
            index,
          };
        })
      );

      return {
        images: uploadedImages,
        count: uploadedImages.length,
        prompt,
        aspectRatio,
      };
    } catch (error) {
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


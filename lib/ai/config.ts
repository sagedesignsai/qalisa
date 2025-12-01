import { google } from '@ai-sdk/google';

/**
 * Google Gemini provider instance
 * Uses GOOGLE_GENERATIVE_AI_API_KEY from environment variables
 */
export const aiProvider = google;

// Re-export google for tools access
export { google };

/**
 * Default model configuration
 * Using Gemini 2.5 Flash for best balance of features and cost
 */
export const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Alternative models available
 */
export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-2.5-pro',
  FLASH_LITE: 'gemini-2.5-flash-lite',
} as const;

/**
 * Create a model instance with optional custom settings
 */
export function createModel(modelId: string = DEFAULT_MODEL) {
  return aiProvider(modelId);
}

/**
 * Default provider options for Google Gemini
 */
export const defaultProviderOptions = {
  google: {
    // Safety settings - adjust as needed
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
} as const;


import { tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import type { UIMessage } from 'ai';

export interface VideoScript {
  title: string;
  script: string;
  scenes: Array<{
    id: string;
    order: number;
    text: string;
    imagePrompt?: string;
    duration: number; // seconds
    narrationText: string;
  }>;
  estimatedDuration: number; // seconds
}

/**
 * Tool to generate structured video script from chat messages
 */
export const scriptGenerationTool = tool({
  description: 'Generate a structured video script with scenes, timing, and narration text from chat messages. Returns a complete video plan with scenes that have precise timing and visual descriptions.',
  inputSchema: z.object({
    messages: z.array(z.any()).describe('Array of chat messages to analyze'),
    projectContext: z.object({
      title: z.string().optional().describe('Project title if available'),
      description: z.string().optional().describe('Project description if available'),
    }).optional().describe('Additional project context'),
  }),
  execute: async ({ messages, projectContext }) => {
    try {
      const uiMessages = messages as UIMessage[];
      
      // Extract text content from messages
      const conversationText = uiMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => {
          if (typeof msg.content === 'string') {
            return `${msg.role}: ${msg.content}`;
          }
          if (Array.isArray(msg.content)) {
            const textParts = msg.content
              .filter(part => part.type === 'text')
              .map(part => (part as any).text)
              .join(' ');
            return `${msg.role}: ${textParts}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');

      // Use Gemini to generate structured script
      const { object: script } = await generateObject({
        model: google('gemini-2.5-pro'),
        schema: z.object({
          title: z.string().describe('Compelling video title'),
          script: z.string().describe('Complete video script/narration'),
          scenes: z.array(z.object({
            id: z.string().describe('Unique scene identifier'),
            order: z.number().describe('Scene order (1-based)'),
            text: z.string().describe('Scene description/narration text'),
            imagePrompt: z.string().describe('Detailed image generation prompt for this scene'),
            duration: z.number().describe('Scene duration in seconds (typically 5-15 seconds)'),
            narrationText: z.string().describe('Exact narration text to be spoken in this scene'),
          })).describe('Array of video scenes with timing and visuals'),
          estimatedDuration: z.number().describe('Total estimated video duration in seconds'),
        }),
        prompt: `Analyze this conversation and create a comprehensive video script:

${conversationText}

${projectContext?.title ? `Project Title: ${projectContext.title}` : ''}
${projectContext?.description ? `Project Description: ${projectContext.description}` : ''}

Create a structured video script that:
1. Breaks content into logical scenes (typically 5-15 seconds each)
2. Each scene should have clear narration text that flows naturally
3. Generate detailed image prompts that visually represent each scene's content
4. Ensure scenes transition smoothly from one to the next
5. Total video should be engaging and informative (aim for 30-120 seconds total)
6. Each scene's narrationText should be concise and match the scene's duration

Return a complete video plan with all scenes properly ordered and timed.`,
      });

      return {
        success: true,
        script: script as VideoScript,
        sceneCount: script.scenes.length,
        totalDuration: script.estimatedDuration,
      };
    } catch (error) {
      throw new Error(`Script generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


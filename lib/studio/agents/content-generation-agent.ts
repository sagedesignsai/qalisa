import { Experimental_Agent as Agent, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { contentExtractionTool } from '../tools/content-extraction-tool';
import type { ExtractedContent } from '../utils/chat-context-extractor';

export interface VideoPlan {
  title: string;
  script: string;
  scenes: Array<{
    id: string;
    order: number;
    text: string;
    imagePrompt?: string;
    duration: number; // seconds
  }>;
  estimatedDuration: number; // seconds
}

/**
 * Agent that plans video structure from chat context
 */
export const contentGenerationAgent = new Agent({
  model: google('gemini-2.5-pro'),
  system: `You are an expert video content planner. Your job is to analyze chat conversations and create structured video plans with scripts, scenes, and image prompts.

Create engaging presentation videos that:
- Break content into logical scenes
- Generate compelling image prompts for each scene
- Estimate appropriate durations
- Maintain narrative flow
- Include clear visual descriptions`,
  tools: {
    extractContent: contentExtractionTool,
  },
  stopWhen: stepCountIs(5),
});

/**
 * Generate video plan from chat context
 */
export async function generateVideoPlan(
  chatMessages: any[]
): Promise<VideoPlan> {
  const result = await contentGenerationAgent.generate({
    prompt: `Analyze these chat messages and create a comprehensive video plan:

${JSON.stringify(chatMessages, null, 2)}

Create a structured video plan with:
1. A compelling title
2. A complete script broken into scenes
3. Image prompts for each scene
4. Estimated durations

Use the extractContent tool first to understand the structure, then create the plan.`,
  });

  // Parse the result to extract video plan
  // The agent should return structured JSON
  try {
    const planText = result.text;
    // Try to extract JSON from the response
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as VideoPlan;
    }
    
    // Fallback: create basic plan from text
    return {
      title: 'Generated Video',
      script: planText,
      scenes: [
        {
          id: 'scene-1',
          order: 1,
          text: planText.substring(0, 200),
          duration: 30,
        },
      ],
      estimatedDuration: 30,
    };
  } catch (error) {
    // Fallback plan
    return {
      title: 'Generated Video',
      script: result.text,
      scenes: [
        {
          id: 'scene-1',
          order: 1,
          text: result.text.substring(0, 200),
          duration: 30,
        },
      ],
      estimatedDuration: 30,
    };
  }
}


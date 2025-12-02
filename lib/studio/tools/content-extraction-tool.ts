import { tool } from 'ai';
import { z } from 'zod';
import { extractChatContext } from '../utils/chat-context-extractor';
import type { UIMessage } from 'ai';

/**
 * Tool to extract structured content from chat messages
 */
export const contentExtractionTool = tool({
  description: 'Extract structured content, sources, and key points from chat messages for media generation',
  inputSchema: z.object({
    messages: z.array(z.any()).describe('Array of chat messages'),
  }),
  execute: async ({ messages }) => {
    const uiMessages = messages as UIMessage[];
    const extracted = extractChatContext(uiMessages);
    
    return {
      text: extracted.text,
      sources: extracted.sources,
      sections: extracted.structure.sections,
      keyPoints: extracted.structure.keyPoints,
      wordCount: extracted.text.split(/\s+/).length,
      estimatedVideoDuration: Math.ceil(extracted.text.split(/\s+/).length / 150), // ~150 words per minute
    };
  },
});


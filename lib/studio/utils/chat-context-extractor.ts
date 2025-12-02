import type { UIMessage } from 'ai';

export interface ExtractedContent {
  text: string;
  sources: Array<{ url: string; title?: string }>;
  structure: {
    sections: Array<{ title: string; content: string }>;
    keyPoints: string[];
  };
}

/**
 * Extract content from chat messages for media generation
 */
export function extractChatContext(messages: UIMessage[]): ExtractedContent {
  const textParts: string[] = [];
  const sources: Array<{ url: string; title?: string }> = [];
  const sections: Array<{ title: string; content: string }> = [];
  const keyPoints: string[] = [];

  // Extract text from assistant messages
  for (const message of messages) {
    if (message.role === 'assistant') {
      for (const part of message.parts) {
        if (part.type === 'text') {
          textParts.push(part.text);
        } else if (part.type === 'source-url') {
          sources.push({
            url: part.url,
            title: part.url, // Could be enhanced with metadata
          });
        }
      }
    }
  }

  const fullText = textParts.join('\n\n');

  // Simple section extraction (can be enhanced with AI)
  const sectionMatches = fullText.match(/#+\s+(.+)/g);
  if (sectionMatches) {
    sectionMatches.forEach((match, index) => {
      const title = match.replace(/^#+\s+/, '');
      const nextMatch = sectionMatches[index + 1];
      const startIndex = fullText.indexOf(match);
      const endIndex = nextMatch ? fullText.indexOf(nextMatch) : fullText.length;
      const content = fullText.slice(startIndex + match.length, endIndex).trim();
      
      sections.push({ title, content });
    });
  } else {
    // If no sections, treat entire text as one section
    sections.push({ title: 'Content', content: fullText });
  }

  // Extract key points (simple bullet point extraction)
  const bulletMatches = fullText.match(/[-•*]\s+(.+)/g);
  if (bulletMatches) {
    keyPoints.push(...bulletMatches.map((m) => m.replace(/^[-•*]\s+/, '')));
  }

  return {
    text: fullText,
    sources,
    structure: {
      sections,
      keyPoints,
    },
  };
}


import type { ProjectMessage } from '@/lib/generated/prisma/client';
import type { UIMessage } from 'ai';

/**
 * Convert ProjectMessage array to UIMessage array
 */
export function projectMessagesToUIMessages(
  messages: ProjectMessage[]
): UIMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system' | 'tool',
    parts: msg.content as UIMessage['parts'],
    metadata: msg.metadata as Record<string, unknown> | undefined,
  }));
}


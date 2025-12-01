import type { UIMessage, UIMessagePart } from 'ai';
import type { Message, Chat } from '@/lib/generated/prisma';

/**
 * Convert database Message to UIMessage format
 */
export function messageToUIMessage(message: Message): UIMessage {
  return {
    id: message.id,
    role: message.role.toLowerCase() as 'user' | 'assistant' | 'system' | 'tool',
    parts: message.content as UIMessagePart[],
    metadata: message.metadata as Record<string, unknown> | undefined,
  };
}

/**
 * Convert UIMessage to database format
 */
export function uiMessageToMessageData(
  message: UIMessage,
  sequence: number,
): Pick<Message, 'role' | 'content' | 'metadata' | 'sequence' | 'isComplete'> {
  return {
    role: message.role.toUpperCase() as Message['role'],
    content: message.parts as unknown as Record<string, unknown>,
    metadata: message.metadata as Record<string, unknown> | undefined,
    sequence,
    isComplete: true, // Will be updated during streaming
  };
}

/**
 * Convert array of database Messages to UIMessage array
 */
export function messagesToUIMessages(messages: Message[]): UIMessage[] {
  return messages
    .sort((a, b) => a.sequence - b.sequence)
    .map(messageToUIMessage);
}

/**
 * Generate a chat title from the first user message
 */
export function generateChatTitle(firstUserMessage: string): string {
  // Extract first 50 characters and clean up
  const title = firstUserMessage
    .trim()
    .replace(/\n/g, ' ')
    .substring(0, 50)
    .trim();
  
  return title || 'New Chat';
}

/**
 * Extract text content from message parts
 */
export function extractTextFromParts(parts: UIMessagePart[]): string {
  return parts
    .filter((part) => part.type === 'text')
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join(' ')
    .trim();
}

/**
 * Check if message is complete (has text content and is not streaming)
 */
export function isMessageComplete(message: UIMessage): boolean {
  const hasText = message.parts.some((part) => part.type === 'text');
  return hasText;
}


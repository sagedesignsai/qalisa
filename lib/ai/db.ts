import { prisma } from '@/lib/db';
import type { UIMessage } from 'ai';
import { messageToUIMessage, messagesToUIMessages, generateChatTitle, extractTextFromParts } from './utils';

/**
 * Create a new chat for a user
 */
export async function createChat(
  userId: string,
  initialMessage?: UIMessage,
  metadata?: Record<string, unknown>,
) {
  const chat = await prisma.chat.create({
    data: {
      userId,
      metadata: metadata || {},
      status: 'ACTIVE',
      ...(initialMessage && {
        messages: {
          create: {
            role: initialMessage.role.toUpperCase() as 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL',
            content: initialMessage.parts as unknown as Record<string, unknown>,
            metadata: initialMessage.metadata as Record<string, unknown> | undefined,
            sequence: 0,
            isComplete: true,
          },
        },
        title: initialMessage.role === 'user'
          ? generateChatTitle(extractTextFromParts(initialMessage.parts))
          : undefined,
      }),
    },
    include: {
      messages: {
        orderBy: { sequence: 'asc' },
      },
    },
  });

  return chat;
}

/**
 * Save a message to a chat
 */
export async function saveMessage(
  chatId: string,
  message: UIMessage,
  isComplete: boolean = true,
) {
  // Get the current max sequence for this chat
  const maxSequence = await prisma.message.findFirst({
    where: { chatId },
    orderBy: { sequence: 'desc' },
    select: { sequence: true },
  });

  const sequence = (maxSequence?.sequence ?? -1) + 1;

  const savedMessage = await prisma.message.create({
    data: {
      chatId,
      role: message.role.toUpperCase() as 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL',
      content: message.parts as unknown as Record<string, unknown>,
      metadata: message.metadata as Record<string, unknown> | undefined,
      sequence,
      isComplete,
    },
  });

  // Update chat title if this is the first user message
  if (message.role === 'user' && sequence === 0) {
    const title = generateChatTitle(extractTextFromParts(message.parts));
    await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });
  }

  return savedMessage;
}

/**
 * Update an existing message (useful for streaming)
 */
export async function updateMessage(
  messageId: string,
  updates: {
    content?: UIMessage['parts'];
    metadata?: Record<string, unknown>;
    isComplete?: boolean;
  },
) {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      ...(updates.content && {
        content: updates.content as unknown as Record<string, unknown>,
      }),
      ...(updates.metadata && { metadata: updates.metadata }),
      ...(updates.isComplete !== undefined && { isComplete: updates.isComplete }),
    },
  });
}

/**
 * Get all messages for a chat
 */
export async function getChatMessages(chatId: string): Promise<UIMessage[]> {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { sequence: 'asc' },
  });

  return messagesToUIMessages(messages);
}

/**
 * Get a chat by ID with user verification
 */
export async function getChatById(chatId: string, userId: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
    include: {
      messages: {
        orderBy: { sequence: 'asc' },
      },
    },
  });

  return chat;
}

/**
 * Get all chats for a user
 */
export async function getUserChats(
  userId: string,
  options?: {
    status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    limit?: number;
    offset?: number;
  },
) {
  const chats = await prisma.chat.findMany({
    where: {
      userId,
      ...(options?.status && { status: options.status }),
    },
    orderBy: { updatedAt: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
    include: {
      messages: {
        orderBy: { sequence: 'desc' },
        take: 1, // Get last message for preview
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  return chats;
}

/**
 * Update chat stream ID for resumption
 */
export async function updateChatStreamId(chatId: string, streamId: string | null) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { streamId },
  });
}

/**
 * Update chat title
 */
export async function updateChatTitle(chatId: string, title: string) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });
}

/**
 * Archive a chat
 */
export async function archiveChat(chatId: string, userId: string) {
  return prisma.chat.updateMany({
    where: {
      id: chatId,
      userId,
    },
    data: {
      status: 'ARCHIVED',
    },
  });
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string, userId: string) {
  return prisma.chat.updateMany({
    where: {
      id: chatId,
      userId,
    },
    data: {
      status: 'DELETED',
    },
  });
}


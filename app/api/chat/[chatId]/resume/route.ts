import { auth } from '@/lib/auth';
import { streamText, convertToModelMessages } from 'ai';
import { createModel, defaultProviderOptions } from '@/lib/ai/config';
import {
  getChatById,
  getChatMessages,
  updateMessage,
  updateChatStreamId,
} from '@/lib/ai/db';
import { extractTextFromParts } from '@/lib/ai/utils';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId } = await params;
    const { streamId, model }: { streamId?: string; model?: string } = await req.json();

    // Verify chat ownership
    const chat = await getChatById(chatId, userId);
    if (!chat) {
      return Response.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Get message history
    const dbMessages = await getChatMessages(chatId);
    const modelMessages = convertToModelMessages(dbMessages);

    // Find the incomplete assistant message
    const incompleteMessage = chat.messages
      .filter((m) => m.role === 'ASSISTANT' && !m.isComplete)
      .sort((a, b) => b.sequence - a.sequence)[0];

    if (!incompleteMessage) {
      return Response.json(
        { error: 'No incomplete message found to resume' },
        { status: 400 },
      );
    }

    // Resume streaming
    const result = streamText({
      model: createModel(model || chat.metadata?.model as string),
      messages: modelMessages,
      ...defaultProviderOptions,
      // Use the stored stream ID if available
      ...(streamId || chat.streamId ? { streamId: streamId || chat.streamId || undefined } : {}),
    });

    // Update stream ID
    const newStreamId = result.streamId;
    if (newStreamId) {
      await updateChatStreamId(chatId, newStreamId);
    }

    // Transform stream and update message
    const stream = result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
      async onFinish(message) {
        await updateMessage(incompleteMessage.id, {
          content: message.parts,
          metadata: message.metadata as Record<string, unknown>,
          isComplete: true,
        });
      },
    });

    return stream;
  } catch (error) {
    console.error('Resume chat error:', error);
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}


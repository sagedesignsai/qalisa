import { auth } from '@/lib/auth';
import { streamText, convertToModelMessages, type UIMessage, type ToolSet } from 'ai';
import { createModel, defaultProviderOptions, google } from '@/lib/ai/config';
import {
  createChat,
  saveMessage,
  updateMessage,
  updateChatStreamId,
  getChatMessages,
  getChatById,
  updateChatTitle,
} from '@/lib/ai/db';
import { extractTextFromParts } from '@/lib/ai/utils';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const {
      messages,
      chatId,
      model,
      webSearch,
      ...options
    }: {
      messages: UIMessage[];
      chatId?: string;
      model?: string;
      webSearch?: boolean;
      [key: string]: unknown;
    } = await req.json();

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Get or create chat
    let currentChatId = chatId;
    if (!currentChatId) {
      // Create new chat with first user message
      const firstUserMessage = messages.find((m) => m.role === 'user');
      const chat = await createChat(userId, firstUserMessage, {
        model: model || 'gemini-2.5-flash',
        ...options,
      });
      currentChatId = chat.id;
    } else {
      // Verify chat ownership
      const chat = await getChatById(currentChatId, userId);
      if (!chat) {
        return Response.json({ error: 'Chat not found' }, { status: 404 });
      }
    }

    // Save user message(s) that aren't already saved
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      await saveMessage(currentChatId, lastMessage, true);
    }

    // Get full message history from database for context
    const dbMessages = await getChatMessages(currentChatId);
    const modelMessages = convertToModelMessages(dbMessages);

    // Create assistant message placeholder
    const assistantMessageId = `msg_${Date.now()}`;
    const assistantMessage: UIMessage = {
      id: assistantMessageId,
      role: 'assistant',
      parts: [],
    };

    // Save assistant message placeholder
    const savedAssistantMessage = await saveMessage(
      currentChatId,
      assistantMessage,
      false, // Not complete yet
    );

    // Configure tools based on options
    const tools: Partial<ToolSet> = {};

    // Add Google Search if webSearch is enabled
    if (webSearch) {
      tools.google_search = google.tools.googleSearch({});
    }

    // Stream the response
    const result = streamText({
      model: createModel(model),
      messages: modelMessages,
      system: 'You are a helpful assistant that can answer questions and help with tasks',
      ...(Object.keys(tools).length > 0 && { tools: tools as ToolSet }),
      ...defaultProviderOptions,
    });

    // Store stream ID for potential resumption
    const streamId = (result as { streamId?: string }).streamId;
    if (streamId) {
      await updateChatStreamId(currentChatId, streamId);
    }

    // Transform the stream to save messages incrementally
    const stream = result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
      async onFinish(options) {
        const responseMessage = options.responseMessage;
        // Mark message as complete
        await updateMessage(savedAssistantMessage.id, {
          content: responseMessage.parts,
          metadata: responseMessage.metadata as Record<string, unknown>,
          isComplete: true,
        });

        // Update chat title if needed (from first assistant response)
        const metadata = responseMessage.metadata as Record<string, unknown> | undefined;
        if (!metadata?.titleGenerated) {
          const chat = await getChatById(currentChatId!, userId);
          if (chat && !chat.title) {
            const text = extractTextFromParts(responseMessage.parts);
            if (text) {
              const title = text.substring(0, 50).trim();
              await updateChatTitle(currentChatId!, title);
            }
          }
        }
      },
    });

    // Add chatId to response headers for client to use
    const response = new Response(stream.body, {
      headers: {
        ...Object.fromEntries(stream.headers.entries()),
        'X-Chat-Id': currentChatId!,
      },
    });

    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}


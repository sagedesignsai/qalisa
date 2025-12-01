import { auth } from '@/lib/auth';
import { getUserChats } from '@/lib/ai/db';
import { extractTextFromParts } from '@/lib/ai/utils';
import type { UIMessagePart } from 'ai';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as 'ACTIVE' | 'ARCHIVED' | 'DELETED' | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const chats = await getUserChats(userId, {
      status: status || undefined,
      limit,
      offset,
    });

    // Format chats with preview
    const formattedChats = chats.map((chat) => {
      const lastMessage = chat.messages[0];
      let preview = '';
      
      if (lastMessage) {
        const parts = lastMessage.content as unknown as UIMessagePart[];
        preview = extractTextFromParts(parts).substring(0, 100);
      }

      return {
        id: chat.id,
        title: chat.title || 'New Chat',
        preview,
        messageCount: chat._count.messages,
        status: chat.status,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    return Response.json({
      chats: formattedChats,
      total: formattedChats.length,
    });
  } catch (error) {
    console.error('Get chats error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}


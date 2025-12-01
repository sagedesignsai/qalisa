import { auth } from '@/lib/auth';
import { getChatById, archiveChat, deleteChat } from '@/lib/ai/db';
import { messagesToUIMessages } from '@/lib/ai/utils';

export async function GET(
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

    const chat = await getChatById(chatId, userId);
    if (!chat) {
      return Response.json({ error: 'Chat not found' }, { status: 404 });
    }

    const messages = messagesToUIMessages(chat.messages);

    return Response.json({
      id: chat.id,
      title: chat.title,
      status: chat.status,
      metadata: chat.metadata,
      streamId: chat.streamId,
      messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    console.error('Get chat error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
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
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      await deleteChat(chatId, userId);
    } else {
      await archiveChat(chatId, userId);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}


import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/ai/chat-interface';
import { getChatById, getUserChats } from '@/lib/ai/db';
import { messagesToUIMessages } from '@/lib/ai/utils';
import { ChatPageClient } from './chat-page-client';

export default async function AIPage({
  searchParams,
}: {
  searchParams: Promise<{ chatId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;
  const params = await searchParams;
  const chatId = params.chatId;

  let initialMessages: typeof import('ai').UIMessage[] = [];
  let chatTitle = 'New Chat';

  if (chatId) {
    const chat = await getChatById(chatId, userId);
    if (chat) {
      initialMessages = messagesToUIMessages(chat.messages);
      chatTitle = chat.title || 'Chat';
    }
  }

  // Get user's recent chats for sidebar
  const recentChats = await getUserChats(userId, {
    status: 'ACTIVE',
    limit: 10,
  });

  return (
    <ChatPageClient
      chatId={chatId}
      chatTitle={chatTitle}
      initialMessages={initialMessages}
      recentChats={recentChats.map((chat) => ({
        id: chat.id,
        title: chat.title || 'Untitled Chat',
      }))}
    />
  );
}


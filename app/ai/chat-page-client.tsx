'use client';

import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/ai/chat-interface';
import type { UIMessage } from 'ai';

interface ChatPageClientProps {
  chatId?: string;
  chatTitle: string;
  initialMessages: UIMessage[];
  recentChats: Array<{ id: string; title: string }>;
}

export function ChatPageClient({
  chatId,
  chatTitle,
  initialMessages,
  recentChats,
}: ChatPageClientProps) {
  const router = useRouter();

  const handleChatIdChange = (newChatId: string) => {
    router.push(`/ai?chatId=${newChatId}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="font-semibold mb-4">Chats</h2>
        <div className="space-y-2">
          <a
            href="/ai"
            className={`block p-2 rounded ${
              !chatId ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            New Chat
          </a>
          {recentChats.map((chat) => (
            <a
              key={chat.id}
              href={`/ai?chatId=${chat.id}`}
              className={`block p-2 rounded truncate ${
                chatId === chat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              title={chat.title}
            >
              {chat.title}
            </a>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <h1 className="text-xl font-semibold">{chatTitle}</h1>
        </div>
        <div className="flex-1">
          <ChatInterface
            chatId={chatId}
            initialMessages={initialMessages}
            onChatIdChange={handleChatIdChange}
          />
        </div>
      </div>
    </div>
  );
}


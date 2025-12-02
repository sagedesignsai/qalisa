'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/ai/chat-interface';
import { StudioPanel } from '@/components/studio/studio-panel';
import { Button } from '@/components/ui/button';
import { PanelRightOpenIcon, PanelRightCloseIcon } from 'lucide-react';
import type { UIMessage } from 'ai';

interface ChatPageClientProps {
  chatId?: string;
  chatTitle: string;
  initialMessages: UIMessage[];
  recentChats: Array<{ id: string; title: string }>;
  projectId?: string;
}

export function ChatPageClient({
  chatId,
  chatTitle,
  initialMessages,
  recentChats,
  projectId,
}: ChatPageClientProps) {
  const router = useRouter();
  const [showStudio, setShowStudio] = useState(false);

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
        <div className="border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{chatTitle}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStudio(!showStudio)}
          >
            {showStudio ? (
              <PanelRightCloseIcon className="h-4 w-4" />
            ) : (
              <PanelRightOpenIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex-1 flex">
          <div className={`flex-1 flex flex-col ${showStudio ? 'border-r' : ''}`}>
            <ChatInterface
              chatId={chatId}
              initialMessages={initialMessages}
              onChatIdChange={handleChatIdChange}
            />
          </div>
          {showStudio && (
            <div className="w-1/2">
              <StudioPanel chatId={chatId} projectId={projectId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


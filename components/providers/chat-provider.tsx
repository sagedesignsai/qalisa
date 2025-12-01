"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { Chat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"

/**
 * Chat Context Value
 */
interface ChatContextValue {
  chat: Chat<UIMessage>
  clearChat: () => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

/**
 * Create a new chat instance
 */
function createChat() {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })
}

/**
 * Chat Provider
 * 
 * Provides a shared chat context for AI conversations.
 * Allows multiple components to access and interact with the same chat instance.
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState(() => createChat())

  const clearChat = () => {
    setChat(createChat())
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

/**
 * Hook to access shared chat context
 * 
 * @throws {Error} If used outside of ChatProvider
 */
export function useSharedChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useSharedChatContext must be used within a ChatProvider")
  }
  return context
}


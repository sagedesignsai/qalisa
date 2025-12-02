'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import type { UIMessage, ToolUIPart } from 'ai';
import { MessageSquare, AlertCircleIcon } from 'lucide-react';

interface ChatInterfaceProps {
  chatId?: string;
  initialMessages?: UIMessage[];
  onChatIdChange?: (chatId: string) => void;
}

const models = [
  {
    name: 'Gemini 2.5 Flash',
    value: 'gemini-2.5-flash',
  },
  {
    name: 'Gemini 2.5 Pro',
    value: 'gemini-2.5-pro',
  },
];

const defaultSuggestions = [
  'What are the latest trends in AI?',
  'How does machine learning work?',
  'Explain quantum computing',
  'Best practices for React development',
  'Tell me about TypeScript benefits',
];

export function ChatInterface({
  chatId,
  initialMessages = [],
  onChatIdChange,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

  const { messages, sendMessage, status, error, resumeStream, id, regenerate } =
    useChat({
      id: chatId,
      messages: initialMessages.length > 0 ? initialMessages : undefined,
      transport: new DefaultChatTransport({
        api: '/api/chat',
        body: chatId ? { chatId } : undefined,
      }),
      onFinish: async (message) => {
        // Chat ID is managed by useChat hook
        if (id && onChatIdChange && id !== chatId) {
          onChatIdChange(id);
        }
      },
    });

  // Update parent when chat ID changes
  useEffect(() => {
    if (id && id !== chatId && onChatIdChange) {
      onChatIdChange(id);
    }
  }, [id, chatId, onChatIdChange]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          ...(chatId && { chatId }),
          model: model,
          webSearch: webSearch,
        },
      },
    );
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      {
        body: {
          ...(chatId && { chatId }),
          model: model,
          webSearch: webSearch,
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <>
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
              <div className="px-4 pb-4">
                <Suggestions>
                  {defaultSuggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      onClick={handleSuggestionClick}
                      suggestion={suggestion}
                    />
                  ))}
                </Suggestions>
              </div>
            </>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' &&
                  message.parts.filter((part) => part.type === 'source-url')
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      <SourcesContent>
                        {message.parts
                          .filter((part) => part.type === 'source-url')
                          .map((part, i) => (
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          ))}
                      </SourcesContent>
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' &&
                            i === message.parts.length - 1 &&
                            message.id === messages[messages.length - 1]?.id && (
                              <MessageActions>
                                <MessageAction
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </MessageAction>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            )}
                        </Message>
                      );
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === 'streaming' &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      // Handle tool calls
                      if (part.type.startsWith('tool-')) {
                        const toolPart = part as unknown as ToolUIPart;
                        const hasInput = 'input' in toolPart && toolPart.input !== undefined && toolPart.input !== null;
                        return (
                          <Tool
                            key={`${message.id}-${i}`}
                            defaultOpen={toolPart.state === 'output-available'}
                          >
                            <ToolHeader
                              type={toolPart.type as ToolUIPart['type']}
                              state={toolPart.state}
                            />
                            <ToolContent>
                              {hasInput ? (
                                <ToolInput input={toolPart.input as ToolUIPart['input']} />
                              ) : null}
                              <ToolOutput
                                output={toolPart.output as ToolUIPart['output']}
                                errorText={toolPart.errorText as ToolUIPart['errorText']}
                              />
                            </ToolContent>
                          </Tool>
                        );
                      }
                      return null;
                  }
                })}
              </div>
            ))
          )}
          {status === 'submitted' && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Error display */}
      {error && (
        <div className="px-4 py-3 bg-destructive/10 text-destructive text-sm border-t flex items-center gap-2">
          <AlertCircleIcon className="size-4 shrink-0" />
          <div className="flex-1">
            <span className="font-medium">Error:</span> {error.message}
          </div>
          {chatId && resumeStream && (
            <button
              onClick={() => resumeStream()}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Resume
            </button>
          )}
        </div>
      )}

      <div className='border-t'>
        <PromptInput
          onSubmit={handleSubmit}
          className="p-3"
          globalDrop
          multiple
        >
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? 'default' : 'ghost'}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((m) => (
                    <PromptInputSelectItem key={m.value} value={m.value}>
                      {m.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={(!input.trim() && status !== 'streaming') || status === 'submitted'}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}


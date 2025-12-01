---
title: Setup
description: How to install and set up AI Elements components in your project
---

# Setup

Installing AI Elements is straightforward and can be done in a couple of ways. You can use the dedicated CLI command for the fastest setup, or integrate via the standard shadcn/ui CLI if you’ve already adopted shadcn’s workflow.

<ElementsInstaller />

## Prerequisites

Before installing AI Elements, make sure your environment meets the following requirements:

- [Node.js](https://nodejs.org/en/download/), version 18 or later
- A [Next.js](https://nextjs.org/) project with the [AI SDK](https://ai-sdk.dev/) installed.
- [shadcn/ui](https://ui.shadcn.com/) installed in your project. If you don't have it installed, running any install command will automatically install it for you.
- We also highly recommend using the [AI Gateway](https://vercel.com/docs/ai-gateway) and adding `AI_GATEWAY_API_KEY` to your `env.local` so you don't have to use an API key from every provider. AI Gateway also gives $5 in usage per month so you can experiment with models. You can obtain an API key [here](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=Get%20your%20AI%20Gateway%20key).

## Installing Components

You can install AI Elements components using either the AI Elements CLI or the shadcn/ui CLI. Both achieve the same result: adding the selected component’s code and any needed dependencies to your project.

The CLI will download the component’s code and integrate it into your project’s directory (usually under your components folder). By default, AI Elements components are added to the `@/components/ai-elements/` directory (or whatever folder you’ve configured in your shadcn components settings).

After running the command, you should see a confirmation in your terminal that the files were added. You can then proceed to use the component in your code.

---
title: Usage
description: Learn how to use AI Elements components in your application.
---

# Usage

Once an AI Elements component is installed, you can import it and use it in your application like any other React component. The components are added as part of your codebase (not hidden in a library), so the usage feels very natural.

## Example

After installing AI Elements components, you can use them in your application like any other React component. For example:

```tsx title="conversation.tsx"
'use client';

import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';

const Example = () => {
  const { messages } = useChat();

  return (
    <>
      {messages.map(({ role, parts }, index) => (
        <Message from={role} key={index}>
          <MessageContent>
            {parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <Response key={`${role}-${i}`}>{part.text}</Response>;
              }
            })}
          </MessageContent>
        </Message>
      ))}
    </>
  );
};

export default Example;
```

In the example above, we import the `Message` component from our AI Elements directory and include it in our JSX. Then, we compose the component with the `MessageContent` and `Response` subcomponents. You can style or configure the component just as you would if you wrote it yourself – since the code lives in your project, you can even open the component file to see how it works or make custom modifications.

## Extensibility

All AI Elements components take as many primitive attributes as possible. For example, the `Message` component extends `HTMLAttributes<HTMLDivElement>`, so you can pass any props that a `div` supports. This makes it easy to extend the component with your own styles or functionality.

## Customization

<Note>
  If you re-install AI Elements by rerunning `npx ai-elements@latest`, the CLI
  will ask before overwriting the file so you can save any custom changes you
  made.
</Note>

After installation, no additional setup is needed. The component’s styles (Tailwind CSS classes) and scripts are already integrated. You can start interacting with the component in your app immediately.

For example, if you'd like to remove the rounding on `Message`, you can go to `components/ai-elements/message.tsx` and remove `rounded-lg` as follows:

```tsx filename="components/ai-elements/message.tsx" highlight="8"
export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 text-sm text-foreground',
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-4 group-[.is-user]:py-3',
      className,
    )}
    {...props}
  >
    <div className="is-user:dark">{children}</div>
  </div>
);
```

---
title: Troubleshooting
description: What to do if you run into issues with AI Elements.
---

# Troubleshooting

## Why are my components not styled?

Make sure your project is configured correctly for shadcn/ui in Tailwind 4 - this means having a `globals.css` file that imports Tailwind and includes the shadcn/ui base styles.

## I ran the AI Elements CLI but nothing was added to my project

Double-check that:

- Your current working directory is the root of your project (where `package.json` lives).
- Your components.json file (if using shadcn-style config) is set up correctly.
- You’re using the latest version of the AI Elements CLI:

```bash
npx ai-elements@latest
```

If all else fails, feel free to open an [issue on GitHub](https://github.com/vercel/ai-elements/issues).

## Theme switching doesn’t work — my app stays in light mode

Ensure your app is using the same data-theme system that shadcn/ui and AI Elements expect. The default implementation toggles a data-theme attribute on the `<html>` element. Make sure your tailwind.config.js is using class or data- selectors accordingly:

## The component imports fail with “module not found”

Check the file exists. If it does, make sure your `tsconfig.json` has a proper paths alias for `@/` i.e.

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## My AI coding assistant can't access AI Elements components

1. Verify your config file syntax is valid JSON.
2. Check that the file path is correct for your AI tool.
3. Restart your coding assistant after making changes.
4. Ensure you have a stable internet connection.

## Still stuck?

If none of these answers help, open an [issue on GitHub](https://github.com/vercel/ai-elements/issues) and someone will be happy to assist.

---
title: Introduction
description: What is AI Elements and why you should use it.
---

# AI Elements

[AI Elements](https://www.npmjs.com/package/ai-elements) is a component library and custom registry built on top of [shadcn/ui](https://ui.shadcn.com/) to help you build AI-native applications faster. It provides pre-built components like conversations, messages and more.

You can install it with:

<ElementsInstaller />

Here are some basic examples of what you can achieve using components from AI Elements.

<ElementsDemo />

## Components

<ElementHeader name="Actions" path="actions" />

<Preview path="actions" />

<ElementHeader name="Artifact" path="artifact" />

<Preview path="artifact" />

<ElementHeader name="Branch" path="branch" />

<Preview path="branch" />

<ElementHeader name="Chain of Thought" path="chain-of-thought" />

<Preview path="chain-of-thought" />

<ElementHeader name="Code Block" path="code-block" />

<Preview path="code-block" />

<ElementHeader name="Context" path="context" />

<Preview path="context" />

<ElementHeader name="Conversation" path="conversation" />

<Preview path="conversation" className="p-0" />

<ElementHeader name="Image" path="image" />

<Preview path="image" />

<ElementHeader name="Loader" path="loader" />

<Preview path="loader" />

<ElementHeader name="Message" path="message" />

<Preview path="message" />

<ElementHeader name="Open In Chat" path="open-in-chat" />

<Preview path="open-in-chat" />

<ElementHeader name="Prompt Input" path="prompt-input" />

<Preview path="prompt-input" />

<ElementHeader name="Reasoning" path="reasoning" />

<Preview path="reasoning" />

<ElementHeader name="Response" path="response" />

<Preview path="response" />

<ElementHeader name="Sources" path="sources" />

<Preview path="sources" />

<ElementHeader name="Suggestion" path="suggestion" />

<Preview path="suggestion" />

<ElementHeader name="Task" path="task" />

<Preview path="task" />

<ElementHeader name="Tool" path="tool" />

<Preview path="tool" />

<ElementHeader name="Web Preview" path="web-preview" />

<Preview path="web-preview" />

<ElementHeader name="Inline Citation" path="inline-citation" />

<Preview path="inline-citation" />

View the [source code](https://github.com/vercel/ai-elements) for all components on GitHub.
---
title: Chatbot
description: An example of how to use the AI Elements to build a chatbot.
---

# Chatbot

An example of how to use the AI Elements to build a chatbot.

<Preview path="chatbot" type="block" className="p-0" />

## Tutorial

Let's walk through how to build a chatbot using AI Elements and AI SDK. Our example will include reasoning, web search with citations, and a model picker.

### Setup

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind the project setup):

```bash filename="Terminal"
npx create-next-app@latest ai-chatbot && cd ai-chatbot
```

Run the following command to install AI Elements. This will also set up shadcn/ui if you haven't already configured it:

```bash filename="Terminal"
npx ai-elements@latest
```

Now, install the AI SDK dependencies:

<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add ai @ai-sdk/react zod" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install ai @ai-sdk/react zod" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add ai @ai-sdk/react zod" dark />
    </Tab>
  </Tabs>
</div>

In order to use the providers, let's configure an AI Gateway API key. Create a `.env.local` in your root directory and navigate [here](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=Get%20your%20AI%20Gateway%20key) to create a token, then paste it in your `.env.local`.

We're now ready to start building our app!

### Client

In your `app/page.tsx`, replace the code with the file below.

Here, we use the `PromptInput` component with its compound components to build a rich input experience with file attachments, model picker, and action menu. The input component uses the new `PromptInputMessage` type for handling both text and file attachments.

The whole chat lives in a `Conversation`. We switch on `message.parts` and render the respective part within `Message`, `Reasoning`, and `Sources`. We also use `status` from `useChat` to stream reasoning tokens, as well as render `Loader`.

```tsx filanem="app/page.tsx"
'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
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
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Action, Actions } from '@/components/ai-elements/actions';
import { Fragment, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
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

const models = [
  {
    name: 'GPT 4o',
    value: 'openai/gpt-4o',
  },
  {
    name: 'Deepseek R1',
    value: 'deepseek/deepseek-r1',
  },
];

const ChatBotDemo = () => {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      { 
        text: message.text || 'Sent with attachments',
        files: message.files 
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      },
    );
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                  </Sources>
                )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>
                                {part.text}
                              </Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && i === messages.length - 1 && (
                            <Actions className="mt-2">
                              <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
                      );
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
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
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.value} value={model.value}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;
```

### Server

Create a new route handler `app/api/chat/route.ts` and paste in the following code. We're using `perplexity/sonar` for web search because by default the model returns search results. We also pass `sendSources` and `sendReasoning` to `toUIMessageStreamResponse` in order to receive as parts on the frontend. The handler now also accepts file attachments from the client.

```ts filename="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: { 
    messages: UIMessage[]; 
    model: string; 
    webSearch: boolean;
  } = await req.json();

  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : model,
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
```

You now have a working chatbot app with file attachment support! The chatbot can handle both text and file inputs through the action menu. Feel free to explore other components like [`Tool`](/elements/components/tool) or [`Task`](/elements/components/task) to extend your app, or view the other examples.

---
title: Examples
description: Examples of how to use the AI Elements.
---

# Examples

This section provides practical examples of how to combine AI Elements—such as `Conversation`, `Message`, `Input`, and more—to build complete, interactive chat interfaces. By leveraging these building blocks, you can create sophisticated conversational experiences that are both user-friendly and highly customizable.

Explore the following examples to see how individual components work together in real-world scenarios. Each example demonstrates how to assemble elements into cohesive layouts, manage user input, display AI responses, and enhance conversations with features like suggestions, sources, and reasoning. Whether you're building a simple chatbot or a complex AI assistant, these examples will help you get started quickly and inspire your own interface designs.

---
title: v0 clone
description: An example of how to use the AI Elements to build a v0 clone.
---

# v0 clone

An example of how to use the AI Elements to build a v0 clone.

## Tutorial

Let's walk through how to build a v0 clone using AI Elements and the [v0 Platform API](https://v0.dev/docs/api/platform).

### Setup

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind the project setup):

```bash filename="Terminal"
npx create-next-app@latest v0-clone && cd v0-clone
```

Run the following command to install shadcn/ui and AI Elements.

```bash filename="Terminal"
npx shadcn@latest init && npx ai-elements@latest
```

Now, install the v0 sdk:

<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add v0-sdk" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install v0-sdk" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add v0-sdk" dark />
    </Tab>
  </Tabs>
</div>

In order to use the providers, let's configure a v0 API key. Create a `.env.local` in your root directory and navigate to your [v0 account settings](https://v0.dev/chat/settings/keys) to create a token, then paste it in your `.env.local` as `V0_API_KEY`.

We're now ready to start building our app!

### Client

In your `app/page.tsx`, replace the code with the file below.

Here, we use `Conversation` to wrap the conversation code, and the `WebPreview` component to render the URL returned from the v0 API.

```tsx filename="app/page.tsx"
'use client';

import { useState } from 'react';

import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation';
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewUrl,
  WebPreviewBody,
} from '@/components/ai-elements/web-preview';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

interface Chat {
  id: string;
  demo: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: 'user' | 'assistant';
      content: string;
    }>
  >([]);

  const handleSendMessage = async (promptMessage: PromptInputMessage) => {
    const hasText = Boolean(promptMessage.text);
    const hasAttachments = Boolean(promptMessage.files?.length);
    
    if (!(hasText || hasAttachments) || isLoading) return;

    const userMessage = promptMessage.text?.trim() || 'Sent with attachments';
    setMessage('');
    setIsLoading(true);

    setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: currentChat?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const chat: Chat = await response.json();
      setCurrentChat(chat);

      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: 'Generated new app preview. Check the preview panel!',
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content:
            'Sorry, there was an error creating your app. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Chat Panel */}
      <div className="w-1/2 flex flex-col border-r">
        {/* Header */}
        <div className="border-b p-3 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">v0 Clone</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center font-semibold mt-8">
              <p className="text-3xl mt-4">What can we build together?</p>
            </div>
          ) : (
            <>
              <Conversation>
                <ConversationContent>
                  {chatHistory.map((msg, index) => (
                    <Message from={msg.type} key={index}>
                      <MessageContent>{msg.content}</MessageContent>
                    </Message>
                  ))}
                </ConversationContent>
              </Conversation>
              {isLoading && (
                <Message from="assistant">
                  <MessageContent>
                    <div className="flex items-center gap-2">
                      <Loader />
                      Creating your app...
                    </div>
                  </MessageContent>
                </Message>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          {!currentChat && (
            <Suggestions>
              <Suggestion
                onClick={() =>
                  setMessage('Create a responsive navbar with Tailwind CSS')
                }
                suggestion="Create a responsive navbar with Tailwind CSS"
              />
              <Suggestion
                onClick={() => setMessage('Build a todo app with React')}
                suggestion="Build a todo app with React"
              />
              <Suggestion
                onClick={() =>
                  setMessage('Make a landing page for a coffee shop')
                }
                suggestion="Make a landing page for a coffee shop"
              />
            </Suggestions>
          )}
          <div className="flex gap-2">
            <PromptInput
              onSubmit={handleSendMessage}
              className="mt-4 w-full max-w-2xl mx-auto relative"
            >
              <PromptInputTextarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="pr-12 min-h-[60px]"
              />
              <PromptInputSubmit
                className="absolute bottom-1 right-1"
                disabled={!message}
                status={isLoading ? 'streaming' : 'ready'}
              />
            </PromptInput>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 flex flex-col">
        <WebPreview>
          <WebPreviewNavigation>
            <WebPreviewUrl
              readOnly
              placeholder="Your app here..."
              value={currentChat?.demo}
            />
          </WebPreviewNavigation>
          <WebPreviewBody src={currentChat?.demo} />
        </WebPreview>
      </div>
    </div>
  );
}
```

In this case, we'll also edit the base component `components/ai-elements/web-preview.tsx` in order to best match with our theme.

```tsx filename="components/ai-elements/web-preview.tsx" highlight="5,24"
  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex size-full flex-col bg-card', // remove rounded-lg border
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
};

export type WebPreviewNavigationProps = ComponentProps<'div'>;

export const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <div
    className={cn('flex items-center gap-1 border-b p-2 h-14', className)} // add h-14
    {...props}
  >
    {children}
  </div>
);
```

### Server

Create a new route handler `app/api/chat/route.ts` and paste in the following code. We use the v0 SDK to manage chats.

```ts filename="app/api/chat/route.ts"
import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    let chat;

    if (chatId) {
      // continue existing chat
      chat = await v0.chats.sendMessage({
        chatId: chatId,
        message,
      });
    } else {
      // create new chat
      chat = await v0.chats.create({
        message,
      });
    }

    return NextResponse.json({
      id: chat.id,
      demo: chat.demo,
    });
  } catch (error) {
    console.error('V0 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
```

To start your server, run `pnpm dev`, navigate to `localhost:3000` and try building an app!

You now have a working v0 clone you can build off of! Feel free to explore the [v0 Platform API](https://v0.dev/docs/api/platform) and components like [`Reasoning`](/elements/components/reasoning) and [`Task`](/elements/components/task) to extend your app, or view the other examples.

---
title: Workflow
description: An example of how to use the AI Elements to build a workflow visualization.
---

# Workflow

An example of how to use the AI Elements to build a workflow visualization with interactive nodes and animated connections, built with [React Flow](https://reactflow.dev/).

<Preview path="workflow" type="block" className="p-0" />

## Tutorial

Let's walk through how to build a workflow visualization using AI Elements. Our example will include custom nodes with headers, content, and footers, along with animated and temporary edge types.

### Setup

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind in the project setup):

```bash filename="Terminal"
npx create-next-app@latest ai-workflow && cd ai-workflow
```

Run the following command to install AI Elements. This will also set up shadcn/ui if you haven't already configured it:

```bash filename="Terminal"
npx ai-elements@latest
```

Now, install the required dependencies:

<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add @xyflow/react" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install @xyflow/react" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add @xyflow/react" dark />
    </Tab>
  </Tabs>
</div>

We're now ready to start building our workflow!

### Client

Let's build the workflow visualization step by step. We'll create the component structure, define our nodes and edges, and configure the canvas.

#### Import the components

First, import the necessary AI Elements components in your `app/page.tsx`:

```tsx filename="app/page.tsx"
'use client';

import { Canvas } from '@/components/ai-elements/canvas';
import { Connection } from '@/components/ai-elements/connection';
import { Controls } from '@/components/ai-elements/controls';
import { Edge } from '@/components/ai-elements/edge';
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from '@/components/ai-elements/node';
import { Panel } from '@/components/ai-elements/panel';
import { Toolbar } from '@/components/ai-elements/toolbar';
import { Button } from '@/components/ui/button';
```

#### Define node IDs

Create a constant object to manage node identifiers. This makes it easier to reference nodes when creating edges:

```tsx filename="app/page.tsx"
const nodeIds = {
  start: 'start',
  process1: 'process1',
  process2: 'process2',
  decision: 'decision',
  output1: 'output1',
  output2: 'output2',
};
```

#### Create mock nodes

Define the nodes array with position, type, and data for each node in your workflow:

```tsx filename="app/page.tsx"
const nodes = [
  {
    id: nodeIds.start,
    type: 'workflow',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start',
      description: 'Initialize workflow',
      handles: { target: false, source: true },
      content: 'Triggered by user action at 09:30 AM',
      footer: 'Status: Ready',
    },
  },
  {
    id: nodeIds.process1,
    type: 'workflow',
    position: { x: 500, y: 0 },
    data: {
      label: 'Process Data',
      description: 'Transform input',
      handles: { target: true, source: true },
      content: 'Validating 1,234 records and applying business rules',
      footer: 'Duration: ~2.5s',
    },
  },
  {
    id: nodeIds.decision,
    type: 'workflow',
    position: { x: 1000, y: 0 },
    data: {
      label: 'Decision Point',
      description: 'Route based on conditions',
      handles: { target: true, source: true },
      content: "Evaluating: data.status === 'valid' && data.score > 0.8",
      footer: 'Confidence: 94%',
    },
  },
  {
    id: nodeIds.output1,
    type: 'workflow',
    position: { x: 1500, y: -300 },
    data: {
      label: 'Success Path',
      description: 'Handle success case',
      handles: { target: true, source: true },
      content: '1,156 records passed validation (93.7%)',
      footer: 'Next: Send to production',
    },
  },
  {
    id: nodeIds.output2,
    type: 'workflow',
    position: { x: 1500, y: 300 },
    data: {
      label: 'Error Path',
      description: 'Handle error case',
      handles: { target: true, source: true },
      content: '78 records failed validation (6.3%)',
      footer: 'Next: Queue for review',
    },
  },
  {
    id: nodeIds.process2,
    type: 'workflow',
    position: { x: 2000, y: 0 },
    data: {
      label: 'Complete',
      description: 'Finalize workflow',
      handles: { target: true, source: false },
      content: 'All records processed and routed successfully',
      footer: 'Total time: 4.2s',
    },
  },
];
```

#### Create mock edges

Define the connections between nodes. Use `animated` for active paths and `temporary` for conditional or error paths:

```tsx filename="app/page.tsx"
const edges = [
  {
    id: 'edge1',
    source: nodeIds.start,
    target: nodeIds.process1,
    type: 'animated',
  },
  {
    id: 'edge2',
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: 'animated',
  },
  {
    id: 'edge3',
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: 'animated',
  },
  {
    id: 'edge4',
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: 'temporary',
  },
  {
    id: 'edge5',
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: 'animated',
  },
  {
    id: 'edge6',
    source: nodeIds.output2,
    target: nodeIds.process2,
    type: 'temporary',
  },
];
```

#### Create the node types

Define custom node rendering using the compound Node components:

```tsx filename="app/page.tsx"
const nodeTypes = {
  workflow: ({
    data,
  }: {
    data: {
      label: string;
      description: string;
      handles: { target: boolean; source: boolean };
      content: string;
      footer: string;
    };
  }) => (
    <Node handles={data.handles}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm">{data.content}</p>
      </NodeContent>
      <NodeFooter>
        <p className="text-muted-foreground text-xs">{data.footer}</p>
      </NodeFooter>
      <Toolbar>
        <Button size="sm" variant="ghost">
          Edit
        </Button>
        <Button size="sm" variant="ghost">
          Delete
        </Button>
      </Toolbar>
    </Node>
  ),
};
```

#### Create the edge types

Map the edge type names to the Edge components:

```tsx filename="app/page.tsx"
const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};
```

#### Build the main component

Finally, create the main component that renders the Canvas with all nodes, edges, controls, and custom UI panels:

```tsx filename="app/page.tsx"
const App = () => (
  <Canvas
    edges={edges}
    edgeTypes={edgeTypes}
    fitView
    nodes={nodes}
    nodeTypes={nodeTypes}
    connectionLineComponent={Connection}
  >
    <Controls />
    <Panel position="top-left">
      <Button size="sm" variant="secondary">
        Export
      </Button>
    </Panel>
  </Canvas>
);

export default App;
```

### Key Features

The workflow visualization demonstrates several powerful features:

- **Custom Node Components**: Each node uses the compound components (`NodeHeader`, `NodeTitle`, `NodeDescription`, `NodeContent`, `NodeFooter`) for consistent, structured layouts.
- **Node Toolbars**: The `Toolbar` component attaches contextual actions (like Edit and Delete buttons) to individual nodes, appearing when hovering or selecting them.
- **Handle Configuration**: Nodes can have source and/or target handles, controlling which connections are possible.
- **Multiple Edge Types**: The `animated` type shows active data flow, while `temporary` indicates conditional or error paths.
- **Custom Connection Lines**: The `Connection` component provides styled bezier curves when dragging new connections between nodes.
- **Interactive Controls**: The `Controls` component adds zoom in/out and fit view buttons with a modern, themed design.
- **Custom UI Panels**: The `Panel` component allows you to position custom UI elements (like buttons, filters, or legends) anywhere on the canvas.
- **Automatic Layout**: The `Canvas` component auto-fits the view and provides pan/zoom controls out of the box.

You now have a working workflow visualization! Feel free to explore dynamic workflows by connecting this to AI-generated process flows, or extend it with interactive editing capabilities using React Flow's built-in features.
---
title: Actions
description: A row of composable action buttons for AI responses, including retry, like, dislike, copy, share, and custom actions.
path: elements/components/actions
---

# Actions

The `Actions` component provides a flexible row of action buttons for AI responses with common actions like retry, like, dislike, copy, and share.

<Preview path="actions" />

## Installation

<ElementsInstaller path="actions" />

## Usage

```tsx
import { Actions, Action } from '@/components/ai-elements/actions';
import { ThumbsUpIcon } from 'lucide-react';
```

```tsx
<Actions className="mt-2">
  <Action label="Like">
    <ThumbsUpIcon className="size-4" />
  </Action>
</Actions>
```

## Usage with AI SDK

Build a simple chat UI where the user can copy or regenerate the most recent message.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { useState } from 'react';
import { Actions, Action } from '@/components/ai-elements/actions';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { Fragment } from 'react';

const ActionsDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      const isLastMessage =
                        messageIndex === messages.length - 1;
                      
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && isLastMessage && (
                            <Actions>
                              <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ActionsDemo;
```

Add the following route to your backend:

```tsx filename="api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Row of composable action buttons with consistent styling
- Support for custom actions with tooltips
- State management for toggle actions (like, dislike, favorite)
- Keyboard accessible with proper ARIA labels
- Clipboard and Web Share API integration
- TypeScript support with proper type definitions
- Consistent with design system styling

## Examples

<Preview path="actions-hover" />

## Props

### `<Actions />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'HTML attributes to spread to the root div.',
    },
  ]}
/>

### `<Action />`

<PropertiesTable
  content={[
    {
      name: 'tooltip',
      type: 'string',
      description: 'Optional tooltip text shown on hover.',
      isOptional: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for screen readers. Also used as fallback if tooltip is not provided.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
    },
  ]}
/>

---
title: Branch
description: Manages multiple versions of AI messages, allowing users to navigate between different response branches.
path: elements/components/branch
---

# Branch

The `Branch` component manages multiple versions of AI messages, allowing users to navigate between different response branches. It provides a clean, modern interface with customizable themes and keyboard-accessible navigation buttons.

<Preview path="branch" />

## Installation

<ElementsInstaller path="branch" />

## Usage

```tsx
import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from '@/components/ai-elements/branch';
```

```tsx
<Branch defaultBranch={0}>
  <BranchMessages>
    <Message from="user">
      <MessageContent>Hello</MessageContent>
    </Message>
    <Message from="user">
      <MessageContent>Hi!</MessageContent>
    </Message>
  </BranchMessages>
  <BranchSelector from="user">
    <BranchPrevious />
    <BranchPage />
    <BranchNext />
  </BranchSelector>
</Branch>
```

## Usage with AI SDK

<Note>
  Branching is an advanced use case that you can implement yourself to suit your
  application's needs. While the AI SDK does not provide built-in support for
  branching, you have full flexibility to design and manage multiple response
  paths as required.
</Note>

## Features

- Context-based state management for multiple message branches
- Navigation controls for moving between branches (previous/next)
- Uses CSS to prevent re-rendering of branches when switching
- Branch counter showing current position (e.g., "1 of 3")
- Automatic branch tracking and synchronization
- Callbacks for branch change and navigation using `onBranchChange`
- Support for custom branch change callbacks
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes
- Keyboard-accessible navigation buttons

## Props

### `<Branch />`

<PropertiesTable
  content={[
    {
      name: 'defaultBranch',
      type: 'number',
      description: 'The index of the branch to show by default (default: 0).',
      isOptional: true,
    },
    {
      name: 'onBranchChange',
      type: '(branchIndex: number) => void',
      description: 'Callback fired when the branch changes.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
    },
  ]}
/>

### `<BranchMessages />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
    },
  ]}
/>

### `<BranchSelector />`

<PropertiesTable
  content={[
    {
      name: 'from',
      type: 'UIMessage["role"]',
      description:
        'Aligns the selector for user, assistant or system messages.',
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the selector container.',
    },
  ]}
/>

### `<BranchPrevious />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
    },
  ]}
/>

### `<BranchNext />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
    },
  ]}
/>

### `<BranchPage />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLSpanElement>',
      description: 'Any other props are spread to the underlying span element.',
    },
  ]}
/>

---
title: Chain of Thought
description: A collapsible component that visualizes AI reasoning steps with support for search results, images, and step-by-step progress indicators.
path: elements/components/chain-of-thought
---

# Chain of Thought

The `ChainOfThought` component provides a visual representation of an AI's reasoning process, showing step-by-step thinking with support for search results, images, and progress indicators. It helps users understand how AI arrives at conclusions.

<Preview path="chain-of-thought" />

## Installation

<ElementsInstaller path="chain-of-thought" />

## Usage

```tsx
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
```

```tsx
<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader />
  <ChainOfThoughtContent>
    <ChainOfThoughtStep
      icon={SearchIcon}
      label="Searching for information"
      status="complete"
    >
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>
          Result 1
        </ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    </ChainOfThoughtStep>
  </ChainOfThoughtContent>
</ChainOfThought>
```

## Features

- Collapsible interface with smooth animations powered by Radix UI
- Step-by-step visualization of AI reasoning process
- Support for different step statuses (complete, active, pending)
- Built-in search results display with badge styling
- Image support with captions for visual content
- Custom icons for different step types
- Context-aware components using React Context API
- Fully typed with TypeScript
- Accessible with keyboard navigation support
- Responsive design that adapts to different screen sizes
- Smooth fade and slide animations for content transitions
- Composable architecture for flexible customization

## Props

### `<ChainOfThought />`

<PropertiesTable
  content={[
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled open state of the collapsible.',
      isOptional: true,
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description:
        'Default open state when uncontrolled. Defaults to false.',
      isOptional: true,
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description:
        'Callback when the open state changes.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any other props are spread to the root div element.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtHeader />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom header text. Defaults to "Chain of Thought".',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleTrigger>',
      description:
        'Any other props are spread to the CollapsibleTrigger component.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtStep />`

<PropertiesTable
  content={[
    {
      name: 'icon',
      type: 'LucideIcon',
      description:
        'Icon to display for the step. Defaults to DotIcon.',
      isOptional: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'The main text label for the step.',
      isOptional: false,
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Optional description text shown below the label.',
      isOptional: true,
    },
    {
      name: 'status',
      type: '"complete" | "active" | "pending"',
      description:
        'Visual status of the step. Defaults to "complete".',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any other props are spread to the root div element.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtSearchResults />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any props are spread to the container div element.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtSearchResult />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Badge>',
      description:
        'Any props are spread to the Badge component.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleContent>',
      description:
        'Any props are spread to the CollapsibleContent component.',
      isOptional: true,
    },
  ]}
/>

### `<ChainOfThoughtImage />`

<PropertiesTable
  content={[
    {
      name: 'caption',
      type: 'string',
      description:
        'Optional caption text displayed below the image.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any other props are spread to the container div element.',
      isOptional: true,
    },
  ]}
/>
---
title: Code Block
description: Provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks.
path: elements/components/code-block
icon: Braces
---

# Code Block

The `CodeBlock` component provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks.

<Preview path="code-block" />

## Installation

<ElementsInstaller path="code-block" />

## Usage

```tsx
import { CodeBlock, CodeBlockCopyButton } from '@/components/ai-elements/code-block';
```

```tsx
<CodeBlock data={"console.log('hello world')"} language="jsx">
  <CodeBlockCopyButton
    onCopy={() => console.log('Copied code to clipboard')}
    onError={() => console.error('Failed to copy code to clipboard')}
  />
</CodeBlock>
```

## Usage with AI SDK

Build a simple code generation tool using the [`experimental_useObject`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-object) hook.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { codeBlockSchema } from '@/app/api/codegen/route';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  CodeBlock,
  CodeBlockCopyButton,
} from '@/components/ai-elements/code-block';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { object, submit, isLoading } = useObject({
    api: '/api/codegen',
    schema: codeBlockSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      submit(input);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto mb-4">
          {object?.code && object?.language && (
            <CodeBlock
              code={object.code}
              language={object.language}
              showLineNumbers={true}
            >
              <CodeBlockCopyButton />
            </CodeBlock>
          )}
        </div>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Generate a React todolist component"
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={isLoading ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
}
```

Add the following route to your backend:

```tsx filename="api/codegen/route.ts"
import { streamObject } from 'ai';
import { z } from 'zod';

export const codeBlockSchema = z.object({
  language: z.string(),
  filename: z.string(),
  code: z.string(),
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: codeBlockSchema,
    prompt:
      `You are a helpful coding assitant. Only generate code, no markdown formatting or backticks, or text.` +
      context,
  });

  return result.toTextStreamResponse();
}
```

## Features

- Syntax highlighting with react-syntax-highlighter
- Line numbers (optional)
- Copy to clipboard functionality
- Automatic light/dark theme switching
- Customizable styles
- Accessible design

## Examples

### Dark Mode

To use the `CodeBlock` component in dark mode, you can wrap it in a `div` with the `dark` class.

<Preview path="code-block-dark" />

## Props

### `<CodeBlock />`

<PropertiesTable
  content={[
    {
      name: 'code',
      type: 'string',
      description: 'The code content to display.',
    },
    {
      name: 'language',
      type: 'string',
      description: 'The programming language for syntax highlighting.',
    },
    {
      name: 'showLineNumbers',
      type: 'boolean',
      description: 'Whether to show line numbers. Default: false.',
      isOptional: true,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Child elements (like CodeBlockCopyButton) positioned in the top-right corner.',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the root container.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

### `<CodeBlockCopyButton />`

<PropertiesTable
  content={[
    {
      name: 'onCopy',
      type: '() => void',
      description: 'Callback fired after a successful copy.',
      isOptional: true,
    },
    {
      name: 'onError',
      type: '(error: Error) => void',
      description: 'Callback fired if copying fails.',
      isOptional: true,
    },
    {
      name: 'timeout',
      type: 'number',
      description: 'How long to show the copied state (ms). Default: 2000.',
      isOptional: true,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom content for the button. Defaults to copy/check icons.',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the button.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

---
title: Context
description: A compound component system for displaying AI model context window usage, token consumption, and cost estimation.
path: elements/components/context
---

# Context

The `Context` component provides a comprehensive view of AI model usage through a compound component system. It displays context window utilization, token consumption breakdown (input, output, reasoning, cache), and cost estimation in an interactive hover card interface.

<Preview path="context" />

## Installation

<ElementsInstaller path="context" />

## Usage

```tsx
import {
  Context,
  ContextTrigger,
  ContextContent,
  ContextContentHeader,
  ContextContentBody,
  ContextContentFooter,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextCacheUsage,
} from '@/components/ai-elements/context';
```

```tsx
<Context
  maxTokens={128000}
  usedTokens={40000}
  usage={{
    inputTokens: 32000,
    outputTokens: 8000,
    totalTokens: 40000,
    cachedInputTokens: 0,
    reasoningTokens: 0,
  }}
  modelId="openai:gpt-4"
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
      <ContextReasoningUsage />
      <ContextCacheUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>
```

## Features

- **Compound Component Architecture**: Flexible composition of context display elements
- **Visual Progress Indicator**: Circular SVG progress ring showing context usage percentage
- **Token Breakdown**: Detailed view of input, output, reasoning, and cached tokens
- **Cost Estimation**: Real-time cost calculation using the `tokenlens` library
- **Intelligent Formatting**: Automatic token count formatting (K, M, B suffixes)
- **Interactive Hover Card**: Detailed information revealed on hover
- **Context Provider Pattern**: Clean data flow through React Context API
- **TypeScript Support**: Full type definitions for all components
- **Accessible Design**: Proper ARIA labels and semantic HTML
- **Theme Integration**: Uses currentColor for automatic theme adaptation

## Props

### `<Context />`

<PropertiesTable
  content={[
    {
      name: 'maxTokens',
      type: 'number',
      description:
        'The total context window size in tokens.',
      isOptional: false,
    },
    {
      name: 'usedTokens',
      type: 'number',
      description:
        'The number of tokens currently used.',
      isOptional: false,
    },
    {
      name: 'usage',
      type: 'LanguageModelUsage',
      description:
        'Detailed token usage breakdown from the AI SDK (input, output, reasoning, cached tokens).',
      isOptional: true,
    },
    {
      name: 'modelId',
      type: 'ModelId',
      description:
        'Model identifier for cost calculation (e.g., "openai:gpt-4", "anthropic:claude-3-opus").',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<HoverCard>',
      description:
        'Any other props are spread to the HoverCard component.',
      isOptional: true,
    },
  ]}
/>

### `<ContextTrigger />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom trigger element. If not provided, renders a default button with percentage and icon.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<Button>',
      description:
        'Props spread to the default button element.',
      isOptional: true,
    },
  ]}
/>

### `<ContextContent />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description:
        'Additional CSS classes for the hover card content.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<HoverCardContent>',
      description:
        'Props spread to the HoverCardContent component.',
      isOptional: true,
    },
  ]}
/>

### `<ContextContentHeader />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom header content. If not provided, renders percentage and token count with progress bar.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<div>',
      description:
        'Props spread to the header div element.',
      isOptional: true,
    },
  ]}
/>

### `<ContextContentBody />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Body content, typically containing usage breakdown components.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<div>',
      description:
        'Props spread to the body div element.',
      isOptional: true,
    },
  ]}
/>

### `<ContextContentFooter />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom footer content. If not provided, renders total cost when modelId is provided.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<div>',
      description:
        'Props spread to the footer div element.',
      isOptional: true,
    },
  ]}
/>

### Usage Components

All usage components (`ContextInputUsage`, `ContextOutputUsage`, `ContextReasoningUsage`, `ContextCacheUsage`) share the same props:

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Custom content. If not provided, renders token count and cost for the respective usage type.',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Additional CSS classes.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<div>',
      description:
        'Props spread to the div element.',
      isOptional: true,
    },
  ]}
/>

## Component Architecture

The Context component uses a compound component pattern with React Context for data sharing:

1. **`<Context>`** - Root provider component that holds all context data
2. **`<ContextTrigger>`** - Interactive trigger element (default: button with percentage)
3. **`<ContextContent>`** - Hover card content container
4. **`<ContextContentHeader>`** - Header section with progress visualization
5. **`<ContextContentBody>`** - Body section for usage breakdowns
6. **`<ContextContentFooter>`** - Footer section for total cost
7. **Usage Components** - Individual token usage displays (Input, Output, Reasoning, Cache)

## Token Formatting

The component uses `Intl.NumberFormat` with compact notation for automatic formatting:

- Under 1,000: Shows exact count (e.g., "842")
- 1,000+: Shows with K suffix (e.g., "32K")
- 1,000,000+: Shows with M suffix (e.g., "1.5M")
- 1,000,000,000+: Shows with B suffix (e.g., "2.1B")

## Cost Calculation

When a `modelId` is provided, the component automatically calculates costs using the `tokenlens` library:

- **Input tokens**: Cost based on model's input pricing
- **Output tokens**: Cost based on model's output pricing
- **Reasoning tokens**: Special pricing for reasoning-capable models
- **Cached tokens**: Reduced pricing for cached input tokens
- **Total cost**: Sum of all token type costs

Costs are formatted using `Intl.NumberFormat` with USD currency.

## Styling

The component uses Tailwind CSS classes and follows your design system:

- Progress indicator uses `currentColor` for theme adaptation
- Hover card has customizable width and padding
- Footer has a secondary background for visual separation
- All text sizes use the `text-xs` class for consistency
- Muted foreground colors for secondary information
---
title: Conversation
description: Wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.
path: elements/components/conversation
---

# Conversation

The `Conversation` component wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.

<Preview path="conversation" className="p-0" />

## Installation

<ElementsInstaller path="conversation" />

## Usage

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
```

```tsx
<Conversation className="relative w-full" style={{ height: '500px' }}>
  <ConversationContent>
    {messages.length === 0 ? (
      <ConversationEmptyState
        icon={<MessageSquare className="size-12" />}
        title="No messages yet"
        description="Start a conversation to see messages here"
      />
    ) : (
      messages.map((message) => (
        <Message from={message.from} key={message.id}>
          <MessageContent>{message.content}</MessageContent>
        </Message>
      ))
    )}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

## Usage with AI SDK

Build a simple conversational UI with `Conversation` and [`PromptInput`](/elements/components/prompt-input):

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';

const ConversationDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text': // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ConversationDemo;
```

Add the following route to your backend:

```tsx filename="api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Automatic scrolling to the bottom when new messages are added
- Smooth scrolling behavior with configurable animation
- Scroll button that appears when not at the bottom
- Responsive design with customizable padding and spacing
- Flexible content layout with consistent message spacing
- Accessible with proper ARIA roles for screen readers
- Customizable styling through className prop
- Support for any number of child message components

## Props

### `<Conversation />`

<PropertiesTable
  content={[
    {
      name: 'contextRef',
      type: 'React.Ref<StickToBottomContext>',
      description: 'Optional ref to access the StickToBottom context object.',
    },
    {
      name: 'instance',
      type: 'StickToBottomInstance',
      description:
        'Optional instance for controlling the StickToBottom component.',
    },
    {
      name: 'children',
      type: '((context: StickToBottomContext) => ReactNode) | ReactNode',
      description:
        'Render prop or ReactNode for custom rendering with context.',
    },
    {
      name: '[...props]',
      type: 'Omit<React.HTMLAttributes<HTMLDivElement>, "children">',
      description: 'Any other props are spread to the root div.',
    },
  ]}
/>

### `<ConversationContent />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: '((context: StickToBottomContext) => ReactNode) | ReactNode',
      description:
        'Render prop or ReactNode for custom rendering with context.',
    },
    {
      name: '[...props]',
      type: 'Omit<React.HTMLAttributes<HTMLDivElement>, "children">',
      description: 'Any other props are spread to the root div.',
    },
  ]}
/>

### `<ConversationEmptyState />`

<PropertiesTable
  content={[
    {
      name: 'title',
      type: 'string',
      description:
        'The title text to display. Defaults to "No messages yet".',
    },
    {
      name: 'description',
      type: 'string',
      description:
        'The description text to display. Defaults to "Start a conversation to see messages here".',
    },
    {
      name: 'icon',
      type: 'React.ReactNode',
      description: 'Optional icon to display above the text.',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Optional additional content to render below the text.',
    },
    {
      name: '[...props]',
      type: 'ComponentProps<"div">',
      description: 'Any other props are spread to the root div.',
    },
  ]}
/>

### `<ConversationScrollButton />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
    },
  ]}
/>

---
title: Image
description: Displays AI-generated images from the AI SDK.
path: elements/components/image
---

# Image

The `Image` component displays AI-generated images from the AI SDK. It accepts a [`Experimental_GeneratedImage`](/docs/reference/ai-sdk-core/generate-image) object from the AI SDK's `generateImage` function and automatically renders it as an image.

<Preview path="image" />

## Installation

<ElementsInstaller path="image" />

## Usage

```tsx
import { Image } from '@/components/ai-elements/image';
```

```tsx
<Image
  base64="valid base64 string"
  mediaType: 'image/jpeg',
  uint8Array: new Uint8Array([]),
  alt="Example generated image"
  className="h-[150px] aspect-square border"
/>
```

## Usage with AI SDK

Build a simple app allowing a user to generate an image given a prompt.

Install the `@ai-sdk/openai` package:

<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add @ai-sdk/openai" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install @ai-sdk/openai" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add @ai-sdk/openai" dark />
    </Tab>
  </Tabs>
</div>

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { Image } from '@/components/ai-elements/image';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { useState } from 'react';
import { Loader } from '@/components/ai-elements/loader';

const ImageDemo = () => {
  const [prompt, setPrompt] = useState('A futuristic cityscape at sunset');
  const [imageData, setImageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPrompt('');

    setIsLoading(true);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      setImageData(data);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {imageData && (
            <div className="flex justify-center">
              <Image
                {...imageData}
                alt="Generated image"
                className="h-[300px] aspect-square border rounded-lg"
              />
            </div>
          )}
          {isLoading && <Loader />}
        </div>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={prompt}
            placeholder="Describe the image you want to generate..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={isLoading ? 'submitted' : 'ready'}
            disabled={!prompt.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ImageDemo;
```

Add the following route to your backend:

```ts filename="app/api/image/route.ts"
import { openai } from '@ai-sdk/openai';
import { experimental_generateImage } from 'ai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { image } = await experimental_generateImage({
    model: openai.image('dall-e-3'),
    prompt: prompt,
    size: '1024x1024',
  });

  return Response.json({
    base64: image.base64,
    uint8Array: image.uint8Array,
    mediaType: image.mediaType,
  });
}
```

## Features

- Accepts `Experimental_GeneratedImage` objects directly from the AI SDK
- Automatically creates proper data URLs from base64-encoded image data
- Supports all standard HTML image attributes
- Responsive by default with `max-w-full h-auto` styling
- Customizable with additional CSS classes
- Includes proper TypeScript types for AI SDK compatibility

## Props

### `<Image />`

<PropertiesTable
  content={[
    {
      name: 'alt',
      type: 'string',
      description: 'Alternative text for the image.',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the image.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'Experimental_GeneratedImage',
      description: 'The image data to display, as returned by the AI SDK.',
      isOptional: true,
    },
  ]}
/>

---
title: Chatbot
description: Components for building conversational AI interfaces.
---

# Chatbot Components

A comprehensive collection of React components designed for building modern AI chat interfaces. These components provide the essential building blocks you need to create interactive, accessible, and user-friendly conversational experiences.
---
title: Inline Citation
description: A hoverable citation component that displays source information and quotes inline with text, perfect for AI-generated content with references.
path: elements/components/inline-citation
---

# Inline Citation

The `InlineCitation` component provides a way to display citations inline with text content, similar to academic papers or research documents. It consists of a citation pill that shows detailed source information on hover, making it perfect for AI-generated content that needs to reference sources.

<Preview path="inline-citation" />

## Installation

<ElementsInstaller path="inline-citation" />

## Usage

```tsx
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationSource,
  InlineCitationText,
} from '@/components/ai-elements/inline-citation';
```

```tsx
<InlineCitation>
  <InlineCitationText>{citation.text}</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger
      sources={citation.sources.map((source) => source.url)}
    />
    <InlineCitationCardBody>
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselIndex />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>
            <InlineCitationSource
              title="AI SDK"
              url="https://ai-sdk.dev"
              description="The AI Toolkit for TypeScript"
            />
          </InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>
```

## Usage with AI SDK

Build citations for AI-generated content using [`experimental_generateObject`](/docs/reference/ai-sdk-ui/use-object).

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from '@/components/ai-elements/inline-citation';
import { Button } from '@/components/ui/button';
import { citationSchema } from '@/app/api/citation/route';

const CitationDemo = () => {
  const { object, submit, isLoading } = useObject({
    api: '/api/citation',
    schema: citationSchema,
  });

  const handleSubmit = (topic: string) => {
    submit({ prompt: topic });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => handleSubmit('artificial intelligence')}
          disabled={isLoading}
          variant="outline"
        >
          Generate AI Content
        </Button>
        <Button
          onClick={() => handleSubmit('climate change')}
          disabled={isLoading}
          variant="outline"
        >
          Generate Climate Content
        </Button>
      </div>

      {isLoading && !object && (
        <div className="text-muted-foreground">
          Generating content with citations...
        </div>
      )}

      {object?.content && (
        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            {object.content.split(/(\[\d+\])/).map((part, index) => {
              const citationMatch = part.match(/\[(\d+)\]/);
              if (citationMatch) {
                const citationNumber = citationMatch[1];
                const citation = object.citations?.find(
                  (c: any) => c.number === citationNumber,
                );

                if (citation) {
                  return (
                    <InlineCitation key={index}>
                      <InlineCitationCard>
                        <InlineCitationCardTrigger sources={[citation.url]} />
                        <InlineCitationCardBody>
                          <InlineCitationCarousel>
                            <InlineCitationCarouselHeader>
                              <InlineCitationCarouselPrev />
                              <InlineCitationCarouselNext />
                              <InlineCitationCarouselIndex />
                            </InlineCitationCarouselHeader>
                            <InlineCitationCarouselContent>
                              <InlineCitationCarouselItem>
                                <InlineCitationSource
                                  title={citation.title}
                                  url={citation.url}
                                  description={citation.description}
                                />
                                {citation.quote && (
                                  <InlineCitationQuote>
                                    {citation.quote}
                                  </InlineCitationQuote>
                                )}
                              </InlineCitationCarouselItem>
                            </InlineCitationCarouselContent>
                          </InlineCitationCarousel>
                        </InlineCitationCardBody>
                      </InlineCitationCard>
                    </InlineCitation>
                  );
                }
              }
              return part;
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default CitationDemo;
```

Add the following route to your backend:

```ts filename="app/api/citation/route.ts"
import { streamObject } from 'ai';
import { z } from 'zod';

export const citationSchema = z.object({
  content: z.string(),
  citations: z.array(
    z.object({
      number: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
      quote: z.string().optional(),
    }),
  ),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: citationSchema,
    prompt: `Generate a well-researched paragraph about ${prompt} with proper citations. 
    
    Include:
    - A comprehensive paragraph with inline citations marked as [1], [2], etc.
    - 2-3 citations with realistic source information
    - Each citation should have a title, URL, and optional description/quote
    - Make the content informative and the sources credible
    
    Format citations as numbered references within the text.`,
  });

  return result.toTextStreamResponse();
}
```

## Features

- Hover interaction to reveal detailed citation information
- **Carousel navigation** for multiple citations with prev/next controls
- **Live index tracking** showing current slide position (e.g., "1/5")
- Support for source titles, URLs, and descriptions
- Optional quote blocks for relevant excerpts
- Composable architecture for flexible citation formats
- Accessible design with proper keyboard navigation
- Seamless integration with AI-generated content
- Clean visual design that doesn't disrupt reading flow
- Smart badge display showing source hostname and count

## Props

### `<InlineCitation />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"span">',
      description: 'Any other props are spread to the root span element.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationText />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"span">',
      description: 'Any other props are spread to the underlying span element.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCard />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"span">',
      description: 'Any other props are spread to the HoverCard component.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCardTrigger />`

<PropertiesTable
  content={[
    {
      name: 'sources',
      type: 'string[]',
      description:
        'Array of source URLs. The length determines the number displayed in the badge.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"button">',
      description:
        'Any other props are spread to the underlying button element.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCardBody />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarousel />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Carousel>',
      description:
        'Any other props are spread to the underlying Carousel component.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any other props are spread to the underlying CarouselContent component.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselItem />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselHeader />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselIndex />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description:
        'Any other props are spread to the underlying div. Children will override the default index display.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselPrev />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CarouselPrevious>',
      description:
        'Any other props are spread to the underlying CarouselPrevious component.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationCarouselNext />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CarouselNext>',
      description:
        'Any other props are spread to the underlying CarouselNext component.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationSource />`

<PropertiesTable
  content={[
    {
      name: 'title',
      type: 'string',
      description: 'The title of the source.',
      isOptional: true,
    },
    {
      name: 'url',
      type: 'string',
      description: 'The URL of the source.',
      isOptional: true,
    },
    {
      name: 'description',
      type: 'string',
      description: 'A brief description of the source.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<InlineCitationQuote />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"blockquote">',
      description:
        'Any other props are spread to the underlying blockquote element.',
      isOptional: true,
    },
  ]}
/>

---
title: Loader
description: A spinning loader component for indicating loading states in AI applications.
path: elements/components/loader
---

# Loader

The `Loader` component provides a spinning animation to indicate loading states in your AI applications. It includes both a customizable wrapper component and the underlying icon for flexible usage.

<Preview path="loader" />

## Installation

<ElementsInstaller path="loader" />

## Usage

```tsx
import { Loader } from '@/components/ai-elements/loader';
```

```tsx
<Loader />
```

## Usage with AI SDK

Build a simple chat app that displays a loader before it the response streans by using `status === "submitted"`.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

const LoaderDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default LoaderDemo;
```

Add the following route to your backend:

```ts filename="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Clean, modern spinning animation using CSS animations
- Configurable size with the `size` prop
- Customizable styling with CSS classes
- Built-in `animate-spin` animation with proper centering
- Exports both `AILoader` wrapper and `LoaderIcon` for flexible usage
- Supports all standard HTML div attributes
- TypeScript support with proper type definitions
- Optimized SVG icon with multiple opacity levels for smooth animation
- Uses `currentColor` for proper theme integration
- Responsive and accessible design

## Examples

### Different Sizes

<Preview path="loader-sizes" />

### Custom Styling

<Preview path="loader-custom" />

## Props

### `<Loader />`

<PropertiesTable
  content={[
    {
      name: 'size',
      type: 'number',
      description:
        'The size (width and height) of the loader in pixels. Defaults to 16.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

---
title: Message
description: Displays a chat interface message from either a user or an AI.
path: elements/components/message
---

# Message

The `Message` component displays a chat interface message from either a user or an AI. It includes an avatar, a name, and a message content.

<Preview path="message" />

## Installation

<ElementsInstaller path="message" />

## Usage

```tsx
import { Message, MessageContent } from '@/components/ai-elements/message';
```

```tsx
// Default contained variant
<Message from="user">
  <MessageContent>Hi there!</MessageContent>
</Message>

// Flat variant for a minimalist look
<Message from="assistant">
  <MessageContent variant="flat">Hello! How can I help you today?</MessageContent>
</Message>
```

## Usage with AI SDK

Render messages in a list with `useChat`.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { Message, MessageContent } from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';

const MessageDemo = () => {
  const { messages } = useChat();

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        {messages.map((message) => (
          <Message from={message.role} key={message.id}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text': // we don't use any reasoning or tool calls in this example
                    return (
                      <Response key={`${message.id}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        ))}
      </div>
    </div>
  );
};

export default MessageDemo;
```

## Features

- Displays messages from both the user and AI assistant with distinct styling.
- Two visual variants: **contained** (default) and **flat** for different design preferences.
- Includes avatar images for message senders with fallback initials.
- Shows the sender's name through avatar fallbacks.
- Automatically aligns user and assistant messages on opposite sides.
- Uses different background colors for user and assistant messages.
- Accepts any React node as message content.

## Variants

### Contained (default)
The **contained** variant provides distinct visual separation with colored backgrounds:
- User messages appear with primary background color and are right-aligned
- Assistant messages have secondary background color and are left-aligned
- Both message types have padding and rounded corners

### Flat
The **flat** variant offers a minimalist design that matches modern AI interfaces like ChatGPT and Gemini:
- User messages use softer secondary colors with subtle borders
- Assistant messages display full-width without background or padding
- Creates a cleaner, more streamlined conversation appearance

## Notes

Always render the `AIMessageContent` first, then the `AIMessageAvatar`. The `AIMessage` component is a wrapper that determines the alignment of the message.

## Examples

### Render Markdown

We can use the [`Response`](/elements/components/response) component to render markdown content.

<Preview path="message-markdown" />

### Flat Variant

The flat variant provides a minimalist design that matches modern AI interfaces.

<Preview path="message-flat" />

## Props

### `<Message />`

<PropertiesTable
  content={[
    {
      name: 'from',
      type: 'UIMessage["role"]',
      description:
        'The role of the message sender ("user", "assistant", or "system").',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

### `<MessageContent />`

<PropertiesTable
  content={[
    {
      name: 'variant',
      type: '"contained" | "flat"',
      description: 'Visual style variant. "contained" (default) shows colored backgrounds, "flat" provides a minimalist design.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the content div.',
      isOptional: true,
    },
  ]}
/>

### `<MessageAvatar />`

<PropertiesTable
  content={[
    {
      name: 'src',
      type: 'string',
      description: 'The URL of the avatar image.',
      isOptional: false,
    },
    {
      name: 'name',
      type: 'string',
      description:
        'The name to use for the avatar fallback (first 2 letters shown if image is missing).',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Avatar>',
      description:
        'Any other props are spread to the underlying Avatar component.',
      isOptional: true,
    },
  ]}
/>

---
title: Open In Chat
description: A dropdown menu for opening queries in various AI chat platforms including ChatGPT, Claude, T3, Scira, and v0.
path: elements/components/open-in-chat
---

# Open In Chat

The `OpenIn` component provides a dropdown menu that allows users to open queries in different AI chat platforms with a single click.

<Preview path="open-in-chat" />

## Installation

<ElementsInstaller path="open-in-chat" />

## Usage

```tsx
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from '@/components/ai-elements/open-in-chat';
```

```tsx
<OpenIn query="How can I implement authentication in Next.js?">
  <OpenInTrigger />
  <OpenInContent>
    <OpenInChatGPT />
    <OpenInClaude />
    <OpenInT3 />
    <OpenInScira />
    <OpenInv0 />
    <OpenInCursor />
  </OpenInContent>
</OpenIn>
```

## Features

- Pre-configured links to popular AI chat platforms
- Context-based query passing for cleaner API
- Customizable dropdown trigger button
- Automatic URL parameter encoding for queries
- Support for ChatGPT, Claude, T3 Chat, Scira AI, v0, and Cursor
- Branded icons for each platform
- TypeScript support with proper type definitions
- Accessible dropdown menu with keyboard navigation
- External link indicators for clarity

## Supported Platforms

- **ChatGPT** - Opens query in OpenAI's ChatGPT with search hints
- **Claude** - Opens query in Anthropic's Claude AI
- **T3 Chat** - Opens query in T3 Chat platform
- **Scira AI** - Opens query in Scira's AI assistant
- **v0** - Opens query in Vercel's v0 platform
- **Cursor** - Opens query in Cursor AI editor

## Props

### `<OpenIn />`

<PropertiesTable
  content={[
    {
      name: 'query',
      type: 'string',
      description: 'The query text to be sent to all AI platforms.',
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenu>',
      description: 'Props to spread to the underlying radix-ui DropdownMenu component.',
    },
  ]}
/>

### `<OpenInTrigger />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Custom trigger button. Defaults to "Open in chat" button with chevron icon.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuTrigger>',
      description: 'Props to spread to the underlying DropdownMenuTrigger component.',
    },
  ]}
/>

### `<OpenInContent />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the dropdown content.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuContent>',
      description: 'Props to spread to the underlying DropdownMenuContent component.',
    },
  ]}
/>

### `<OpenInChatGPT />`, `<OpenInClaude />`, `<OpenInT3 />`, `<OpenInScira />`, `<OpenInv0 />`, `<OpenInCursor />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuItem>',
      description: 'Props to spread to the underlying DropdownMenuItem component. The query is automatically provided via context from the parent OpenIn component.',
    },
  ]}
/>

### `<OpenInItem />`, `<OpenInLabel />`, `<OpenInSeparator />`

Additional composable components for custom dropdown menu items, labels, and separators that follow the same props pattern as their underlying radix-ui counterparts.
---
title: Prompt Input
description: Allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.
path: elements/components/prompt-input
---

# Prompt Input

The `PromptInput` component allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.

<Preview path="prompt-input" />

## Installation

<ElementsInstaller path="prompt-input" />

## Usage

```tsx
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputProvider,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
```

```tsx
import { GlobeIcon } from 'lucide-react';

<PromptInput onSubmit={() => {}} className="mt-4 relative">
  <PromptInputBody>
    <PromptInputAttachments>
      {(attachment) => (
        <PromptInputAttachment data={attachment} />
      )}
    </PromptInputAttachments>
    <PromptInputTextarea onChange={(e) => {}} value={''} />
  </PromptInputBody>
  <PromptInputToolbar>
    <PromptInputTools>
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger />
        <PromptInputActionMenuContent>
          <PromptInputActionAddAttachments />
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
      <PromptInputSpeechButton />
      <PromptInputButton>
        <GlobeIcon size={16} />
        <span>Search</span>
      </PromptInputButton>
      <PromptInputModelSelect onValueChange={(value) => {}} value="gpt-4o">
        <PromptInputModelSelectTrigger>
          <PromptInputModelSelectValue />
        </PromptInputModelSelectTrigger>
        <PromptInputModelSelectContent>
          <PromptInputModelSelectItem value="gpt-4o">
            GPT-4o
          </PromptInputModelSelectItem>
          <PromptInputModelSelectItem value="claude-opus-4-20250514">
            Claude 4 Opus
          </PromptInputModelSelectItem>
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>
    </PromptInputTools>
    <PromptInputSubmit
      disabled={false}
      status={'ready'}
    />
  </PromptInputToolbar>
</PromptInput>
```

## Usage with AI SDK

Built a fully functional chat app using `PromptInput`, [`Conversation`](/elements/components/conversation) with a model picker:

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

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
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { GlobeIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];

const InputDemo = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, status, sendMessage } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      { 
        text: message.text || 'Sent with attachments',
        files: message.files 
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      },
    );
    setText('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton
                onTranscriptionChange={setText}
                textareaRef={textareaRef}
              />
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant={useWebSearch ? 'default' : 'ghost'}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default InputDemo;
```

Add the following route to your backend:

```ts filename="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { 
    model, 
    messages, 
    webSearch 
  }: { 
    messages: UIMessage[]; 
    model: string;
    webSearch?: boolean;
  } = await req.json();

  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : model,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Auto-resizing textarea that adjusts height based on content
- File attachment support with drag-and-drop
- Image preview for image attachments
- Configurable file constraints (max files, max size, accepted types)
- Automatic submit button icons based on status
- Support for keyboard shortcuts (Enter to submit, Shift+Enter for new line)
- Customizable min/max height for the textarea
- Flexible toolbar with support for custom actions and tools
- Built-in model selection dropdown
- Built-in native speech recognition button (Web Speech API)
- Optional provider for lifted state management
- Form automatically resets on submit
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes
- Form-based submission handling
- Hidden file input sync for native form posts
- Global document drop support (opt-in)

## Props

### `<PromptInput />`

<PropertiesTable
  content={[
    {
      name: 'onSubmit',
      type: '(message: PromptInputMessage, event: FormEvent) => void',
      description: 'Handler called when the form is submitted with message text and files.',
      isOptional: false,
    },
    {
      name: 'accept',
      type: 'string',
      description: 'File types to accept (e.g., "image/*"). Leave undefined for any.',
      isOptional: true,
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Whether to allow multiple file selection.',
      isOptional: true,
    },
    {
      name: 'globalDrop',
      type: 'boolean',
      description: 'When true, accepts file drops anywhere on the document.',
      isOptional: true,
    },
    {
      name: 'syncHiddenInput',
      type: 'boolean',
      description: 'Render a hidden input with given name for native form posts.',
      isOptional: true,
    },
    {
      name: 'maxFiles',
      type: 'number',
      description: 'Maximum number of files allowed.',
      isOptional: true,
    },
    {
      name: 'maxFileSize',
      type: 'number',
      description: 'Maximum file size in bytes.',
      isOptional: true,
    },
    {
      name: 'onError',
      type: '(err: { code: "max_files" | "max_file_size" | "accept", message: string }) => void',
      description: 'Handler for file validation errors.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLFormElement>',
      description: 'Any other props are spread to the root form element.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputTextarea />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Textarea>',
      description:
        'Any other props are spread to the underlying Textarea component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputToolbar />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the toolbar div.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputTools />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the tools div.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputButton />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputSubmit />`

<PropertiesTable
  content={[
    {
      name: 'status',
      type: 'ChatStatus',
      description: 'Current chat status to determine button icon (submitted, streaming, error).',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputModelSelect />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Select>',
      description:
        'Any other props are spread to the underlying Select component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputModelSelectTrigger />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof SelectTrigger>',
      description:
        'Any other props are spread to the underlying SelectTrigger component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputModelSelectContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof SelectContent>',
      description:
        'Any other props are spread to the underlying SelectContent component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputModelSelectItem />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof SelectItem>',
      description:
        'Any other props are spread to the underlying SelectItem component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputModelSelectValue />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof SelectValue>',
      description:
        'Any other props are spread to the underlying SelectValue component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputBody />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the body div.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputAttachments />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: '(attachment: FileUIPart & { id: string }) => React.ReactNode',
      description: 'Render function for each attachment.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the attachments container.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputAttachment />`

<PropertiesTable
  content={[
    {
      name: 'data',
      type: 'FileUIPart & { id: string }',
      description: 'The attachment data to display.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the attachment div.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputActionMenu />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenu>',
      description:
        'Any other props are spread to the underlying DropdownMenu component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputActionMenuTrigger />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying Button component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputActionMenuContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuContent>',
      description:
        'Any other props are spread to the underlying DropdownMenuContent component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputActionMenuItem />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuItem>',
      description:
        'Any other props are spread to the underlying DropdownMenuItem component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputActionAddAttachments />`

<PropertiesTable
  content={[
    {
      name: 'label',
      type: 'string',
      description: 'Label for the menu item. Defaults to "Add photos or files".',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof DropdownMenuItem>',
      description:
        'Any other props are spread to the underlying DropdownMenuItem component.',
      isOptional: true,
    },
  ]}
/>

### `<PromptInputProvider />`

<PropertiesTable
  content={[
    {
      name: 'initialInput',
      type: 'string',
      description: 'Initial text input value.',
      isOptional: true,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Child components that will have access to the provider context.',
      isOptional: false,
    },
  ]}
/>

Optional global provider that lifts PromptInput state outside of PromptInput. When used, it allows you to access and control the input state from anywhere within the provider tree. If not used, PromptInput stays fully self-managed.

### `<PromptInputSpeechButton />`

<PropertiesTable
  content={[
    {
      name: 'textareaRef',
      type: 'RefObject<HTMLTextAreaElement | null>',
      description: 'Reference to the textarea element to insert transcribed text.',
      isOptional: true,
    },
    {
      name: 'onTranscriptionChange',
      type: '(text: string) => void',
      description: 'Callback fired when transcription text changes.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof PromptInputButton>',
      description:
        'Any other props are spread to the underlying PromptInputButton component.',
      isOptional: true,
    },
  ]}
/>

Built-in button component that provides native speech recognition using the Web Speech API. The button will be disabled if speech recognition is not supported in the browser. Displays a microphone icon and pulses while actively listening.

## Hooks

### `usePromptInputAttachments`

Access and manage file attachments within a PromptInput context.

```tsx
const attachments = usePromptInputAttachments();

// Available methods:
attachments.files // Array of current attachments
attachments.add(files) // Add new files
attachments.remove(id) // Remove an attachment by ID
attachments.clear() // Clear all attachments
attachments.openFileDialog() // Open file selection dialog
```

### `usePromptInputController`

Access the full PromptInput controller from a PromptInputProvider. Only available when using the provider.

```tsx
const controller = usePromptInputController();

// Available methods:
controller.textInput.value // Current text input value
controller.textInput.setInput(value) // Set text input value
controller.textInput.clear() // Clear text input
controller.attachments // Same as usePromptInputAttachments
```

### `useProviderAttachments`

Access attachments context from a PromptInputProvider. Only available when using the provider.

```tsx
const attachments = useProviderAttachments();

// Same interface as usePromptInputAttachments
```

---
title: Reasoning
description: A collapsible component that displays AI reasoning content, automatically opening during streaming and closing when finished.
path: elements/components/reasoning
---

# Reasoning

The `Reasoning` component displays AI reasoning content, automatically opening during streaming and closing when finished.

<Preview path="reasoning" />

## Installation

<ElementsInstaller path="reasoning" />

## Usage

```tsx
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
```

```tsx
<Reasoning className="w-full" isStreaming={false}>
  <ReasoningTrigger />
  <ReasoningContent>I need to computer the square of 2.</ReasoningContent>
</Reasoning>
```

## Usage with AI SDK

Build a chatbot with reasoning using Deepseek R1.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from @/components/ai-elements/response';

const ReasoningDemo = () => {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      case 'reasoning':
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
      </div>
    </div>
  );
};

export default ReasoningDemo;
```

Add the following route to your backend:

```ts filename="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: 'deepseek/deepseek-r1',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

## Features

- Automatically opens when streaming content and closes when finished
- Manual toggle control for user interaction
- Smooth animations and transitions powered by Radix UI
- Visual streaming indicator with pulsing animation
- Composable architecture with separate trigger and content components
- Built with accessibility in mind including keyboard navigation
- Responsive design that works across different screen sizes
- Seamlessly integrates with both light and dark themes
- Built on top of shadcn/ui Collapsible primitives
- TypeScript support with proper type definitions

## Props

### `<Reasoning />`

<PropertiesTable
  content={[
    {
      name: 'isStreaming',
      type: 'boolean',
      description:
        'Whether the reasoning is currently streaming (auto-opens and closes the panel).',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Collapsible>',
      description:
        'Any other props are spread to the underlying Collapsible component.',
      isOptional: true,
    },
  ]}
/>

### `<ReasoningTrigger />`

<PropertiesTable
  content={[
    {
      name: 'title',
      type: 'string',
      description:
        'Optional title to display in the trigger (default: "Reasoning").',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleTrigger>',
      description:
        'Any other props are spread to the underlying CollapsibleTrigger component.',
      isOptional: true,
    },
  ]}
/>

### `<ReasoningContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleContent>',
      description:
        'Any other props are spread to the underlying CollapsibleContent component.',
      isOptional: true,
    },
  ]}
/>

---
title: Response
description: A component that renders a Markdown response from a large language model.
path: elements/components/response
---

# Response

The `Response` component renders a Markdown response from a large language model. It uses [Streamdown](https://streamdown.ai/) under the hood to render the markdown.

<Preview path="response" />

## Installation

<ElementsInstaller path="response" />

<Note label={false} type="warning">
  **Important:** After adding the component, you'll need to add the following to your `globals.css` file:

  ```css
  @source "../node_modules/streamdown/dist/index.js";
  ```

  This is **required** for the Response component to work properly. Without this import, the Streamdown styles will not be applied to your project. See [Streamdown's documentation](https://streamdown.ai/) for more details.
</Note>

## Usage

```tsx
import { Response } from '@/components/ai-elements/response';
```

```tsx
<Response>**Hi there.** I am an AI model designed to help you.</Response>
```

## Usage with AI SDK

Populate a markdown response with messages from [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';

const ResponseDemo = () => {
  const { messages } = useChat();

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text': // we don't use any reasoning or tool calls in this example
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
};

export default ResponseDemo;
```

## Features

- Renders markdown content with support for paragraphs, links, and code blocks
- Supports GFM features like tables, task lists, and strikethrough text via remark-gfm
- Supports rendering Math Equations via rehype-katex
- **Smart streaming support** - automatically completes incomplete formatting during real-time text streaming
- Code blocks are rendered with syntax highlighting for various programming languages
- Code blocks include a button to easily copy code to clipboard
- Adapts to different screen sizes while maintaining readability
- Seamlessly integrates with both light and dark themes
- Customizable appearance through className props and Tailwind CSS utilities
- Built with accessibility in mind for all users

## Props

### `<Response />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'string',
      description: 'The markdown content to render.',
    },
    {
      name: 'parseIncompleteMarkdown',
      type: 'boolean',
      description: 'Whether to parse and fix incomplete markdown syntax (e.g., unclosed code blocks or lists).',
      default: 'true',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class names to apply to the wrapper div element.',
      isOptional: true,
    },
    {
      name: 'components',
      type: 'object',
      description: 'Custom React components to use for rendering markdown elements (e.g., custom heading, paragraph, code block components).',
      isOptional: true,
    },
    {
      name: 'allowedImagePrefixes',
      type: 'string[]',
      description: 'Array of allowed URL prefixes for images. Use ["*"] to allow all images.',
      default: '["*"]',
      isOptional: true,
    },
    {
      name: 'allowedLinkPrefixes',
      type: 'string[]',
      description: 'Array of allowed URL prefixes for links. Use ["*"] to allow all links.',
      default: '["*"]',
      isOptional: true,
    },
    {
      name: 'defaultOrigin',
      type: 'string',
      description: 'Default origin to use for relative URLs in links and images.',
      isOptional: true,
    },
    {
      name: 'rehypePlugins',
      type: 'array',
      description: 'Array of rehype plugins to use for processing HTML. Includes KaTeX for math rendering by default.',
      default: '[rehypeKatex]',
      isOptional: true,
    },
    {
      name: 'remarkPlugins',
      type: 'array',
      description: 'Array of remark plugins to use for processing markdown. Includes GitHub Flavored Markdown and math support by default.',
      default: '[remarkGfm, remarkMath]',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

---
title: Sources
description: A component that allows a user to view the sources or citations used to generate a response.
path: elements/components/sources
---

# Sources

The `Sources` component allows a user to view the sources or citations used to generate a response.

<Preview path="sources" />

## Installation

<ElementsInstaller path="sources" />

## Usage

```tsx
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
```

```tsx
<Sources>
  <SourcesTrigger count={1} />
  <SourcesContent>
    <Source href="https://ai-sdk.dev" title="AI SDK" />
  </SourcesContent>
</Sources>
```

## Usage with AI SDK

Build a simple web search agent with Perplexity Sonar.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from '@ai-sdk/react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { useState } from 'react';
import { DefaultChatTransport } from 'ai';

const SourceDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/sources',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto mb-4">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'source-url':
                            return (
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            );
                        }
                      })}
                    </Sources>
                  )}
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            );
                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                </div>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Ask a question and search the..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default SourceDemo;
```

Add the following route to your backend:

```tsx filename="api/chat/route.ts"
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { perplexity } from '@ai-sdk/perplexity';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'perplexity/sonar',
    system:
      'You are a helpful assistant. Keep your responses short (< 100 words) unless you are asked for more details. ALWAYS USE SEARCH.',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
  });
}
```

## Features

- Collapsible component that allows a user to view the sources or citations used to generate a response
- Customizable trigger and content components
- Support for custom sources or citations
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes

## Examples

### Custom rendering

<Preview path="sources-custom" />

## Props

### `<Sources />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

### `<SourcesTrigger />`

<PropertiesTable
  content={[
    {
      name: 'count',
      type: 'number',
      description: 'The number of sources to display in the trigger.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ButtonHTMLAttributes<HTMLButtonElement>',
      description: 'Any other props are spread to the trigger button.',
      isOptional: true,
    },
  ]}
/>

### `<SourcesContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the content container.',
      isOptional: true,
    },
  ]}
/>

### `<Source />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.AnchorHTMLAttributes<HTMLAnchorElement>',
      description: 'Any other props are spread to the anchor element.',
      isOptional: true,
    },
  ]}
/>

---
title: Suggestion
description: A suggestion component that displays a horizontal row of clickable suggestions for user interaction.
path: elements/components/suggestion
---

# Suggestion

The `Suggestion` component displays a horizontal row of clickable suggestions for user interaction.

<Preview path="suggestion" />

## Installation

<ElementsInstaller path="suggestion" />

## Usage

```tsx
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
```

```tsx
<Suggestions>
  <Suggestion suggestion="What are the latest trends in AI?" />
</Suggestions>
```

## Usage with AI SDK

Build a simple input with suggestions users can click to send a message to the LLM.

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

const suggestions = [
  'Can you explain how to play tennis?',
  'What is the weather in Tokyo?',
  'How do I make a really good fish taco?',
];

const SuggestionDemo = () => {
  const [input, setInput] = useState('');
  const { sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-4">
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
          <Input
            onSubmit={handleSubmit}
            className="mt-4 w-full max-w-2xl mx-auto relative"
          >
            <PromptInputTextarea
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.currentTarget.value)}
              className="pr-12"
            />
            <PromptInputSubmit
              status={status === 'streaming' ? 'streaming' : 'ready'}
              disabled={!input.trim()}
              className="absolute bottom-1 right-1"
            />
          </Input>
        </div>
      </div>
    </div>
  );
};

export default SuggestionDemo;
```

## Features

- Horizontal row of clickable suggestion buttons
- Customizable styling with variant and size options
- Flexible layout that wraps suggestions on smaller screens
- onClick callback that emits the selected suggestion string
- Support for both individual suggestions and suggestion lists
- Clean, modern styling with hover effects
- Responsive design with mobile-friendly touch targets
- TypeScript support with proper type definitions

## Examples

### Usage with AI Input

<Preview path="suggestion-input" />

## Props

### `<Suggestions />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof ScrollArea>',
      description:
        'Any other props are spread to the underlying ScrollArea component.',
      isOptional: true,
    },
  ]}
/>

### `<Suggestion />`

<PropertiesTable
  content={[
    {
      name: 'suggestion',
      type: 'string',
      description: 'The suggestion string to display and emit on click.',
      isOptional: false,
    },
    {
      name: 'onClick',
      type: '(suggestion: string) => void',
      description: 'Callback fired when the suggestion is clicked.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'Omit<React.ComponentProps<typeof Button>, "onClick">',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

---
title: Task
description: A collapsible task list component for displaying AI workflow progress, with status indicators and optional descriptions.
path: elements/components/task
---

# Task

The `Task` component provides a structured way to display task lists or workflow progress with collapsible details, status indicators, and progress tracking. It consists of a main `Task` container with `TaskTrigger` for the clickable header and `TaskContent` for the collapsible content area.

<Preview path="task" />

## Installation

<ElementsInstaller path="task" />

## Usage

```tsx
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@/components/ai-elements/task';
```

```tsx
<Task className="w-full">
  <TaskTrigger title="Found project files" />
  <TaskContent>
    <TaskItem>
      Read <TaskItemFile>index.md</TaskItemFile>
    </TaskItem>
  </TaskContent>
</Task>
```

## Usage with AI SDK

Build a mock async programming agent using [`experimental_generateObject`](/docs/reference/ai-sdk-ui/use-object).

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  Task,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
  TaskContent,
} from '@/components/ai-elements/task';
import { Button } from '@/components/ui/button';
import { tasksSchema } from '@/app/api/task/route';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiCss,
  SiHtml5,
  SiJson,
  SiMarkdown,
} from '@icons-pack/react-simple-icons';

const iconMap = {
  react: { component: SiReact, color: '#149ECA' },
  typescript: { component: SiTypescript, color: '#3178C6' },
  javascript: { component: SiJavascript, color: '#F7DF1E' },
  css: { component: SiCss, color: '#1572B6' },
  html: { component: SiHtml5, color: '#E34F26' },
  json: { component: SiJson, color: '#000000' },
  markdown: { component: SiMarkdown, color: '#000000' },
};

const TaskDemo = () => {
  const { object, submit, isLoading } = useObject({
    api: '/api/agent',
    schema: tasksSchema,
  });

  const handleSubmit = (taskType: string) => {
    submit({ prompt: taskType });
  };

  const renderTaskItem = (item: any, index: number) => {
    if (item?.type === 'file' && item.file) {
      const iconInfo = iconMap[item.file.icon as keyof typeof iconMap];
      if (iconInfo) {
        const IconComponent = iconInfo.component;
        return (
          <span className="inline-flex items-center gap-1" key={index}>
            {item.text}
            <TaskItemFile>
              <IconComponent
                color={item.file.color || iconInfo.color}
                className="size-4"
              />
              <span>{item.file.name}</span>
            </TaskItemFile>
          </span>
        );
      }
    }
    return item?.text || '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => handleSubmit('React component development')}
            disabled={isLoading}
            variant="outline"
          >
            React Development
          </Button>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          {isLoading && !object && (
            <div className="text-muted-foreground">Generating tasks...</div>
          )}

          {object?.tasks?.map((task: any, taskIndex: number) => (
            <Task key={taskIndex} defaultOpen={taskIndex === 0}>
              <TaskTrigger title={task.title || 'Loading...'} />
              <TaskContent>
                {task.items?.map((item: any, itemIndex: number) => (
                  <TaskItem key={itemIndex}>
                    {renderTaskItem(item, itemIndex)}
                  </TaskItem>
                ))}
              </TaskContent>
            </Task>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDemo;
```

Add the following route to your backend:

```ts filename="app/api/agent.ts"
import { streamObject } from 'ai';
import { z } from 'zod';

export const taskItemSchema = z.object({
  type: z.enum(['text', 'file']),
  text: z.string(),
  file: z
    .object({
      name: z.string(),
      icon: z.string(),
      color: z.string().optional(),
    })
    .optional(),
});

export const taskSchema = z.object({
  title: z.string(),
  items: z.array(taskItemSchema),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

export const tasksSchema = z.object({
  tasks: z.array(taskSchema),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: tasksSchema,
    prompt: `You are an AI assistant that generates realistic development task workflows. Generate a set of tasks that would occur during ${prompt}.

    Each task should have:
    - A descriptive title
    - Multiple task items showing the progression
    - Some items should be plain text, others should reference files
    - Use realistic file names and appropriate file types
    - Status should progress from pending to in_progress to completed

    For file items, use these icon types: 'react', 'typescript', 'javascript', 'css', 'html', 'json', 'markdown'

    Generate 3-4 tasks total, with 4-6 items each.`,
  });

  return result.toTextStreamResponse();
}
```

## Features

- Visual icons for pending, in-progress, completed, and error states
- Expandable content for task descriptions and additional information
- Built-in progress counter showing completed vs total tasks
- Optional progressive reveal of tasks with customizable timing
- Support for custom content within task items
- Full type safety with proper TypeScript definitions
- Keyboard navigation and screen reader support

## Props

### `<Task />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Collapsible>',
      description:
        'Any other props are spread to the root Collapsible component.',
      isOptional: true,
    },
  ]}
/>

### `<TaskTrigger />`

<PropertiesTable
  content={[
    {
      name: 'title',
      type: 'string',
      description:
        'The title of the task that will be displayed in the trigger.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleTrigger>',
      description:
        'Any other props are spread to the CollapsibleTrigger component.',
      isOptional: true,
    },
  ]}
/>

### `<TaskContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleContent>',
      description:
        'Any other props are spread to the CollapsibleContent component.',
      isOptional: true,
    },
  ]}
/>

### `<TaskItem />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<TaskItemFile />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

---
title: Tool
description: A collapsible component for displaying tool invocation details in AI chatbot interfaces.
path: elements/components/tool
---

# Tool

The `Tool` component displays a collapsible interface for showing/hiding tool details. It is designed to take the `ToolUIPart` type from the AI SDK and display it in a collapsible interface.

<Preview path="tool" />

## Installation

<ElementsInstaller path="tool" />

## Usage

```tsx
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from '@/components/ai-elements/tool';
```

```tsx
<Tool>
  <ToolHeader type="tool-call" state={'output-available' as const} />
  <ToolContent>
    <ToolInput input="Input to tool call" />
    <ToolOutput errorText="Error" output="Output from tool call" />
  </ToolContent>
</Tool>
```

## Usage in AI SDK

Build a simple stateful weather app that renders the last message in a tool using [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ToolUIPart } from 'ai';
import { Button } from '@/components/ui/button';
import { Response } from '@/components/ai-elements/response';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';

type WeatherToolInput = {
  location: string;
  units: 'celsius' | 'fahrenheit';
};

type WeatherToolOutput = {
  location: string;
  temperature: string;
  conditions: string;
  humidity: string;
  windSpeed: string;
  lastUpdated: string;
};

type WeatherToolUIPart = ToolUIPart<{
  fetch_weather_data: {
    input: WeatherToolInput;
    output: WeatherToolOutput;
  };
}>;

const Example = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/weather',
    }),
  });

  const handleWeatherClick = () => {
    sendMessage({ text: 'Get weather data for San Francisco in fahrenheit' });
  };

  const latestMessage = messages[messages.length - 1];
  const weatherTool = latestMessage?.parts?.find(
    (part) => part.type === 'tool-fetch_weather_data',
  ) as WeatherToolUIPart | undefined;

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="space-y-4">
          <Button onClick={handleWeatherClick} disabled={status !== 'ready'}>
            Get Weather for San Francisco
          </Button>

          {weatherTool && (
            <Tool defaultOpen={true}>
              <ToolHeader type="tool-fetch_weather_data" state={weatherTool.state} />
              <ToolContent>
                <ToolInput input={weatherTool.input} />
                <ToolOutput
                  output={
                    <Response>
                      {formatWeatherResult(weatherTool.output)}
                    </Response>
                  }
                  errorText={weatherTool.errorText}
                />
              </ToolContent>
            </Tool>
          )}
        </div>
      </div>
    </div>
  );
};

function formatWeatherResult(result: WeatherToolOutput): string {
  return `**Weather for ${result.location}**

**Temperature:** ${result.temperature}  
**Conditions:** ${result.conditions}  
**Humidity:** ${result.humidity}  
**Wind Speed:** ${result.windSpeed}  

*Last updated: ${result.lastUpdated}*`;
}

export default Example;
```

Add the following route to your backend:

```ts filename="app/api/weather/route.tsx"
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
    tools: {
      fetch_weather_data: {
        description: 'Fetch weather information for a specific location',
        parameters: z.object({
          location: z
            .string()
            .describe('The city or location to get weather for'),
          units: z
            .enum(['celsius', 'fahrenheit'])
            .default('celsius')
            .describe('Temperature units'),
        }),
        inputSchema: z.object({
          location: z.string(),
          units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
        }),
        execute: async ({ location, units }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const temp =
            units === 'celsius'
              ? Math.floor(Math.random() * 35) + 5
              : Math.floor(Math.random() * 63) + 41;

          return {
            location,
            temperature: `${temp}°${units === 'celsius' ? 'C' : 'F'}`,
            conditions: 'Sunny',
            humidity: `12%`,
            windSpeed: `35 ${units === 'celsius' ? 'km/h' : 'mph'}`,
            lastUpdated: new Date().toLocaleString(),
          };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Collapsible interface for showing/hiding tool details
- Visual status indicators with icons and badges
- Support for multiple tool execution states (pending, running, completed, error)
- Formatted parameter display with JSON syntax highlighting
- Result and error handling with appropriate styling
- Composable structure for flexible layouts
- Accessible keyboard navigation and screen reader support
- Consistent styling that matches your design system
- Auto-opens completed tools by default for better UX

## Examples

### Input Streaming (Pending)

Shows a tool in its initial state while parameters are being processed.

<Preview path="tool-input-streaming" />

### Input Available (Running)

Shows a tool that's actively executing with its parameters.

<Preview path="tool-input-available" />

### Output Available (Completed)

Shows a completed tool with successful results. Opens by default to show the results. In this instance, the output is a JSON object, so we can use the `CodeBlock` component to display it.

<Preview path="tool-output-available" />

### Output Error

Shows a tool that encountered an error during execution. Opens by default to display the error.

<Preview path="tool-output-error" />

## Props

### `<Tool />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Collapsible>',
      description:
        'Any other props are spread to the root Collapsible component.',
      isOptional: true,
    },
  ]}
/>

### `<ToolHeader />`

<PropertiesTable
  content={[
    {
      name: 'type',
      type: 'ToolUIPart["type"]',
      description: 'The type/name of the tool.',
      isOptional: false,
    },
    {
      name: 'state',
      type: 'ToolUIPart["state"]',
      description:
        'The current state of the tool (input-streaming, input-available, output-available, or output-error).',
      isOptional: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the header.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleTrigger>',
      description: 'Any other props are spread to the CollapsibleTrigger.',
      isOptional: true,
    },
  ]}
/>

### `<ToolContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof CollapsibleContent>',
      description: 'Any other props are spread to the CollapsibleContent.',
      isOptional: true,
    },
  ]}
/>

### `<ToolInput />`

<PropertiesTable
  content={[
    {
      name: 'input',
      type: 'ToolUIPart["input"]',
      description:
        'The input parameters passed to the tool, displayed as formatted JSON.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

### `<ToolOutput />`

<PropertiesTable
  content={[
    {
      name: 'output',
      type: 'React.ReactNode',
      description: 'The output/result of the tool execution.',
      isOptional: false,
    },
    {
      name: 'errorText',
      type: 'ToolUIPart["errorText"]',
      description: 'An error message if the tool execution failed.',
      isOptional: false,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<"div">',
      description: 'Any other props are spread to the underlying div.',
      isOptional: true,
    },
  ]}
/>

---
title: Canvas
description: A React Flow-based canvas component for building interactive node-based interfaces.
path: elements/components/canvas
---

# Canvas

The `Canvas` component provides a React Flow-based canvas for building interactive node-based interfaces. It comes pre-configured with sensible defaults for AI applications, including panning, zooming, and selection behaviors.

<Note>
  The Canvas component is designed to be used with the [Node](/elements/components/node) and [Edge](/elements/components/edge) components. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="canvas" />

## Usage

```tsx
import { Canvas } from '@/components/ai-elements/canvas';
```

```tsx
<Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} />
```

## Features

- Pre-configured React Flow canvas with AI-optimized defaults
- Pan on scroll enabled for intuitive navigation
- Selection on drag for multi-node operations
- Customizable background color using CSS variables
- Delete key support (Backspace and Delete keys)
- Auto-fit view to show all nodes
- Disabled double-click zoom for better UX
- Disabled pan on drag to prevent accidental canvas movement
- Fully compatible with React Flow props and API

## Props

### `<Canvas />`

<PropertiesTable
  content={[
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Child components like Background, Controls, or MiniMap.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ReactFlowProps',
      description: 'Any other React Flow props like nodes, edges, nodeTypes, edgeTypes, onNodesChange, etc.',
    },
  ]}
/>
---
title: Connection
description: A custom connection line component for React Flow-based canvases with animated bezier curve styling.
path: elements/components/connection
---

# Connection

The `Connection` component provides a styled connection line for React Flow canvases. It renders an animated bezier curve with a circle indicator at the target end, using consistent theming through CSS variables.

<Note>
  The Connection component is designed to be used with the [Canvas](/elements/components/canvas) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="connection" />

## Usage

```tsx
import { Connection } from '@/components/ai-elements/connection';
```

```tsx
<ReactFlow connectionLineComponent={Connection} />
```

## Features

- Smooth bezier curve animation for connection lines
- Visual indicator circle at the target position
- Theme-aware styling using CSS variables
- Cubic bezier curve calculation for natural flow
- Lightweight implementation with minimal props
- Full TypeScript support with React Flow types
- Compatible with React Flow's connection system

## Props

### `<Connection />`

<PropertiesTable
  content={[
    {
      name: 'fromX',
      type: 'number',
      description: 'The x-coordinate of the connection start point.',
    },
    {
      name: 'fromY',
      type: 'number',
      description: 'The y-coordinate of the connection start point.',
    },
    {
      name: 'toX',
      type: 'number',
      description: 'The x-coordinate of the connection end point.',
    },
    {
      name: 'toY',
      type: 'number',
      description: 'The y-coordinate of the connection end point.',
    },
  ]}
/>
---
title: Controls
description: A styled controls component for React Flow-based canvases with zoom and fit view functionality.
path: elements/components/controls
---

# Controls

The `Controls` component provides interactive zoom and fit view controls for React Flow canvases. It includes a modern, themed design with backdrop blur and card styling.

<Note>
  The Controls component is designed to be used with the [Canvas](/elements/components/canvas) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="controls" />

## Usage

```tsx
import { Controls } from '@/components/ai-elements/controls';
```

```tsx
<ReactFlow>
  <Controls />
</ReactFlow>
```

## Features

- Zoom in/out controls
- Fit view button to center and scale content
- Rounded pill design with backdrop blur
- Theme-aware card background
- Subtle drop shadow for depth
- Full TypeScript support
- Compatible with all React Flow control features

## Props

### `<Controls />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the controls.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof Controls>',
      description: 'Any other props from @xyflow/react Controls component (showZoom, showFitView, showInteractive, position, etc.).',
    },
  ]}
/>
---
title: Edge
description: Customizable edge components for React Flow canvases with animated and temporary states.
path: elements/components/edge
---

# Edge

The `Edge` component provides two pre-styled edge types for React Flow canvases: `Temporary` for dashed temporary connections and `Animated` for connections with animated indicators.

<Note>
  The Edge component is designed to be used with the [Canvas](/elements/components/canvas) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="edge" />

## Usage

```tsx
import { Edge } from '@/components/ai-elements/edge';
```

```tsx
const edgeTypes = {
  temporary: Edge.Temporary,
  animated: Edge.Animated,
};

<Canvas
  nodes={nodes}
  edges={edges}
  edgeTypes={edgeTypes}
/>
```

## Features

- Two distinct edge types: Temporary and Animated
- Temporary edges use dashed lines with ring color
- Animated edges include a moving circle indicator
- Automatic handle position calculation
- Smart offset calculation based on handle type and position
- Uses Bezier curves for smooth, natural-looking connections
- Fully compatible with React Flow's edge system
- Type-safe implementation with TypeScript

## Edge Types

### `Edge.Temporary`

A dashed edge style for temporary or preview connections. Uses a simple Bezier path with a dashed stroke pattern.

### `Edge.Animated`

A solid edge with an animated circle that moves along the path. The animation repeats indefinitely with a 2-second duration, providing visual feedback for active connections.

## Props

Both edge types accept standard React Flow `EdgeProps`:

<PropertiesTable
  content={[
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier for the edge.',
    },
    {
      name: 'source',
      type: 'string',
      description: 'ID of the source node.',
    },
    {
      name: 'target',
      type: 'string',
      description: 'ID of the target node.',
    },
    {
      name: 'sourceX',
      type: 'number',
      description: 'X coordinate of the source handle (Temporary only).',
      isOptional: true,
    },
    {
      name: 'sourceY',
      type: 'number',
      description: 'Y coordinate of the source handle (Temporary only).',
      isOptional: true,
    },
    {
      name: 'targetX',
      type: 'number',
      description: 'X coordinate of the target handle (Temporary only).',
      isOptional: true,
    },
    {
      name: 'targetY',
      type: 'number',
      description: 'Y coordinate of the target handle (Temporary only).',
      isOptional: true,
    },
    {
      name: 'sourcePosition',
      type: 'Position',
      description: 'Position of the source handle (Left, Right, Top, Bottom).',
      isOptional: true,
    },
    {
      name: 'targetPosition',
      type: 'Position',
      description: 'Position of the target handle (Left, Right, Top, Bottom).',
      isOptional: true,
    },
    {
      name: 'markerEnd',
      type: 'string',
      description: 'SVG marker ID for the edge end (Animated only).',
      isOptional: true,
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Custom styles for the edge (Animated only).',
      isOptional: true,
    },
  ]}
/>
---
title: Workflow
description: Components for building node-based workflow visualizations.
---

# Workflow Components

Components for building interactive node-based workflow diagrams using React Flow. These components provide canvas rendering, customizable nodes, and animated edges for creating visual process flows.
---
title: Node
description: A composable node component for React Flow-based canvases with Card-based styling.
path: elements/components/node
---

# Node

The `Node` component provides a composable, Card-based node for React Flow canvases. It includes support for connection handles, structured layouts, and consistent styling using shadcn/ui components.

<Note>
  The Node component is designed to be used with the [Canvas](/elements/components/canvas) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="node" />

## Usage

```tsx
import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
} from '@/components/ai-elements/node';
```

```tsx
<Node handles={{ target: true, source: true }}>
  <NodeHeader>
    <NodeTitle>Node Title</NodeTitle>
    <NodeDescription>Optional description</NodeDescription>
    <NodeAction>
      <Button>Action</Button>
    </NodeAction>
  </NodeHeader>
  <NodeContent>
    Main content goes here
  </NodeContent>
  <NodeFooter>
    Footer content
  </NodeFooter>
</Node>
```

## Features

- Built on shadcn/ui Card components for consistent styling
- Automatic handle placement (left for target, right for source)
- Composable sub-components (Header, Title, Description, Action, Content, Footer)
- Semantic structure for organizing node information
- Pre-styled sections with borders and backgrounds
- Responsive sizing with fixed small width
- Full TypeScript support with proper type definitions
- Compatible with React Flow's node system

## Props

### `<Node />`

<PropertiesTable
  content={[
    {
      name: 'handles',
      type: '{ target: boolean; source: boolean; }',
      description: 'Configuration for connection handles. Target renders on the left, source on the right.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the node.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof Card>',
      description: 'Any other props are spread to the underlying Card component.',
    },
  ]}
/>

### `<NodeHeader />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the header.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardHeader>',
      description: 'Any other props are spread to the underlying CardHeader component.',
    },
  ]}
/>

### `<NodeTitle />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardTitle>',
      description: 'Any other props are spread to the underlying CardTitle component.',
    },
  ]}
/>

### `<NodeDescription />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardDescription>',
      description: 'Any other props are spread to the underlying CardDescription component.',
    },
  ]}
/>

### `<NodeAction />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardAction>',
      description: 'Any other props are spread to the underlying CardAction component.',
    },
  ]}
/>

### `<NodeContent />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the content.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardContent>',
      description: 'Any other props are spread to the underlying CardContent component.',
    },
  ]}
/>

### `<NodeFooter />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the footer.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof CardFooter>',
      description: 'Any other props are spread to the underlying CardFooter component.',
    },
  ]}
/>
---
title: Panel
description: A styled panel component for React Flow-based canvases to position custom UI elements.
path: elements/components/panel
---

# Panel

The `Panel` component provides a positioned container for custom UI elements on React Flow canvases. It includes modern card styling with backdrop blur and flexible positioning options.

<Note>
  The Panel component is designed to be used with the [Canvas](/elements/components/canvas) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="panel" />

## Usage

```tsx
import { Panel } from '@/components/ai-elements/panel';
```

```tsx
<ReactFlow>
  <Panel position="top-left">
    <Button>Custom Action</Button>
  </Panel>
</ReactFlow>
```

## Features

- Flexible positioning (top-left, top-right, bottom-left, bottom-right, top-center, bottom-center)
- Rounded pill design with backdrop blur
- Theme-aware card background
- Flexbox layout for easy content alignment
- Subtle drop shadow for depth
- Full TypeScript support
- Compatible with React Flow's panel system

## Props

### `<Panel />`

<PropertiesTable
  content={[
    {
      name: 'position',
      type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
      description: 'Position of the panel on the canvas.',
      isOptional: true,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the panel.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof Panel>',
      description: 'Any other props from @xyflow/react Panel component.',
    },
  ]}
/>
---
title: Toolbar
description: A styled toolbar component for React Flow nodes with flexible positioning and custom actions.
path: elements/components/toolbar
---

# Toolbar

The `Toolbar` component provides a positioned toolbar that attaches to nodes in React Flow canvases. It features modern card styling with backdrop blur and flexbox layout for action buttons and controls.

<Note>
  The Toolbar component is designed to be used with the [Node](/elements/components/node) component. See the [Workflow](/elements/examples/workflow) demo for a full example.
</Note>

## Installation

<ElementsInstaller path="toolbar" />

## Usage

```tsx
import { Toolbar } from '@/components/ai-elements/toolbar';
```

```tsx
import { Toolbar } from '@/components/ai-elements/toolbar';
import { Button } from '@/components/ui/button';

const CustomNode = () => (
  <Node>
    <NodeContent>...</NodeContent>
    <Toolbar>
      <Button size="sm" variant="ghost">
        Edit
      </Button>
      <Button size="sm" variant="ghost">
        Delete
      </Button>
    </Toolbar>
  </Node>
);
```

## Features

- Attaches to any React Flow node
- Bottom positioning by default
- Rounded card design with border
- Theme-aware background styling
- Flexbox layout with gap spacing
- Full TypeScript support
- Compatible with all React Flow NodeToolbar features

## Props

### `<Toolbar />`

<PropertiesTable
  content={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the toolbar.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'ComponentProps<typeof NodeToolbar>',
      description: 'Any other props from @xyflow/react NodeToolbar component (position, offset, isVisible, etc.).',
    },
  ]}
/>
---
title: Artifact
description: A container component for displaying generated content like code, documents, or other outputs with built-in actions.
path: elements/components/artifact
---

# Artifact

The `Artifact` component provides a structured container for displaying generated content like code, documents, or other outputs with built-in header actions.

<Preview path="artifact" />

## Installation

<ElementsInstaller path="artifact" />

## Usage

```tsx
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from '@/components/ai-elements/artifact';
```

```tsx
<Artifact>
  <ArtifactHeader>
    <div>
      <ArtifactTitle>Dijkstra's Algorithm Implementation</ArtifactTitle>
      <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
    </div>
    <ArtifactActions>
      <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy to clipboard" />
    </ArtifactActions>
  </ArtifactHeader>
  <ArtifactContent>
    {/* Your content here */}
  </ArtifactContent>
</Artifact>
```

## Features

- Structured container with header and content areas
- Built-in header with title and description support
- Flexible action buttons with tooltips
- Customizable styling for all subcomponents
- Support for close buttons and action groups
- Clean, modern design with border and shadow
- Responsive layout that adapts to content
- TypeScript support with proper type definitions
- Composable architecture for maximum flexibility

## Examples

### With Code Display

<Preview path="artifact" />

## Props

### `<Artifact />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description:
        'Any other props are spread to the underlying div element.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactHeader />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description:
        'Any other props are spread to the underlying div element.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactTitle />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLParagraphElement>',
      description:
        'Any other props are spread to the underlying paragraph element.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactDescription />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLParagraphElement>',
      description:
        'Any other props are spread to the underlying paragraph element.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactActions />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description:
        'Any other props are spread to the underlying div element.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactAction />`

<PropertiesTable
  content={[
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text to display on hover.',
      isOptional: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Screen reader label for the action button.',
      isOptional: true,
    },
    {
      name: 'icon',
      type: 'LucideIcon',
      description: 'Lucide icon component to display in the button.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactClose />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

### `<ArtifactContent />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description:
        'Any other props are spread to the underlying div element.',
      isOptional: true,
    },
  ]}
/>
---
title: Vibe Coding
description: Components for building interactive development environments and previews.
---

# Vibe Coding Components

Components for creating interactive coding experiences, including artifact rendering and web preview capabilities for displaying and interacting with generated code.
---
title: Web Preview
description: A composable component for previewing the result of a generated UI, with support for live examples and code display.
path: elements/components/web-preview
---

# WebPreview

The `WebPreview` component provides a flexible way to showcase the result of a generated UI component, along with its source code. It is designed for documentation and demo purposes, allowing users to interact with live examples and view the underlying implementation.

<Preview path="web-preview" />

## Installation

<ElementsInstaller path="web-preview" />

## Usage

```tsx
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewUrl,
  WebPreviewBody,
} from '@/components/ai-elements/web-preview';
```

```tsx
<WebPreview defaultUrl="https://ai-sdk.dev" style={{ height: '400px' }}>
  <WebPreviewNavigation>
    <WebPreviewUrl src="https://ai-sdk.dev" />
  </WebPreviewNavigation>
  <WebPreviewBody src="https://ai-sdk.dev" />
</WebPreview>
```

## Usage with AI SDK

Build a simple v0 clone using the [v0 Platform API](https://v0.dev/docs/api/platform).

Install the `v0-sdk` package:

<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add v0-sdk" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install v0-sdk" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add v0-sdk" dark />
    </Tab>
  </Tabs>
</div>

Add the following component to your frontend:

```tsx filename="app/page.tsx"
'use client';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@/components/ai-elements/web-preview';
import { useState } from 'react';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '../ai-elements/loader';

const WebPreviewDemo = () => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPrompt('');

    setIsGenerating(true);
    try {
      const response = await fetch('/api/v0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setPreviewUrl(data.demo || '/');
      console.log('Generation finished:', data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader />
              <p className="mt-4 text-muted-foreground">
                Generating app, this may take a few seconds...
              </p>
            </div>
          ) : previewUrl ? (
            <WebPreview defaultUrl={previewUrl}>
              <WebPreviewNavigation>
                <WebPreviewUrl />
              </WebPreviewNavigation>
              <WebPreviewBody src={previewUrl} />
            </WebPreview>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Your generated app will appear here
            </div>
          )}
        </div>

        <Input
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={prompt}
            placeholder="Describe the app you want to build..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="pr-12 min-h-[60px]"
          />
          <PromptInputSubmit
            status={isGenerating ? 'streaming' : 'ready'}
            disabled={!prompt.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default WebPreviewDemo;
```

Add the following route to your backend:

```ts filename="app/api/v0/route.ts"
import { v0 } from 'v0-sdk';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await v0.chats.create({
    system: 'You are an expert coder',
    message: prompt,
    modelConfiguration: {
      modelId: 'v0-1.5-sm',
      imageGenerations: false,
      thinking: false,
    },
  });

  return Response.json({
    demo: result.demo,
    webUrl: result.webUrl,
  });
}
```

## Features

- Live preview of UI components
- Composable architecture with dedicated sub-components
- Responsive design modes (Desktop, Tablet, Mobile)
- Navigation controls with back/forward functionality
- URL input and example selector
- Full screen mode support
- Console logging with timestamps
- Context-based state management
- Consistent styling with the design system
- Easy integration into documentation pages

## Props

### `<WebPreview />`

<PropertiesTable
  content={[
    {
      name: 'defaultUrl',
      type: 'string',
      description:
        'The initial URL to load in the preview (default: empty string).',
      isOptional: true,
    },
    {
      name: 'onUrlChange',
      type: '(url: string) => void',
      description: 'Callback fired when the URL changes.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

### `<WebPreviewNavigation />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the navigation container.',
      isOptional: true,
    },
  ]}
/>

### `<WebPreviewNavigationButton />`

<PropertiesTable
  content={[
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text to display on hover.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Button>',
      description:
        'Any other props are spread to the underlying shadcn/ui Button component.',
      isOptional: true,
    },
  ]}
/>

### `<WebPreviewUrl />`

<PropertiesTable
  content={[
    {
      name: '[...props]',
      type: 'React.ComponentProps<typeof Input>',
      description:
        'Any other props are spread to the underlying shadcn/ui Input component.',
      isOptional: true,
    },
  ]}
/>

### `<WebPreviewBody />`

<PropertiesTable
  content={[
    {
      name: 'loading',
      type: 'React.ReactNode',
      description: 'Optional loading indicator to display over the preview.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.IframeHTMLAttributes<HTMLIFrameElement>',
      description: 'Any other props are spread to the underlying iframe.',
      isOptional: true,
    },
  ]}
/>

### `<WebPreviewConsole />`

<PropertiesTable
  content={[
    {
      name: 'logs',
      type: 'Array<{ level: "log" | "warn" | "error"; message: string; timestamp: Date }>',
      description: 'Console log entries to display in the console panel.',
      isOptional: true,
    },
    {
      name: '[...props]',
      type: 'React.HTMLAttributes<HTMLDivElement>',
      description: 'Any other props are spread to the root div.',
      isOptional: true,
    },
  ]}
/>

---
title: Components
description: Components for building chat interfaces.
---

# Components

A comprehensive collection of React components designed for building modern AI chat interfaces. These components provide the essential building blocks you need to create interactive, accessible, and user-friendly conversational experiences.

## Foundation Components

The core building blocks that form the structure of any chat interface. These components handle the fundamental aspects of displaying conversations, managing user input, and presenting AI responses in an organized, scrollable format.

**What you'll find:**
- Conversation containers that manage message flow and scrolling behavior
- Message display components with proper alignment and styling
- Input interfaces with auto-sizing and keyboard shortcuts
- Response rendering with markdown support and syntax highlighting

## Interactive Elements

Components that enhance user engagement and provide dynamic functionality beyond basic text exchange. These elements make conversations more intuitive and provide users with multiple ways to interact with AI systems.

**What you'll find:**
- Action buttons for common response interactions (retry, like, copy, share)
- Navigation controls for exploring different conversation branches
- Quick suggestion systems for common inputs and actions
- Collapsible interfaces for detailed tool and process information
- Interactive elements that respond to user actions and preferences

## Content Enhancement

Specialized components for displaying AI-generated content, metadata, and contextual information. These components help users understand how AI responses were generated and provide transparency into the reasoning process.

**What you'll find:**
- Expandable reasoning displays that show AI thought processes
- Source and citation components for research-backed responses
- Status indicators for ongoing processes and tool executions
- Rich content rendering for various data types and formats

## Design Philosophy

Every component in this collection is built with consistent principles:

**Accessibility First**
- Full keyboard navigation support
- Screen reader compatibility with proper ARIA attributes
- High contrast and readable typography
- Focus management for complex interactions

**Responsive by Design**
- Mobile-friendly touch targets and controls
- Adaptive layouts that work across screen sizes
- Touch-optimized interactions for mobile devices
- Consistent experience across desktop and mobile

**Modern Development**
- TypeScript support with comprehensive type definitions
- Composable architecture for flexible implementations
- Theme integration supporting light and dark modes
- Built with modern React patterns and best practices

**Performance Optimized**
- Efficient rendering with minimal re-renders
- Lazy loading and code splitting where appropriate
- Optimized bundle sizes for fast loading
- Smooth animations and transitions

## Building Your Interface

These components are designed to work together seamlessly while remaining flexible enough to use independently. Whether you're building a simple chat interface or a complex conversational AI application, you can mix and match components to create the exact experience your users need.

Each component includes comprehensive documentation with examples, API references, and implementation guidance to help you integrate them into your project quickly and effectively.


---
title: AI Gateway
description: Learn how to use the AI Gateway provider with the AI SDK.
---


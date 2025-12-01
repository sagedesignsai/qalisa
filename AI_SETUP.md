# AI Infrastructure Setup Guide

This guide will help you set up the AI infrastructure for the Qalisa project with database persistence, resumable requests, and memory management.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database configured
- Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Step 1: Install Dependencies

```bash
pnpm install
```

This will install:
- `ai` - Core AI SDK
- `@ai-sdk/react` - React hooks for chat interfaces
- `@ai-sdk/google` - Google Gemini provider
- `zod` - Schema validation (already installed)

## Step 2: Environment Variables

Create a `.env.local` file in the project root with:

```env
# Database (already configured)
DATABASE_URL="postgresql://user:password@localhost:5432/qalisa?schema=public"

# Google Gemini API Key (REQUIRED)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

# AI Gateway (Optional but recommended)
# Get your key at: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
AI_GATEWAY_API_KEY="your-ai-gateway-api-key"
```

## Step 3: Database Migration

Run the Prisma migration to create the Chat and Message tables:

```bash
# Generate Prisma client with new models
pnpm prisma generate

# Create and apply migration
pnpm prisma migrate dev --name add_ai_chat_models
```

This will create:
- `chats` table - Stores chat sessions
- `messages` table - Stores individual messages with full context

## Step 4: Install AI Elements (Optional but Recommended)

AI Elements provides pre-built UI components for chat interfaces:

```bash
npx ai-elements@latest
```

This will:
- Install shadcn/ui if not already installed
- Add AI Elements components to `components/ai-elements/`
- Set up the component registry

## Step 5: Verify Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/ai` (you'll need to be logged in)

3. Start a chat conversation - messages will be automatically saved to the database

## Features

### Database Persistence
- All chats and messages are automatically saved
- Full conversation history is preserved
- Messages include all parts (text, reasoning, sources, tool calls)

### Resumable Requests
- If a stream is interrupted, you can resume it
- Stream IDs are stored in the database
- Use the `resumeStream()` function from `useChat` hook

### Memory Management
- Full conversation context is loaded when resuming a chat
- Efficient database queries with proper indexing
- Support for long conversations

## API Routes

- `POST /api/chat` - Create new chat or send message to existing chat
- `GET /api/chats` - List user's chats
- `GET /api/chats/[chatId]` - Get specific chat with all messages
- `DELETE /api/chats/[chatId]` - Archive or delete chat
- `POST /api/chat/[chatId]/resume` - Resume interrupted stream

## Usage Example

```tsx
import { ChatInterface } from '@/components/ai/chat-interface';

export default function MyPage() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
}
```

## Next Steps

1. Customize the chat interface with AI Elements components
2. Add tool calling functionality
3. Implement chat search and filtering
4. Add export/import functionality for chats

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database permissions

### API Key Issues
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Check API key has proper permissions
- Ensure API key is not expired

### Migration Issues
- Run `pnpm prisma generate` first
- Check for existing migrations conflicts
- Reset database if needed: `pnpm prisma migrate reset` (⚠️ deletes all data)


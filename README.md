# Qalisa - AI-Powered Next.js Boilerplate

A production-ready, full-stack Next.js boilerplate featuring AI chat capabilities, user authentication, and a modern dashboard. Built with TypeScript, Next.js 16, Prisma, NextAuth.js, and Google Gemini AI.

## ✨ Features

### 🤖 AI Chat Interface
- **Streaming AI Conversations** - Real-time streaming responses using Google Gemini
- **Chat Persistence** - All conversations saved to PostgreSQL database
- **Resumable Streams** - Resume interrupted conversations seamlessly
- **Multiple Model Support** - Switch between Gemini 2.5 Flash, Pro, and Flash Lite
- **Rich Message Types** - Support for text, reasoning, sources, and tool calls
- **Chat History** - Full conversation history with search and management

### 🔐 Authentication & User Management
- **NextAuth.js Integration** - Secure authentication with multiple providers
- **Credentials Auth** - Email/password authentication with bcrypt hashing
- **Google OAuth** - One-click Google sign-in
- **Session Management** - JWT-based sessions with Prisma adapter
- **User Profiles** - User management with subscription tiers

### 📊 Dashboard & Analytics
- **Interactive Charts** - Recharts-powered data visualization
- **Data Tables** - Sortable, filterable data tables
- **Section Cards** - Overview cards with key metrics
- **Responsive Design** - Mobile-first, fully responsive layout

### 🎨 Modern UI Components
- **AI Elements** - Pre-built AI chat components from [ai-sdk.dev](https://ai-sdk.dev/elements)
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Dark Mode Ready** - Theme support with next-themes
- **Animations** - Smooth animations with Motion

### 🗄️ Database & ORM
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production-ready relational database
- **Migrations** - Version-controlled schema changes
- **Type Safety** - Full TypeScript support

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript 5** - Type-safe development

### AI & Machine Learning
- **Vercel AI SDK** (`ai`) - Core AI SDK for LLM integration
- **@ai-sdk/react** - React hooks for chat interfaces
- **@ai-sdk/google** - Google Gemini provider

### Authentication
- **NextAuth.js v5** - Authentication framework
- **@auth/prisma-adapter** - Prisma adapter for NextAuth
- **bcryptjs** - Password hashing

### Database
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Tabler Icons** - Additional icon set

### Data Visualization
- **Recharts** - Composable charting library
- **React Flow** (`@xyflow/react`) - Interactive node-based graphs

### Utilities
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **nanoid** - Unique ID generation
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging

## 📁 Project Structure

```
qalisa/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── ai/                      # AI chat interface
│   │   ├── page.tsx            # Chat page (server)
│   │   └── chat-page-client.tsx # Chat page (client)
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth routes
│   │   ├── chat/               # Chat API endpoints
│   │   └── chats/              # Chat management endpoints
│   ├── dashboard/              # Dashboard pages
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Dashboard home
│   │   └── data.json          # Sample dashboard data
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
│
├── components/                  # React components
│   ├── ai/                     # AI-specific components
│   │   └── chat-interface.tsx # Main chat interface
│   ├── ai-elements/            # AI Elements components
│   │   ├── conversation.tsx   # Conversation container
│   │   ├── message.tsx        # Message component
│   │   ├── prompt-input.tsx   # Input component
│   │   ├── sources.tsx        # Source citations
│   │   ├── reasoning.tsx      # Reasoning display
│   │   └── ...                # More AI components
│   ├── dashboard/              # Dashboard components
│   │   ├── chart-area-interactive.tsx
│   │   ├── data-table/
│   │   └── section-cards.tsx
│   ├── ui/                     # shadcn/ui components
│   ├── app-sidebar.tsx         # Application sidebar
│   ├── site-header.tsx         # Site header
│   └── nav-*.tsx              # Navigation components
│
├── lib/                         # Utility libraries
│   ├── ai/                     # AI-related utilities
│   │   ├── config.ts          # AI model configuration
│   │   ├── db.ts              # Chat database functions
│   │   └── utils.ts           # AI utility functions
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Prisma client
│   ├── utils.ts                # General utilities
│   └── generated/             # Generated code
│       └── prisma/             # Generated Prisma client
│
├── prisma/                      # Database schema
│   └── schema.prisma           # Prisma schema definition
│
├── docs/                       # Documentation
│   └── ai-sdk/                 # AI SDK documentation
│
├── types/                      # TypeScript type definitions
│   └── next-auth.d.ts         # NextAuth type extensions
│
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **PostgreSQL** 14+ database
- **pnpm** (or npm/yarn) package manager
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd qalisa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/qalisa?schema=public"

   # NextAuth
   AUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
   AUTH_URL="http://localhost:3028"   # Your app URL

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Google Gemini AI (Required)
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

   # AI Gateway (Optional but recommended)
   AI_GATEWAY_API_KEY="your-ai-gateway-api-key"

   # PayFast Payment Gateway (Required for payments)
   PAYFAST_MERCHANT_ID="your-payfast-merchant-id"
   PAYFAST_MERCHANT_KEY="your-payfast-merchant-key"
   PAYFAST_PASSPHRASE="your-payfast-passphrase" # Optional, but recommended
   PAYFAST_SANDBOX="true" # Set to "false" for production

   # Polar.sh Payment Gateway (Alternative payment provider)
   POLAR_ACCESS_TOKEN="your-polar-access-token"
   POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"
   POLAR_SANDBOX="true" # Set to "false" for production
   POLAR_ORGANIZATION_ID="your-polar-organization-id"
   # Polar Product/Price IDs (configure in Polar dashboard)
   POLAR_PRODUCT_STARTER_ID="prod_xxx"
   POLAR_PRICE_STARTER_MONTHLY_ID="price_xxx"
   POLAR_PRICE_STARTER_YEARLY_ID="price_xxx"
   POLAR_PRODUCT_PROFESSIONAL_ID="prod_xxx"
   POLAR_PRICE_PROFESSIONAL_MONTHLY_ID="price_xxx"
   POLAR_PRICE_PROFESSIONAL_YEARLY_ID="price_xxx"

   NEXT_PUBLIC_APP_URL="http://localhost:3028" # Your app URL for webhooks
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run migrations
   pnpm prisma migrate dev

   # (Optional) Seed database
   # pnpm prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at [http://localhost:3028](http://localhost:3028)

## 🔧 Configuration

### Database Schema

The Prisma schema includes:

- **User** - User accounts with authentication
- **Account** - OAuth account connections
- **Session** - User sessions
- **Chat** - AI chat conversations
- **Message** - Individual chat messages

See `prisma/schema.prisma` for the complete schema definition.

### AI Model Configuration

Default model settings can be configured in `lib/ai/config.ts`:

```typescript
export const DEFAULT_MODEL = 'gemini-2.5-flash';

export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-2.5-pro',
  FLASH_LITE: 'gemini-2.5-flash-lite',
} as const;
```

### Authentication Providers

NextAuth is configured in `lib/auth.ts`. Currently supports:
- **Credentials** (email/password)
- **Google OAuth**

To add more providers, see the [NextAuth.js documentation](https://next-auth.js.org/configuration/providers).

## 📚 Key Features Explained

### AI Chat System

The AI chat system is built on Vercel AI SDK with the following features:

- **Streaming Responses** - Real-time token streaming for better UX
- **Message Persistence** - All messages saved to database with full context
- **Resumable Streams** - Resume interrupted conversations using stream IDs
- **Multi-part Messages** - Support for text, reasoning, sources, and tool calls
- **Model Selection** - Switch between different Gemini models
- **Chat Management** - Create, archive, and delete chats

**Usage Example:**
```tsx
import { ChatInterface } from '@/components/ai/chat-interface';

export default function ChatPage() {
  return <ChatInterface chatId="optional-chat-id" />;
}
```

### Authentication Flow

1. User signs up/registers with email and password
2. Password is hashed using bcrypt
3. Session created using NextAuth.js
4. JWT token stored in secure cookie
5. User redirected to dashboard or AI chat

### Dashboard Components

The dashboard includes:
- **Section Cards** - Overview metrics cards
- **Interactive Charts** - Area charts with tooltips
- **Data Tables** - Sortable and filterable tables

All components are fully typed and customizable.

## 🎨 Customization

### Adding New Routes

1. Create a new file in `app/` directory
2. Export a default React component
3. Use Next.js App Router conventions

### Adding New API Endpoints

1. Create a route handler in `app/api/`
2. Export HTTP method functions (GET, POST, etc.)
3. Use Next.js Route Handlers API

### Customizing AI Models

Edit `lib/ai/config.ts` to:
- Change default model
- Add new models
- Configure safety settings
- Adjust provider options

### Styling

- **Tailwind CSS** - Edit `app/globals.css` for global styles
- **Component Styles** - Use Tailwind classes directly
- **Theme** - Configure in `components/providers/` (if using theme provider)

## 📡 API Reference

### Chat API

#### `POST /api/chat`
Create a new chat or send a message to an existing chat.

**Request Body:**
```json
{
  "messages": UIMessage[],
  "chatId": "optional-chat-id",
  "model": "gemini-2.5-flash",
  "webSearch": false
}
```

**Response:**
- Streaming response with Server-Sent Events (SSE)

#### `GET /api/chats`
Get all chats for the authenticated user.

**Query Parameters:**
- `status` - Filter by status (ACTIVE, ARCHIVED, DELETED)
- `limit` - Number of chats to return
- `offset` - Pagination offset

#### `GET /api/chats/[chatId]`
Get a specific chat with all messages.

#### `DELETE /api/chats/[chatId]`
Archive or delete a chat.

#### `POST /api/chat/[chatId]/resume`
Resume an interrupted stream.

### Authentication API

All authentication routes are handled by NextAuth.js at `/api/auth/*`.

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 3028

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma generate  # Generate Prisma client
pnpm prisma migrate   # Run migrations
pnpm prisma studio    # Open Prisma Studio

# Linting
pnpm lint             # Run ESLint
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Next.js ESLint configuration
- **Prettier** - Recommended (not included by default)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- **Railway**
- **Render**
- **AWS Amplify**
- **DigitalOcean App Platform**

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_CLIENT_ID` (if using Google OAuth)
- `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
- `PAYFAST_MERCHANT_ID` (if using payments)
- `PAYFAST_MERCHANT_KEY` (if using payments)
- `PAYFAST_PASSPHRASE` (if using payments, recommended)
- `PAYFAST_SANDBOX` (set to "false" for production)
- `NEXT_PUBLIC_APP_URL` (your production URL for webhooks)

## 📖 Documentation

- [AI SDK Documentation](./docs/ai-sdk/) - Comprehensive AI SDK guides
- [AI Setup Guide](./AI_SETUP.md) - Detailed AI infrastructure setup
- [Next.js Documentation](https://nextjs.org/docs) - Next.js official docs
- [Prisma Documentation](https://www.prisma.io/docs) - Prisma ORM docs
- [NextAuth.js Documentation](https://next-auth.js.org) - Authentication docs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) - For the excellent AI SDK
- [Next.js](https://nextjs.org/) - For the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) - For beautiful components
- [Prisma](https://www.prisma.io/) - For the great ORM
- [AI Elements](https://ai-sdk.dev/elements) - For pre-built AI components

## 📧 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Next.js, TypeScript, and AI**

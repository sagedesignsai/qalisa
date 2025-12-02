# Database Seeder

A comprehensive database seeder that generates realistic and related data for development and testing.

## Features

- ✅ **Realistic User Data** - Creates users with proper password hashing (bcrypt)
- ✅ **Related Chat Conversations** - Generates chats with realistic message threads
- ✅ **AI Message Structure** - Properly formatted UIMessage parts (text, reasoning, sources)
- ✅ **Multiple Subscription Levels** - Users across all subscription tiers
- ✅ **Time-based Data** - Messages created with realistic timestamps

## Included Users

### Primary User
- **Email**: `sagedesigns.ai@gmail.com`
- **Password**: `T3chn0l0gy@1`
- **Subscription**: PROFESSIONAL
- **Name**: Sage Designs

### Additional Demo Users
- `demo@qalisa.com` - Demo User (STARTER)
- `entrepreneur@example.com` - Sarah Johnson (PROFESSIONAL)
- `business@example.com` - Michael Chen (ENTERPRISE)
- `founder@startup.co.za` - Thabo Mbeki (STARTER)

## Sample Conversations

The seeder includes 5 realistic conversation templates:

1. **Business Plan for Tech Startup** - SaaS business planning discussion
2. **South African Business Compliance** - CIPC, SARS, VAT registration guidance
3. **Marketing Strategy for E-commerce** - E-commerce marketing tactics
4. **Financial Projections Template** - 3-year financial planning
5. **AI Integration for Business** - AI adoption strategies

Each conversation includes:
- Multiple message exchanges
- Realistic assistant responses
- Some with reasoning tokens
- Some with source citations
- Proper message sequencing

## Usage

### Run the Seeder

```bash
# Using Prisma CLI (recommended)
pnpm prisma db seed

# Or directly with tsx
tsx prisma/seed.ts
```

### Reset and Seed

```bash
# Reset database and run seed
pnpm prisma migrate reset
```

## Seeder Utilities

The seeder includes utility functions for generating realistic data:

- `hashPassword()` - Hash passwords using bcrypt (10 rounds)
- `randomDate()` - Generate random dates within a range
- `randomElement()` - Pick random element from array
- `randomInt()` - Generate random integers
- `createTextParts()` - Create text-only message parts
- `createReasoningParts()` - Create messages with reasoning tokens
- `createPartsWithSources()` - Create messages with source citations

## Data Structure

### Users
- Properly hashed passwords (bcrypt, 10 rounds)
- Various subscription levels
- Email verified status
- Realistic names and emails

### Chats
- 2-4 chats per user
- Realistic titles
- Mix of ACTIVE and ARCHIVED status
- Metadata with model information
- Timestamps spread over last 30 days

### Messages
- Proper UIMessage structure
- Sequential ordering
- Mix of text, reasoning, and source parts
- Realistic timestamps (1 minute apart)
- Complete message flags

## Customization

To add more sample conversations, edit the `sampleConversations` array in `prisma/seed.ts`:

```typescript
const sampleConversations = [
  {
    title: 'Your Conversation Title',
    messages: [
      {
        role: 'USER',
        text: 'User message here',
      },
      {
        role: 'ASSISTANT',
        text: 'Assistant response',
        reasoning: 'Optional reasoning', // Optional
        sources: ['url1', 'url2'], // Optional
      },
    ],
  },
];
```

## Security Notes

- All passwords are properly hashed using bcrypt (10 rounds)
- Matches the authentication implementation in `lib/auth.ts`
- Never commit plain text passwords to version control
- The seeder uses `upsert` to prevent duplicate users

## Troubleshooting

### Error: Cannot find module 'prisma/config'
- Ensure Prisma v7+ is installed
- Run `pnpm prisma generate`

### Error: DATABASE_URL not found
- Ensure `.env` file exists with `DATABASE_URL`
- Check `prisma.config.ts` is loading environment variables

### Error: Password hashing fails
- Ensure `bcryptjs` is installed
- Check Node.js version compatibility





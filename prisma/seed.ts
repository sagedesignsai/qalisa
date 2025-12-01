import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';
import type { UIMessagePart } from 'ai';

// Type guard for UIMessagePart
type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'source-url'; url: string };

const prisma = new PrismaClient();

/**
 * Utility functions for generating realistic data
 */
const seedUtils = {
  /**
   * Hash password using bcrypt (same as auth implementation)
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  /**
   * Generate random date within a range
   */
  randomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  },

  /**
   * Pick random element from array
   */
  randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Generate random number between min and max
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Create UIMessage parts array for text message
   */
  createTextParts(text: string): MessagePart[] {
    return [{ type: 'text', text }];
  },

  /**
   * Create UIMessage parts array with reasoning
   */
  createReasoningParts(text: string, reasoning?: string): MessagePart[] {
    const parts: MessagePart[] = [{ type: 'text', text }];
    if (reasoning) {
      parts.push({ type: 'reasoning', text: reasoning });
    }
    return parts;
  },

  /**
   * Create UIMessage parts array with sources
   */
  createPartsWithSources(
    text: string,
    sources: string[],
  ): MessagePart[] {
    const parts: MessagePart[] = [{ type: 'text', text }];
    sources.forEach((url) => {
      parts.push({ type: 'source-url', url });
    });
    return parts;
  },
};

/**
 * Sample chat conversations for realistic data
 */
const sampleConversations = [
  {
    title: 'Business Plan for Tech Startup',
    messages: [
      {
        role: 'USER' as const,
        text: 'I need help creating a business plan for my tech startup. We\'re building a SaaS platform for small businesses.',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'I\'d be happy to help you create a comprehensive business plan for your SaaS platform! Let\'s start by understanding your target market and value proposition.',
        reasoning:
          'The user wants help with a business plan. I should start by gathering key information about their business model, target market, and unique value proposition.',
      },
      {
        role: 'USER' as const,
        text: 'Our target market is small businesses with 5-50 employees, particularly in retail and hospitality.',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'Great! Small businesses in retail and hospitality often struggle with inventory management and customer engagement. What specific problem does your SaaS platform solve for them?',
      },
    ],
  },
  {
    title: 'South African Business Compliance',
    messages: [
      {
        role: 'USER' as const,
        text: 'What are the key compliance requirements for starting a business in South Africa?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'Starting a business in South Africa requires several key compliance steps:\n\n1. **CIPC Registration** - Register your company with the Companies and Intellectual Property Commission\n2. **SARS Registration** - Register for tax with the South African Revenue Service\n3. **VAT Registration** - Required if annual turnover exceeds R1 million\n4. **UIF Registration** - Unemployment Insurance Fund registration for employees\n5. **COIDA Registration** - Compensation for Occupational Injuries and Diseases Act',
        sources: [
          'https://www.cipc.co.za/',
          'https://www.sars.gov.za/',
        ],
      },
      {
        role: 'USER' as const,
        text: 'How long does CIPC registration typically take?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'CIPC registration typically takes 5-10 business days for online applications, or 10-15 business days for manual submissions. The process can be expedited with priority processing.',
      },
    ],
  },
  {
    title: 'Marketing Strategy for E-commerce',
    messages: [
      {
        role: 'USER' as const,
        text: 'I need a marketing strategy for my new e-commerce store selling handmade jewelry.',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'For a handmade jewelry e-commerce store, I recommend a multi-channel approach:\n\n**Social Media Marketing:**\n- Instagram and Pinterest for visual content\n- Facebook for community building\n- TikTok for behind-the-scenes content\n\n**Content Marketing:**\n- Blog posts about jewelry care and styling\n- Email newsletters with new collections\n- Customer testimonials and stories',
      },
      {
        role: 'USER' as const,
        text: 'What about paid advertising?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'For paid advertising, I suggest:\n\n1. **Google Ads** - Target keywords like "handmade jewelry" and "custom jewelry"\n2. **Facebook/Instagram Ads** - Use lookalike audiences based on your customers\n3. **Pinterest Ads** - Great for visual products like jewelry\n4. **Influencer Partnerships** - Collaborate with micro-influencers in fashion/lifestyle niches',
      },
    ],
  },
  {
    title: 'Financial Projections Template',
    messages: [
      {
        role: 'USER' as const,
        text: 'Can you help me create financial projections for the next 3 years?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'I can help you create comprehensive 3-year financial projections! Let\'s start with your revenue model. Are you:\n- Selling products (one-time or subscription)?\n- Providing services?\n- Using a marketplace model?\n\nOnce I understand your revenue streams, I can help you project:\n- Revenue growth\n- Cost of goods sold (COGS)\n- Operating expenses\n- Cash flow\n- Break-even analysis',
      },
    ],
  },
  {
    title: 'AI Integration for Business',
    messages: [
      {
        role: 'USER' as const,
        text: 'How can I integrate AI into my business operations?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'AI integration can transform various aspects of your business:\n\n**Customer Service:**\n- Chatbots for 24/7 support\n- Automated email responses\n- Sentiment analysis\n\n**Operations:**\n- Inventory management\n- Demand forecasting\n- Supply chain optimization\n\n**Marketing:**\n- Personalized recommendations\n- Content generation\n- Ad optimization',
        reasoning:
          'The user is asking about AI integration. I should provide practical, actionable examples across different business functions.',
      },
      {
        role: 'USER' as const,
        text: 'What about for a small retail business specifically?',
      },
      {
        role: 'ASSISTANT' as const,
        text: 'For small retail businesses, here are the most impactful AI integrations:\n\n1. **Inventory Management** - Predict demand and optimize stock levels\n2. **Customer Insights** - Analyze purchase patterns and preferences\n3. **Pricing Optimization** - Dynamic pricing based on demand and competition\n4. **Visual Search** - Let customers search by uploading product images\n5. **Personalized Recommendations** - Suggest products based on browsing history',
      },
    ],
  },
];

/**
 * Generate sample users
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');

  const users = [
    {
      email: 'sagedesigns.ai@gmail.com',
      name: 'Sage Designs',
      password: 'T3chn0l0gy@1',
      subscription: 'PROFESSIONAL' as const,
      language: 'en',
    },
    {
      email: 'demo@qalisa.com',
      name: 'Demo User',
      password: 'Demo123!@#',
      subscription: 'STARTER' as const,
      language: 'en',
    },
    {
      email: 'entrepreneur@example.com',
      name: 'Sarah Johnson',
      password: 'Startup2024!',
      subscription: 'PROFESSIONAL' as const,
      language: 'en',
    },
    {
      email: 'business@example.com',
      name: 'Michael Chen',
      password: 'Business123!',
      subscription: 'ENTERPRISE' as const,
      language: 'en',
    },
    {
      email: 'founder@startup.co.za',
      name: 'Thabo Mbeki',
      password: 'Founder2024!',
      subscription: 'STARTER' as const,
      language: 'en',
    },
  ];

  for (const userData of users) {
    const hashedPassword = await seedUtils.hashPassword(userData.password);

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: hashedPassword,
        subscription: userData.subscription,
        language: userData.language,
      },
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        subscription: userData.subscription,
        language: userData.language,
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created/updated user: ${userData.email}`);
  }
}

/**
 * Generate sample chats and messages
 */
async function seedChats() {
  console.log('🌱 Seeding chats and messages...');

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('⚠️  No users found. Please seed users first.');
    return;
  }

  // Create chats for each user
  for (const user of users) {
    // Create 2-4 chats per user
    const chatCount = seedUtils.randomInt(2, 4);

    for (let i = 0; i < chatCount; i++) {
      const conversation =
        sampleConversations[
          Math.floor(Math.random() * sampleConversations.length)
        ];

      // Create chat with first message
      const firstMessage = conversation.messages[0];
      const createdAt = seedUtils.randomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date(),
      );

      const chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: conversation.title,
          status: seedUtils.randomElement(['ACTIVE', 'ARCHIVED', 'ACTIVE']),
          metadata: {
            model: seedUtils.randomElement([
              'gemini-2.5-flash',
              'gemini-2.5-pro',
            ]),
            createdAt: createdAt.toISOString(),
          },
          createdAt,
          updatedAt: createdAt,
          messages: {
            create: {
              role: firstMessage.role,
              content: seedUtils.createTextParts(
                firstMessage.text,
              ) as unknown as Record<string, unknown>,
              sequence: 0,
              isComplete: true,
              createdAt,
            },
          },
        },
      });

      // Add remaining messages
      for (let j = 1; j < conversation.messages.length; j++) {
        const message = conversation.messages[j];
        const messageCreatedAt = new Date(
          createdAt.getTime() + j * 60000, // 1 minute apart
        );

        let parts: UIMessagePart[];
        if ('sources' in message && message.sources) {
          parts = seedUtils.createPartsWithSources(
            message.text,
            message.sources,
          );
        } else if ('reasoning' in message && message.reasoning) {
          parts = seedUtils.createReasoningParts(
            message.text,
            message.reasoning,
          );
        } else {
          parts = seedUtils.createTextParts(message.text);
        }

        await prisma.message.create({
          data: {
            chatId: chat.id,
            role: message.role,
            content: parts as unknown as Record<string, unknown>,
            metadata:
              'reasoning' in message && message.reasoning
                ? { hasReasoning: true }
                : 'sources' in message && message.sources
                  ? { sourceCount: message.sources.length }
                  : undefined,
            sequence: j,
            isComplete: true,
            createdAt: messageCreatedAt,
          },
        });
      }

      console.log(
        `✅ Created chat "${conversation.title}" for ${user.email} with ${conversation.messages.length} messages`,
      );
    }
  }
}

/**
 * Main seed function
 */
async function main() {
  console.log('🚀 Starting database seed...\n');

  try {
    await seedUsers();
    console.log('');
    await seedChats();
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


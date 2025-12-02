import { prisma } from '@/lib/db';
import type { UIMessage } from 'ai';

export interface ProjectSourceInput {
  url: string;
  title?: string;
}

/**
 * Extract unique sources from UIMessage array
 */
export function extractSourcesFromMessages(
  messages: UIMessage[]
): ProjectSourceInput[] {
  const sourceMap = new Map<string, string>();

  for (const message of messages) {
    if (message.role === 'assistant') {
      for (const part of message.parts) {
        if (part.type === 'source-url') {
          const url = part.url;
          if (!sourceMap.has(url)) {
            sourceMap.set(url, url); // Use URL as title if not provided
          }
        }
      }
    }
  }

  return Array.from(sourceMap.entries()).map(([url, title]) => ({
    url,
    title,
  }));
}

/**
 * Sync project sources from embedded messages
 */
export async function syncProjectSources(projectId: string): Promise<void> {
  // Get all project messages
  const messages = await prisma.projectMessage.findMany({
    where: { projectId },
    orderBy: { sequence: 'asc' },
  });

  // Convert to UIMessage format
  const uiMessages: UIMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system' | 'tool',
    parts: msg.content as UIMessage['parts'],
    metadata: msg.metadata as Record<string, unknown> | undefined,
  }));

  // Extract sources
  const sources = extractSourcesFromMessages(uiMessages);

  // Get existing sources
  const existingSources = await prisma.projectSource.findMany({
    where: { projectId },
    select: { url: true },
  });
  const existingUrls = new Set(existingSources.map((s) => s.url));

  // Add new sources
  const newSources = sources.filter((s) => !existingUrls.has(s.url));
  if (newSources.length > 0) {
    await prisma.projectSource.createMany({
      data: newSources.map((source) => ({
        projectId,
        url: source.url,
        title: source.title,
      })),
      skipDuplicates: true,
    });
  }

  // Remove sources that no longer exist in messages
  const currentUrls = new Set(sources.map((s) => s.url));
  const sourcesToRemove = existingSources.filter(
    (s) => !currentUrls.has(s.url)
  );
  if (sourcesToRemove.length > 0) {
    await prisma.projectSource.deleteMany({
      where: {
        projectId,
        url: { in: sourcesToRemove.map((s) => s.url) },
      },
    });
  }
}

/**
 * Get source count for a project
 */
export async function getProjectSourceCount(
  projectId: string
): Promise<number> {
  return prisma.projectSource.count({
    where: { projectId },
  });
}


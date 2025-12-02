import { prisma } from '@/lib/db';
import type {
  StudioContentItem,
  ProjectMessage,
  ProjectSource,
} from '@/lib/generated/prisma';

export type ContentItemType =
  | 'VIDEO_OVERVIEW'
  | 'INFOGRAPHIC'
  | 'SLIDE_DECK'
  | 'AUDIO_OVERVIEW'
  | 'MIND_MAP'
  | 'REPORT'
  | 'FLASHCARDS'
  | 'QUIZ';

export type ContentItemStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'READY'
  | 'EXPORTING'
  | 'COMPLETED'
  | 'FAILED';

export interface CreateContentItemInput {
  projectId: string;
  type: ContentItemType;
  title: string;
  metadata?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface UpdateContentItemInput {
  title?: string;
  status?: ContentItemStatus;
  metadata?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

/**
 * Create a new content item
 */
export async function createContentItem(
  input: CreateContentItemInput
): Promise<StudioContentItem> {
  return prisma.studioContentItem.create({
    data: {
      projectId: input.projectId,
      type: input.type,
      title: input.title,
      status: 'DRAFT',
      metadata: input.metadata || {},
      data: input.data || {},
    },
  });
}

/**
 * Get content items for a project
 */
export async function getContentItems(
  projectId: string,
  type?: ContentItemType
): Promise<StudioContentItem[]> {
  return prisma.studioContentItem.findMany({
    where: {
      projectId,
      ...(type && { type }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      mediaAssets: true,
    },
  });
}

/**
 * Get content item by ID
 */
export async function getContentItemById(
  itemId: string,
  projectId: string
): Promise<StudioContentItem | null> {
  return prisma.studioContentItem.findFirst({
    where: {
      id: itemId,
      projectId,
    },
    include: {
      mediaAssets: true,
    },
  });
}

/**
 * Update content item
 */
export async function updateContentItem(
  itemId: string,
  projectId: string,
  input: UpdateContentItemInput
): Promise<StudioContentItem> {
  return prisma.studioContentItem.update({
    where: {
      id: itemId,
      projectId,
    },
    data: {
      ...input,
      updatedAt: new Date(),
    },
  });
}

/**
 * Delete content item
 */
export async function deleteContentItem(
  itemId: string,
  projectId: string
): Promise<void> {
  await prisma.studioContentItem.delete({
    where: {
      id: itemId,
      projectId,
    },
  });
}


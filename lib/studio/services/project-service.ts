import { prisma } from '@/lib/db';
import type { StudioProject, MediaAsset, VideoTrack, ProjectExport } from '@/lib/generated/prisma';
import type { StudioProjectType, StudioProjectStatus } from '../types';
import type { UIMessage } from 'ai';
import { extractSourcesFromMessages, syncProjectSources } from './source-extraction-service';

export interface CreateProjectInput {
  userId: string;
  chatId?: string;
  type?: StudioProjectType; // Optional now, can be inferred from content items
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  messages?: UIMessage[]; // Embedded messages
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: StudioProjectStatus;
  chatId?: string | null;
  metadata?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  remotionConfig?: Record<string, unknown>;
  agentVersion?: string;
}

/**
 * Create a new studio project
 */
export async function createProject(input: CreateProjectInput): Promise<StudioProject> {
  // Extract sources from messages if provided
  const sources = input.messages
    ? extractSourcesFromMessages(input.messages)
    : [];

  // Create project with messages and sources
  const project = await prisma.studioProject.create({
    data: {
      userId: input.userId,
      chatId: input.chatId,
      type: input.type || 'DOCUMENT', // Default type
      title: input.title,
      description: input.description,
      metadata: input.metadata || {},
      settings: input.settings || {},
      status: 'DRAFT',
      messages: input.messages
        ? {
            create: input.messages.map((msg, index) => ({
              role: msg.role.toUpperCase() as 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL',
              content: msg.parts as unknown as Record<string, unknown>,
              metadata: msg.metadata as Record<string, unknown> | undefined,
              sequence: index,
              isComplete: true,
            })),
          }
        : undefined,
      sources: sources.length > 0
        ? {
            create: sources.map((source) => ({
              url: source.url,
              title: source.title,
            })),
          }
        : undefined,
    },
    include: {
      messages: true,
      sources: true,
      contentItems: true,
    },
  });

  return project;
}

/**
 * Get project by ID (with relations)
 */
export async function getProjectById(
  projectId: string,
  userId: string
): Promise<StudioProject | null> {
  return prisma.studioProject.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          sequence: 'asc',
        },
      },
      sources: true,
      contentItems: {
        include: {
          mediaAssets: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      mediaAssets: true,
      videoTracks: {
        include: {
          asset: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      exports: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

/**
 * List projects for a user
 */
export async function listProjects(
  userId: string,
  options?: {
    status?: StudioProjectStatus;
    type?: StudioProjectType;
    chatId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<StudioProject[]> {
  return prisma.studioProject.findMany({
    where: {
      userId,
      ...(options?.status && { status: options.status }),
      ...(options?.type && { type: options.type }),
      ...(options?.chatId && { chatId: options.chatId }),
    },
    include: {
      sources: true,
      contentItems: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: options?.limit,
    skip: options?.offset,
  });
}

/**
 * Update project
 */
export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput
): Promise<StudioProject> {
  // Verify ownership
  const project = await prisma.studioProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Build update data, validating chatId if provided
  const updateData: {
    title?: string;
    description?: string | null;
    status?: StudioProjectStatus;
    chatId?: string | null;
    metadata?: Record<string, unknown> | null;
    settings?: Record<string, unknown> | null;
    remotionConfig?: Record<string, unknown> | null;
    agentVersion?: string | null;
  } = {};

  // Copy non-chatId fields (only include if they're explicitly provided in input)
  if ('title' in input && input.title !== undefined) {
    updateData.title = input.title;
  }
  if ('description' in input && input.description !== undefined) {
    updateData.description = input.description;
  }
  if ('status' in input && input.status !== undefined) {
    updateData.status = input.status;
  }
  if ('metadata' in input && input.metadata !== undefined) {
    updateData.metadata = input.metadata;
  }
  if ('settings' in input && input.settings !== undefined) {
    updateData.settings = input.settings;
  }
  if ('remotionConfig' in input && input.remotionConfig !== undefined) {
    updateData.remotionConfig = input.remotionConfig;
  }
  if ('agentVersion' in input && input.agentVersion !== undefined) {
    updateData.agentVersion = input.agentVersion;
  }

  // Handle chatId validation
  if ('chatId' in input) {
    // Handle null, undefined, or empty string as null (clear relation)
    if (input.chatId === null || input.chatId === undefined || input.chatId === '') {
      updateData.chatId = null;
    } else {
      // Verify chat exists and belongs to user before updating
      try {
        const chat = await prisma.chat.findFirst({
          where: {
            id: input.chatId,
            userId,
          },
        });
        if (!chat) {
          throw new Error(`Chat ${input.chatId} not found or does not belong to user`);
        }
        // Chat exists, proceed with update
        updateData.chatId = input.chatId;
      } catch (error) {
        // Re-throw validation errors
        if (error instanceof Error && error.message.includes('not found')) {
          throw error;
        }
        // Handle Prisma errors
        console.error('Error validating chat:', error);
        throw new Error(`Failed to validate chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  return prisma.studioProject.update({
    where: { id: projectId },
    data: updateData,
  });
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string, userId: string): Promise<void> {
  // Verify ownership
  const project = await prisma.studioProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  await prisma.studioProject.delete({
    where: { id: projectId },
  });
}

/**
 * Create media asset
 */
export async function createMediaAsset(
  projectId: string,
  data: {
    type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'MUSIC';
    appwriteId: string;
    url: string;
    mimeType: string;
    size: number;
    duration?: number;
    width?: number;
    height?: number;
    metadata?: Record<string, unknown>;
  }
): Promise<MediaAsset> {
  return prisma.mediaAsset.create({
    data: {
      projectId,
      ...data,
    },
  });
}

/**
 * Create video track
 */
export async function createVideoTrack(
  projectId: string,
  data: {
    assetId?: string;
    type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY' | 'TRANSITION';
    startTime: number;
    endTime: number;
    volume?: number;
    order: number;
    metadata?: Record<string, unknown>;
    remotionMetadata?: Record<string, unknown>;
  }
): Promise<VideoTrack> {
  return prisma.videoTrack.create({
    data: {
      projectId,
      ...data,
      volume: data.volume ?? 1.0,
    },
  });
}

/**
 * Update video track
 */
export async function updateVideoTrack(
  trackId: string,
  projectId: string,
  data: {
    startTime?: number;
    endTime?: number;
    volume?: number;
    order?: number;
    metadata?: Record<string, unknown>;
  }
): Promise<VideoTrack> {
  // Verify track belongs to project
  const track = await prisma.videoTrack.findFirst({
    where: { id: trackId, projectId },
  });

  if (!track) {
    throw new Error('Track not found');
  }

  return prisma.videoTrack.update({
    where: { id: trackId },
    data,
  });
}

/**
 * Delete video track
 */
export async function deleteVideoTrack(trackId: string, projectId: string): Promise<void> {
  const track = await prisma.videoTrack.findFirst({
    where: { id: trackId, projectId },
  });

  if (!track) {
    throw new Error('Track not found');
  }

  await prisma.videoTrack.delete({
    where: { id: trackId },
  });
}

/**
 * Reorder tracks
 */
export async function reorderTracks(
  projectId: string,
  trackOrders: Array<{ trackId: string; order: number }>
): Promise<void> {
  await Promise.all(
    trackOrders.map(({ trackId, order }) =>
      prisma.videoTrack.updateMany({
        where: {
          id: trackId,
          projectId,
        },
        data: { order },
      })
    )
  );
}

/**
 * Create project export
 */
export async function createProjectExport(
  projectId: string,
  data: {
    format: 'MP4' | 'WEBM' | 'PNG' | 'PDF' | 'HTML';
    quality: string;
    appwriteId?: string;
    url?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<ProjectExport> {
  return prisma.projectExport.create({
    data: {
      projectId,
      ...data,
      status: 'PENDING',
    },
  });
}

/**
 * Update export status
 */
export async function updateExportStatus(
  exportId: string,
  projectId: string,
  data: {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress?: number;
    appwriteId?: string;
    url?: string;
    error?: string;
    completedAt?: Date;
  }
): Promise<ProjectExport> {
  const exportRecord = await prisma.projectExport.findFirst({
    where: { id: exportId, projectId },
  });

  if (!exportRecord) {
    throw new Error('Export not found');
  }

  return prisma.projectExport.update({
    where: { id: exportId },
    data,
  });
}


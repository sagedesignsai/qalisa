import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getProjectById, updateProject } from '@/lib/studio/services/project-service';
import { getChatMessages } from '@/lib/ai/db';
import { messagesToUIMessages } from '@/lib/ai/utils';
import { generateVideoPlan } from '@/lib/studio/agents/content-generation-agent';
import { generateMediaAssets } from '@/lib/studio/agents/media-generation-agent';
import { generateVideoOverview } from '@/lib/studio/agents/video-overview-agent';
import {
  createMediaAsset,
  createVideoTrack,
} from '@/lib/studio/services/project-service';
import { validateCompositionConfig } from '@/lib/studio/services/remotion-composition-service';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await getProjectById(projectId, session.user.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'DRAFT' && project.status !== 'READY') {
      return NextResponse.json(
        { error: 'Project is not in a valid state for generation' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { includeMusic = false, agentMode = 'legacy', generateComponentCode = false } = body;

    // Update status to GENERATING
    await updateProject(projectId, session.user.id, { status: 'GENERATING' });

    // Get chat messages if chatId exists
    let chatMessages: any[] = [];
    if (project.chatId) {
      const dbMessages = await getChatMessages(project.chatId);
      chatMessages = messagesToUIMessages(dbMessages);
    }

    // Use unified agent if requested, otherwise use legacy flow
    if (agentMode === 'unified') {
      try {
        // Generate complete video overview using unified agent
        const result = await generateVideoOverview({
          messages: chatMessages,
          projectContext: {
            title: project.title,
            description: project.description || undefined,
          },
          includeMusic,
          generateComponentCode,
        });

        // Save media assets to database
        const savedAssets: string[] = [];
        
        // Save audio files
        for (const audio of result.assets.audioFiles) {
          const asset = await createMediaAsset(projectId, {
            type: 'AUDIO',
            appwriteId: audio.fileId,
            url: audio.url,
            mimeType: 'audio/wav',
            size: 0,
            duration: audio.duration,
            metadata: { sceneId: audio.sceneId },
          });
          savedAssets.push(asset.id);
        }

        // Save image files
        for (const image of result.assets.imageFiles) {
          const asset = await createMediaAsset(projectId, {
            type: 'IMAGE',
            appwriteId: image.fileId,
            url: image.url,
            mimeType: 'image/png',
            size: 0,
            width: 1920,
            height: 1080,
            metadata: { sceneId: image.sceneId },
          });
          savedAssets.push(asset.id);
        }

        // Save music file if available
        if (result.assets.musicFile) {
          const musicAsset = await createMediaAsset(projectId, {
            type: 'MUSIC',
            appwriteId: result.assets.musicFile.fileId,
            url: result.assets.musicFile.url,
            mimeType: 'audio/mpeg',
            size: 0,
            duration: result.assets.musicFile.duration,
            metadata: { isBackground: true },
          });
          savedAssets.push(musicAsset.id);
        }

        // Create video tracks from aligned tracks
        let trackOrder = 0;
        for (const alignedTrack of result.tracks) {
          // Find the corresponding media asset
          const mediaAsset = await prisma.mediaAsset.findFirst({
            where: { 
              projectId,
              appwriteId: alignedTrack.assetId,
            },
          });

          if (mediaAsset || alignedTrack.type === 'TEXT_OVERLAY') {
            await createVideoTrack(projectId, {
              assetId: mediaAsset?.id,
              type: alignedTrack.type,
              startTime: alignedTrack.startTime,
              endTime: alignedTrack.endTime,
              volume: alignedTrack.volume,
              order: trackOrder++,
              metadata: alignedTrack.metadata,
              remotionMetadata: alignedTrack.metadata, // Store Remotion-specific metadata
            });
          }
        }

        // Validate and save Remotion config
        if (validateCompositionConfig(result.remotionConfig)) {
          await updateProject(projectId, session.user.id, {
            status: 'READY',
            remotionConfig: result.remotionConfig as any,
            agentVersion: 'unified-v1',
            metadata: {
              ...(project.metadata as Record<string, unknown> || {}),
              script: result.script,
              generatedAt: new Date().toISOString(),
              remotionComponentCode: result.remotionComponentCode,
            },
          });
        } else {
          await updateProject(projectId, session.user.id, {
            status: 'READY',
            agentVersion: 'unified-v1',
            metadata: {
              ...(project.metadata as Record<string, unknown> || {}),
              script: result.script,
              generatedAt: new Date().toISOString(),
            },
          });
        }

        return NextResponse.json({
          success: true,
          projectId,
          generatedAssets: savedAssets.length,
          trackCount: result.tracks.length,
          agentMode: 'unified',
          remotionConfig: result.remotionConfig,
        });
      } catch (error) {
        console.error('Error generating project with unified agent:', error);
        
        // Update project status to FAILED
        await updateProject(projectId, session.user.id, {
          status: 'FAILED',
        });

        return NextResponse.json(
          {
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            agentMode: 'unified',
          },
          { status: 500 }
        );
      }
    }

    // Legacy flow (backward compatibility)
    // Generate video plan
    const videoPlan = await generateVideoPlan(chatMessages);

    // Generate media assets
    const generatedMedia = await generateMediaAssets(videoPlan, includeMusic);

    // Save media assets to database
    const savedAssets: string[] = [];
    
    // Save audio files
    for (const audio of generatedMedia.audioFiles) {
      const asset = await createMediaAsset(projectId, {
        type: 'AUDIO',
        appwriteId: audio.fileId,
        url: audio.url,
        mimeType: 'audio/wav',
        size: 0, // Will be updated if available
        metadata: { sceneId: audio.sceneId },
      });
      savedAssets.push(asset.id);
    }

    // Save image files
    for (const image of generatedMedia.imageFiles) {
      const asset = await createMediaAsset(projectId, {
        type: 'IMAGE',
        appwriteId: image.fileId,
        url: image.url,
        mimeType: 'image/png',
        size: 0,
        metadata: { sceneId: image.sceneId },
      });
      savedAssets.push(asset.id);
    }

    // Create video tracks from generated media
    let trackOrder = 0;
    for (let i = 0; i < videoPlan.scenes.length; i++) {
      const scene = videoPlan.scenes[i];
      const audioAsset = generatedMedia.audioFiles.find((a) => a.sceneId === scene.id);
      const imageAsset = generatedMedia.imageFiles.find((a) => a.sceneId === scene.id);

      // Create audio track
      if (audioAsset) {
        const audioMediaAsset = await prisma.mediaAsset.findFirst({
          where: { appwriteId: audioAsset.fileId },
        });
        if (audioMediaAsset) {
          await createVideoTrack(projectId, {
            assetId: audioMediaAsset.id,
            type: 'AUDIO',
            startTime: scene.order > 1 ? videoPlan.scenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0) : 0,
            endTime: videoPlan.scenes.slice(0, i + 1).reduce((sum, s) => sum + s.duration, 0),
            volume: 1.0,
            order: trackOrder++,
          });
        }
      }

      // Create video track (image)
      if (imageAsset) {
        const imageMediaAsset = await prisma.mediaAsset.findFirst({
          where: { appwriteId: imageAsset.fileId },
        });
        if (imageMediaAsset) {
          await createVideoTrack(projectId, {
            assetId: imageMediaAsset.id,
            type: 'VIDEO',
            startTime: scene.order > 1 ? videoPlan.scenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0) : 0,
            endTime: videoPlan.scenes.slice(0, i + 1).reduce((sum, s) => sum + s.duration, 0),
            volume: 1.0,
            order: trackOrder++,
          });
        }
      }
    }

    // Update project status to READY
    await updateProject(projectId, session.user.id, {
      status: 'READY',
      agentVersion: 'legacy',
      metadata: {
        ...(project.metadata as Record<string, unknown> || {}),
        videoPlan,
        generatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      projectId,
      generatedAssets: savedAssets.length,
      agentMode: 'legacy',
    });
  } catch (error) {
    console.error('Error generating project:', error);
    
    // Update project status to FAILED
    try {
      const { projectId } = await params;
      await updateProject(projectId, (await auth())!.user!.id, {
        status: 'FAILED',
      });
    } catch {
      // Ignore update errors
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


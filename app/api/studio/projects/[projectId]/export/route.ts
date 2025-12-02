import { auth } from '@/lib/auth';
import { getProjectById, updateProject } from '@/lib/studio/services/project-service';
import {
  createProjectExport,
  updateExportStatus,
} from '@/lib/studio/services/project-service';
import { compileAndUploadVideo } from '@/lib/studio/agents/video-compilation-agent';
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

    if (project.status !== 'READY') {
      return NextResponse.json(
        { error: 'Project is not ready for export' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { format = 'MP4', quality = '1080p' } = body;

    // Create export record
    const exportRecord = await createProjectExport(projectId, {
      format,
      quality,
    });

    // Update project status
    await updateProject(projectId, session.user.id, { status: 'EXPORTING' });

    // Update export status to PROCESSING
    await updateExportStatus(exportRecord.id, projectId, {
      status: 'PROCESSING',
      progress: 0.1,
    });

    // Compile video (this is async, so we'll update status as we go)
    try {
      const tracks = project.videoTracks.map((track) => ({
        id: track.id,
        type: track.type,
        assetId: track.assetId,
        startTime: track.startTime,
        endTime: track.endTime,
        volume: track.volume,
        url: track.asset?.url,
      }));

      const result = await compileAndUploadVideo(
        tracks as any,
        format.toLowerCase() as 'mp4' | 'webm',
        quality
      );

      // Update export with completed status
      await updateExportStatus(exportRecord.id, projectId, {
        status: 'COMPLETED',
        progress: 1.0,
        appwriteId: result.fileId,
        url: result.url,
        completedAt: new Date(),
      });

      // Update project status
      await updateProject(projectId, session.user.id, { status: 'COMPLETED' });

      return NextResponse.json({
        success: true,
        exportId: exportRecord.id,
        url: result.url,
      });
    } catch (error) {
      // Update export with failed status
      await updateExportStatus(exportRecord.id, projectId, {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Update project status
      await updateProject(projectId, session.user.id, { status: 'READY' });

      throw error;
    }
  } catch (error) {
    console.error('Error exporting project:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


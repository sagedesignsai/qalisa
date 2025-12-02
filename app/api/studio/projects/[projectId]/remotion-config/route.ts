import { auth } from '@/lib/auth';
import { getProjectById, updateProject } from '@/lib/studio/services/project-service';
import { validateCompositionConfig, generateCompositionFromTracks } from '@/lib/studio/services/remotion-composition-service';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { RemotionCompositionConfig } from '@/lib/studio/types';

/**
 * GET /api/studio/projects/[projectId]/remotion-config
 * Retrieve Remotion composition configuration
 */
export async function GET(
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

    // Check if Remotion config exists in project
    const remotionConfig = (project as any).remotionConfig as RemotionCompositionConfig | null;

    if (remotionConfig && validateCompositionConfig(remotionConfig)) {
      return NextResponse.json({ config: remotionConfig });
    }

    // If no config exists, generate one from tracks
    const tracks = await prisma.videoTrack.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found. Generate video first.' },
        { status: 404 }
      );
    }

    const generatedConfig = generateCompositionFromTracks(tracks);

    // Save generated config
    await updateProject(projectId, session.user.id, {
      remotionConfig: generatedConfig as any,
    });

    return NextResponse.json({ config: generatedConfig });
  } catch (error) {
    console.error('Error fetching Remotion config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/studio/projects/[projectId]/remotion-config
 * Update Remotion composition configuration
 */
export async function PUT(
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

    const body = await req.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json(
        { error: 'Config is required' },
        { status: 400 }
      );
    }

    if (!validateCompositionConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid Remotion composition configuration' },
        { status: 400 }
      );
    }

    await updateProject(projectId, session.user.id, {
      remotionConfig: config as any,
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error updating Remotion config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/studio/projects/[projectId]/remotion-config
 * Regenerate Remotion composition from tracks
 */
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

    const body = await req.json();
    const { fps, width, height } = body;

    // Get all tracks for the project
    const tracks = await prisma.videoTrack.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found. Generate video first.' },
        { status: 404 }
      );
    }

    // Generate composition from tracks
    const config = generateCompositionFromTracks(tracks, fps, width, height);

    // Save generated config
    await updateProject(projectId, session.user.id, {
      remotionConfig: config as any,
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error regenerating Remotion config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


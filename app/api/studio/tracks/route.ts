import { auth } from '@/lib/auth';
import {
  createVideoTrack,
  updateVideoTrack,
  deleteVideoTrack,
  reorderTracks,
  getProjectById,
} from '@/lib/studio/services/project-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, assetId, type, startTime, endTime, volume, order, metadata } = body;

    if (!projectId || !type || startTime === undefined || endTime === undefined || order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await getProjectById(projectId, session.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const track = await createVideoTrack(projectId, {
      assetId,
      type,
      startTime,
      endTime,
      volume,
      order,
      metadata,
    });

    return NextResponse.json({ track }, { status: 201 });
  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { trackId, projectId, startTime, endTime, volume, order, metadata } = body;

    if (!trackId || !projectId) {
      return NextResponse.json(
        { error: 'trackId and projectId are required' },
        { status: 400 }
      );
    }

    const track = await updateVideoTrack(trackId, projectId, {
      startTime,
      endTime,
      volume,
      order,
      metadata,
    });

    return NextResponse.json({ track });
  } catch (error) {
    console.error('Error updating track:', error);
    if (error instanceof Error && error.message === 'Track not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get('trackId');
    const projectId = searchParams.get('projectId');

    if (!trackId || !projectId) {
      return NextResponse.json(
        { error: 'trackId and projectId are required' },
        { status: 400 }
      );
    }

    await deleteVideoTrack(trackId, projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting track:', error);
    if (error instanceof Error && error.message === 'Track not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, trackOrders } = body;

    if (!projectId || !trackOrders || !Array.isArray(trackOrders)) {
      return NextResponse.json(
        { error: 'projectId and trackOrders array are required' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await getProjectById(projectId, session.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await reorderTracks(projectId, trackOrders);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering tracks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


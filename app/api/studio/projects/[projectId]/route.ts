import { auth } from '@/lib/auth';
import {
  getProjectById,
  updateProject,
  deleteProject,
} from '@/lib/studio/services/project-service';
import { NextResponse } from 'next/server';

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

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error getting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const body = await req.json();

    console.log('Updating project:', { projectId, userId: session.user.id, body });

    const project = await updateProject(projectId, session.user.id, body);

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Project not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('Chat') && error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      // Return the actual error message for debugging
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    await deleteProject(projectId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


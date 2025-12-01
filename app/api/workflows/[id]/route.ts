import { auth } from '@/lib/auth';
import {
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  archiveWorkflow,
} from '@/lib/workflows/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    const workflow = await getWorkflowById(id, userId);
    if (!workflow) {
      return Response.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return Response.json({ workflow });
  } catch (error) {
    console.error('Get workflow error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const body = await req.json();

    await updateWorkflow(id, userId, body);

    const workflow = await getWorkflowById(id, userId);
    return Response.json({ workflow });
  } catch (error) {
    console.error('Update workflow error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      await deleteWorkflow(id, userId);
    } else {
      await archiveWorkflow(id, userId);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete workflow error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}


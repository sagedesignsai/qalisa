import { auth } from '@/lib/auth';
import {
  createWorkflow,
  getUserWorkflows,
} from '@/lib/workflows/db';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'DRAFT'
      | 'ACTIVE'
      | 'ARCHIVED'
      | 'DELETED'
      | null;
    const type = searchParams.get('type') as
      | 'AGENT'
      | 'AUTOMATION'
      | 'DATA_PROCESSING'
      | 'CUSTOM'
      | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const workflows = await getUserWorkflows(userId, {
      status: status || undefined,
      type: type || undefined,
      limit,
      offset,
    });

    return Response.json({ workflows });
  } catch (error) {
    console.error('Get workflows error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name, description, type, config, metadata } = body;

    if (!name) {
      return Response.json(
        { error: 'Workflow name is required' },
        { status: 400 },
      );
    }

    const workflow = await createWorkflow(userId, {
      name,
      description,
      type,
      config,
      metadata,
    });

    return Response.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error('Create workflow error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}


import { auth } from '@/lib/auth';
import { updateWorkflowGraph } from '@/lib/workflows/db';
import type { Node, Edge } from '@xyflow/react';

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
    const { nodes, edges } = body as { nodes: Node[]; edges: Edge[] };

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return Response.json(
        { error: 'Nodes and edges must be arrays' },
        { status: 400 },
      );
    }

    await updateWorkflowGraph(id, userId, nodes, edges);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update workflow graph error:', error);
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


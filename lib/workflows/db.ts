import { prisma } from '@/lib/db';
import type { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  name: string;
  description?: string;
  type?: 'AGENT' | 'AUTOMATION' | 'DATA_PROCESSING' | 'CUSTOM';
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowWithGraph {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  config: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
  userId: string,
  data: WorkflowData,
) {
  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      type: data.type || 'AGENT',
      config: data.config || {},
      metadata: data.metadata || {},
      status: 'DRAFT',
    },
  });

  return workflow;
}

/**
 * Get workflow by ID with nodes and edges
 */
export async function getWorkflowById(
  workflowId: string,
  userId: string,
): Promise<WorkflowWithGraph | null> {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
    include: {
      nodes: true,
      edges: true,
    },
  });

  if (!workflow) return null;

  // Convert database nodes to React Flow nodes
  const nodes: Node[] = workflow.nodes.map((node) => ({
    id: node.nodeId,
    type: node.type,
    position: node.position as { x: number; y: number },
    data: node.data as Record<string, unknown>,
  }));

  // Convert database edges to React Flow edges
  const edges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.edgeId,
    source: edge.source,
    target: edge.target,
    type: edge.type || undefined,
    data: edge.data as Record<string, unknown> | undefined,
  }));

  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    type: workflow.type,
    status: workflow.status,
    config: workflow.config as Record<string, unknown> | null,
    metadata: workflow.metadata as Record<string, unknown> | null,
    nodes,
    edges,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
  };
}

/**
 * Get all workflows for a user
 */
export async function getUserWorkflows(
  userId: string,
  options?: {
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    type?: 'AGENT' | 'AUTOMATION' | 'DATA_PROCESSING' | 'CUSTOM';
    limit?: number;
    offset?: number;
  },
) {
  const workflows = await prisma.workflow.findMany({
    where: {
      userId,
      ...(options?.status && { status: options.status }),
      ...(options?.type && { type: options.type }),
    },
    orderBy: { updatedAt: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          nodes: true,
          edges: true,
        },
      },
    },
  });

  return workflows;
}

/**
 * Update workflow
 */
export async function updateWorkflow(
  workflowId: string,
  userId: string,
  data: Partial<WorkflowData & { status?: string }>,
) {
  const workflow = await prisma.workflow.updateMany({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type && { type: data.type }),
      ...(data.status && { status: data.status }),
      ...(data.config && { config: data.config }),
      ...(data.metadata && { metadata: data.metadata }),
    },
  });

  return workflow;
}

/**
 * Update workflow graph (nodes and edges)
 */
export async function updateWorkflowGraph(
  workflowId: string,
  userId: string,
  nodes: Node[],
  edges: Edge[],
) {
  // Verify workflow ownership
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Delete existing nodes and edges
  await prisma.workflowNode.deleteMany({
    where: { workflowId },
  });
  await prisma.workflowEdge.deleteMany({
    where: { workflowId },
  });

  // Create new nodes
  if (nodes.length > 0) {
    await prisma.workflowNode.createMany({
      data: nodes.map((node) => ({
        workflowId,
        nodeId: node.id,
        type: node.type || 'default',
        position: node.position,
        data: node.data || {},
        metadata: {},
      })),
    });
  }

  // Create new edges
  if (edges.length > 0) {
    await prisma.workflowEdge.createMany({
      data: edges.map((edge) => ({
        workflowId,
        edgeId: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || null,
        data: edge.data || null,
        metadata: {},
      })),
    });
  }

  // Update workflow timestamp
  await prisma.workflow.update({
    where: { id: workflowId },
    data: { updatedAt: new Date() },
  });

  return { success: true };
}

/**
 * Delete workflow
 */
export async function deleteWorkflow(workflowId: string, userId: string) {
  return prisma.workflow.updateMany({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      status: 'DELETED',
    },
  });
}

/**
 * Archive workflow
 */
export async function archiveWorkflow(workflowId: string, userId: string) {
  return prisma.workflow.updateMany({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      status: 'ARCHIVED',
    },
  });
}


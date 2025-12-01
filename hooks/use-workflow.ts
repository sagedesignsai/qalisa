'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

export interface Workflow {
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

export function useWorkflow(workflowId: string | null) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflow = useCallback(async () => {
    if (!workflowId) {
      setWorkflow(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/${workflowId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }
      const data = await response.json();
      setWorkflow(data.workflow);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const updateWorkflow = useCallback(
    async (updates: Partial<Workflow>) => {
      if (!workflowId) return;

      try {
        const response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Failed to update workflow');
        }

        const data = await response.json();
        setWorkflow(data.workflow);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [workflowId],
  );

  const updateGraph = useCallback(
    async (nodes: Node[], edges: Edge[]) => {
      if (!workflowId) return;

      try {
        const response = await fetch(`/api/workflows/${workflowId}/graph`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges }),
        });

        if (!response.ok) {
          throw new Error('Failed to update workflow graph');
        }

        // Refresh workflow
        await fetchWorkflow();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [workflowId, fetchWorkflow],
  );

  const executeWorkflow = useCallback(
    async (input: string, context?: Record<string, unknown>) => {
      if (!workflowId) return null;

      try {
        const response = await fetch(`/api/workflows/${workflowId}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, context }),
        });

        if (!response.ok) {
          throw new Error('Failed to execute workflow');
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [workflowId],
  );

  return {
    workflow,
    loading,
    error,
    refetch: fetchWorkflow,
    updateWorkflow,
    updateGraph,
    executeWorkflow,
  };
}


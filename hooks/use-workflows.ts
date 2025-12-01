'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WorkflowListItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    nodes: number;
    edges: number;
  };
}

export function useWorkflows(options?: {
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  type?: 'AGENT' | 'AUTOMATION' | 'DATA_PROCESSING' | 'CUSTOM';
}) {
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.type) params.append('type', options.type);

      const response = await fetch(`/api/workflows?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      const data = await response.json();
      setWorkflows(data.workflows);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.type]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const createWorkflow = useCallback(
    async (data: {
      name: string;
      description?: string;
      type?: 'AGENT' | 'AUTOMATION' | 'DATA_PROCESSING' | 'CUSTOM';
      config?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }) => {
      try {
        const response = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create workflow');
        }

        const result = await response.json();
        await fetchWorkflows();
        return result.workflow;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [fetchWorkflows],
  );

  const deleteWorkflow = useCallback(
    async (id: string, permanent = false) => {
      try {
        const response = await fetch(
          `/api/workflows/${id}?permanent=${permanent}`,
          {
            method: 'DELETE',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete workflow');
        }

        await fetchWorkflows();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [fetchWorkflows],
  );

  return {
    workflows,
    loading,
    error,
    refetch: fetchWorkflows,
    createWorkflow,
    deleteWorkflow,
  };
}


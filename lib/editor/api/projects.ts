/**
 * Projects API Client
 * Utility functions for project API operations
 */

import type { CreateProjectInput, UpdateProjectInput } from '../validation/schemas';

const API_BASE = '/api/editor/projects';

export async function getProjects(options?: { isDraft?: boolean; limit?: number; offset?: number }) {
  const params = new URLSearchParams();
  if (options?.isDraft !== undefined) {
    params.set('isDraft', String(options.isDraft));
  }
  if (options?.limit) {
    params.set('limit', String(options.limit));
  }
  if (options?.offset) {
    params.set('offset', String(options.offset));
  }

  const res = await fetch(`${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch projects');
  }
  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch project');
  }
  return res.json();
}

export async function createProject(data: CreateProjectInput) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete project');
  }
  return res.json();
}


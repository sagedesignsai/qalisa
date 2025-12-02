/**
 * Pages API Client
 * Utility functions for page API operations
 */

import type { CreatePageInput, UpdatePageInput } from '../validation/schemas';

const API_BASE = '/api/editor/pages';

export async function getPages(options?: { projectId?: string; published?: boolean; limit?: number; offset?: number }) {
  const params = new URLSearchParams();
  if (options?.projectId) {
    params.set('projectId', options.projectId);
  }
  if (options?.published !== undefined) {
    params.set('published', String(options.published));
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
    throw new Error(error.error || 'Failed to fetch pages');
  }
  return res.json();
}

export async function getPage(slug: string) {
  const res = await fetch(`${API_BASE}/${slug}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch page');
  }
  return res.json();
}

export async function createPage(data: CreatePageInput) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create page');
  }
  return res.json();
}

export async function updatePage(slug: string, data: UpdatePageInput) {
  const res = await fetch(`${API_BASE}/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update page');
  }
  return res.json();
}

export async function deletePage(slug: string) {
  const res = await fetch(`${API_BASE}/${slug}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete page');
  }
  return res.json();
}

export async function publishPage(slug: string, published: boolean) {
  const res = await fetch(`${API_BASE}/${slug}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ published }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to publish page');
  }
  return res.json();
}


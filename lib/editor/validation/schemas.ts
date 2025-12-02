/**
 * Validation Schemas
 * Zod schemas for editor API validation
 */

import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  isDraft: z.boolean().default(true),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  craftJson: z.unknown().optional(),
  rekaJson: z.unknown().optional(),
  isDraft: z.boolean().optional(),
});

export const createPageSchema = z.object({
  projectId: z.string().cuid().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(255),
  craftJson: z.unknown().optional(),
  rekaJson: z.unknown().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  craftJson: z.unknown().optional(),
  rekaJson: z.unknown().optional(),
  published: z.boolean().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;


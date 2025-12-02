/**
 * Editor Project Store
 * Manages project state: current project, save status
 */

import { create } from 'zustand';
import type { ProjectState } from '../types/state.types';

const DEFAULT_PROJECT: ProjectState = {
  id: null,
  name: 'Untitled Project',
  isDraft: true,
  isDirty: false,
  lastSavedAt: null,
  craftJson: null,
  rekaJson: null,
};

interface EditorProjectStore extends ProjectState {
  // Project actions
  setProject: (project: Partial<ProjectState>) => void;
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setDraftStatus: (isDraft: boolean) => void;
  markDirty: () => void;
  markClean: () => void;
  setCraftJson: (json: unknown) => void;
  clearCraftJson: () => void;
  setRekaJson: (json: unknown) => void;
  resetProject: () => void;
}

export const useEditorProjectStore = create<EditorProjectStore>((set) => ({
  // Initial state
  ...DEFAULT_PROJECT,

  // Project actions
  setProject: (project) =>
    set((state) => ({
      ...state,
      ...project,
    })),

  setProjectId: (id) =>
    set({
      id,
    }),

  setProjectName: (name) =>
    set({
      name,
      isDirty: true,
    }),

  setDraftStatus: (isDraft) =>
    set({
      isDraft,
      isDirty: true,
    }),

  markDirty: () =>
    set({
      isDirty: true,
    }),

  markClean: () =>
    set({
      isDirty: false,
      lastSavedAt: new Date(),
    }),

  setCraftJson: (json) =>
    set({
      craftJson: json,
      isDirty: true,
    }),

  clearCraftJson: () =>
    set({
      craftJson: null,
      isDirty: true,
    }),

  setRekaJson: (json) =>
    set({
      rekaJson: json,
      isDirty: true,
    }),

  resetProject: () =>
    set(DEFAULT_PROJECT),
}));


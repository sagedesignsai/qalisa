/**
 * Canvas Store
 * Manages canvas-specific state: zoom, viewport, grid
 * Note: Some canvas state is also in useEditorUIStore
 * This store can be used for additional canvas-specific features
 */

import { create } from 'zustand';

interface CanvasStore {
  // Additional canvas state can go here
  // Main canvas state is in useEditorUIStore
  isDragging: boolean;
  dragStartPosition: { x: number; y: number } | null;
  hoveredNodeId: string | null;

  // Actions
  setDragging: (isDragging: boolean, position?: { x: number; y: number }) => void;
  setHoveredNode: (nodeId: string | null) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  isDragging: false,
  dragStartPosition: null,
  hoveredNodeId: null,

  setDragging: (isDragging, position) =>
    set({
      isDragging,
      dragStartPosition: isDragging && position ? position : null,
    }),

  setHoveredNode: (nodeId) =>
    set({
      hoveredNodeId: nodeId,
    }),
}));


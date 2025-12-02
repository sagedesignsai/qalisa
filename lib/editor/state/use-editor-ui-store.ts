/**
 * Editor UI Store
 * Manages editor UI state: panels, canvas, selection.
 * Store logic updated to align with panel constraints and API
 * used in @components/editor/layout/editor-layout.tsx.
 */

import { create } from 'zustand';
import type {
  EditorUIState,
  PanelState,
  CanvasState,
  SelectionState,
  ViewportSize,
} from '../types/editor.types';

// Panel size constraints - smaller defaults to prioritize canvas
export const LEFT_SIDEBAR_MIN = 200;
export const LEFT_SIDEBAR_MAX = 350;
export const RIGHT_SIDEBAR_MIN = 240;
export const RIGHT_SIDEBAR_MAX = 400;

// Default viewport values (unchanged)
const DEFAULT_VIEWPORT: ViewportSize = {
  width: 1440,
  height: 900,
  label: 'Desktop',
};

const DEFAULT_PANELS: PanelState = {
  leftSidebar: {
    open: true,
    width: 240, // Smaller default - prioritizes canvas
    activeTab: 'build',
  },
  rightSidebar: {
    open: true,
    width: 280, // Smaller default - prioritizes canvas
    activeTab: 'properties',
  },
};

const DEFAULT_CANVAS: CanvasState = {
  zoom: 0.8,
  viewportSize: DEFAULT_VIEWPORT,
  showGrid: true,
  showGuides: true,
};

const DEFAULT_SELECTION: SelectionState = {
  selectedNodeId: null,
  selectedNodePath: [],
};

interface EditorUIStore extends EditorUIState {
  // Panel actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setPanelWidth: (panel: 'leftSidebar' | 'rightSidebar', width: number) => void;
  setLeftSidebarTab: (tab: 'build' | 'connect' | 'layers') => void;
  setRightSidebarTab: (tab: 'properties' | 'settings') => void;

  // Canvas actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setViewportSize: (size: ViewportSize) => void;
  toggleGrid: () => void;
  toggleGuides: () => void;

  // Selection actions
  setSelectedNode: (nodeId: string | null, path?: string[]) => void;
  clearSelection: () => void;
}

export const useEditorUIStore = create<EditorUIStore>((set) => ({
  // Initial state
  panels: DEFAULT_PANELS,
  canvas: DEFAULT_CANVAS,
  selection: DEFAULT_SELECTION,

  // Panel actions
  toggleLeftSidebar: () =>
    set((state) => ({
      panels: {
        ...state.panels,
        leftSidebar: {
          ...state.panels.leftSidebar,
          open: !state.panels.leftSidebar.open,
        },
      },
    })),

  toggleRightSidebar: () =>
    set((state) => ({
      panels: {
        ...state.panels,
        rightSidebar: {
          ...state.panels.rightSidebar,
          open: !state.panels.rightSidebar.open,
        },
      },
    })),

  // Unified width setter, matches API in @components/editor/layout/editor-layout.tsx
  setPanelWidth: (panel, width) =>
    set((state) => {
      if (panel === 'leftSidebar') {
        return {
          panels: {
            ...state.panels,
            leftSidebar: {
              ...state.panels.leftSidebar,
              width: Math.max(LEFT_SIDEBAR_MIN, Math.min(LEFT_SIDEBAR_MAX, width)),
            },
          },
        };
      }
      if (panel === 'rightSidebar') {
        return {
          panels: {
            ...state.panels,
            rightSidebar: {
              ...state.panels.rightSidebar,
              width: Math.max(RIGHT_SIDEBAR_MIN, Math.min(RIGHT_SIDEBAR_MAX, width)),
            },
          },
        };
      }
      return {};
    }),

  setLeftSidebarTab: (tab) =>
    set((state) => ({
      panels: {
        ...state.panels,
        leftSidebar: {
          ...state.panels.leftSidebar,
          activeTab: tab,
        },
      },
    })),

  setRightSidebarTab: (tab) =>
    set((state) => ({
      panels: {
        ...state.panels,
        rightSidebar: {
          ...state.panels.rightSidebar,
          activeTab: tab,
        },
      },
    })),

  // Canvas actions
  setZoom: (zoom) =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        zoom: Math.max(0.1, Math.min(2.0, zoom)),
      },
    })),

  zoomIn: () =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        zoom: Math.min(2.0, state.canvas.zoom + 0.1),
      },
    })),

  zoomOut: () =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        zoom: Math.max(0.1, state.canvas.zoom - 0.1),
      },
    })),

  resetZoom: () =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        zoom: 0.8,
      },
    })),

  setViewportSize: (size) =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        viewportSize: size,
      },
    })),

  toggleGrid: () =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        showGrid: !state.canvas.showGrid,
      },
    })),

  toggleGuides: () =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        showGuides: !state.canvas.showGuides,
      },
    })),

  // Selection actions
  setSelectedNode: (nodeId, path = []) =>
    set({
      selection: {
        selectedNodeId: nodeId,
        selectedNodePath: path,
      },
    }),

  clearSelection: () =>
    set({
      selection: DEFAULT_SELECTION,
    }),
}));


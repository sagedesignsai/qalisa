/**
 * Editor UI Types
 * Types for editor UI state management
 */

export type ViewportSize = {
  width: number;
  height: number;
  label: string;
};

export type ZoomLevel = number; // 0.1 to 2.0

export type PanelState = {
  leftSidebar: {
    open: boolean;
    width: number;
    activeTab: 'build' | 'connect' | 'layers';
  };
  rightSidebar: {
    open: boolean;
    width: number;
    activeTab: 'properties' | 'settings';
  };
};

export type CanvasState = {
  zoom: ZoomLevel;
  viewportSize: ViewportSize;
  showGrid: boolean;
  showGuides: boolean;
};

export type SelectionState = {
  selectedNodeId: string | null;
  selectedNodePath: string[]; // Breadcrumb path
};

export type EditorUIState = {
  panels: PanelState;
  canvas: CanvasState;
  selection: SelectionState;
};


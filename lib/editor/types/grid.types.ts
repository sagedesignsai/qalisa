/**
 * Grid Layout Types
 * Types for React Grid Layout integration with Reka.js
 */

import type { Layout, Layouts } from 'react-grid-layout';
import type * as t from '@rekajs/types';

/**
 * Grid Layout Item
 * Extends React Grid Layout's Layout type with component metadata
 */
export interface GridLayoutItem extends Layout {
  /**
   * Component ID in Reka.js AST
   */
  componentId: string;
  
  /**
   * Component type name
   */
  componentType: string;
  
  /**
   * Whether this item is selected
   */
  selected?: boolean;
  
  /**
   * Whether this item is locked (cannot be moved/resized)
   */
  locked?: boolean;
  
  /**
   * Minimum width in grid units
   */
  minW?: number;
  
  /**
   * Maximum width in grid units
   */
  maxW?: number;
  
  /**
   * Minimum height in grid units
   */
  minH?: number;
  
  /**
   * Maximum height in grid units
   */
  maxH?: number;
}

/**
 * Grid Component Metadata
 * Combines layout information with component data
 */
export interface GridComponentMetadata {
  /**
   * Grid layout item
   */
  layout: GridLayoutItem;
  
  /**
   * Component props from Reka.js
   */
  props: Record<string, unknown>;
  
  /**
   * Component state from Reka.js
   */
  state?: Record<string, unknown>;
  
  /**
   * Whether component is a container (can have children)
   */
  isContainer?: boolean;
  
  /**
   * Child component IDs (for containers)
   */
  children?: string[];
}

/**
 * Grid Editor State
 * Unified state structure combining grid layout and Reka.js AST
 */
export interface GridEditorState {
  /**
   * Current layout items
   */
  layout: GridLayoutItem[];
  
  /**
   * Responsive layouts for different breakpoints
   */
  layouts: Layouts;
  
  /**
   * Selected component IDs
   */
  selectedIds: Set<string>;
  
  /**
   * Currently dragging component ID
   */
  draggingId: string | null;
  
  /**
   * Currently resizing component ID
   */
  resizingId: string | null;
  
  /**
   * Grid configuration
   */
  config: GridConfig;
  
  /**
   * Component metadata map (componentId -> metadata)
   */
  componentMetadata: Map<string, GridComponentMetadata>;
}

/**
 * Grid Configuration
 */
export interface GridConfig {
  /**
   * Number of columns in the grid
   */
  cols: number;
  
  /**
   * Row height in pixels
   */
  rowHeight: number;
  
  /**
   * Margin between grid items [x, y]
   */
  margin: [number, number];
  
  /**
   * Padding around the grid [x, y]
   */
  containerPadding: [number, number];
  
  /**
   * Whether layout is compact (items move up to fill gaps)
   */
  compactType: 'vertical' | 'horizontal' | null;
  
  /**
   * Whether items can be dragged
   */
  isDraggable: boolean;
  
  /**
   * Whether items can be resized
   */
  isResizable: boolean;
  
  /**
   * Whether to prevent collisions when dragging
   */
  preventCollision: boolean;
  
  /**
   * Responsive breakpoints
   */
  breakpoints: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
    xxs: number;
  };
  
  /**
   * Column counts for each breakpoint
   */
  colsByBreakpoint: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
    xxs: number;
  };
}

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  cols: 12,
  rowHeight: 30,
  margin: [10, 10],
  containerPadding: [10, 10],
  compactType: 'vertical',
  isDraggable: true,
  isResizable: true,
  preventCollision: false,
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  colsByBreakpoint: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2,
  },
};

/**
 * Reka.js Component with Layout Extension
 * Extends Reka.js Component AST to include layout metadata
 */
export interface RekaComponentWithLayout extends t.RekaComponent {
  /**
   * Layout metadata stored in component custom data
   */
  custom?: {
    layout?: {
      x: number;
      y: number;
      w: number;
      h: number;
      minW?: number;
      maxW?: number;
      minH?: number;
      maxH?: number;
      locked?: boolean;
    };
  };
}

/**
 * Grid Editor Actions
 */
export interface GridEditorActions {
  /**
   * Add a new component to the grid
   */
  addComponent: (
    componentType: string,
    props: Record<string, unknown>,
    layout: Partial<Layout>
  ) => string; // Returns component ID
  
  /**
   * Remove a component from the grid
   */
  removeComponent: (componentId: string) => void;
  
  /**
   * Update component layout
   */
  updateLayout: (componentId: string, layout: Partial<Layout>) => void;
  
  /**
   * Update component props
   */
  updateProps: (componentId: string, props: Record<string, unknown>) => void;
  
  /**
   * Select components
   */
  selectComponents: (componentIds: string[]) => void;
  
  /**
   * Clear selection
   */
  clearSelection: () => void;
  
  /**
   * Update grid configuration
   */
  updateConfig: (config: Partial<GridConfig>) => void;
  
  /**
   * Handle layout change from React Grid Layout
   */
  handleLayoutChange: (layout: Layout[], layouts: Layouts) => void;
}


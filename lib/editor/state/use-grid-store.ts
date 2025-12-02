/**
 * Grid Store
 * Zustand store for grid layout state management
 * Replaces Craft.js node tree management
 */

import { create } from 'zustand';
import type { Layout, Layouts } from 'react-grid-layout';
import type {
  GridLayoutItem,
  GridEditorState,
  GridConfig,
  GridComponentMetadata,
  GridEditorActions,
} from '../types/grid.types';
import { DEFAULT_GRID_CONFIG } from '../types/grid.types';
import { nanoid } from 'nanoid';

interface GridStore extends GridEditorState, GridEditorActions {
  // Internal state
  _initialized: boolean;
  
  // Initialization
  initialize: (initialLayout?: GridLayoutItem[]) => void;
  
  // Component metadata helpers
  getComponentMetadata: (componentId: string) => GridComponentMetadata | undefined;
  setComponentMetadata: (componentId: string, metadata: Partial<GridComponentMetadata>) => void;
  
  // Layout helpers
  getLayoutItem: (componentId: string) => GridLayoutItem | undefined;
  findLayoutItem: (predicate: (item: GridLayoutItem) => boolean) => GridLayoutItem | undefined;
  
  // Selection helpers
  isSelected: (componentId: string) => boolean;
  toggleSelection: (componentId: string) => void;
  
  // Serialization
  serialize: () => {
    layout: GridLayoutItem[];
    layouts: Layouts;
    componentMetadata: Record<string, GridComponentMetadata>;
    config: GridConfig;
  };
  
  // Deserialization
  deserialize: (data: {
    layout: GridLayoutItem[];
    layouts?: Layouts;
    componentMetadata?: Record<string, GridComponentMetadata>;
    config?: Partial<GridConfig>;
  }) => void;
}

const createDefaultLayouts = (): Layouts => ({
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
});

export const useGridStore = create<GridStore>((set, get) => ({
  // Initial state
  layout: [],
  layouts: createDefaultLayouts(),
  selectedIds: new Set(),
  draggingId: null,
  resizingId: null,
  config: DEFAULT_GRID_CONFIG,
  componentMetadata: new Map(),
  _initialized: false,

  // Initialization
  initialize: (initialLayout = []) => {
    if (get()._initialized) return;
    
    set({
      layout: initialLayout,
      layouts: {
        lg: initialLayout,
        md: initialLayout,
        sm: initialLayout,
        xs: initialLayout,
        xxs: initialLayout,
      },
      _initialized: true,
    });
  },

  // Add component
  addComponent: (componentType, props, layoutPartial) => {
    const componentId = nanoid();
    const config = get().config;
    
    const layoutItem: GridLayoutItem = {
      i: componentId,
      x: layoutPartial.x ?? 0,
      y: layoutPartial.y ?? 0,
      w: layoutPartial.w ?? 4,
      h: layoutPartial.h ?? 4,
      minW: layoutPartial.minW ?? 1,
      maxW: layoutPartial.maxW ?? config.cols,
      minH: layoutPartial.minH ?? 1,
      maxH: layoutPartial.maxH ?? undefined,
      componentId,
      componentType,
      selected: false,
      locked: false,
      ...layoutPartial,
    };

    const metadata: GridComponentMetadata = {
      layout: layoutItem,
      props,
      isContainer: false,
      children: [],
    };

    set((state) => {
      const newLayout = [...state.layout, layoutItem];
      const newMetadata = new Map(state.componentMetadata);
      newMetadata.set(componentId, metadata);

      return {
        layout: newLayout,
        layouts: {
          lg: newLayout,
          md: newLayout,
          sm: newLayout,
          xs: newLayout,
          xxs: newLayout,
        },
        componentMetadata: newMetadata,
      };
    });

    return componentId;
  },

  // Remove component
  removeComponent: (componentId) => {
    set((state) => {
      const newLayout = state.layout.filter((item) => item.i !== componentId);
      const newMetadata = new Map(state.componentMetadata);
      newMetadata.delete(componentId);
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(componentId);

      return {
        layout: newLayout,
        layouts: {
          lg: newLayout,
          md: newLayout,
          sm: newLayout,
          xs: newLayout,
          xxs: newLayout,
        },
        componentMetadata: newMetadata,
        selectedIds: newSelectedIds,
        draggingId: state.draggingId === componentId ? null : state.draggingId,
        resizingId: state.resizingId === componentId ? null : state.resizingId,
      };
    });
  },

  // Update layout
  updateLayout: (componentId, layoutPartial) => {
    set((state) => {
      const newLayout = state.layout.map((item) => {
        if (item.i === componentId) {
          return {
            ...item,
            ...layoutPartial,
          };
        }
        return item;
      });

      const newMetadata = new Map(state.componentMetadata);
      const existingMetadata = newMetadata.get(componentId);
      if (existingMetadata) {
        newMetadata.set(componentId, {
          ...existingMetadata,
          layout: {
            ...existingMetadata.layout,
            ...layoutPartial,
          },
        });
      }

      return {
        layout: newLayout,
        layouts: {
          lg: newLayout,
          md: newLayout,
          sm: newLayout,
          xs: newLayout,
          xxs: newLayout,
        },
        componentMetadata: newMetadata,
      };
    });
  },

  // Update props
  updateProps: (componentId, props) => {
    set((state) => {
      const newMetadata = new Map(state.componentMetadata);
      const existingMetadata = newMetadata.get(componentId);
      if (existingMetadata) {
        newMetadata.set(componentId, {
          ...existingMetadata,
          props: {
            ...existingMetadata.props,
            ...props,
          },
        });
      }
      return { componentMetadata: newMetadata };
    });
  },

  // Select components
  selectComponents: (componentIds) => {
    set({
      selectedIds: new Set(componentIds),
    });
    
    // Update layout items to reflect selection
    set((state) => ({
      layout: state.layout.map((item) => ({
        ...item,
        selected: componentIds.includes(item.i),
      })),
    }));
  },

  // Clear selection
  clearSelection: () => {
    set({
      selectedIds: new Set(),
    });
    
    set((state) => ({
      layout: state.layout.map((item) => ({
        ...item,
        selected: false,
      })),
    }));
  },

  // Update config
  updateConfig: (configPartial) => {
    set((state) => ({
      config: {
        ...state.config,
        ...configPartial,
      },
    }));
  },

  // Handle layout change
  handleLayoutChange: (layout, layouts) => {
    set((state) => {
      // Convert Layout[] to GridLayoutItem[]
      const gridLayout: GridLayoutItem[] = layout.map((item) => {
        const existingItem = state.layout.find((li) => li.i === item.i);
        return {
          ...item,
          componentId: existingItem?.componentId || item.i,
          componentType: existingItem?.componentType || '',
          selected: existingItem?.selected || false,
          locked: existingItem?.locked || false,
          minW: existingItem?.minW,
          maxW: existingItem?.maxW,
          minH: existingItem?.minH,
          maxH: existingItem?.maxH,
        } as GridLayoutItem;
      });

      return {
        layout: gridLayout,
        layouts,
      };
    });
  },

  // Get component metadata
  getComponentMetadata: (componentId) => {
    return get().componentMetadata.get(componentId);
  },

  // Set component metadata
  setComponentMetadata: (componentId, metadataPartial) => {
    set((state) => {
      const newMetadata = new Map(state.componentMetadata);
      const existingMetadata = newMetadata.get(componentId);
      
      if (existingMetadata) {
        newMetadata.set(componentId, {
          ...existingMetadata,
          ...metadataPartial,
          layout: metadataPartial.layout || existingMetadata.layout,
          props: metadataPartial.props || existingMetadata.props,
        });
      } else {
        // Create new metadata if it doesn't exist
        const layoutItem = state.layout.find((item) => item.i === componentId);
        if (layoutItem) {
          newMetadata.set(componentId, {
            layout: layoutItem as GridLayoutItem,
            props: {},
            ...metadataPartial,
          });
        }
      }

      return { componentMetadata: newMetadata };
    });
  },

  // Get layout item
  getLayoutItem: (componentId) => {
    return get().layout.find((item) => item.i === componentId);
  },

  // Find layout item
  findLayoutItem: (predicate) => {
    return get().layout.find(predicate);
  },

  // Check if selected
  isSelected: (componentId) => {
    return get().selectedIds.has(componentId);
  },

  // Toggle selection
  toggleSelection: (componentId) => {
    const state = get();
    const newSelectedIds = new Set(state.selectedIds);
    
    if (newSelectedIds.has(componentId)) {
      newSelectedIds.delete(componentId);
    } else {
      newSelectedIds.add(componentId);
    }

    get().selectComponents(Array.from(newSelectedIds));
  },

  // Serialize
  serialize: () => {
    const state = get();
    return {
      layout: state.layout,
      layouts: state.layouts,
      componentMetadata: Object.fromEntries(state.componentMetadata),
      config: state.config,
    };
  },

  // Deserialize
  deserialize: (data) => {
    set({
      layout: data.layout,
      layouts: data.layouts || createDefaultLayouts(),
      componentMetadata: new Map(
        Object.entries(data.componentMetadata || {})
      ),
      config: {
        ...DEFAULT_GRID_CONFIG,
        ...data.config,
      },
      _initialized: true,
    });
  },
}));


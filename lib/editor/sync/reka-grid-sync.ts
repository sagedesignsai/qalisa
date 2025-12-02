/**
 * Reka.js Grid Sync Layer
 * Bidirectional synchronization between Reka.js AST and grid layout
 */

import type { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';
import { useGridStore } from '../state/use-grid-store';
import type { GridLayoutItem, GridComponentMetadata } from '../types/grid.types';
import {
  gridItemToRekaComponent,
  rekaComponentToGridItem,
  extractPropsFromRekaComponent,
  updateRekaComponentProps,
  addLayoutToRekaComponent,
} from '@/lib/reka/layout-integration';
import { nanoid } from 'nanoid';

/**
 * Sync grid layout changes to Reka.js
 */
export function syncGridToReka(reka: Reka, componentId: string) {
  const gridStore = useGridStore.getState();
  const metadata = gridStore.getComponentMetadata(componentId);
  
  if (!metadata) return;

  // Get or create component in Reka.js
  const state = reka.state;
  let component = state.program.components.find(
    (c) => c.name === componentId
  );

  if (!component) {
    // Create new component from grid item
    const rekaComponent = gridItemToRekaComponent(metadata, componentId);
    
    // Add to Reka.js state
    reka.dispatch(
      t.state({
        ...state,
        program: t.program({
          components: [...state.program.components, rekaComponent],
        }),
      })
    );
  } else {
    // Update existing component
    const updatedComponent = addLayoutToRekaComponent(
      component,
      metadata.layout
    );
    const updatedProps = updateRekaComponentProps(
      updatedComponent,
      metadata.props
    );

    // Update in Reka.js state
    reka.dispatch(
      t.state({
        ...state,
        program: t.program({
          components: state.program.components.map((c) =>
            c.name === componentId ? updatedProps : c
          ),
        }),
      })
    );
  }
}

/**
 * Sync Reka.js changes to grid layout
 */
export function syncRekaToGrid(reka: Reka) {
  const state = reka.state;
  const gridStore = useGridStore.getState();
  
  // Get all components from Reka.js
  const rekaComponents = state.program.components || [];
  
  // Sync each component to grid
  for (const component of rekaComponents) {
    const gridItem = rekaComponentToGridItem(component, component.name);
    
    if (gridItem) {
      // Check if grid item exists
      const existingItem = gridStore.getLayoutItem(component.name);
      
      if (!existingItem) {
        // Add new grid item
        const props = extractPropsFromRekaComponent(component);
        gridStore.addComponent(
          component.name,
          props,
          {
            x: gridItem.x,
            y: gridItem.y,
            w: gridItem.w,
            h: gridItem.h,
            minW: gridItem.minW,
            maxW: gridItem.maxW,
            minH: gridItem.minH,
            maxH: gridItem.maxH,
          }
        );
      } else {
        // Update existing grid item
        gridStore.updateLayout(component.name, {
          x: gridItem.x,
          y: gridItem.y,
          w: gridItem.w,
          h: gridItem.h,
        });
        
        const props = extractPropsFromRekaComponent(component);
        gridStore.updateProps(component.name, props);
      }
    }
  }
  
  // Remove grid items that don't exist in Reka.js
  const rekaComponentIds = new Set(rekaComponents.map((c) => c.name));
  const gridLayout = gridStore.layout;
  
  for (const item of gridLayout) {
    if (!rekaComponentIds.has(item.componentId)) {
      gridStore.removeComponent(item.componentId);
    }
  }
}

/**
 * Debounced sync function
 */
let syncTimeout: NodeJS.Timeout | null = null;

export function debouncedSyncGridToReka(
  reka: Reka,
  componentId: string,
  delay = 300
) {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(() => {
    syncGridToReka(reka, componentId);
  }, delay);
}

export function debouncedSyncRekaToGrid(reka: Reka, delay = 300) {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(() => {
    syncRekaToGrid(reka);
  }, delay);
}

/**
 * Initialize sync between Reka.js and Grid
 */
export function initializeSync(reka: Reka) {
  // Initial sync from Reka.js to Grid
  syncRekaToGrid(reka);
  
  // Listen to Reka.js state changes
  // Note: Reka.js doesn't have built-in change listeners,
  // so we'll need to manually sync when needed
}


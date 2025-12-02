/**
 * Grid Editor Context
 * React context for grid editor state
 * Replaces Craft.js useEditor hook
 */

'use client';

import { createContext, useContext, useMemo } from 'react';
import { useGridStore } from '../state/use-grid-store';
import type { GridEditorActions, GridLayoutItem, GridConfig } from '../types/grid.types';

interface GridEditorContextValue {
  // State
  layout: GridLayoutItem[];
  selectedIds: Set<string>;
  draggingId: string | null;
  resizingId: string | null;
  config: GridConfig;
  
  // Actions
  actions: GridEditorActions;
  
  // Helpers
  isSelected: (componentId: string) => boolean;
  getComponentMetadata: (componentId: string) => import('../types/grid.types').GridComponentMetadata | undefined;
}

const GridEditorContext = createContext<GridEditorContextValue | null>(null);

export function useGridEditor() {
  const context = useContext(GridEditorContext);
  if (!context) {
    throw new Error('useGridEditor must be used within GridEditorProvider');
  }
  return context;
}

export function GridEditorContextProvider({ children }: { children: React.ReactNode }) {
  const layout = useGridStore((state) => state.layout);
  const selectedIds = useGridStore((state) => state.selectedIds);
  const draggingId = useGridStore((state) => state.draggingId);
  const resizingId = useGridStore((state) => state.resizingId);
  const config = useGridStore((state) => state.config);
  
  const actions = useMemo(
    () => ({
      addComponent: useGridStore.getState().addComponent,
      removeComponent: useGridStore.getState().removeComponent,
      updateLayout: useGridStore.getState().updateLayout,
      updateProps: useGridStore.getState().updateProps,
      selectComponents: useGridStore.getState().selectComponents,
      clearSelection: useGridStore.getState().clearSelection,
      updateConfig: useGridStore.getState().updateConfig,
      handleLayoutChange: useGridStore.getState().handleLayoutChange,
    }),
    []
  );
  
  const isSelected = useGridStore.getState().isSelected;
  const getComponentMetadata = useGridStore.getState().getComponentMetadata;

  const value = useMemo(
    () => ({
      layout,
      selectedIds,
      draggingId,
      resizingId,
      config,
      actions,
      isSelected,
      getComponentMetadata,
    }),
    [layout, selectedIds, draggingId, resizingId, config, actions, isSelected, getComponentMetadata]
  );

  return <GridEditorContext.Provider value={value}>{children}</GridEditorContext.Provider>;
}


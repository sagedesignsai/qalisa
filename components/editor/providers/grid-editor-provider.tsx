/**
 * Grid Editor Provider
 * Main provider for grid-based editor
 * Replaces CraftEditorProvider
 */

'use client';

import { GridEditorContextProvider } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import { useEditorProjectStore } from '@/lib/editor/state/use-editor-project-store';
import { useEffect } from 'react';

interface GridEditorProviderProps {
  children: React.ReactNode;
}

export function GridEditorProvider({ children }: GridEditorProviderProps) {
  const { rekaJson, setRekaJson } = useEditorProjectStore();
  const initialize = useGridStore((state) => state.initialize);
  const deserialize = useGridStore((state) => state.deserialize);
  const serialize = useGridStore((state) => state.serialize);

  // Initialize grid store on mount
  useEffect(() => {
    if (rekaJson) {
      try {
        // TODO: Deserialize from Reka.js JSON that includes layout
        // For now, initialize with empty layout
        initialize();
      } catch (error) {
        console.error('Error initializing grid from Reka.js state:', error);
        initialize();
      }
    } else {
      initialize();
    }
  }, [initialize, rekaJson]);

  // Sync grid state changes to Reka.js
  useEffect(() => {
    // TODO: Implement bidirectional sync with Reka.js
    // This will be handled by the sync layer
  }, []);

  return (
    <GridEditorContextProvider>
      {children}
    </GridEditorContextProvider>
  );
}


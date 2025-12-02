/**
 * Selection Manager
 * Grid-based selection system
 * Replaces Craft.js selection
 */

'use client';

import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import { useEffect } from 'react';

export function SelectionManager() {
  const { selectedIds, actions } = useGridEditor();
  const layout = useGridStore((state) => state.layout);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected components
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
        e.preventDefault();
        selectedIds.forEach((id) => {
          actions.removeComponent(id);
        });
        actions.clearSelection();
      }

      // Escape to clear selection
      if (e.key === 'Escape') {
        actions.clearSelection();
      }

      // Multi-select with Shift/Cmd
      if ((e.shiftKey || e.metaKey) && e.key.startsWith('Arrow')) {
        // TODO: Implement arrow key navigation for multi-select
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, actions]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't clear if clicking on grid items or controls
      if (
        target.closest('.grid-item-wrapper') ||
        target.closest('.grid-drag-handle') ||
        target.closest('[data-grid-control]')
      ) {
        return;
      }

      // Clear selection if clicking outside
      if (selectedIds.size > 0) {
        actions.clearSelection();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedIds, actions]);

  return null; // This component manages selection logic, no UI
}


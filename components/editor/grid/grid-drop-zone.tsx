/**
 * Grid Drop Zone
 * Handles external drag-and-drop from component palette
 */

'use client';

import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import { componentRegistry } from '@/lib/editor/components/component-registry';
import { useCallback } from 'react';

interface GridDropZoneProps {
  children: React.ReactNode;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}

export function GridDropZone({
  children,
  onDragEnter,
  onDragLeave,
}: GridDropZoneProps) {
  const { actions, config } = useGridEditor();
  const layout = useGridStore((state) => state.layout);

  // Calculate drop position and grid coordinates
  const calculateDropPosition = useCallback(
    (e: React.DragEvent, clientX: number, clientY: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = clientX - rect.left - config.containerPadding[0];
      const y = clientY - rect.top - config.containerPadding[1];

      // Convert pixel coordinates to grid coordinates
      const gridX = Math.floor(x / (rect.width / config.cols));
      const gridY = Math.floor(y / config.rowHeight);

      // Find the highest Y position to place new item below existing items
      const maxY = layout.reduce((max, item) => {
        const itemBottom = item.y + item.h;
        return itemBottom > max ? itemBottom : max;
      }, 0);

      return {
        x: Math.max(0, Math.min(gridX, config.cols - 1)),
        y: maxY + 1,
        w: 4, // Default width
        h: 4, // Default height
      };
    },
    [config, layout]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const componentData = e.dataTransfer.getData('application/craftjs-component');
      if (!componentData) {
        return;
      }

      try {
        const { type, props } = JSON.parse(componentData);
        const componentDef = componentRegistry.find((c) => c.name === type);

        if (componentDef) {
          // Calculate drop position
          const position = calculateDropPosition(
            e,
            e.clientX,
            e.clientY
          );

          // Add component to grid
          const componentId = actions.addComponent(
            type,
            props || componentDef.defaultProps || {},
            position
          );

          console.log('Component added to grid:', componentId, type);
        }
      } catch (error) {
        console.error('Error handling drop:', error);
      }
    },
    [actions, calculateDropPosition]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/craftjs-component')) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (e.dataTransfer.types.includes('application/craftjs-component')) {
        e.preventDefault();
        e.stopPropagation();
        onDragEnter?.();
      }
    },
    [onDragEnter]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        onDragLeave?.();
      }
    },
    [onDragLeave]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}


/**
 * Grid Component Wrapper
 * Wraps components in grid layout items
 * Handles selection, drag, resize
 */

'use client';

import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import type { GridLayoutItem, GridComponentMetadata } from '@/lib/editor/types/grid.types';
import { useReka } from '@rekajs/react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/craft/container';
import { Text } from '@/components/craft/text';
import { Button } from '@/components/craft/button';
import { Heading } from '@/components/craft/heading';
import { ImageComponent } from '@/components/craft/image';
import { Row } from '@/components/craft/row';
import { Column } from '@/components/craft/column';

interface GridComponentWrapperProps {
  componentId: string;
  layoutItem: GridLayoutItem;
}

export function GridComponentWrapper({
  componentId,
  layoutItem,
}: GridComponentWrapperProps) {
  const { isSelected, getComponentMetadata, actions } = useGridEditor();
  const { reka } = useReka();
  const draggingId = useGridStore((state) => state.draggingId);
  const resizingId = useGridStore((state) => state.resizingId);
  
  const metadata = getComponentMetadata(componentId);
  const selected = isSelected(componentId);
  const isDragging = draggingId === componentId;
  const isResizing = resizingId === componentId;

  // Handle click to select
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.shiftKey || e.metaKey) {
      // Multi-select
      actions.toggleSelection?.(componentId) || actions.selectComponents([...Array.from(useGridStore.getState().selectedIds), componentId]);
    } else {
      // Single select
      actions.selectComponents([componentId]);
    }
  };

  // Get component from Reka.js or render from metadata
  const component = useMemo(() => {
    if (!metadata) return null;
    
    // Try to get component from Reka.js state if available
    if (reka?.state?.program?.components) {
      const rekaComponent = reka.state.program.components.find(
        (c) => c.name === metadata.layout.componentType
      );
      
      if (rekaComponent) {
        // Render using Reka.js
        // TODO: Implement Reka.js rendering
        // For now, fallback to metadata rendering
      }
    }
    
    // Fallback: render from metadata
    return renderComponentFromMetadata(metadata);
  }, [reka, metadata]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'grid-item relative w-full h-full cursor-pointer',
        selected && 'ring-2 ring-primary ring-offset-2',
        isDragging && 'opacity-50',
        isResizing && 'ring-2 ring-blue-500'
      )}
    >
      {/* Drag Handle */}
      <div className="grid-drag-handle absolute top-0 left-0 w-full h-4 bg-primary/10 cursor-move opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-8 h-1 bg-primary/50 rounded" />
      </div>

      {/* Component Content */}
      <div className="w-full h-full pt-4">
        {component || (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            {layoutItem.componentType}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
      )}
    </div>
  );
}

/**
 * Render component from metadata (temporary until Reka.js integration is complete)
 */
function renderComponentFromMetadata(metadata: GridComponentMetadata) {
  const componentType = metadata.layout.componentType;
  const props = metadata.props || {};
  
  switch (componentType) {
    case 'Text':
      return <Text {...(props as any)} />;
    case 'Button':
      return <Button {...(props as any)} />;
    case 'Heading':
      return <Heading {...(props as any)} />;
    case 'Image':
      return <ImageComponent {...(props as any)} />;
    case 'Container':
      return <Container {...(props as any)} />;
    case 'Row':
      return <Row {...(props as any)} />;
    case 'Column':
      return <Column {...(props as any)} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          {componentType}
        </div>
      );
  }
}


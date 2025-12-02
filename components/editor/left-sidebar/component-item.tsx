/**
 * Component Item
 * Individual component item in the palette (draggable)
 * Updated for grid system
 */

'use client';

import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import type { ComponentDefinition } from '@/lib/editor/types/component.types';
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Heading1, 
  Layout, 
  Columns,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  Square,
  Image: ImageIcon,
  Heading1,
  Layout,
  Columns,
};

export function ComponentItem({ component }: { component: ComponentDefinition }) {
  const Icon = component.icon ? iconMap[component.icon] || Square : Square;

  // Add component to grid on click
  const handleAddComponent = () => {
    try {
      // Get grid store state
      const gridStore = useGridStore.getState();
      
      // Calculate position: add to the end (highest Y + 1)
      const maxY = gridStore.layout.reduce((max, item) => {
        const itemBottom = item.y + item.h;
        return itemBottom > max ? itemBottom : max;
      }, 0);

      // Add component to grid
      const componentId = gridStore.addComponent(
        component.name,
        component.defaultProps || {},
        {
          x: 0,
          y: maxY + 1,
          w: 4, // Default width
          h: 4, // Default height
        }
      );

      console.log('Component added to grid:', componentId);
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  // Drag handlers for HTML5 drag-and-drop
  const handleDragStart = (e: React.DragEvent) => {
    // Store component data in dataTransfer for drop handling
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/craftjs-component', JSON.stringify({
      type: component.name,
      props: component.defaultProps || {},
    }));
    
    // Add a custom drag image for better UX
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleAddComponent}
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors group active:scale-[0.98]"
      title={`Drag or click to add ${component.name}`}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{component.name}</div>
        {component.description && (
          <div className="text-xs text-muted-foreground truncate">
            {component.description}
          </div>
        )}
      </div>
    </div>
  );
}


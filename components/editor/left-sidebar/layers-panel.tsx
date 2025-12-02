/**
 * Layers Panel
 * Custom layers panel for grid components
 * Shows component hierarchy and allows selection
 */

'use client';

import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import { componentRegistry } from '@/lib/editor/components/component-registry';
import { ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LayerItemProps {
  componentId: string;
  metadata: import('@/lib/editor/types/grid.types').GridComponentMetadata;
  level: number;
  isSelected: boolean;
  onSelect: (componentId: string) => void;
}

function LayerItem({ componentId, metadata, level, isSelected, onSelect }: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const componentDef = componentRegistry.find(c => c.name === metadata.layout.componentType);
  const hasChildren = metadata.children && metadata.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded',
          isSelected && 'bg-primary/10 text-primary',
          level > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(componentId)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <span className="flex-1 truncate">
          {componentDef?.name || metadata.layout.componentType}
        </span>
        <span className="text-xs text-muted-foreground">
          {metadata.layout.w}×{metadata.layout.h}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {metadata.children?.map((childId) => {
            const childMetadata = useGridStore.getState().getComponentMetadata(childId);
            if (!childMetadata) return null;
            return (
              <LayerItem
                key={childId}
                componentId={childId}
                metadata={childMetadata}
                level={level + 1}
                isSelected={useGridStore.getState().isSelected(childId)}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LayersPanel() {
  const { layout, selectedIds, actions } = useGridEditor();
  const componentMetadata = useGridStore((state) => state.componentMetadata);

  // Get root components (components not children of other components)
  const rootComponents = useMemo(() => {
    const allComponentIds = new Set(componentMetadata.keys());
    const childIds = new Set<string>();
    
    componentMetadata.forEach((metadata) => {
      metadata.children?.forEach((childId) => {
        childIds.add(childId);
      });
    });

    return Array.from(allComponentIds).filter((id) => !childIds.has(id));
  }, [componentMetadata]);

  const handleSelect = (componentId: string) => {
    actions.selectComponents([componentId]);
  };

  if (rootComponents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">
          No components yet. Drag components from the palette to add them.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-2">
      <div className="space-y-1">
        {rootComponents.map((componentId) => {
          const metadata = componentMetadata.get(componentId);
          if (!metadata) return null;
          return (
            <LayerItem
              key={componentId}
              componentId={componentId}
              metadata={metadata}
              level={0}
              isSelected={selectedIds.has(componentId)}
              onSelect={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
}


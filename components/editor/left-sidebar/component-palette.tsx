/**
 * Component Palette
 * Displays available components for drag-and-drop
 */

'use client';

import { useComponentPaletteStore } from '@/lib/editor/state/use-component-palette-store';
import { componentRegistry, getComponentsByCategory } from '@/lib/editor/components/component-registry';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Heading1, 
  Layout, 
  Columns,
  Search,
} from 'lucide-react';
import { useEffect } from 'react';
import { ComponentItem } from './component-item';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  Square,
  Image: ImageIcon,
  Heading1,
  Layout,
  Columns,
};

export function ComponentPalette() {
  const { searchQuery, selectedCategory, filteredComponents, setSearchQuery, setCategory, setComponents } = useComponentPaletteStore();

  useEffect(() => {
    setComponents(componentRegistry);
  }, [setComponents]);

  const categories: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'commonly-used', label: 'Commonly Used' },
    { value: 'layout', label: 'Layout' },
    { value: 'content', label: 'Content' },
    { value: 'media', label: 'Media' },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as any)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredComponents.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No components found
            </div>
          ) : (
            filteredComponents.map((component) => (
              <ComponentItem key={component.id} component={component} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}


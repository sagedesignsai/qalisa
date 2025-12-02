/**
 * Right Sidebar
 * Property panel with Grid Layout properties and Component Props
 * Updated for grid system
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PanelRightClose } from 'lucide-react';
import { useEffect, useState } from 'react';
import { componentRegistry } from '@/lib/editor/components/component-registry';

export function RightSidebar() {
  const { panels, toggleRightSidebar, setRightSidebarTab } = useEditorUIStore();
  const { selectedIds, getComponentMetadata, actions } = useGridEditor();
  
  // Get first selected component (for now, single selection)
  const selectedId = selectedIds.size > 0 ? Array.from(selectedIds)[0] : null;
  const componentMetadata = selectedId ? getComponentMetadata(selectedId) : null;
  const componentDef = componentMetadata 
    ? componentRegistry.find(c => c.name === componentMetadata.componentName)
    : null;

  const [activeTab, setActiveTab] = useState<'properties' | 'settings'>('properties');

  // Grid layout state
  const [layoutProps, setLayoutProps] = useState({
    x: componentMetadata?.layout.x ?? 0,
    y: componentMetadata?.layout.y ?? 0,
    w: componentMetadata?.layout.w ?? 4,
    h: componentMetadata?.layout.h ?? 4,
    minW: componentMetadata?.layout.minW ?? 1,
    maxW: componentMetadata?.layout.maxW ?? 12,
    minH: componentMetadata?.layout.minH ?? 1,
    maxH: componentMetadata?.layout.maxH ?? undefined,
  });

  // Component props state
  const [componentProps, setComponentProps] = useState<Record<string, any>>(
    componentMetadata?.props ?? {}
  );

  // Update local state when selection changes
  useEffect(() => {
    if (componentMetadata) {
      setLayoutProps({
        x: componentMetadata.layout.x ?? 0,
        y: componentMetadata.layout.y ?? 0,
        w: componentMetadata.layout.w ?? 4,
        h: componentMetadata.layout.h ?? 4,
        minW: componentMetadata.layout.minW ?? 1,
        maxW: componentMetadata.layout.maxW ?? 12,
        minH: componentMetadata.layout.minH ?? 1,
        maxH: componentMetadata.layout.maxH ?? undefined,
      });
      setComponentProps(componentMetadata.props ?? {});
    }
  }, [componentMetadata]);

  // Update grid layout when layout props change
  const handleLayoutChange = (key: string, value: number | undefined) => {
    if (!selectedId) return;
    
    const newLayoutProps = { ...layoutProps, [key]: value };
    setLayoutProps(newLayoutProps);
    
    actions.updateLayout(selectedId, {
      [key]: value,
    });
  };

  // Update component props when props change
  const handlePropChange = (key: string, value: any) => {
    if (!selectedId) return;
    
    const newProps = { ...componentProps, [key]: value };
    setComponentProps(newProps);
    
    actions.updateProps(selectedId, {
      [key]: value,
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header - Compact */}
      <div className="flex h-10 items-center justify-between border-b border-border px-3">
        <h2 className="text-xs font-semibold">
          {selectedId ? (componentDef?.name || 'Properties') : 'No Selection'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightSidebar}
          className="h-7 w-7"
        >
          <PanelRightClose className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Sidebar Content */}
      {selectedId && componentMetadata ? (
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="flex h-full flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="settings">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Component Props</Label>
                  {componentDef && Object.keys(componentDef.defaultProps || {}).map((key) => {
                    const propValue = componentProps[key];
                    const propType = typeof propValue;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`prop-${key}`} className="text-xs capitalize">
                          {key}
                        </Label>
                        {propType === 'string' ? (
                          <Input
                            id={`prop-${key}`}
                            value={propValue ?? ''}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            className="h-8 text-xs"
                          />
                        ) : propType === 'number' ? (
                          <Input
                            id={`prop-${key}`}
                            type="number"
                            value={propValue ?? 0}
                            onChange={(e) => handlePropChange(key, Number(e.target.value))}
                            className="h-8 text-xs"
                          />
                        ) : propType === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <input
                              id={`prop-${key}`}
                              type="checkbox"
                              checked={propValue ?? false}
                              onChange={(e) => handlePropChange(key, e.target.checked)}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`prop-${key}`} className="text-xs">
                              {key}
                            </Label>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Grid Layout</Label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="layout-x" className="text-xs">X Position</Label>
                      <Input
                        id="layout-x"
                        type="number"
                        value={layoutProps.x}
                        onChange={(e) => handleLayoutChange('x', Number(e.target.value))}
                        className="h-8 text-xs"
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="layout-y" className="text-xs">Y Position</Label>
                      <Input
                        id="layout-y"
                        type="number"
                        value={layoutProps.y}
                        onChange={(e) => handleLayoutChange('y', Number(e.target.value))}
                        className="h-8 text-xs"
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="layout-w" className="text-xs">Width</Label>
                      <Input
                        id="layout-w"
                        type="number"
                        value={layoutProps.w}
                        onChange={(e) => handleLayoutChange('w', Number(e.target.value))}
                        className="h-8 text-xs"
                        min={layoutProps.minW}
                        max={layoutProps.maxW}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="layout-h" className="text-xs">Height</Label>
                      <Input
                        id="layout-h"
                        type="number"
                        value={layoutProps.h}
                        onChange={(e) => handleLayoutChange('h', Number(e.target.value))}
                        className="h-8 text-xs"
                        min={layoutProps.minH}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t space-y-2">
                    <Label className="text-xs font-semibold">Constraints</Label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="layout-minW" className="text-xs">Min Width</Label>
                        <Input
                          id="layout-minW"
                          type="number"
                          value={layoutProps.minW}
                          onChange={(e) => handleLayoutChange('minW', Number(e.target.value))}
                          className="h-8 text-xs"
                          min={1}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="layout-maxW" className="text-xs">Max Width</Label>
                        <Input
                          id="layout-maxW"
                          type="number"
                          value={layoutProps.maxW}
                          onChange={(e) => handleLayoutChange('maxW', Number(e.target.value))}
                          className="h-8 text-xs"
                          min={layoutProps.minW}
                          max={12}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="layout-minH" className="text-xs">Min Height</Label>
                        <Input
                          id="layout-minH"
                          type="number"
                          value={layoutProps.minH}
                          onChange={(e) => handleLayoutChange('minH', Number(e.target.value))}
                          className="h-8 text-xs"
                          min={1}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="layout-maxH" className="text-xs">Max Height</Label>
                        <Input
                          id="layout-maxH"
                          type="number"
                          value={layoutProps.maxH ?? ''}
                          onChange={(e) => handleLayoutChange('maxH', e.target.value ? Number(e.target.value) : undefined)}
                          className="h-8 text-xs"
                          min={layoutProps.minH}
                          placeholder="Unlimited"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Select an element to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}


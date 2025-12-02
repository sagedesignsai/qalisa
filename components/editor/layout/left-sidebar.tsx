/**
 * Left Sidebar
 * Component palette, Global Variables, App Context
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PanelLeftClose } from 'lucide-react';
import { ComponentPalette } from '../left-sidebar/component-palette';
import { LayersPanel } from '../left-sidebar/layers-panel';

export function LeftSidebar() {
  const { panels, toggleLeftSidebar, setLeftSidebarTab } = useEditorUIStore();

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header - Compact */}
      <div className="flex h-10 items-center justify-between border-b border-border px-3">
        <h2 className="text-xs font-semibold">Elements</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLeftSidebar}
          className="h-7 w-7"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={panels.leftSidebar.activeTab}
          onValueChange={(value) => setLeftSidebarTab(value as 'build' | 'connect' | 'layers')}
          className="flex h-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="flex-1 overflow-hidden p-0">
            <ComponentPalette />
          </TabsContent>

          <TabsContent value="layers" className="flex-1 overflow-hidden p-0">
            <LayersPanel />
          </TabsContent>

          <TabsContent value="connect" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Global Variables and App Context will go here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


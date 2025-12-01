/**
 * Left Sidebar
 * Component palette, Global Variables, App Context
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function LeftSidebar() {
  const { panels, toggleLeftSidebar, setLeftSidebarTab } = useEditorUIStore();

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Elements</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLeftSidebar}
          className="h-8 w-8"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={panels.leftSidebar.activeTab}
          onValueChange={(value) => setLeftSidebarTab(value as 'build' | 'connect')}
          className="flex h-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Component palette will go here
              </p>
            </div>
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


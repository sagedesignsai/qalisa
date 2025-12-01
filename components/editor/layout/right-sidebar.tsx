/**
 * Right Sidebar
 * Property panel with Visibility, Padding/Alignment, Loops, Conditionals, Props
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { usePropertyPanelStore } from '@/lib/editor/state/use-property-panel-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PanelRightClose } from 'lucide-react';

export function RightSidebar() {
  const { panels, toggleRightSidebar, setRightSidebarTab } = useEditorUIStore();
  const { selectedElementId, activeTab, setActiveTab } = usePropertyPanelStore();

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">
          {selectedElementId ? 'Properties' : 'No Selection'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightSidebar}
          className="h-8 w-8"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Content */}
      {selectedElementId ? (
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="flex h-full flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Property sections will go here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Settings will go here
                </p>
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


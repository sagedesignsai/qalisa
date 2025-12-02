/**
 * Editor Layout
 * Main three-panel layout for the page builder editor using resizable panels
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { LeftSidebar } from './left-sidebar';
import { GridCanvasArea } from './grid-canvas-area';
import { RightSidebar } from './right-sidebar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export function EditorLayout() {
  const { panels, setPanelWidth } = useEditorUIStore();

  // Panel size constraints as percentages - smaller to prioritize canvas
  const leftSidebarMin = 10; // 10% minimum (~200px on 1920px screen)
  const leftSidebarMax = 18; // 18% maximum (~350px on 1920px screen)
  const rightSidebarMin = 12; // 12% minimum (~240px on 1920px screen)
  const rightSidebarMax = 20; // 20% maximum (~400px on 1920px screen)

  // Calculate default sizes as percentages - prioritize canvas space
  const getDefaultSizes = () => {
    if (!panels.leftSidebar.open && !panels.rightSidebar.open) {
      return { left: 0, canvas: 100, right: 0 };
    }
    if (!panels.leftSidebar.open) {
      return { left: 0, canvas: 85, right: 15 }; // 15% right, 85% canvas
    }
    if (!panels.rightSidebar.open) {
      return { left: 15, canvas: 85, right: 0 }; // 15% left, 85% canvas
    }
    // Both open: maximize canvas space
    return { left: 14, canvas: 72, right: 14 }; // 14% each, 72% canvas (prioritized)
  };

  const defaultSizes = getDefaultSizes();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full bg-background">
      {/* Left Sidebar - Always render but collapse when closed */}
      <ResizablePanel
        minSize={panels.leftSidebar.open ? leftSidebarMin : 0}
        maxSize={panels.leftSidebar.open ? leftSidebarMax : 0}
        defaultSize={panels.leftSidebar.open ? defaultSizes.left : 0}
        collapsedSize={0}
        collapsible
        className="border-r border-border bg-muted/30 flex flex-col"
        onResize={(size) => {
          if (panels.leftSidebar.open && typeof size === "number" && size > 0) {
            const pixelWidth = Math.round((size / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920));
            setPanelWidth('leftSidebar', pixelWidth);
          }
        }}
      >
        {panels.leftSidebar.open && <LeftSidebar />}
      </ResizablePanel>

      {/* Handle - only show when both panels are open */}
      {panels.leftSidebar.open && <ResizableHandle withHandle />}

      {/* Center: Canvas Area - Takes remaining space, prioritized */}
      <ResizablePanel
        defaultSize={defaultSizes.canvas}
        minSize={50} // Minimum 50% ensures canvas is always the largest
        className="flex flex-col overflow-hidden"
      >
        <GridCanvasArea />
      </ResizablePanel>

      {/* Handle - only show when both panels are open */}
      {panels.rightSidebar.open && <ResizableHandle withHandle />}

      {/* Right Sidebar - Always render but collapse when closed */}
      <ResizablePanel
        minSize={panels.rightSidebar.open ? rightSidebarMin : 0}
        maxSize={panels.rightSidebar.open ? rightSidebarMax : 0}
        defaultSize={panels.rightSidebar.open ? defaultSizes.right : 0}
        collapsedSize={0}
        collapsible
        className="border-l border-border bg-muted/30 flex flex-col"
        onResize={(size) => {
          if (panels.rightSidebar.open && typeof size === "number" && size > 0) {
            const pixelWidth = Math.round((size / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920));
            setPanelWidth('rightSidebar', pixelWidth);
          }
        }}
      >
        {panels.rightSidebar.open && <RightSidebar />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


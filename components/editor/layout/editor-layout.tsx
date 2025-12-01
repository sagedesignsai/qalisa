/**
 * Editor Layout
 * Main three-panel layout for the page builder editor
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { LeftSidebar } from './left-sidebar';
import { CanvasArea } from './canvas-area';
import { RightSidebar } from './right-sidebar';

export function EditorLayout() {
  const { panels } = useEditorUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      {panels.leftSidebar.open && (
        <div
          className="border-r border-border bg-muted/30"
          style={{ width: `${panels.leftSidebar.width}px` }}
        >
          <LeftSidebar />
        </div>
      )}

      {/* Center Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CanvasArea />
      </div>

      {/* Right Sidebar */}
      {panels.rightSidebar.open && (
        <div
          className="border-l border-border bg-muted/30"
          style={{ width: `${panels.rightSidebar.width}px` }}
        >
          <RightSidebar />
        </div>
      )}
    </div>
  );
}


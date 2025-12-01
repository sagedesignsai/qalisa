/**
 * Canvas Area
 * Main visual editing area with zoom, viewport controls, breadcrumb navigation
 * Now integrated with Craft.js Frame
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { useEditor } from '@craftjs/core';
import { Frame, Element } from '@craftjs/core';
import { Container } from '@/components/craft/container';
import { useEditorProjectStore } from '@/lib/editor/state/use-editor-project-store';
import { Breadcrumb } from '../canvas/breadcrumb';
import { CanvasToolbar } from '../canvas/canvas-toolbar';
import { useEffect } from 'react';

export function CanvasArea() {
  const { canvas, selection, setSelectedNode } = useEditorUIStore();
  const { craftJson } = useEditorProjectStore();
  const { selected } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  // Sync Craft.js selection with our store
  useEffect(() => {
    if (selected) {
      const selectedNodeId = Array.from(selected)[0] || null;
      setSelectedNode(selectedNodeId, []);
    } else {
      setSelectedNode(null, []);
    }
  }, [selected, setSelectedNode]);

  return (
    <div className="flex h-full flex-col">
      {/* Canvas Toolbar */}
      <div className="border-b border-border">
        <CanvasToolbar />
      </div>

      {/* Breadcrumb Navigation */}
      {selection.selectedNodeId && (
        <div className="border-b border-border px-4 py-2">
          <Breadcrumb />
        </div>
      )}

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto bg-muted/20 p-8">
        <div
          className="mx-auto bg-background shadow-lg"
          style={{
            width: `${canvas.viewportSize.width}px`,
            height: `${canvas.viewportSize.height}px`,
            transform: `scale(${canvas.zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="h-full w-full border border-border">
            {/* Craft.js Frame - wraps the editable content */}
            <Frame
              data={craftJson ? (typeof craftJson === 'string' ? JSON.parse(craftJson) : craftJson) : undefined}
            >
              <Element canvas is={Container} padding={20}>
                {/* Initial empty container - users can add components here */}
              </Element>
            </Frame>
          </div>
        </div>
      </div>
    </div>
  );
}


/**
 * Grid Canvas Area
 * Main visual editing area using React Grid Layout
 * Replaces CanvasArea with Frame
 */

'use client';

import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useGridEditor } from '@/lib/editor/context/grid-editor-context';
import { useGridStore } from '@/lib/editor/state/use-grid-store';
import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { Breadcrumb } from '../canvas/breadcrumb';
import { CanvasToolbar } from '../canvas/canvas-toolbar';
import { GridComponentWrapper } from '../grid/grid-component-wrapper';
import { GridDropZone } from '../grid/grid-drop-zone';
import { useEffect, useCallback, useState } from 'react';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function GridCanvasArea() {
  const { layout, config, actions } = useGridEditor();
  const { selection, setSelectedNode } = useEditorUIStore();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const draggingId = useGridStore((state) => state.draggingId);
  const resizingId = useGridStore((state) => state.resizingId);

  // Sync grid selection with UI store
  useEffect(() => {
    const selectedIds = Array.from(useGridStore.getState().selectedIds);
    if (selectedIds.length > 0) {
      setSelectedNode(selectedIds[0], []);
    } else {
      setSelectedNode(null, []);
    }
  }, [layout, setSelectedNode]);

  // Handle layout change from React Grid Layout
  const handleLayoutChange = useCallback(
    (currentLayout: any[], allLayouts: any) => {
      actions.handleLayoutChange(currentLayout, allLayouts);
    },
    [actions]
  );

  // Handle drag start
  const handleDragStart = useCallback((layout: any[], oldItem: any, newItem: any, placeholder: any, e: MouseEvent, element: HTMLElement) => {
    useGridStore.setState({ draggingId: newItem.i });
  }, []);

  // Handle drag stop
  const handleDragStop = useCallback((layout: any[], oldItem: any, newItem: any, placeholder: any, e: MouseEvent, element: HTMLElement) => {
    useGridStore.setState({ draggingId: null });
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((layout: any[], oldItem: any, newItem: any, placeholder: any, e: MouseEvent, element: HTMLElement) => {
    useGridStore.setState({ resizingId: newItem.i });
  }, []);

  // Handle resize stop
  const handleResizeStop = useCallback((layout: any[], oldItem: any, newItem: any, placeholder: any, e: MouseEvent, element: HTMLElement) => {
    useGridStore.setState({ resizingId: null });
  }, []);

  return (
    <div className="flex h-full flex-col relative">
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

      {/* Grid Canvas Viewport */}
      <div
        className={`flex-1 overflow-auto bg-muted/20 p-8 relative ${
          isDraggingOver ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      >
        <div className="min-h-full flex items-start justify-center">
          <GridDropZone
            onDragEnter={() => setIsDraggingOver(true)}
            onDragLeave={() => setIsDraggingOver(false)}
          >
            <ResponsiveGridLayout
              className="layout"
              layouts={useGridStore.getState().layouts}
              breakpoints={config.breakpoints}
              cols={config.colsByBreakpoint}
              rowHeight={config.rowHeight}
              margin={config.margin}
              containerPadding={config.containerPadding}
              isDraggable={config.isDraggable}
              isResizable={config.isResizable}
              preventCollision={config.preventCollision}
              compactType={config.compactType}
              onLayoutChange={handleLayoutChange}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
              draggableHandle=".grid-drag-handle"
              resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 's', 'n']}
            >
              {layout.map((item) => (
                <div key={item.i} className="grid-item-wrapper">
                  <GridComponentWrapper
                    componentId={item.componentId}
                    layoutItem={item}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          </GridDropZone>
        </div>
      </div>
    </div>
  );
}


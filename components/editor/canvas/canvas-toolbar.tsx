/**
 * Canvas Toolbar
 * Zoom controls, viewport size selector
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZoomIn, ZoomOut, Grid, Eye } from 'lucide-react';

const VIEWPORT_SIZES = [
  { width: 1440, height: 900, label: 'Desktop (1440x900)' },
  { width: 768, height: 1024, label: 'Tablet (768x1024)' },
  { width: 375, height: 667, label: 'Mobile (375x667)' },
];

export function CanvasToolbar() {
  const {
    canvas,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setViewportSize,
    toggleGrid,
    toggleGuides,
  } = useEditorUIStore();

  const currentViewportLabel = VIEWPORT_SIZES.find(
    (size) =>
      size.width === canvas.viewportSize.width &&
      size.height === canvas.viewportSize.height
  )?.label || canvas.viewportSize.label;

  return (
    <div className="flex h-12 items-center justify-between px-4">
      {/* Left side - Viewport selector */}
      <div className="flex items-center gap-2">
        <Select
          value={currentViewportLabel}
          onValueChange={(value) => {
            const size = VIEWPORT_SIZES.find((s) => s.label === value);
            if (size) {
              setViewportSize({
                width: size.width,
                height: size.height,
                label: size.label,
              });
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VIEWPORT_SIZES.map((size) => (
              <SelectItem key={size.label} value={size.label}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Zoom controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleGrid}
          className="h-8 w-8"
          title="Toggle Grid"
        >
          <Grid className={`h-4 w-4 ${canvas.showGrid ? 'text-primary' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleGuides}
          className="h-8 w-8"
          title="Toggle Guides"
        >
          <Eye className={`h-4 w-4 ${canvas.showGuides ? 'text-primary' : ''}`} />
        </Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomOut}
          className="h-8 w-8"
          disabled={canvas.zoom <= 0.1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center text-sm text-muted-foreground">
          {Math.round(canvas.zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomIn}
          className="h-8 w-8"
          disabled={canvas.zoom >= 2.0}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetZoom}
          className="h-8 px-2 text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}


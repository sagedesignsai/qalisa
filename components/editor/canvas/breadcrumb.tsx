/**
 * Breadcrumb Navigation
 * Shows the selected element path
 */

'use client';

import { useEditorUIStore } from '@/lib/editor/state/use-editor-ui-store';
import {
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumb() {
  const { selection } = useEditorUIStore();

  if (selection.selectedNodePath.length === 0) {
    return null;
  }

  return (
    <BreadcrumbPrimitive>
      <BreadcrumbList>
        {selection.selectedNodePath.map((path, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm">{path}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
}


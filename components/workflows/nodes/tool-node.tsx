'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from '@/components/ai-elements/node';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

export type ToolNodeData = {
  label: string;
  description?: string;
  name?: string;
  toolType?: string;
  parameters?: Record<string, unknown>;
};

export type ToolNodeType = {
  id: string;
  type: 'tool';
  data: ToolNodeData;
};

export const ToolNode = memo(({ data, selected }: NodeProps<ToolNodeType>) => {
  return (
    <Node handles={{ target: true, source: true }}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <Wrench className="size-4" />
          <NodeTitle>{data.label || 'Tool'}</NodeTitle>
        </div>
        {data.description && (
          <NodeDescription>{data.description}</NodeDescription>
        )}
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2 text-sm">
          {data.name && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name:</span>
              <Badge variant="outline">{data.name}</Badge>
            </div>
          )}
          {data.toolType && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge>{data.toolType}</Badge>
            </div>
          )}
          {data.parameters && Object.keys(data.parameters).length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Parameters:</span>
              <span>{Object.keys(data.parameters).length}</span>
            </div>
          )}
        </div>
      </NodeContent>
    </Node>
  );
});

ToolNode.displayName = 'ToolNode';


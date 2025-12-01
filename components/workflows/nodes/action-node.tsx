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
import { Zap } from 'lucide-react';

export type ActionNodeData = {
  label: string;
  description?: string;
  actionType?: string;
  config?: Record<string, unknown>;
};

export type ActionNodeType = {
  id: string;
  type: 'action';
  data: ActionNodeData;
};

export const ActionNode = memo(({ data, selected }: NodeProps<ActionNodeType>) => {
  return (
    <Node handles={{ target: true, source: true }}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <Zap className="size-4" />
          <NodeTitle>{data.label || 'Action'}</NodeTitle>
        </div>
        {data.description && (
          <NodeDescription>{data.description}</NodeDescription>
        )}
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2 text-sm">
          {data.actionType && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge>{data.actionType}</Badge>
            </div>
          )}
          {data.config && Object.keys(data.config).length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Config:</span>
              <span>{Object.keys(data.config).length} items</span>
            </div>
          )}
        </div>
      </NodeContent>
    </Node>
  );
});

ActionNode.displayName = 'ActionNode';


'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeHeader,
  NodeTitle,
} from '@/components/ai-elements/node';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

export type ConditionNodeData = {
  label: string;
  description?: string;
  condition?: string;
  trueLabel?: string;
  falseLabel?: string;
};

export type ConditionNodeType = {
  id: string;
  type: 'condition';
  data: ConditionNodeData;
};

export const ConditionNode = memo(
  ({ data, selected }: NodeProps<ConditionNodeType>) => {
    return (
      <Node handles={{ target: true, source: true }}>
        <NodeHeader>
          <div className="flex items-center gap-2">
            <GitBranch className="size-4" />
            <NodeTitle>{data.label || 'Condition'}</NodeTitle>
          </div>
          {data.description && (
            <NodeDescription>{data.description}</NodeDescription>
          )}
        </NodeHeader>
        <NodeContent>
          <div className="space-y-2 text-sm">
            {data.condition && (
              <div className="rounded-md bg-muted p-2 font-mono text-xs">
                {data.condition}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Handle
                type="source"
                position={Position.Right}
                id="true"
                className="!bg-green-500"
              />
              <span className="text-xs text-muted-foreground">
                {data.trueLabel || 'True'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Handle
                type="source"
                position={Position.Right}
                id="false"
                className="!bg-red-500"
              />
              <span className="text-xs text-muted-foreground">
                {data.falseLabel || 'False'}
              </span>
            </div>
          </div>
        </NodeContent>
      </Node>
    );
  },
);

ConditionNode.displayName = 'ConditionNode';


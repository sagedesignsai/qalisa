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
import { Bot } from 'lucide-react';

export type AgentNodeData = {
  label: string;
  description?: string;
  model?: string;
  system?: string;
  maxSteps?: number;
  temperature?: number;
};

export type AgentNodeType = {
  id: string;
  type: 'agent';
  data: AgentNodeData;
};

export const AgentNode = memo(({ data, selected }: NodeProps<AgentNodeType>) => {
  return (
    <Node handles={{ target: true, source: true }}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <Bot className="size-4" />
          <NodeTitle>{data.label || 'Agent'}</NodeTitle>
        </div>
        {data.description && (
          <NodeDescription>{data.description}</NodeDescription>
        )}
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2 text-sm">
          {data.model && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Model:</span>
              <Badge variant="outline">{data.model}</Badge>
            </div>
          )}
          {data.maxSteps && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Max Steps:</span>
              <span>{data.maxSteps}</span>
            </div>
          )}
          {data.temperature !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temperature:</span>
              <span>{data.temperature}</span>
            </div>
          )}
        </div>
      </NodeContent>
      {data.system && (
        <NodeFooter>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.system}
          </p>
        </NodeFooter>
      )}
    </Node>
  );
});

AgentNode.displayName = 'AgentNode';


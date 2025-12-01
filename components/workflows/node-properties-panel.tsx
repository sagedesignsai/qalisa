'use client';

import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type {
  AgentNodeData,
  ToolNodeData,
  ConditionNodeData,
  ActionNodeData,
} from './nodes';

interface NodePropertiesPanelProps {
  node: Node | null;
  onClose?: () => void;
}

export function NodePropertiesPanel({ node, onClose }: NodePropertiesPanelProps) {
  const { updateNodeData } = useReactFlow();

  const updateData = useCallback(
    (updates: Record<string, unknown>) => {
      if (!node) return;
      updateNodeData(node.id, (data) => ({
        ...data,
        ...updates,
      }));
    },
    [node, updateNodeData],
  );

  if (!node) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Select a node to edit its properties</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Node Properties</CardTitle>
        <CardDescription>{node.type || 'default'} node</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common properties */}
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={(node.data as { label?: string }).label || ''}
            onChange={(e) => updateData({ label: e.target.value })}
            placeholder="Node label"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={(node.data as { description?: string }).description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Node description"
            rows={3}
          />
        </div>

        {/* Agent node specific */}
        {node.type === 'agent' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={(node.data as AgentNodeData).model || 'gemini-2.5-flash'}
                onValueChange={(value) => updateData({ model: value })}
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system">System Prompt</Label>
              <Textarea
                id="system"
                value={(node.data as AgentNodeData).system || ''}
                onChange={(e) => updateData({ system: e.target.value })}
                placeholder="System prompt for the agent"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSteps">
                Max Steps: {(node.data as AgentNodeData).maxSteps || 10}
              </Label>
              <Slider
                id="maxSteps"
                value={[(node.data as AgentNodeData).maxSteps || 10]}
                onValueChange={([value]) => updateData({ maxSteps: value })}
                min={1}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">
                Temperature: {(node.data as AgentNodeData).temperature ?? 0.7}
              </Label>
              <Slider
                id="temperature"
                value={[(node.data as AgentNodeData).temperature ?? 0.7]}
                onValueChange={([value]) => updateData({ temperature: value })}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </>
        )}

        {/* Tool node specific */}
        {node.type === 'tool' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="toolName">Tool Name</Label>
              <Input
                id="toolName"
                value={(node.data as ToolNodeData).name || ''}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="tool_name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toolType">Tool Type</Label>
              <Select
                value={(node.data as ToolNodeData).toolType || ''}
                onValueChange={(value) => updateData({ toolType: value })}
              >
                <SelectTrigger id="toolType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="function">Function</SelectItem>
                  <SelectItem value="api">API Call</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Condition node specific */}
        {node.type === 'condition' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Textarea
                id="condition"
                value={(node.data as ConditionNodeData).condition || ''}
                onChange={(e) => updateData({ condition: e.target.value })}
                placeholder="e.g., data.status === 'success'"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trueLabel">True Label</Label>
              <Input
                id="trueLabel"
                value={(node.data as ConditionNodeData).trueLabel || 'True'}
                onChange={(e) => updateData({ trueLabel: e.target.value })}
                placeholder="True"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="falseLabel">False Label</Label>
              <Input
                id="falseLabel"
                value={(node.data as ConditionNodeData).falseLabel || 'False'}
                onChange={(e) => updateData({ falseLabel: e.target.value })}
                placeholder="False"
              />
            </div>
          </>
        )}

        {/* Action node specific */}
        {node.type === 'action' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={(node.data as ActionNodeData).actionType || ''}
                onValueChange={(value) => updateData({ actionType: value })}
              >
                <SelectTrigger id="actionType">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send-email">Send Email</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}


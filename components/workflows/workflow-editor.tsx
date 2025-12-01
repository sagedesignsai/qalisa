'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import { Canvas } from '@/components/ai-elements/canvas';
import { Connection as ConnectionComponent } from '@/components/ai-elements/connection';
import { Controls } from '@/components/ai-elements/controls';
import { Edge as EdgeComponent } from '@/components/ai-elements/edge';
import { Panel } from '@/components/ai-elements/panel';
import { useWorkflow } from '@/hooks/use-workflow';
import { NodePropertiesPanel } from './node-properties-panel';
import {
  AgentNode,
  ToolNode,
  ConditionNode,
  ActionNode,
} from './nodes';
import { WorkflowToolbar } from './workflow-toolbar';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { useReactFlow } from '@xyflow/react';

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  condition: ConditionNode,
  action: ActionNode,
};

const edgeTypes = {
  animated: EdgeComponent.Animated,
  temporary: EdgeComponent.Temporary,
};

interface WorkflowEditorProps {
  workflowId: string;
}

function WorkflowEditorInner({ workflowId }: WorkflowEditorProps) {
  const { workflow, updateGraph } = useWorkflow(workflowId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Load workflow data
  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    }
  }, [workflow]);

  // Auto-save with debounce
  const debouncedSave = useDebouncedCallback(
    async (nodesToSave: Node[], edgesToSave: Edge[]) => {
      if (!workflowId) return;
      setIsSaving(true);
      try {
        await updateGraph(nodesToSave, edgesToSave);
      } catch (error) {
        console.error('Failed to save workflow:', error);
      } finally {
        setIsSaving(false);
      }
    },
    1000,
  );

  // Save on changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      debouncedSave(nodes, edges);
    }
  }, [nodes, edges, debouncedSave]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, type: 'animated' }, eds));
    },
    [setEdges],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const nodePosition = position || screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position: nodePosition,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition],
  );

  const deleteSelectedNodes = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
        ),
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  if (!workflow) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={ConnectionComponent}
          fitView
        >
          <Controls />
          <Panel position="top-left">
            <WorkflowToolbar
              onAddNode={addNode}
              onDelete={deleteSelectedNodes}
              canDelete={!!selectedNode}
              isSaving={isSaving}
            />
          </Panel>
        </Canvas>
      </div>

      {/* Properties Panel */}
      <div className="border-l bg-background p-4">
        <NodePropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner workflowId={workflowId} />
    </ReactFlowProvider>
  );
}


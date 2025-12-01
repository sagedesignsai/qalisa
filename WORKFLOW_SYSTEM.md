# Workflow System Documentation

A complete, reusable workflow system for building AI agent applications with visual node-based editing, database persistence, and execution capabilities.

## Overview

The workflow system provides:
- **Visual Workflow Editor**: Drag-and-drop node-based interface using React Flow
- **Database Persistence**: Full CRUD operations with Prisma
- **Agent Building**: Specialized node types for building AI agents
- **Execution Engine**: API endpoint for executing workflows as agents
- **Modular Architecture**: Reusable components and hooks

## Architecture

### Database Schema

- **Workflow**: Main workflow entity with metadata
- **WorkflowNode**: Individual nodes in the workflow graph
- **WorkflowEdge**: Connections between nodes

### API Routes

- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/[id]` - Get workflow with graph
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete/archive workflow
- `PUT /api/workflows/[id]/graph` - Update workflow graph (nodes/edges)
- `POST /api/workflows/[id]/execute` - Execute workflow as agent

### Components

#### Core Components

- **WorkflowEditor** (`components/workflows/workflow-editor.tsx`)
  - Main editor component with canvas integration
  - Auto-saves changes with debouncing
  - Manages node/edge state

- **NodePropertiesPanel** (`components/workflows/node-properties-panel.tsx`)
  - Side panel for editing node properties
  - Type-specific property editors

- **WorkflowToolbar** (`components/workflows/workflow-toolbar.tsx`)
  - Toolbar for adding nodes and actions
  - Shows save status

- **WorkflowsList** (`components/workflows/workflows-list.tsx`)
  - List view of all workflows
  - Create/delete workflows

#### Node Types

- **AgentNode** - Configure agent settings (model, system prompt, max steps)
- **ToolNode** - Add tools to the agent
- **ConditionNode** - Conditional branching logic
- **ActionNode** - Execute actions

### Hooks

- **useWorkflow** (`hooks/use-workflow.ts`)
  - Fetch and manage a single workflow
  - Update workflow and graph
  - Execute workflow

- **useWorkflows** (`hooks/use-workflows.ts`)
  - List all workflows
  - Create/delete workflows

- **useDebounce** (`hooks/use-debounce.ts`)
  - Debounce callbacks for auto-save

## Usage

### Creating a Workflow

```tsx
import { useWorkflows } from '@/hooks/use-workflows';

function MyComponent() {
  const { createWorkflow } = useWorkflows();
  
  const handleCreate = async () => {
    await createWorkflow({
      name: 'My Agent',
      description: 'A helpful agent',
      type: 'AGENT',
    });
  };
}
```

### Editing a Workflow

```tsx
import { WorkflowEditor } from '@/components/workflows/workflow-editor';

function WorkflowPage({ workflowId }: { workflowId: string }) {
  return <WorkflowEditor workflowId={workflowId} />;
}
```

### Executing a Workflow

```tsx
import { useWorkflow } from '@/hooks/use-workflow';

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const { executeWorkflow } = useWorkflow(workflowId);
  
  const handleExecute = async () => {
    const result = await executeWorkflow('What is the weather?');
    console.log(result.text);
  };
}
```

## Node Types

### Agent Node

Configures the main agent:
- Model selection (Gemini 2.5 Flash/Pro)
- System prompt
- Max steps
- Temperature

### Tool Node

Adds tools to the agent:
- Tool name
- Tool type (function, API, database, custom)
- Parameters schema

### Condition Node

Adds conditional logic:
- Condition expression
- True/false labels
- Multiple output handles

### Action Node

Executes actions:
- Action type (email, webhook, database, etc.)
- Configuration

## Setup

1. **Run Database Migration**

```bash
pnpm prisma generate
pnpm prisma migrate dev --name add_workflow_system
```

2. **Access the Workflow Editor**

Navigate to `/workflows` to see the list of workflows, or `/workflows/[id]` to edit a specific workflow.

## Features

- ✅ Visual node-based editor
- ✅ Auto-save with debouncing
- ✅ Database persistence
- ✅ Multiple node types
- ✅ Property editing panel
- ✅ Workflow execution
- ✅ Agent building capabilities
- ✅ Type-safe with TypeScript
- ✅ Responsive UI

## Example: Building an Agent

1. Create a new workflow of type "AGENT"
2. Add an Agent node and configure:
   - Model: Gemini 2.5 Flash
   - System prompt: "You are a helpful assistant"
   - Max steps: 10
3. Add Tool nodes for capabilities
4. Connect nodes with edges
5. Save and execute

## Future Enhancements

- [ ] More node types (data processing, API calls)
- [ ] Workflow templates
- [ ] Version control for workflows
- [ ] Workflow sharing
- [ ] Execution history
- [ ] Workflow analytics
- [ ] Import/export workflows


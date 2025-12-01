import { auth } from '@/lib/auth';
import { getWorkflowById } from '@/lib/workflows/db';
import { Experimental_Agent as Agent, stepCountIs } from 'ai';
import { createModel } from '@/lib/ai/config';
import { z } from 'zod';

// Allow execution up to 60 seconds
export const maxDuration = 60;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;
    const body = await req.json();
    const { input, context } = body;

    // Get workflow
    const workflow = await getWorkflowById(id, userId);
    if (!workflow) {
      return Response.json({ error: 'Workflow not found' }, { status: 404 });
    }

    if (workflow.status !== 'ACTIVE' && workflow.status !== 'DRAFT') {
      return Response.json(
        { error: 'Workflow is not active' },
        { status: 400 },
      );
    }

    // Build agent from workflow nodes
    const agentConfig = buildAgentFromWorkflow(workflow);

    // Create agent
    const agent = new Agent({
      model: createModel(agentConfig.model || 'gemini-2.5-flash'),
      system: agentConfig.system || 'You are a helpful assistant.',
      tools: agentConfig.tools || {},
      stopWhen: stepCountIs(agentConfig.maxSteps || 10),
    });

    // Execute agent
    const result = await agent.generate({
      prompt: input || 'Execute the workflow',
    });

    return Response.json({
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Execute workflow error:', error);
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Build agent configuration from workflow nodes
 */
function buildAgentFromWorkflow(workflow: {
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
  }>;
  config: Record<string, unknown> | null;
}) {
  const config: {
    model?: string;
    system?: string;
    tools?: Record<string, unknown>;
    maxSteps?: number;
  } = {
    model: workflow.config?.model as string | undefined,
    system: workflow.config?.system as string | undefined,
    maxSteps: (workflow.config?.maxSteps as number) || 10,
    tools: {},
  };

  // Process nodes to build tools
  for (const node of workflow.nodes) {
    if (node.type === 'agent') {
      // Agent node configuration
      if (node.data.model) {
        config.model = node.data.model as string;
      }
      if (node.data.system) {
        config.system = node.data.system as string;
      }
      if (node.data.maxSteps) {
        config.maxSteps = node.data.maxSteps as number;
      }
    } else if (node.type === 'tool') {
      // Tool node - create tool definition
      const toolName = (node.data.name as string) || `tool_${node.id}`;
      const toolDescription = (node.data.description as string) || '';
      const toolSchema = node.data.schema as Record<string, unknown> | undefined;

      if (toolSchema) {
        config.tools![toolName] = {
          description: toolDescription,
          parameters: z.object(
            Object.fromEntries(
              Object.entries(toolSchema).map(([key, value]) => [
                key,
                z.any(), // Simplified - in production, properly parse schema
              ]),
            ),
          ),
          execute: async (params: Record<string, unknown>) => {
            // Execute tool logic
            // In production, this would call the actual tool implementation
            return {
              result: `Tool ${toolName} executed with params: ${JSON.stringify(params)}`,
            };
          },
        };
      }
    }
  }

  return config;
}


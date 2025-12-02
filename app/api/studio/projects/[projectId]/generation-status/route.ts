import { auth } from '@/lib/auth';
import { getProjectById } from '@/lib/studio/services/project-service';
import { NextResponse } from 'next/server';

export interface GenerationStatus {
  projectId: string;
  status: 'DRAFT' | 'GENERATING' | 'READY' | 'EXPORTING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0.0 to 1.0
  currentStep?: string;
  completedSteps?: string[];
  error?: string;
  agentVersion?: string;
}

/**
 * GET /api/studio/projects/[projectId]/generation-status
 * Get real-time generation status for a project
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await getProjectById(projectId, session.user.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Calculate progress based on status
    let progress = 0;
    let currentStep: string | undefined;
    const completedSteps: string[] = [];

    switch (project.status) {
      case 'DRAFT':
        progress = 0;
        currentStep = 'Waiting to start';
        break;
      case 'GENERATING':
        // Estimate progress based on metadata if available
        const metadata = project.metadata as Record<string, unknown> | null;
        if (metadata?.progress) {
          progress = metadata.progress as number;
        } else {
          progress = 0.5; // Default to 50% when generating
        }
        currentStep = (metadata?.currentStep as string) || 'Generating video';
        
        // Add completed steps from metadata
        if (metadata?.completedSteps && Array.isArray(metadata.completedSteps)) {
          completedSteps.push(...(metadata.completedSteps as string[]));
        }
        break;
      case 'READY':
        progress = 1.0;
        currentStep = 'Generation complete';
        completedSteps.push('Script generation', 'Media generation', 'Track alignment', 'Composition creation');
        break;
      case 'EXPORTING':
        progress = 0.9;
        currentStep = 'Exporting video';
        completedSteps.push('Script generation', 'Media generation', 'Track alignment', 'Composition creation');
        break;
      case 'COMPLETED':
        progress = 1.0;
        currentStep = 'Completed';
        completedSteps.push('Script generation', 'Media generation', 'Track alignment', 'Composition creation', 'Export');
        break;
      case 'FAILED':
        progress = 0;
        currentStep = 'Generation failed';
        break;
    }

    const status: GenerationStatus = {
      projectId: project.id,
      status: project.status,
      progress,
      currentStep,
      completedSteps: completedSteps.length > 0 ? completedSteps : undefined,
      error: project.status === 'FAILED' ? 'Generation failed. Please try again.' : undefined,
      agentVersion: (project as any).agentVersion || undefined,
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching generation status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


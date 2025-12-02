'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudioOverviewPanel } from './studio-overview-panel';
import { GenerationStatus } from './generation-status';
import { VideoEditor } from './video-editor/video-editor';
import type { StudioProject } from '@/lib/generated/prisma';

interface StudioPanelProps {
  chatId?: string;
  projectId?: string;
  onProjectSelect?: (projectId: string) => void;
}

export function StudioPanel({ chatId, projectId, onProjectSelect }: StudioPanelProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<StudioProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(!!projectId);

  useEffect(() => {
    if (projectId) {
      loadProject();
    } else {
      setSelectedProject(null);
      setLoading(false);
    }
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`/api/studio/projects/${projectId}`);
      if (response.ok) {
        const { project } = await response.json();
        setSelectedProject(project);
        onProjectSelect?.(project.id);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/studio/${projectId}`);
  };

  const handleCreateProject = async (type: string) => {
    try {
      // Map content item type to project type
      const projectTypeMap: Record<string, string> = {
        VIDEO_OVERVIEW: 'PRESENTATION_VIDEO',
        INFOGRAPHIC: 'INFOGRAPHIC',
        SLIDE_DECK: 'SLIDE_DECK',
        AUDIO_OVERVIEW: 'DOCUMENT',
        MIND_MAP: 'DOCUMENT',
        REPORT: 'DOCUMENT',
        FLASHCARDS: 'DOCUMENT',
        QUIZ: 'DOCUMENT',
      };

      const projectType = projectTypeMap[type] || 'DOCUMENT';

      const response = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          type: projectType,
          title: `New ${type.replace('_', ' ')} Project`,
        }),
      });

      if (response.ok) {
        const { project } = await response.json();
        
        // Create initial content item
        const contentItemResponse = await fetch(
          `/api/studio/projects/${project.id}/content-items`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type,
              title: `New ${type.replace('_', ' ')}`,
            }),
          }
        );

        if (contentItemResponse.ok) {
          handleProjectClick(project.id);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleGenerate = async (projectId: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/studio/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ includeMusic: false }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      // Refresh project
      const projectResponse = await fetch(`/api/studio/projects/${projectId}`);
      if (projectResponse.ok) {
        const { project } = await projectResponse.json();
        setSelectedProject(project);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Show overview panel when no project is selected
  if (!projectId || !selectedProject) {
    return (
      <StudioOverviewPanel
        chatId={chatId}
        onProjectClick={handleProjectClick}
        onCreateProject={handleCreateProject}
      />
    );
  }

  // Show project editor when project is selected
  return (
    <div className="flex flex-col h-full border-l bg-background">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Studio</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {selectedProject.status === 'GENERATING' && (
              <GenerationStatus projectId={selectedProject.id} />
            )}
            
            {selectedProject.status === 'READY' && selectedProject.type === 'PRESENTATION_VIDEO' && (
              <VideoEditor projectId={selectedProject.id} />
            )}

            {selectedProject.status === 'DRAFT' && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Project is ready to generate
                  </p>
                  <button
                    onClick={() => handleGenerate(selectedProject.id)}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Video'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


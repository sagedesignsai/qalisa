'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, VideoIcon, ImageIcon, FileTextIcon } from 'lucide-react';
import { ProjectSelector } from './project-selector';
import { VideoEditor } from './video-editor/video-editor';
import { GenerationStatus } from './generation-status';
import type { StudioProject } from '@/lib/generated/prisma';

interface StudioDashboardProps {
  userId: string;
}

export function StudioDashboard({ userId }: StudioDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<StudioProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/studio/projects');
      if (response.ok) {
        const { projects } = await response.json();
        setProjects(projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: StudioProject) => {
    setSelectedProject(project);
  };

  const handleCreateProject = async (type: 'PRESENTATION_VIDEO' | 'INFOGRAPHIC' | 'SLIDE_DECK' | 'DOCUMENT') => {
    try {
      const response = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: `New ${type.replace('_', ' ')} Project`,
        }),
      });

      if (response.ok) {
        const { project } = await response.json();
        setSelectedProject(project);
        loadProjects();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading studio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Studio</h1>
        <p className="text-muted-foreground">
          Create presentation videos, infographics, and interactive content from your chats
        </p>
      </div>

      {!selectedProject ? (
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCreateProject('PRESENTATION_VIDEO')}
              >
                <VideoIcon className="h-8 w-8" />
                <span>Presentation Video</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCreateProject('INFOGRAPHIC')}
              >
                <ImageIcon className="h-8 w-8" />
                <span>Infographic</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCreateProject('SLIDE_DECK')}
              >
                <FileTextIcon className="h-8 w-8" />
                <span>Slide Deck</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCreateProject('DOCUMENT')}
              >
                <FileTextIcon className="h-8 w-8" />
                <span>Document</span>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet</p>
                <p className="text-sm mt-2">Create a new project to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={`/dashboard/studio/${project.id}`}
                    className="text-left p-4 border rounded-lg hover:bg-muted transition-colors block"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {project.type === 'PRESENTATION_VIDEO' && <VideoIcon className="h-5 w-5" />}
                      {project.type === 'INFOGRAPHIC' && <ImageIcon className="h-5 w-5" />}
                      {(project.type === 'SLIDE_DECK' || project.type === 'DOCUMENT') && (
                        <FileTextIcon className="h-5 w-5" />
                      )}
                      <span className="font-medium">{project.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.type.replace('_', ' ')} • {project.status}
                    </div>
                    {project.description && (
                      <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {project.description}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col border rounded-lg">
          <div className="border-b p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selectedProject.title}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedProject.type.replace('_', ' ')} • {selectedProject.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
              >
                Back to Projects
              </Button>
              {selectedProject.status === 'DRAFT' && (
                <Button
                  onClick={() => handleGenerate(selectedProject.id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {selectedProject.status === 'GENERATING' && (
              <GenerationStatus projectId={selectedProject.id} />
            )}

            {selectedProject.status === 'READY' && selectedProject.type === 'PRESENTATION_VIDEO' && (
              <VideoEditor projectId={selectedProject.id} />
            )}

            {selectedProject.status === 'DRAFT' && (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Project is ready to generate
                  </p>
                  <Button
                    onClick={() => handleGenerate(selectedProject.id)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Video'}
                  </Button>
                </div>
              </div>
            )}

            {selectedProject.status === 'COMPLETED' && (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Project completed successfully
                  </p>
                  <Button
                    onClick={() => {
                      // Reload project to show editor
                      const projectResponse = fetch(`/api/studio/projects/${selectedProject.id}`);
                      projectResponse.then((res) => {
                        if (res.ok) {
                          res.json().then(({ project }) => {
                            setSelectedProject(project);
                          });
                        }
                      });
                    }}
                  >
                    Open Editor
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


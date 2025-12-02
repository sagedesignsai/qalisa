'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, VideoIcon } from 'lucide-react';
import type { StudioProject } from '@/lib/generated/prisma';

interface ProjectSelectorProps {
  chatId?: string;
  onProjectSelect: (project: StudioProject) => void;
}

export function ProjectSelector({ chatId, onProjectSelect }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

  const createProject = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          type: 'PRESENTATION_VIDEO',
          title: `Video from Chat ${new Date().toLocaleDateString()}`,
        }),
      });

      if (response.ok) {
        const { project } = await response.json();
        onProjectSelect(project);
        loadProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button
          onClick={createProject}
          disabled={creating}
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {creating ? 'Creating...' : 'Create New Video Project'}
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No projects yet</p>
          <p className="text-sm mt-2">Create a new project to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-2">Recent Projects</h3>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {project.type.replace('_', ' ')} • {project.status}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


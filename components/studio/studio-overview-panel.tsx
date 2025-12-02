'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AudioWaveformIcon,
  VideoIcon,
  NetworkIcon,
  FileTextIcon,
  LayersIcon,
  HelpCircleIcon,
  BarChartIcon,
  PresentationIcon,
  PencilIcon,
  PlusIcon,
  FileIcon,
  SquareStackIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { StudioProject } from '@/lib/generated/prisma/client';

interface StudioOverviewPanelProps {
  projectId?: string;
  chatId?: string;
  project?: StudioProject | null;
  showHeader?: boolean;
  onProjectClick?: (projectId: string) => void;
  onCreateContentItem?: (type: string) => void;
  onContentItemClick?: (itemId: string, type: string) => void;
}

interface StudioFeature {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  beta?: boolean;
  type: StudioProjectType;
}

type StudioProjectType =
  | 'PRESENTATION_VIDEO'
  | 'INFOGRAPHIC'
  | 'SLIDE_DECK'
  | 'DOCUMENT';

const STUDIO_FEATURES: StudioFeature[] = [
  {
    id: 'audio-overview',
    title: 'Audio Overview',
    icon: AudioWaveformIcon,
    type: 'DOCUMENT', // Using DOCUMENT as placeholder
  },
  {
    id: 'video-overview',
    title: 'Video Overview',
    icon: VideoIcon,
    type: 'PRESENTATION_VIDEO',
  },
  {
    id: 'mind-map',
    title: 'Mind Map',
    icon: NetworkIcon,
    type: 'DOCUMENT', // Using DOCUMENT as placeholder
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FileTextIcon,
    type: 'DOCUMENT',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    icon: LayersIcon,
    type: 'DOCUMENT', // Using DOCUMENT as placeholder
  },
  {
    id: 'quiz',
    title: 'Quiz',
    icon: HelpCircleIcon,
    type: 'DOCUMENT', // Using DOCUMENT as placeholder
  },
  {
    id: 'infographic',
    title: 'Infographic',
    icon: BarChartIcon,
    beta: true,
    type: 'INFOGRAPHIC',
  },
  {
    id: 'slide-deck',
    title: 'Slide Deck',
    icon: PresentationIcon,
    beta: true,
    type: 'SLIDE_DECK',
  },
];

const getProjectTypeIcon = (type: string) => {
  switch (type) {
    case 'PRESENTATION_VIDEO':
    case 'VIDEO_OVERVIEW':
      return VideoIcon;
    case 'INFOGRAPHIC':
      return BarChartIcon;
    case 'SLIDE_DECK':
      return PresentationIcon;
    case 'AUDIO_OVERVIEW':
      return AudioWaveformIcon;
    case 'MIND_MAP':
      return NetworkIcon;
    case 'REPORT':
      return FileTextIcon;
    case 'FLASHCARDS':
      return LayersIcon;
    case 'QUIZ':
      return HelpCircleIcon;
    case 'DOCUMENT':
      return FileTextIcon;
    default:
      return FileIcon;
  }
};

export function StudioOverviewPanel({
  projectId,
  chatId,
  project: projectProp,
  showHeader = true,
  onProjectClick,
  onCreateContentItem,
  onContentItemClick,
}: StudioOverviewPanelProps) {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [project, setProject] = useState<StudioProject | null>(projectProp || null);
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!projectId && !projectProp);

  useEffect(() => {
    if (projectProp) {
      setProject(projectProp);
      setContentItems((projectProp as any).contentItems || []);
      setLoading(false);
    } else if (projectId) {
      loadProject();
    } else {
      loadProjects();
    }
  }, [projectId, chatId, projectProp]);

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`/api/studio/projects/${projectId}`);
      if (response.ok) {
        const { project: projectData } = await response.json();
        setProject(projectData);
        setContentItems(projectData.contentItems || []);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const url = chatId
        ? `/api/studio/projects?chatId=${chatId}`
        : '/api/studio/projects';
      const response = await fetch(url);
      if (response.ok) {
        const { projects } = await response.json();
        setProjects(projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceCount = (project: StudioProject): number => {
    // Get source count from sources relation if available
    if ('sources' in project && Array.isArray(project.sources)) {
      return project.sources.length;
    }
    return 0;
  };

  const getContentTypes = (project: StudioProject): string[] => {
    // Get content types from contentItems relation if available
    if ('contentItems' in project && Array.isArray(project.contentItems)) {
      return project.contentItems.map((item: any) => item.type);
    }
    // Fallback to legacy type field
    if (project.type) {
      return [project.type];
    }
    return [];
  };

  const handleFeatureClick = async (feature: StudioFeature) => {
    if (projectId) {
      // Create new content item for existing project
      onCreateContentItem?.(feature.id);
    } else {
      // Create new project (legacy behavior)
      onCreateContentItem?.(feature.id);
    }
  };

  const handleProjectClick = (project: StudioProject) => {
    onProjectClick?.(project.id);
  };

  const handleContentItemClick = (item: any) => {
    onContentItemClick?.(item.id, item.type);
  };

  // Map feature IDs to content item types
  const getContentItemType = (featureId: string): string => {
    const typeMap: Record<string, string> = {
      'audio-overview': 'AUDIO_OVERVIEW',
      'video-overview': 'VIDEO_OVERVIEW',
      'mind-map': 'MIND_MAP',
      'reports': 'REPORT',
      'flashcards': 'FLASHCARDS',
      'quiz': 'QUIZ',
      'infographic': 'INFOGRAPHIC',
      'slide-deck': 'SLIDE_DECK',
    };
    return typeMap[featureId] || 'DOCUMENT';
  };

  const getContentItemIcon = (type: string) => {
    return getProjectTypeIcon(type);
  };

  // If projectId is provided, show content items for that project
  if (projectId) {
    const sourceCount = project ? getSourceCount(project) : 0;

    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header - only show if showHeader is true */}
        {showHeader && (
          <div className="border-b p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{project?.title || 'Studio'}</h2>
              {project && (
                <p className="text-sm text-muted-foreground">
                  {sourceCount} source{sourceCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <SquareStackIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Generated Content Items */}
          {loading ? (
            <div className="px-4 py-8">
              <p className="text-sm text-muted-foreground text-center">Loading content...</p>
            </div>
          ) : contentItems.length > 0 ? (
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Generated Content</h3>
              <div className="space-y-2">
                {contentItems.map((item) => {
                  const ItemIcon = getContentItemIcon(item.type);
                  const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  });

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleContentItemClick(item)}
                      className="w-full p-3 rounded-lg border bg-card hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <ItemIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="capitalize">{item.status.toLowerCase()}</span>
                            <span>•</span>
                            <span>{timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Feature Cards Grid - Create New Content */}
          <div className="px-4 pb-4 border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Generate New Content</h3>
            <div className="grid grid-cols-2 gap-3">
              {STUDIO_FEATURES.map((feature) => {
                const Icon = feature.icon;
                const contentItemType = getContentItemType(feature.id);
                const alreadyExists = contentItems.some((item) => item.type === contentItemType);

                return (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature)}
                    disabled={alreadyExists}
                    className="group relative p-4 rounded-lg border bg-card hover:bg-muted transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      {alreadyExists && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          Created
                        </span>
                      )}
                      {!alreadyExists && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeatureClick(feature);
                          }}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{feature.title}</span>
                      {feature.beta && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          BETA
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No projectId - show projects list (legacy behavior)
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Studio</h2>
        <Button variant="ghost" size="icon">
          <SquareStackIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Feature Cards Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {STUDIO_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature)}
                  className="group relative p-4 rounded-lg border bg-card hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeatureClick(feature);
                      }}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{feature.title}</span>
                    {feature.beta && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        BETA
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {projects.map((project) => {
                const sourceCount = getSourceCount(project);
                const contentTypes = getContentTypes(project);
                // Use first content type for icon, or fallback to project type
                const displayType = contentTypes[0] || project.type || 'DOCUMENT';
                const ProjectIcon = getProjectTypeIcon(displayType);
                const timeAgo = formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true,
                });

                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="w-full p-3 rounded-lg border bg-card hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <ProjectIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {project.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{sourceCount} source{sourceCount !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Note Button */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // TODO: Implement add note functionality
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add note
        </Button>
      </div>
    </div>
  );
}


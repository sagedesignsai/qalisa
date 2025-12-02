'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/ai/chat-interface';
import { VideoPlayer } from './video-player';
import { GenerationStatus } from './generation-status';
import { StudioOverviewPanel } from './studio-overview-panel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import {
  ArrowLeftIcon,
  VideoIcon,
  Headphones,
  Network,
  DownloadIcon,
  RefreshCwIcon,
  Share2Icon,
  MoreVerticalIcon,
} from 'lucide-react';
import type { StudioProject } from '@/lib/generated/prisma/client';
import type { UIMessage } from 'ai';

interface StudioProjectPageProps {
  project: StudioProject & {
    messages?: any[];
    sources?: any[];
    contentItems?: any[];
    mediaAssets: any[];
    videoTracks: any[];
    exports: any[];
  };
  chatId?: string;
  chatTitle?: string;
  initialMessages?: UIMessage[];
  sourceCount?: number;
}

export function StudioProjectPage({
  project: initialProject,
  chatId,
  chatTitle,
  initialMessages = [],
  sourceCount: initialSourceCount,
}: StudioProjectPageProps) {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [project, setProject] = useState(initialProject);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContentItemId, setSelectedContentItemId] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  // Determine available content items and set default view
  const contentItems = project.contentItems || [];
  const videoItem = contentItems.find((item: any) => item.type === 'VIDEO_OVERVIEW');
  const audioItem = contentItems.find((item: any) => item.type === 'AUDIO_OVERVIEW');
  const mindMapItem = contentItems.find((item: any) => item.type === 'MIND_MAP');
  const infographicItem = contentItems.find((item: any) => item.type === 'INFOGRAPHIC');
  const slideDeckItem = contentItems.find((item: any) => item.type === 'SLIDE_DECK');

  // Get selected content item
  const selectedContentItem = selectedContentItemId
    ? contentItems.find((item: any) => item.id === selectedContentItemId)
    : null;

  // Set default view based on selected content item
  const getViewFromContentItem = (item: any): 'video' | 'audio' | 'mindmap' | 'infographic' | 'slidedeck' | null => {
    if (!item) return null;
    switch (item.type) {
      case 'VIDEO_OVERVIEW': return 'video';
      case 'AUDIO_OVERVIEW': return 'audio';
      case 'MIND_MAP': return 'mindmap';
      case 'INFOGRAPHIC': return 'infographic';
      case 'SLIDE_DECK': return 'slidedeck';
      default: return null;
    }
  };

  const [studioView, setStudioView] = useState<'video' | 'audio' | 'mindmap' | 'infographic' | 'slidedeck'>('video');
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Automatically collapse sidebar when component mounts
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    // Load video URL if project has exports
    if (project.exports && project.exports.length > 0) {
      const completedExport = project.exports.find((e: any) => e.status === 'COMPLETED' && e.url);
      if (completedExport) {
        setVideoUrl(completedExport.url);
        // Estimate duration from tracks
        const maxEndTime = Math.max(...(project.videoTracks?.map((t: any) => t.endTime) || [0]), 0);
        setVideoDuration(maxEndTime);
      }
    }
  }, [project]);

  useEffect(() => {
    // Refresh project periodically if generating
    if (project.status === 'GENERATING' || project.status === 'EXPORTING') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/studio/projects/${project.id}`);
          if (response.ok) {
            const { project: updatedProject } = await response.json();
            setProject(updatedProject);

            // Load video URL if available
            if (updatedProject.exports && updatedProject.exports.length > 0) {
              const completedExport = updatedProject.exports.find((e: any) => e.status === 'COMPLETED' && e.url);
              if (completedExport) {
                setVideoUrl(completedExport.url);
              }
            }
          }
        } catch (error) {
          console.error('Error refreshing project:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [project.status, project.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/studio/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ includeMusic: false }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      // Refresh project
      const projectResponse = await fetch(`/api/studio/projects/${project.id}`);
      if (projectResponse.ok) {
        const { project: updatedProject } = await projectResponse.json();
        setProject(updatedProject);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/studio/projects/${project.id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'MP4', quality: '1080p' }),
      });

      if (response.ok) {
        const { url } = await response.json();
        // Open download link
        window.open(url, '_blank');

        // Refresh project to show export status
        const projectResponse = await fetch(`/api/studio/projects/${project.id}`);
        if (projectResponse.ok) {
          const { project: updatedProject } = await projectResponse.json();
          setProject(updatedProject);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleChatIdChange = async (newChatId: string) => {
    setCurrentChatId(newChatId);
    // Update project with new chatId
    try {
      const response = await fetch(`/api/studio/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: newChatId }),
      });

      if (response.ok) {
        // Update local project state
        setProject({ ...project, chatId: newChatId });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update project chatId:', errorData.error || 'Unknown error');
        // Revert chatId change on error
        setCurrentChatId(project.chatId || '');
      }
    } catch (error) {
      console.error('Error updating project chatId:', error);
      // Revert chatId change on error
      setCurrentChatId(project.chatId || '');
    }
  };

  // Get source count from project sources (preferred) or calculate from messages
  const sourceCount = initialSourceCount !== undefined
    ? initialSourceCount
    : (project.sources?.length || initialMessages.reduce((count, msg) => {
      return count + (msg.parts?.filter((p: any) => p.type === 'source-url').length || 0);
    }, 0));

  const handleCreateContentItem = async (featureId: string) => {
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

    const contentType = typeMap[featureId] || 'DOCUMENT';
    const titleMap: Record<string, string> = {
      'AUDIO_OVERVIEW': 'Audio Overview',
      'VIDEO_OVERVIEW': 'Video Overview',
      'MIND_MAP': 'Mind Map',
      'REPORT': 'Report',
      'FLASHCARDS': 'Flashcards',
      'QUIZ': 'Quiz',
      'INFOGRAPHIC': 'Infographic',
      'SLIDE_DECK': 'Slide Deck',
    };

    try {
      const response = await fetch(`/api/studio/projects/${project.id}/content-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          title: titleMap[contentType] || 'New Content',
        }),
      });

      if (response.ok) {
        const { item } = await response.json();
        // Refresh project to get updated content items
        const projectResponse = await fetch(`/api/studio/projects/${project.id}`);
        if (projectResponse.ok) {
          const { project: updatedProject } = await projectResponse.json();
          setProject(updatedProject);
          // Select the newly created content item
          setSelectedContentItemId(item.id);
          const view = getViewFromContentItem(item);
          if (view) {
            setStudioView(view);
            setShowOverview(false);
          }
        }
      }
    } catch (error) {
      console.error('Error creating content item:', error);
    }
  };

  const handleContentItemClick = (itemId: string, type: string) => {
    setSelectedContentItemId(itemId);
    const view = getViewFromContentItem({ type });
    if (view) {
      setStudioView(view);
      setShowOverview(false);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Chat */}
      <ResizablePanel
        defaultSize={35}
        minSize={35}
        maxSize={50}
        className="flex flex-col"
      >
        <div className="h-full border-r flex flex-col">
          <ChatInterface
            chatId={currentChatId}
            initialMessages={initialMessages}
            onChatIdChange={handleChatIdChange}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Studio */}
      <ResizablePanel
        defaultSize={65}
        minSize={50}
        maxSize={65}
        className="flex flex-col bg-background"
      >
        {/* Studio Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showOverview && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowOverview(true);
                    setSelectedContentItemId(null);
                  }}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold">
                  {showOverview ? project.title : 'Studio'}
                </h1>
                {showOverview && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {sourceCount} source{sourceCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard/studio')}
                title="Back to Studio"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Share">
                <Share2Icon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="More options">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Show Overview Panel or Content Editor */}
        {showOverview ? (
          <div className="flex-1 overflow-hidden">
            <StudioOverviewPanel
              projectId={project.id}
              chatId={currentChatId}
              project={project}
              showHeader={false}
              onCreateContentItem={handleCreateContentItem}
              onContentItemClick={handleContentItemClick}
            />
          </div>
        ) : (
          <Tabs value={studioView} onValueChange={(v) => setStudioView(v as any)} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 pb-0">
              <TabsList>
                {videoItem && (
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <VideoIcon className="h-4 w-4" />
                    Video Overview
                  </TabsTrigger>
                )}
                {audioItem && (
                  <TabsTrigger value="audio" className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    Audio Overview
                  </TabsTrigger>
                )}
                {mindMapItem && (
                  <TabsTrigger value="mindmap" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Mind Map
                  </TabsTrigger>
                )}
                {infographicItem && (
                  <TabsTrigger value="infographic" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Infographic
                  </TabsTrigger>
                )}
                {slideDeckItem && (
                  <TabsTrigger value="slidedeck" className="flex items-center gap-2">
                    <VideoIcon className="h-4 w-4" />
                    Slide Deck
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="video" className="flex-1 overflow-hidden mt-0">
              {project.status === 'GENERATING' && (
                <GenerationStatus projectId={project.id} />
              )}

              {project.status === 'READY' && videoItem && (
                <VideoPlayer
                  title={videoItem.title || project.title}
                  sourceCount={sourceCount}
                  videoUrl={videoUrl}
                  duration={videoDuration}
                  currentTime={currentTime}
                  onTimeChange={setCurrentTime}
                  onExport={handleExport}
                  onShare={() => {
                    if (videoUrl) {
                      navigator.clipboard.writeText(videoUrl);
                    }
                  }}
                />
              )}

              {project.status === 'DRAFT' && (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center max-w-md">
                    <VideoIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Ready to Generate</h2>
                    <p className="text-muted-foreground mb-6">
                      Click Generate to create your video overview from the chat content.
                    </p>
                    <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                      <RefreshCwIcon className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate Video Overview'}
                    </Button>
                  </div>
                </div>
              )}

              {project.status === 'COMPLETED' && videoItem && videoUrl && (
                <VideoPlayer
                  title={videoItem.title || project.title}
                  sourceCount={sourceCount}
                  videoUrl={videoUrl}
                  duration={videoDuration}
                  currentTime={currentTime}
                  onTimeChange={setCurrentTime}
                  onExport={handleExport}
                  onShare={() => {
                    if (videoUrl) {
                      navigator.clipboard.writeText(videoUrl);
                    }
                  }}
                />
              )}

              {project.status === 'FAILED' && (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center max-w-md">
                    <VideoIcon className="h-16 w-16 mx-auto mb-4 text-destructive opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Generation Failed</h2>
                    <p className="text-muted-foreground mb-6">
                      There was an error generating your video. Please try again.
                    </p>
                    <Button onClick={handleGenerate} variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Retry Generation
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audio" className="flex-1 overflow-hidden mt-0">
              {audioItem ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Headphones className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">{audioItem.title}</h2>
                    <p className="text-muted-foreground">
                      Status: {audioItem.status}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Headphones className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Audio Overview</h2>
                    <p className="text-muted-foreground">
                      No audio overview content available
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mindmap" className="flex-1 overflow-hidden mt-0">
              {mindMapItem ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">{mindMapItem.title}</h2>
                    <p className="text-muted-foreground">
                      Status: {mindMapItem.status}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Mind Map</h2>
                    <p className="text-muted-foreground">
                      No mind map content available
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="infographic" className="flex-1 overflow-hidden mt-0">
              {infographicItem ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">{infographicItem.title}</h2>
                    <p className="text-muted-foreground">
                      Status: {infographicItem.status}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Infographic</h2>
                    <p className="text-muted-foreground">
                      No infographic content available
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="slidedeck" className="flex-1 overflow-hidden mt-0">
              {slideDeckItem ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <VideoIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">{slideDeckItem.title}</h2>
                    <p className="text-muted-foreground">
                      Status: {slideDeckItem.status}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <VideoIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">Slide Deck</h2>
                    <p className="text-muted-foreground">
                      No slide deck content available
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


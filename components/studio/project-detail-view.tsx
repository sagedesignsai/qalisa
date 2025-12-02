'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquareIcon,
  LinkIcon,
  FileTextIcon,
  SettingsIcon,
} from 'lucide-react';
import type { StudioProject } from '@/lib/generated/prisma/client';
import type { UIMessage } from 'ai';

interface ProjectDetailViewProps {
  projectId: string;
  onClose?: () => void;
}

export function ProjectDetailView({ projectId, onClose }: ProjectDetailViewProps) {
  const [project, setProject] = useState<StudioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/studio/projects/${projectId}`);
      if (response.ok) {
        const { project } = await response.json();
        setProject(project);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const messages = 'messages' in project && Array.isArray(project.messages)
    ? project.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system' | 'tool',
        parts: msg.content as UIMessage['parts'],
        metadata: msg.metadata as Record<string, unknown> | undefined,
      }))
    : [];

  const sources = 'sources' in project && Array.isArray(project.sources)
    ? project.sources
    : [];

  const contentItems = 'contentItems' in project && Array.isArray(project.contentItems)
    ? project.contentItems
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{project.title}</h2>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="content">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Messages ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="sources">
            <LinkIcon className="h-4 w-4 mr-2" />
            Sources ({sources.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-4">
              {contentItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No content items yet</p>
              ) : (
                contentItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Status: {item.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="messages" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-muted ml-auto max-w-[80%]'
                        : 'bg-card'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.role}
                    </div>
                    <div className="text-sm">
                      {message.parts
                        .filter((part: any) => part.type === 'text')
                        .map((part: any, i: number) => (
                          <div key={i}>{part.text}</div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sources" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-2">
              {sources.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sources</p>
              ) : (
                sources.map((source: any) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-sm">{source.title || source.url}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {source.url}
                    </div>
                  </a>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Project Settings</h3>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(project.settings || {}, null, 2)}
                </pre>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}


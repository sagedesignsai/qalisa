'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StudioProjectType } from '@/lib/studio/types';
import type { ContentItemType } from '@/lib/studio/services/content-item-service';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId?: string;
  initialContentType?: ContentItemType;
  onProjectCreated?: (projectId: string) => void;
}

const CONTENT_TYPE_TO_PROJECT_TYPE: Record<ContentItemType, StudioProjectType> = {
  VIDEO_OVERVIEW: 'PRESENTATION_VIDEO',
  INFOGRAPHIC: 'INFOGRAPHIC',
  SLIDE_DECK: 'SLIDE_DECK',
  AUDIO_OVERVIEW: 'DOCUMENT',
  MIND_MAP: 'DOCUMENT',
  REPORT: 'DOCUMENT',
  FLASHCARDS: 'DOCUMENT',
  QUIZ: 'DOCUMENT',
};

export function CreateProjectDialog({
  open,
  onOpenChange,
  chatId,
  initialContentType,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<ContentItemType>(
    initialContentType || 'VIDEO_OVERVIEW'
  );
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setCreating(true);
    try {
      // Create project
      const projectResponse = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          type: CONTENT_TYPE_TO_PROJECT_TYPE[contentType],
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to create project');
      }

      const { project } = await projectResponse.json();

      // Create initial content item
      const contentItemResponse = await fetch(
        `/api/studio/projects/${project.id}/content-items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: contentType,
            title: title.trim(),
          }),
        }
      );

      if (!contentItemResponse.ok) {
        throw new Error('Failed to create content item');
      }

      onProjectCreated?.(project.id);
      onOpenChange(false);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new studio project to generate content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select
              value={contentType}
              onValueChange={(value) => setContentType(value as ContentItemType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO_OVERVIEW">Video Overview</SelectItem>
                <SelectItem value="INFOGRAPHIC">Infographic</SelectItem>
                <SelectItem value="SLIDE_DECK">Slide Deck</SelectItem>
                <SelectItem value="AUDIO_OVERVIEW">Audio Overview</SelectItem>
                <SelectItem value="MIND_MAP">Mind Map</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
                <SelectItem value="FLASHCARDS">Flashcards</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || creating}>
            {creating ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Timeline } from './timeline';
import { TrackList } from './track-list';
import { RemotionPlayerWrapper } from './remotion-player-wrapper';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface VideoEditorProps {
  projectId: string;
}

export function VideoEditor({ projectId }: VideoEditorProps) {
  const [tracks, setTracks] = useState<VideoTrack[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/studio/projects/${projectId}`);
      if (response.ok) {
        const { project } = await response.json();
        setTracks(project.videoTracks || []);
        setAssets(project.mediaAssets || []);
        
        // Calculate duration from tracks
        const maxEndTime = Math.max(...(project.videoTracks?.map((t: VideoTrack) => t.endTime) || [0]), 0);
        setDuration(maxEndTime);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTrack = async (trackId: string, updates: Partial<VideoTrack>) => {
    try {
      const response = await fetch('/api/studio/tracks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          projectId,
          ...updates,
        }),
      });

      if (response.ok) {
        const { track } = await response.json();
        setTracks((prev) => prev.map((t) => (t.id === trackId ? track : t)));
      }
    } catch (error) {
      console.error('Error updating track:', error);
    }
  };

  const deleteTrack = async (trackId: string) => {
    try {
      const response = await fetch(`/api/studio/tracks?trackId=${trackId}&projectId=${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTracks((prev) => prev.filter((t) => t.id !== trackId));
      }
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex">
        {/* Track List Sidebar */}
        <div className="w-64 border-r">
          <TrackList
            tracks={tracks}
            assets={assets}
            onUpdateTrack={updateTrack}
            onDeleteTrack={deleteTrack}
          />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview with Remotion Player */}
          <div className="flex-1 border-b bg-black">
            <RemotionPlayerWrapper
              tracks={tracks}
              assets={assets}
              durationInSeconds={duration}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
            />
          </div>

          {/* Timeline */}
          <div className="h-64 border-t">
            <Timeline
              tracks={tracks}
              assets={assets}
              currentTime={currentTime}
              duration={duration}
              onTimeChange={setCurrentTime}
              onTrackUpdate={updateTrack}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


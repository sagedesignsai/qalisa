'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface TimelineProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
  onTrackUpdate: (trackId: string, updates: Partial<VideoTrack>) => void;
}

export function Timeline({
  tracks,
  assets,
  currentTime,
  duration,
  onTimeChange,
  onTrackUpdate,
}: TimelineProps) {
  const [draggingTrack, setDraggingTrack] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrackColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-blue-500';
      case 'AUDIO':
        return 'bg-green-500';
      case 'MUSIC':
        return 'bg-purple-500';
      case 'TEXT_OVERLAY':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const pixelsPerSecond = 100; // Scale: 100px per second

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto p-4">
        <div className="relative" style={{ width: `${duration * pixelsPerSecond}px`, minWidth: '100%' }}>
          {/* Time ruler */}
          <div className="h-6 border-b mb-2 flex">
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="border-r text-xs text-muted-foreground px-1"
                style={{ width: `${pixelsPerSecond}px` }}
              >
                {formatTime(i)}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="space-y-2">
            {tracks.map((track) => {
              const left = track.startTime * pixelsPerSecond;
              const width = (track.endTime - track.startTime) * pixelsPerSecond;
              
              return (
                <div
                  key={track.id}
                  className="relative h-12"
                  onMouseDown={() => setDraggingTrack(track.id)}
                >
                  <div
                    className={`absolute h-full rounded ${getTrackColor(track.type)} opacity-80 cursor-move`}
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                    }}
                  >
                    <div className="p-1 text-xs text-white truncate">
                      {track.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          />
        </div>
      </div>

      {/* Time controls */}
      <div className="border-t p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-20">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            onValueChange={([value]) => onTimeChange(value)}
            min={0}
            max={duration || 1}
            step={0.1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-20 text-right">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}


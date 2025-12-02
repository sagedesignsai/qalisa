'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrashIcon, Volume2Icon } from 'lucide-react';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface TrackListProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  onUpdateTrack: (trackId: string, updates: Partial<VideoTrack>) => void;
  onDeleteTrack: (trackId: string) => void;
}

export function TrackList({
  tracks,
  assets,
  onUpdateTrack,
  onDeleteTrack,
}: TrackListProps) {
  const getAsset = (assetId?: string | null) => {
    if (!assetId) return null;
    return assets.find((a) => a.id === assetId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Tracks</h3>
      <div className="space-y-4">
        {tracks.map((track) => {
          const asset = getAsset(track.assetId);
          return (
            <div
              key={track.id}
              className="p-3 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {track.type.replace('_', ' ')}
                  </div>
                  {asset && (
                    <div className="text-xs text-muted-foreground truncate">
                      {asset.type}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatTime(track.startTime)} - {formatTime(track.endTime)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTrack(track.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>

              {track.type === 'AUDIO' || track.type === 'MUSIC' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Volume2Icon className="h-3 w-3" />
                    <span>Volume: {Math.round(track.volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[track.volume * 100]}
                    onValueChange={([value]) =>
                      onUpdateTrack(track.id, { volume: value / 100 })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}


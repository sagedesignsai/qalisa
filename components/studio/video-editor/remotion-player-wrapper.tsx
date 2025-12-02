'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { StudioVideoComposition } from './studio-video-composition';
import { DEFAULT_COMPOSITION } from '@/lib/studio/services/remotion';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface RemotionPlayerWrapperProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  durationInSeconds: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export function RemotionPlayerWrapper({
  tracks,
  assets,
  durationInSeconds,
  currentTime,
  onTimeUpdate,
  onPlay,
  onPause,
}: RemotionPlayerWrapperProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const durationInFrames = Math.ceil(durationInSeconds * DEFAULT_COMPOSITION.fps);
  const currentFrame = Math.floor(currentTime * DEFAULT_COMPOSITION.fps);

  const inputProps = useMemo(
    () => ({
      tracks,
      assets,
      durationInSeconds,
    }),
    [tracks, assets, durationInSeconds]
  );

  // Sync current time with player
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentFrame);
    }
  }, [currentFrame]);

  // Listen to player time updates
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleTimeUpdate = (e: CustomEvent<number>) => {
      const frame = e.detail;
      const time = frame / DEFAULT_COMPOSITION.fps;
      onTimeUpdate(time);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
    };
  }, [onTimeUpdate, onPlay, onPause]);

  return (
    <Player
      ref={playerRef}
      component={StudioVideoComposition}
      durationInFrames={durationInFrames}
      compositionWidth={DEFAULT_COMPOSITION.width}
      compositionHeight={DEFAULT_COMPOSITION.height}
      fps={DEFAULT_COMPOSITION.fps}
      inputProps={inputProps}
      controls
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}


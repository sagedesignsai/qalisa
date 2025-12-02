'use client';

import { useMemo } from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { ImageSequence } from './sequences/image-sequence';
import { AudioSequence } from './sequences/audio-sequence';
import { TextOverlaySequence } from './sequences/text-overlay-sequence';
import { secondsToFrames } from '@/lib/studio/services/remotion';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface StudioVideoCompositionProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
}

export function StudioVideoComposition({
  tracks,
  assets,
}: StudioVideoCompositionProps) {
  const { fps } = useVideoConfig();

  // Group tracks by type for better rendering
  const videoTracks = useMemo(
    () => tracks.filter((t) => t.type === 'VIDEO'),
    [tracks]
  );
  const audioTracks = useMemo(
    () => tracks.filter((t) => t.type === 'AUDIO' || t.type === 'MUSIC'),
    [tracks]
  );
  const textTracks = useMemo(
    () => tracks.filter((t) => t.type === 'TEXT_OVERLAY'),
    [tracks]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Render video/image tracks */}
      {videoTracks.map((track) => {
        const asset = assets.find((a) => a.id === track.assetId);
        if (!asset) return null;

        const startFrame = secondsToFrames(track.startTime, fps);
        const durationInFrames = secondsToFrames(
          track.endTime - track.startTime,
          fps
        );

        return (
          <Sequence
            key={track.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <ImageSequence asset={asset} track={track} />
          </Sequence>
        );
      })}

      {/* Render text overlays */}
      {textTracks.map((track) => {
        const startFrame = secondsToFrames(track.startTime, fps);
        const durationInFrames = secondsToFrames(
          track.endTime - track.startTime,
          fps
        );

        return (
          <Sequence
            key={track.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <TextOverlaySequence track={track} />
          </Sequence>
        );
      })}

      {/* Render audio tracks */}
      {audioTracks.map((track) => {
        const asset = assets.find((a) => a.id === track.assetId);
        if (!asset) return null;

        const startFrame = secondsToFrames(track.startTime, fps);
        const durationInFrames = secondsToFrames(
          track.endTime - track.startTime,
          fps
        );

        return (
          <Sequence
            key={track.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <AudioSequence asset={asset} track={track} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}


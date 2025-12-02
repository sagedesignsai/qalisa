'use client';

import { AbsoluteFill, Img, useVideoConfig } from 'remotion';
import type { MediaAsset, VideoTrack } from '@/lib/generated/prisma';

interface ImageSequenceProps {
  asset: MediaAsset;
  track: VideoTrack;
}

export function ImageSequence({ asset, track }: ImageSequenceProps) {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img
        src={asset.url}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
}


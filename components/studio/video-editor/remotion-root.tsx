'use client';

import { Composition } from 'remotion';
import { StudioVideoComposition } from './studio-video-composition';
import { DEFAULT_COMPOSITION } from '@/lib/studio/services/remotion';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface RemotionRootProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  durationInSeconds: number;
}

export function RemotionRoot({ tracks, assets, durationInSeconds }: RemotionRootProps) {
  const durationInFrames = Math.ceil(durationInSeconds * DEFAULT_COMPOSITION.fps);

  return (
    <Composition
      id="studio-video"
      component={StudioVideoComposition}
      durationInFrames={durationInFrames}
      fps={DEFAULT_COMPOSITION.fps}
      width={DEFAULT_COMPOSITION.width}
      height={DEFAULT_COMPOSITION.height}
      defaultProps={{
        tracks,
        assets,
      }}
    />
  );
}


'use client';

import { Audio } from 'remotion';
import type { MediaAsset, VideoTrack } from '@/lib/generated/prisma';

interface AudioSequenceProps {
  asset: MediaAsset;
  track: VideoTrack;
}

export function AudioSequence({ asset, track }: AudioSequenceProps) {
  return (
    <Audio
      src={asset.url}
      volume={track.volume}
    />
  );
}


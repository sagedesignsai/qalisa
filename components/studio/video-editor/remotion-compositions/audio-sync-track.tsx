'use client';

import { useMemo } from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { AudioSequence } from '../sequences/audio-sequence';
import { ImageSequence } from '../sequences/image-sequence';
import { secondsToFrames } from '@/lib/studio/services/remotion';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface AudioSyncTrackProps {
  audioTrack: VideoTrack;
  videoTrack: VideoTrack;
  audioAsset: MediaAsset;
  videoAsset: MediaAsset;
}

/**
 * Component that ensures audio-visual synchronization
 * Renders both audio and video tracks together with precise timing
 */
export function AudioSyncTrack({
  audioTrack,
  videoTrack,
  audioAsset,
  videoAsset,
}: AudioSyncTrackProps) {
  const { fps } = useVideoConfig();

  // Calculate synchronization
  const syncInfo = useMemo(() => {
    const audioStartFrame = secondsToFrames(audioTrack.startTime, fps);
    const videoStartFrame = secondsToFrames(videoTrack.startTime, fps);
    const audioDuration = secondsToFrames(audioTrack.endTime - audioTrack.startTime, fps);
    const videoDuration = secondsToFrames(videoTrack.endTime - videoTrack.startTime, fps);

    // Use the earlier start time and longer duration to ensure both are visible
    const startFrame = Math.min(audioStartFrame, videoStartFrame);
    const durationInFrames = Math.max(audioDuration, videoDuration);

    return {
      startFrame,
      durationInFrames,
      audioOffset: audioStartFrame - startFrame,
      videoOffset: videoStartFrame - startFrame,
    };
  }, [audioTrack, videoTrack, fps]);

  return (
    <Sequence
      from={syncInfo.startFrame}
      durationInFrames={syncInfo.durationInFrames}
    >
      {/* Video track */}
      <Sequence
        from={syncInfo.videoOffset}
        durationInFrames={secondsToFrames(videoTrack.endTime - videoTrack.startTime, fps)}
      >
        <ImageSequence asset={videoAsset} track={videoTrack} />
      </Sequence>

      {/* Audio track */}
      <Sequence
        from={syncInfo.audioOffset}
        durationInFrames={secondsToFrames(audioTrack.endTime - audioTrack.startTime, fps)}
      >
        <AudioSequence asset={audioAsset} track={audioTrack} />
      </Sequence>
    </Sequence>
  );
}


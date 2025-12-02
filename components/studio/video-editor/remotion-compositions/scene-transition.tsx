'use client';

import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { TransitionConfig } from '@/lib/studio/types';

interface SceneTransitionProps {
  transition?: TransitionConfig;
  durationInFrames: number;
}

export function SceneTransition({ transition, durationInFrames }: SceneTransitionProps) {
  const frame = useCurrentFrame();

  if (!transition || transition.type === 'none') {
    return null;
  }

  // Calculate opacity based on transition type and duration
  const opacity = interpolate(
    frame,
    [durationInFrames - transition.duration, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  switch (transition.type) {
    case 'fade':
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            opacity: 1 - opacity,
          }}
        />
      );

    case 'slide':
      const slideX = interpolate(
        frame,
        [durationInFrames - transition.duration, durationInFrames],
        [0, -1920],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      );
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `translateX(${slideX}px)`,
            opacity: 1 - opacity,
          }}
        />
      );

    case 'zoom':
      const scale = interpolate(
        frame,
        [durationInFrames - transition.duration, durationInFrames],
        [1, 1.2],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      );
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            transform: `scale(${scale})`,
            opacity: 1 - opacity,
          }}
        />
      );

    default:
      return null;
  }
}


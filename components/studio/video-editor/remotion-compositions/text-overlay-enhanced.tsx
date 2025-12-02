'use client';

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { VideoTrack } from '@/lib/generated/prisma';

interface TextOverlayEnhancedProps {
  track: VideoTrack;
}

export function TextOverlayEnhanced({ track }: TextOverlayEnhancedProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const metadata = track.metadata as Record<string, unknown> | null;
  const text = (metadata?.text as string) || '';
  const style = (metadata?.style as string) || 'subtitles';

  // Calculate animation based on track timing
  const startFrame = Math.floor(track.startTime * fps);
  const endFrame = Math.floor(track.endTime * fps);
  const durationInFrames = endFrame - startFrame;

  // Fade in animation
  const fadeIn = interpolate(
    frame,
    [startFrame, startFrame + Math.min(10, durationInFrames / 4)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade out animation
  const fadeOut = interpolate(
    frame,
    [endFrame - Math.min(10, durationInFrames / 4), endFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Slide up animation for subtitles
  const slideY = style === 'subtitles'
    ? interpolate(
        frame,
        [startFrame, startFrame + Math.min(15, durationInFrames / 3)],
        [20, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 0;

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: `translateX(-50%) translateY(${slideY}px)`,
    color: 'white',
    fontSize: style === 'subtitles' ? 24 : 32,
    fontWeight: style === 'subtitles' ? 'normal' : 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: style === 'subtitles' ? '10px 20px' : '15px 30px',
    borderRadius: 8,
    opacity,
    maxWidth: '80%',
    lineHeight: 1.4,
  };

  if (style === 'title') {
    baseStyles.bottom = '20%';
    baseStyles.fontSize = 48;
    baseStyles.fontWeight = 'bold';
    baseStyles.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  } else {
    baseStyles.bottom = 50;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={baseStyles}>
        {text}
      </div>
    </AbsoluteFill>
  );
}


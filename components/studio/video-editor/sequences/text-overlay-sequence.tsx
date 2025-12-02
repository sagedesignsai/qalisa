'use client';

import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { VideoTrack } from '@/lib/generated/prisma';

interface TextOverlaySequenceProps {
  track: VideoTrack;
}

export function TextOverlaySequence({ track }: TextOverlaySequenceProps) {
  const { width, height } = useVideoConfig();
  const metadata = track.metadata as { text?: string; position?: string; fontSize?: number; color?: string } | null;

  const text = metadata?.text || 'Text Overlay';
  const position = metadata?.position || 'center';
  const fontSize = metadata?.fontSize || 48;
  const color = metadata?.color || '#ffffff';

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    top: {
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      top: '50%',
      left: '10%',
      transform: 'translateY(-50%)',
    },
    right: {
      top: '50%',
      right: '10%',
      transform: 'translateY(-50%)',
    },
  };

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          ...positionStyles[position],
          fontSize,
          color,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from 'lucide-react';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';

interface VideoPreviewProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

export function VideoPreview({
  tracks,
  assets,
  currentTime,
  onTimeUpdate,
}: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;

    // Find current track at currentTime
    const currentTrack = tracks.find(
      (t) => currentTime >= t.startTime && currentTime <= t.endTime
    );

    if (currentTrack) {
      const asset = assets.find((a) => a.id === currentTrack.assetId);
      if (asset && asset.type === 'IMAGE') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = asset.url;
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [tracks, assets, currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        onTimeUpdate(elapsed);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, onTimeUpdate]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-black relative">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full"
          style={{ aspectRatio: '16/9' }}
        />
      </div>
      <div className="border-t p-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}


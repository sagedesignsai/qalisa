'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  MaximizeIcon,
  Share2Icon,
  DownloadIcon,
  MoreVerticalIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  title: string;
  sourceCount: number;
  videoUrl?: string;
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function VideoPlayer({
  title,
  sourceCount,
  videoUrl,
  duration,
  currentTime,
  onTimeChange,
  onPlay,
  onPause,
  onShare,
  onExport,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onPause?.();
      } else {
        videoRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    onTimeChange(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        if (videoRef.current) {
          onTimeChange(videoRef.current.currentTime);
        }
      };
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        onPause?.();
      });

      return () => {
        videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [onTimeChange, onPause]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm text-muted-foreground">Studio</h2>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Based on {sourceCount} source{sourceCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onShare}>
            <Share2Icon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onExport}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFullscreen}>
                Fullscreen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Video Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-full"
            style={{ aspectRatio: '16/9' }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
            style={{ aspectRatio: '16/9' }}
          />
        )}
      </div>

      {/* Video Controls */}
      <div className="border-t p-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            min={0}
            max={duration || 1}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSeek([Math.max(0, currentTime - 10)])}
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSeek([Math.min(duration, currentTime + 10)])}
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeedChange(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 0.5)}
                className="text-xs"
              >
                {playbackSpeed}X
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleFullscreen}>
              <MaximizeIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Buttons */}
      <div className="border-t p-4 flex items-center justify-center gap-4">
        <Button variant="outline" size="sm">
          <ThumbsUpIcon className="h-4 w-4 mr-2" />
          Good video
        </Button>
        <Button variant="outline" size="sm">
          <ThumbsDownIcon className="h-4 w-4 mr-2" />
          Bad video
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { ImageSequence } from '../sequences/image-sequence';
import { AudioSequence } from '../sequences/audio-sequence';
import { TextOverlaySequence } from '../sequences/text-overlay-sequence';
import { SceneTransition } from './scene-transition';
import { secondsToFrames } from '@/lib/studio/services/remotion';
import type { VideoTrack, MediaAsset } from '@/lib/generated/prisma';
import type { RemotionCompositionConfig } from '@/lib/studio/types';

interface AgentGeneratedCompositionProps {
  tracks: VideoTrack[];
  assets: MediaAsset[];
  remotionConfig?: RemotionCompositionConfig;
}

export function AgentGeneratedComposition({
  tracks,
  assets,
  remotionConfig,
}: AgentGeneratedCompositionProps) {
  const { fps } = useVideoConfig();

  // Use Remotion config if available, otherwise generate from tracks
  const composition = useMemo(() => {
    if (remotionConfig) {
      return remotionConfig;
    }

    // Fallback: generate composition from tracks
    const scenes = new Map<string, VideoTrack[]>();
    for (const track of tracks) {
      const sceneId = (track.metadata as any)?.sceneId || `scene-${Math.floor(track.startTime)}`;
      if (!scenes.has(sceneId)) {
        scenes.set(sceneId, []);
      }
      scenes.get(sceneId)!.push(track);
    }

    const sceneArray = Array.from(scenes.entries()).map(([id, sceneTracks]) => {
      const sortedTracks = sceneTracks.sort((a, b) => a.order - b.order);
      const startTime = Math.min(...sortedTracks.map(t => t.startTime));
      const endTime = Math.max(...sortedTracks.map(t => t.endTime));
      const from = secondsToFrames(startTime, fps);
      const durationInFrames = secondsToFrames(endTime - startTime, fps);

      return {
        id,
        from,
        durationInFrames,
        tracks: sortedTracks.map(track => ({
          type: track.type as 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY',
          assetId: track.assetId || '',
          startTime: track.startTime,
          endTime: track.endTime,
          volume: track.volume,
          metadata: track.metadata as Record<string, unknown> | undefined,
        })),
      };
    });

    sceneArray.sort((a, b) => a.from - b.from);

    return {
      id: 'studio-video',
      fps,
      width: 1920,
      height: 1080,
      durationInFrames: sceneArray.length > 0
        ? sceneArray[sceneArray.length - 1].from + sceneArray[sceneArray.length - 1].durationInFrames
        : 0,
      scenes: sceneArray,
      transitions: [],
    };
  }, [tracks, assets, remotionConfig, fps]);

  // Group tracks by scene for rendering
  const scenesByStartTime = useMemo(() => {
    const grouped = new Map<number, VideoTrack[]>();
    for (const track of tracks) {
      const startFrame = secondsToFrames(track.startTime, fps);
      if (!grouped.has(startFrame)) {
        grouped.set(startFrame, []);
      }
      grouped.get(startFrame)!.push(track);
    }
    return grouped;
  }, [tracks, fps]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {composition.scenes.map((scene, index) => {
        const sceneTracks = tracks.filter(t => {
          const sceneId = (t.metadata as any)?.sceneId || `scene-${Math.floor(t.startTime)}`;
          return sceneId === scene.id;
        });

        return (
          <Sequence
            key={scene.id}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
          >
            <AbsoluteFill>
              {/* Render video/image tracks */}
              {sceneTracks
                .filter(t => t.type === 'VIDEO')
                .map(track => {
                  const asset = assets.find(a => a.id === track.assetId);
                  if (!asset) return null;

                  return (
                    <ImageSequence
                      key={track.id}
                      asset={asset}
                      track={track}
                    />
                  );
                })}

              {/* Render text overlays */}
              {sceneTracks
                .filter(t => t.type === 'TEXT_OVERLAY')
                .map(track => (
                  <TextOverlaySequence
                    key={track.id}
                    track={track}
                  />
                ))}

              {/* Render audio tracks */}
              {sceneTracks
                .filter(t => t.type === 'AUDIO' || t.type === 'MUSIC')
                .map(track => {
                  const asset = assets.find(a => a.id === track.assetId);
                  if (!asset) return null;

                  return (
                    <AudioSequence
                      key={track.id}
                      asset={asset}
                      track={track}
                    />
                  );
                })}
            </AbsoluteFill>

            {/* Add transition if configured */}
            {composition.transitions && index < composition.scenes.length - 1 && (
              <SceneTransition
                transition={composition.transitions.find(
                  t => t.fromScene === scene.id && t.toScene === composition.scenes[index + 1].id
                )}
                durationInFrames={scene.durationInFrames}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}


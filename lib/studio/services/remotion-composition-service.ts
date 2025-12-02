import type { RemotionCompositionConfig, RemotionScene, TransitionConfig, EffectConfig } from '../types';
import type { VideoTrack } from '@/lib/generated/prisma';
import { secondsToFrames, framesToSeconds, DEFAULT_COMPOSITION } from './remotion';

/**
 * Generate Remotion composition from video tracks
 */
export function generateCompositionFromTracks(
  tracks: VideoTrack[],
  fps: number = DEFAULT_COMPOSITION.fps,
  width: number = DEFAULT_COMPOSITION.width,
  height: number = DEFAULT_COMPOSITION.height
): RemotionCompositionConfig {
  // Group tracks by scene (using metadata or timing)
  const sceneMap = new Map<string, VideoTrack[]>();
  
  for (const track of tracks) {
    const sceneId = (track.metadata as any)?.sceneId || `scene-${Math.floor(track.startTime)}`;
    if (!sceneMap.has(sceneId)) {
      sceneMap.set(sceneId, []);
    }
    sceneMap.get(sceneId)!.push(track);
  }

  // Create scenes
  const scenes: RemotionScene[] = Array.from(sceneMap.entries()).map(([sceneId, sceneTracks]) => {
    const sortedTracks = sceneTracks.sort((a, b) => a.order - b.order);
    const startTime = Math.min(...sortedTracks.map(t => t.startTime));
    const endTime = Math.max(...sortedTracks.map(t => t.endTime));
    const from = secondsToFrames(startTime, fps);
    const durationInFrames = secondsToFrames(endTime - startTime, fps);

    return {
      id: sceneId,
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

  // Sort scenes by start time
  scenes.sort((a, b) => a.from - b.from);

  // Generate transitions between scenes
  const transitions: TransitionConfig[] = [];
  for (let i = 0; i < scenes.length - 1; i++) {
    const currentScene = scenes[i];
    const nextScene = scenes[i + 1];
    
    transitions.push({
      type: 'fade',
      duration: Math.floor(fps * 0.5), // 0.5 second fade
      fromScene: currentScene.id,
      toScene: nextScene.id,
    });
  }

  // Calculate total duration
  const lastScene = scenes[scenes.length - 1];
  const totalDuration = lastScene ? lastScene.from + lastScene.durationInFrames : 0;

  return {
    id: 'studio-video',
    fps,
    width,
    height,
    durationInFrames: totalDuration,
    scenes,
    transitions,
  };
}

/**
 * Validate Remotion composition configuration
 */
export function validateCompositionConfig(config: any): config is RemotionCompositionConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }

  if (typeof config.id !== 'string' || !config.id) {
    return false;
  }

  if (typeof config.fps !== 'number' || config.fps <= 0) {
    return false;
  }

  if (typeof config.width !== 'number' || config.width <= 0) {
    return false;
  }

  if (typeof config.height !== 'number' || config.height <= 0) {
    return false;
  }

  if (typeof config.durationInFrames !== 'number' || config.durationInFrames <= 0) {
    return false;
  }

  if (!Array.isArray(config.scenes)) {
    return false;
  }

  for (const scene of config.scenes) {
    if (typeof scene.id !== 'string' || !scene.id) {
      return false;
    }
    if (typeof scene.from !== 'number' || scene.from < 0) {
      return false;
    }
    if (typeof scene.durationInFrames !== 'number' || scene.durationInFrames <= 0) {
      return false;
    }
    if (!Array.isArray(scene.tracks)) {
      return false;
    }
  }

  return true;
}

/**
 * Render Remotion component code from composition config
 */
export function renderCompositionCode(config: RemotionCompositionConfig): string {
  const imports = `import { Composition, Sequence, AbsoluteFill, useVideoConfig } from 'remotion';`;

  const componentCode = `
export function StudioVideoComposition({ tracks, assets }: { tracks: any[]; assets: any[] }) {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      ${config.scenes.map((scene, index) => `
      <Sequence
        key="${scene.id}"
        from={${scene.from}}
        durationInFrames={${scene.durationInFrames}}
      >
        <AbsoluteFill>
          ${scene.tracks.map(track => {
            if (track.type === 'VIDEO') {
              return `
          <img
            src={assets.find(a => a.id === '${track.assetId}')?.url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />`;
            } else if (track.type === 'AUDIO' || track.type === 'MUSIC') {
              return `
          <audio
            src={assets.find(a => a.id === '${track.assetId}')?.url}
            volume={${track.volume}}
          />`;
            } else if (track.type === 'TEXT_OVERLAY') {
              return `
          <div style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: 24,
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 20px',
            borderRadius: 8,
          }}>
            ${(track.metadata as any)?.text || ''}
          </div>`;
            }
            return '';
          }).join('')}
        </AbsoluteFill>
      </Sequence>`).join('')}
    </AbsoluteFill>
  );
}`;

  return `${imports}\n${componentCode}`;
}

/**
 * Apply transitions to composition
 */
export function applyTransitions(
  config: RemotionCompositionConfig,
  transitions: TransitionConfig[]
): RemotionCompositionConfig {
  return {
    ...config,
    transitions: [...(config.transitions || []), ...transitions],
  };
}

/**
 * Apply effects to composition
 */
export function applyEffects(
  config: RemotionCompositionConfig,
  effects: EffectConfig[]
): RemotionCompositionConfig {
  return {
    ...config,
    effects: [...(config.effects || []), ...effects],
  };
}

/**
 * Merge Remotion config with user edits
 */
export function mergeRemotionConfig(
  baseConfig: RemotionCompositionConfig,
  edits: Partial<RemotionCompositionConfig>
): RemotionCompositionConfig {
  return {
    ...baseConfig,
    ...edits,
    scenes: edits.scenes || baseConfig.scenes,
    transitions: edits.transitions !== undefined ? edits.transitions : baseConfig.transitions,
    effects: edits.effects !== undefined ? edits.effects : baseConfig.effects,
  };
}


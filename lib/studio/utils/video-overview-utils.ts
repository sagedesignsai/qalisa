import type { VideoScript, AlignedTrack, GeneratedMedia } from '../types';
import type { MediaAsset } from '@/lib/generated/prisma';

/**
 * Calculate precise track timing from audio duration
 */
export function calculateTrackTiming(
  audioDuration: number,
  sceneStartTime: number
): { startTime: number; endTime: number } {
  return {
    startTime: sceneStartTime,
    endTime: sceneStartTime + audioDuration,
  };
}

/**
 * Align assets to script scenes
 */
export function alignAssetsToScenes(
  script: VideoScript,
  assets: GeneratedMedia
): Map<string, { audio?: typeof assets.audioFiles[0]; image?: typeof assets.imageFiles[0] }> {
  const alignment = new Map();

  for (const scene of script.scenes) {
    const audio = assets.audioFiles.find(a => a.sceneId === scene.id);
    const image = assets.imageFiles.find(i => i.sceneId === scene.id);

    alignment.set(scene.id, {
      audio,
      image,
    });
  }

  return alignment;
}

/**
 * Validate agent result structure
 */
export function validateAgentResult(result: any): result is {
  script: VideoScript;
  assets: GeneratedMedia;
  tracks: AlignedTrack[];
  remotionConfig: any;
} {
  if (!result || typeof result !== 'object') {
    return false;
  }

  // Validate script
  if (!result.script || typeof result.script !== 'object') {
    return false;
  }
  if (typeof result.script.title !== 'string') {
    return false;
  }
  if (!Array.isArray(result.script.scenes)) {
    return false;
  }

  // Validate assets
  if (!result.assets || typeof result.assets !== 'object') {
    return false;
  }
  if (!Array.isArray(result.assets.audioFiles)) {
    return false;
  }
  if (!Array.isArray(result.assets.imageFiles)) {
    return false;
  }

  // Validate tracks
  if (!Array.isArray(result.tracks)) {
    return false;
  }
  for (const track of result.tracks) {
    if (typeof track.sceneId !== 'string') {
      return false;
    }
    if (typeof track.startTime !== 'number') {
      return false;
    }
    if (typeof track.endTime !== 'number') {
      return false;
    }
    if (track.endTime <= track.startTime) {
      return false;
    }
  }

  // Validate remotion config
  if (!result.remotionConfig || typeof result.remotionConfig !== 'object') {
    return false;
  }

  return true;
}

/**
 * Calculate total video duration from tracks
 */
export function calculateTotalDuration(tracks: AlignedTrack[]): number {
  if (tracks.length === 0) {
    return 0;
  }

  return Math.max(...tracks.map(t => t.endTime));
}

/**
 * Verify audio-visual synchronization
 */
export function verifySynchronization(tracks: AlignedTrack[]): {
  synchronized: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const sceneMap = new Map<string, AlignedTrack[]>();

  // Group tracks by scene
  for (const track of tracks) {
    if (!sceneMap.has(track.sceneId)) {
      sceneMap.set(track.sceneId, []);
    }
    sceneMap.get(track.sceneId)!.push(track);
  }

  // Check synchronization for each scene
  for (const [sceneId, sceneTracks] of sceneMap.entries()) {
    const audioTracks = sceneTracks.filter(t => t.type === 'AUDIO');
    const videoTracks = sceneTracks.filter(t => t.type === 'VIDEO');

    if (audioTracks.length > 0 && videoTracks.length > 0) {
      const audioTrack = audioTracks[0];
      const videoTrack = videoTracks[0];

      const startDiff = Math.abs(audioTrack.startTime - videoTrack.startTime);
      const endDiff = Math.abs(audioTrack.endTime - videoTrack.endTime);

      if (startDiff > 0.1) {
        issues.push(`Scene ${sceneId}: Audio and video start times differ by ${startDiff.toFixed(2)}s`);
      }

      if (endDiff > 0.1) {
        issues.push(`Scene ${sceneId}: Audio and video end times differ by ${endDiff.toFixed(2)}s`);
      }
    }
  }

  return {
    synchronized: issues.length === 0,
    issues,
  };
}

/**
 * Match media assets to tracks
 */
export function matchAssetsToTracks(
  tracks: AlignedTrack[],
  assets: MediaAsset[]
): Map<string, MediaAsset> {
  const assetMap = new Map<string, MediaAsset>();

  for (const track of tracks) {
    if (track.assetId) {
      const asset = assets.find(a => a.id === track.assetId || a.appwriteId === track.assetId);
      if (asset) {
        assetMap.set(track.assetId, asset);
      }
    }
  }

  return assetMap;
}

/**
 * Calculate scene timing from script
 */
export function calculateSceneTiming(script: VideoScript): Map<string, { startTime: number; endTime: number }> {
  const timing = new Map();
  let currentTime = 0;

  for (const scene of script.scenes.sort((a, b) => a.order - b.order)) {
    timing.set(scene.id, {
      startTime: currentTime,
      endTime: currentTime + scene.duration,
    });
    currentTime += scene.duration;
  }

  return timing;
}


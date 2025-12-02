/**
 * Remotion composition helpers
 * These utilities help create Remotion compositions for video editing
 */

export interface RemotionCompositionConfig {
  id: string;
  component: React.ComponentType<any>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps?: Record<string, any>;
}

/**
 * Calculate duration in frames from seconds
 */
export function secondsToFrames(seconds: number, fps: number = 30): number {
  return Math.ceil(seconds * fps);
}

/**
 * Calculate seconds from frames
 */
export function framesToSeconds(frames: number, fps: number = 30): number {
  return frames / fps;
}

/**
 * Create a Remotion composition configuration
 */
export function createComposition(config: RemotionCompositionConfig): RemotionCompositionConfig {
  return config;
}

/**
 * Default video composition settings
 */
export const DEFAULT_COMPOSITION = {
  fps: 30,
  width: 1920,
  height: 1080,
} as const;


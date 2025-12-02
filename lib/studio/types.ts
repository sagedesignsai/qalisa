import type { StudioProject, MediaAsset, VideoTrack, ProjectExport } from '@/lib/generated/prisma';

export type StudioProjectType = 'PRESENTATION_VIDEO' | 'INFOGRAPHIC' | 'SLIDE_DECK' | 'DOCUMENT';
export type StudioProjectStatus = 'DRAFT' | 'GENERATING' | 'READY' | 'EXPORTING' | 'COMPLETED' | 'FAILED';
export type MediaAssetType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'MUSIC';
export type TrackType = 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY' | 'TRANSITION';
export type ExportFormat = 'MP4' | 'WEBM' | 'PNG' | 'PDF' | 'HTML';
export type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface StudioProjectWithRelations extends StudioProject {
  mediaAssets: MediaAsset[];
  videoTracks: VideoTrack[];
  exports: ProjectExport[];
}

export interface MediaGenerationProgress {
  projectId: string;
  status: StudioProjectStatus;
  progress: number; // 0.0 to 1.0
  currentStep?: string;
  completedAssets: number;
  totalAssets: number;
  error?: string;
}

export interface VideoCompilationOptions {
  tracks: VideoTrack[];
  width?: number;
  height?: number;
  fps?: number;
  format: ExportFormat;
  quality: string; // e.g., "1080p", "720p"
}

// Video Overview Agent Types
export interface VideoScript {
  title: string;
  script: string;
  scenes: Array<{
    id: string;
    order: number;
    text: string;
    imagePrompt?: string;
    duration: number; // seconds
    narrationText: string;
  }>;
  estimatedDuration: number; // seconds
}

export interface GeneratedMedia {
  audioFiles: Array<{ fileId: string; url: string; sceneId: string; duration?: number }>;
  imageFiles: Array<{ fileId: string; url: string; sceneId: string }>;
  musicFile?: { fileId: string; url: string; duration?: number };
}

export interface AlignedTrack {
  sceneId: string;
  assetId: string;
  type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY';
  startTime: number;
  endTime: number;
  volume: number;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface RemotionScene {
  id: string;
  from: number; // frame
  durationInFrames: number;
  tracks: Array<{
    type: 'VIDEO' | 'AUDIO' | 'MUSIC' | 'TEXT_OVERLAY';
    assetId: string;
    startTime: number;
    endTime: number;
    volume: number;
    metadata?: Record<string, unknown>;
  }>;
}

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'none';
  duration: number; // frames
  fromScene: string;
  toScene: string;
}

export interface EffectConfig {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation';
  value: number;
  sceneId?: string;
}

export interface RemotionCompositionConfig {
  id: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  scenes: RemotionScene[];
  transitions?: TransitionConfig[];
  effects?: EffectConfig[];
}

export interface VideoOverviewAgentResult {
  script: VideoScript;
  assets: GeneratedMedia;
  tracks: AlignedTrack[];
  remotionConfig: RemotionCompositionConfig;
  remotionComponentCode?: string;
}


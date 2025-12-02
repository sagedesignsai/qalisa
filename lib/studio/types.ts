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


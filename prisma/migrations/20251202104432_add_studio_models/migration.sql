-- CreateEnum
CREATE TYPE "StudioProjectType" AS ENUM ('PRESENTATION_VIDEO', 'INFOGRAPHIC', 'SLIDE_DECK', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "StudioProjectStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'EXPORTING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'MUSIC');

-- CreateEnum
CREATE TYPE "TrackType" AS ENUM ('VIDEO', 'AUDIO', 'MUSIC', 'TEXT_OVERLAY', 'TRANSITION');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('MP4', 'WEBM', 'PNG', 'PDF', 'HTML');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "studio_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT,
    "type" "StudioProjectType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "StudioProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "MediaAssetType" NOT NULL,
    "appwriteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION,
    "width" INTEGER,
    "height" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_tracks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assetId" TEXT,
    "type" "TrackType" NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_exports" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "quality" TEXT NOT NULL,
    "appwriteId" TEXT,
    "url" TEXT,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "project_exports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "studio_projects_userId_createdAt_idx" ON "studio_projects"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "studio_projects_chatId_idx" ON "studio_projects"("chatId");

-- CreateIndex
CREATE INDEX "media_assets_projectId_idx" ON "media_assets"("projectId");

-- CreateIndex
CREATE INDEX "video_tracks_projectId_order_idx" ON "video_tracks"("projectId", "order");

-- CreateIndex
CREATE INDEX "project_exports_projectId_idx" ON "project_exports"("projectId");

-- CreateIndex
CREATE INDEX "project_exports_status_idx" ON "project_exports"("status");

-- AddForeignKey
ALTER TABLE "studio_projects" ADD CONSTRAINT "studio_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_projects" ADD CONSTRAINT "studio_projects_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_tracks" ADD CONSTRAINT "video_tracks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_tracks" ADD CONSTRAINT "video_tracks_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_exports" ADD CONSTRAINT "project_exports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

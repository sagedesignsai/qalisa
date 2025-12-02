-- CreateEnum
CREATE TYPE "ContentItemType" AS ENUM ('VIDEO_OVERVIEW', 'INFOGRAPHIC', 'SLIDE_DECK', 'AUDIO_OVERVIEW', 'MIND_MAP', 'REPORT', 'FLASHCARDS', 'QUIZ');

-- CreateEnum
CREATE TYPE "ContentItemStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'EXPORTING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "project_messages" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "sequence" INTEGER NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_sources" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "extractedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio_content_items" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ContentItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContentItemStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_content_items_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "studio_projects" ADD COLUMN "settings" JSONB;

-- AlterTable
ALTER TABLE "media_assets" ADD COLUMN "contentItemId" TEXT;

-- CreateIndex
CREATE INDEX "project_messages_projectId_sequence_idx" ON "project_messages"("projectId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "project_sources_projectId_url_key" ON "project_sources"("projectId", "url");

-- CreateIndex
CREATE INDEX "project_sources_projectId_idx" ON "project_sources"("projectId");

-- CreateIndex
CREATE INDEX "studio_content_items_projectId_type_idx" ON "studio_content_items"("projectId", "type");

-- CreateIndex
CREATE INDEX "media_assets_contentItemId_idx" ON "media_assets"("contentItemId");

-- AddForeignKey
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_sources" ADD CONSTRAINT "project_sources_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_content_items" ADD CONSTRAINT "studio_content_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "studio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "studio_content_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;


import { Client, Storage, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID!;

export type MediaFolder = 'images' | 'audio' | 'video' | 'exports';

/**
 * Upload media file to Appwrite bucket
 * Files are organized by folder type (images/, audio/, video/, exports/)
 */
export async function uploadMedia(
  file: Buffer | Uint8Array,
  filename: string,
  mimeType: string,
  folder: MediaFolder = 'images'
): Promise<{ fileId: string; url: string }> {
  if (!BUCKET_ID) {
    throw new Error('APPWRITE_BUCKET_ID is not configured');
  }

  const fileId = ID.unique();
  const filePath = `${folder}/${fileId}-${filename}`;

  await storage.createFile(BUCKET_ID, fileId, file);

  // Get file view URL (public URL)
  const url = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view`;

  return { fileId, url };
}

/**
 * Delete media file from Appwrite bucket
 */
export async function deleteMedia(fileId: string): Promise<void> {
  if (!BUCKET_ID) {
    throw new Error('APPWRITE_BUCKET_ID is not configured');
  }

  await storage.deleteFile(BUCKET_ID, fileId);
}

/**
 * Get file download URL
 */
export function getFileUrl(fileId: string): string {
  if (!BUCKET_ID) {
    throw new Error('APPWRITE_BUCKET_ID is not configured');
  }

  return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view`;
}

/**
 * Get file download URL with download parameter
 */
export function getFileDownloadUrl(fileId: string, filename: string): string {
  if (!BUCKET_ID) {
    throw new Error('APPWRITE_BUCKET_ID is not configured');
  }

  return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?filename=${encodeURIComponent(filename)}`;
}


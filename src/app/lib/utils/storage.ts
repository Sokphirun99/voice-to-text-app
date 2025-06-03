import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Define a simple in-memory cache for storing file information in development
// In production, this would be replaced with a proper database
const fileCache = new Map<string, {
  path: string;
  contentType: string;
  extension: string;
}>();

// Storage directory for audio files
const STORAGE_DIR = path.join(process.cwd(), 'storage');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fsPromises.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create storage directory:', error);
  }
}

/**
 * Save an audio file to storage
 */
export async function saveAudioFile(audioBlob: Blob, fileId: string): Promise<string> {
  await ensureStorageDir();
  
  // Convert blob to buffer
  const buffer = Buffer.from(await audioBlob.arrayBuffer());
  
  // Determine file extension based on mime type
  const extension = audioBlob.type.split('/')[1] || 'webm';
  
  // Create file path
  const fileName = `${fileId}.${extension}`;
  const filePath = path.join(STORAGE_DIR, fileName);
  
  // Save file
  await fsPromises.writeFile(filePath, buffer);
  
  // Store information in the cache
  fileCache.set(fileId, {
    path: filePath,
    contentType: audioBlob.type,
    extension
  });
  
  // Return the URL to access the file
  return `/api/storage?id=${fileId}`;
}

/**
 * Get an audio file from storage
 */
export async function getAudioFile(fileId: string) {
  // Check if the file info is in the cache
  const fileInfo = fileCache.get(fileId);
  
  if (!fileInfo) {
    // In production, we would look up the file info in a database
    // For now, we'll try to find the file in the storage directory
    try {
      const files = await fsPromises.readdir(STORAGE_DIR);
      const fileEntry = files.find(file => file.startsWith(`${fileId}.`));
      
      if (!fileEntry) {
        return null;
      }
      
      const extension = path.extname(fileEntry).substring(1);
      const contentType = `audio/${extension}`;
      const filePath = path.join(STORAGE_DIR, fileEntry);
      
      // Store in cache for future use
      fileCache.set(fileId, {
        path: filePath,
        contentType,
        extension
      });
      
      // Read the file data
      const data = await fsPromises.readFile(filePath);
      
      return {
        data,
        contentType,
        extension
      };
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  } else {
    // File info is in cache, read the file
    try {
      const data = await fsPromises.readFile(fileInfo.path);
      
      return {
        data,
        contentType: fileInfo.contentType,
        extension: fileInfo.extension
      };
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }
}

/**
 * Delete an audio file from storage
 */
export async function deleteAudioFile(fileId: string): Promise<boolean> {
  // Check if the file info is in the cache
  const fileInfo = fileCache.get(fileId);
  
  if (fileInfo) {
    try {
      await fsPromises.unlink(fileInfo.path);
      fileCache.delete(fileId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  } else {
    // Try to find the file in the storage directory
    try {
      const files = await fsPromises.readdir(STORAGE_DIR);
      const fileEntry = files.find(file => file.startsWith(`${fileId}.`));
      
      if (!fileEntry) {
        return false;
      }
      
      const filePath = path.join(STORAGE_DIR, fileEntry);
      await fsPromises.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

/**
 * Image Generation Cache
 * 
 * Caches generated images to avoid regenerating the same images.
 * Uses prompt hash as cache key for efficient lookup.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cache metadata file
const CACHE_DIR = path.join(process.cwd(), 'public', 'images', 'blog', '.cache');
const CACHE_INDEX_FILE = path.join(CACHE_DIR, 'index.json');

interface CacheEntry {
  promptHash: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  usedCount: number;
  size?: string;
  style?: string;
}

interface CacheIndex {
  [promptHash: string]: CacheEntry;
}

/**
 * Initialize cache directory
 */
function initCache(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(CACHE_INDEX_FILE)) {
    fs.writeFileSync(CACHE_INDEX_FILE, JSON.stringify({}, null, 2), 'utf-8');
  }
}

/**
 * Generate hash from prompt for cache key
 */
function generatePromptHash(prompt: string, size?: string, style?: string): string {
  const content = `${prompt}|${size || 'default'}|${style || 'default'}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Load cache index
 */
function loadCacheIndex(): CacheIndex {
  try {
    initCache();
    const data = fs.readFileSync(CACHE_INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[Image Cache] Error loading cache index:', error);
    return {};
  }
}

/**
 * Save cache index
 */
function saveCacheIndex(index: CacheIndex): void {
  try {
    initCache();
    fs.writeFileSync(CACHE_INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Image Cache] Error saving cache index:', error);
  }
}

/**
 * Check if image exists in cache
 * 
 * @param prompt - Image generation prompt
 * @param size - Image size
 * @param style - Image style
 * @returns Cached image URL or null
 */
export function getCachedImage(
  prompt: string,
  size?: string,
  style?: string
): string | null {
  try {
    const promptHash = generatePromptHash(prompt, size, style);
    const cacheIndex = loadCacheIndex();
    
    const entry = cacheIndex[promptHash];
    
    if (entry) {
      // Verify file still exists
      const filePath = path.join(process.cwd(), 'public', entry.imageUrl);
      if (fs.existsSync(filePath)) {
        // Update used count
        entry.usedCount += 1;
        cacheIndex[promptHash] = entry;
        saveCacheIndex(cacheIndex);
        
        console.log(`[Image Cache] HIT: ${promptHash.substring(0, 8)}... (used ${entry.usedCount} times)`);
        return entry.imageUrl;
      } else {
        // File was deleted, remove from cache
        delete cacheIndex[promptHash];
        saveCacheIndex(cacheIndex);
        console.log(`[Image Cache] STALE: ${promptHash.substring(0, 8)}... removed`);
      }
    }
    
    console.log(`[Image Cache] MISS: ${promptHash.substring(0, 8)}...`);
    return null;
  } catch (error) {
    console.error('[Image Cache] Error checking cache:', error);
    return null;
  }
}

/**
 * Save generated image to cache
 * 
 * @param prompt - Image generation prompt
 * @param imageUrl - Generated image URL (relative path)
 * @param size - Image size
 * @param style - Image style
 */
export function cacheImage(
  prompt: string,
  imageUrl: string,
  size?: string,
  style?: string
): void {
  try {
    const promptHash = generatePromptHash(prompt, size, style);
    const cacheIndex = loadCacheIndex();
    
    cacheIndex[promptHash] = {
      promptHash,
      prompt: prompt.substring(0, 200), // Store truncated prompt
      imageUrl,
      createdAt: new Date().toISOString(),
      usedCount: 1,
      size,
      style,
    };
    
    saveCacheIndex(cacheIndex);
    console.log(`[Image Cache] CACHED: ${promptHash.substring(0, 8)}... -> ${imageUrl}`);
  } catch (error) {
    console.error('[Image Cache] Error caching image:', error);
  }
}

/**
 * Clear old cache entries (older than specified days)
 * 
 * @param daysOld - Remove entries older than this many days
 * @returns Number of entries removed
 */
export function clearOldCache(daysOld: number = 30): number {
  try {
    const cacheIndex = loadCacheIndex();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let removedCount = 0;
    
    for (const [hash, entry] of Object.entries(cacheIndex)) {
      const createdAt = new Date(entry.createdAt);
      if (createdAt < cutoffDate) {
        // Delete file if it exists
        const filePath = path.join(process.cwd(), 'public', entry.imageUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.warn(`[Image Cache] Failed to delete ${filePath}:`, err);
          }
        }
        
        delete cacheIndex[hash];
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      saveCacheIndex(cacheIndex);
      console.log(`[Image Cache] Cleared ${removedCount} old entries (${daysOld}+ days)`);
    }
    
    return removedCount;
  } catch (error) {
    console.error('[Image Cache] Error clearing old cache:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  totalSize: string;
  oldestEntry: string;
  newestEntry: string;
  mostUsed: CacheEntry | null;
} {
  try {
    const cacheIndex = loadCacheIndex();
    const entries = Object.values(cacheIndex);
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        totalSize: '0 KB',
        oldestEntry: 'N/A',
        newestEntry: 'N/A',
        mostUsed: null,
      };
    }
    
    // Calculate total size
    let totalBytes = 0;
    for (const entry of entries) {
      const filePath = path.join(process.cwd(), 'public', entry.imageUrl);
      if (fs.existsSync(filePath)) {
        totalBytes += fs.statSync(filePath).size;
      }
    }
    
    // Find oldest and newest
    const sorted = entries.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Find most used
    const mostUsed = entries.reduce((max, entry) => 
      entry.usedCount > max.usedCount ? entry : max
    , entries[0]);
    
    return {
      totalEntries: entries.length,
      totalSize: formatBytes(totalBytes),
      oldestEntry: sorted[0].createdAt,
      newestEntry: sorted[sorted.length - 1].createdAt,
      mostUsed,
    };
  } catch (error) {
    console.error('[Image Cache] Error getting stats:', error);
    return {
      totalEntries: 0,
      totalSize: '0 KB',
      oldestEntry: 'N/A',
      newestEntry: 'N/A',
      mostUsed: null,
    };
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 KB';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

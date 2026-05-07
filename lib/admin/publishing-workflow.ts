/**
 * Content Publishing Workflow System
 * Manages draft, review, and published states for blog posts and services
 * Includes version history, rollback capabilities, and content scheduling
 */

import fs from 'fs';
import path from 'path';

export type ContentStatus = 'draft' | 'review' | 'published' | 'scheduled' | 'archived';

export interface VersionHistory {
  version: number;
  timestamp: string;
  author: string;
  action: 'created' | 'updated' | 'published' | 'unpublished' | 'rollback';
  changes: string;
  contentSnapshot: any;
}

export interface BlogPostWorkflow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  seoScore?: number;
  status: ContentStatus;
  scheduledDate?: string;
  versionHistory: VersionHistory[];
  currentVersion: number;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
}

export interface ServiceWorkflow {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  gradient: string;
  price: string;
  features: string[];
  benefits: string[];
  suitableFor: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: ContentStatus;
  versionHistory: VersionHistory[];
  currentVersion: number;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
}

const WORKFLOW_DIR = path.join(process.cwd(), 'data', 'workflow');
const BLOG_WORKFLOW_DIR = path.join(WORKFLOW_DIR, 'blog');
const SERVICE_WORKFLOW_DIR = path.join(WORKFLOW_DIR, 'services');
const VERSIONS_DIR = path.join(WORKFLOW_DIR, 'versions');

// Initialize directories
function initializeWorkflowDirs() {
  [WORKFLOW_DIR, BLOG_WORKFLOW_DIR, SERVICE_WORKFLOW_DIR, VERSIONS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

initializeWorkflowDirs();

/**
 * Save blog post with workflow status
 */
export function saveBlogPostWorkflow(post: BlogPostWorkflow): { success: boolean; message: string } {
  try {
    const filePath = path.join(BLOG_WORKFLOW_DIR, `${post.slug}.json`);
    
    // Create version history entry
    const version: VersionHistory = {
      version: post.currentVersion,
      timestamp: new Date().toISOString(),
      author: post.author,
      action: post.currentVersion === 1 ? 'created' : 'updated',
      changes: `Version ${post.currentVersion}`,
      contentSnapshot: { ...post }
    };

    post.versionHistory.push(version);

    // Save workflow file
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8');

    // Save version snapshot
    saveVersionSnapshot('blog', post.slug, post.currentVersion, post);

    return {
      success: true,
      message: `Blog post "${post.title}" saved as ${post.status}`
    };
  } catch (error) {
    console.error('Error saving blog post workflow:', error);
    return {
      success: false,
      message: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Save service with workflow status
 */
export function saveServiceWorkflow(service: ServiceWorkflow): { success: boolean; message: string } {
  try {
    const filePath = path.join(SERVICE_WORKFLOW_DIR, `${service.slug}.json`);
    
    const version: VersionHistory = {
      version: service.currentVersion,
      timestamp: new Date().toISOString(),
      author: service.name,
      action: service.currentVersion === 1 ? 'created' : 'updated',
      changes: `Version ${service.currentVersion}`,
      contentSnapshot: { ...service }
    };

    service.versionHistory.push(version);

    fs.writeFileSync(filePath, JSON.stringify(service, null, 2), 'utf-8');
    saveVersionSnapshot('service', service.slug, service.currentVersion, service);

    return {
      success: true,
      message: `Service "${service.name}" saved as ${service.status}`
    };
  } catch (error) {
    console.error('Error saving service workflow:', error);
    return {
      success: false,
      message: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Change content status (draft → review → published)
 */
export function changeContentStatus(
  type: 'blog' | 'service',
  slug: string,
  newStatus: ContentStatus,
  author: string,
  reviewedBy?: string
): { success: boolean; message: string } {
  try {
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    const filePath = path.join(dir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Content not found' };
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const oldStatus = content.status;

    // Update status
    content.status = newStatus;
    content.currentVersion += 1;

    if (reviewedBy) {
      content.reviewedBy = reviewedBy;
      content.reviewedAt = new Date().toISOString();
    }

    if (newStatus === 'published') {
      content.publishedAt = new Date().toISOString();
    }

    // Add version history
    const version: VersionHistory = {
      version: content.currentVersion,
      timestamp: new Date().toISOString(),
      author,
      action: newStatus === 'published' ? 'published' : newStatus === 'draft' ? 'unpublished' : 'updated',
      changes: `Status changed: ${oldStatus} → ${newStatus}`,
      contentSnapshot: { ...content }
    };

    content.versionHistory.push(version);

    // Save updated content
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    saveVersionSnapshot(type, slug, content.currentVersion, content);

    return {
      success: true,
      message: `Status changed to ${newStatus}`
    };
  } catch (error) {
    console.error('Error changing content status:', error);
    return {
      success: false,
      message: `Failed to change status: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Rollback to previous version
 */
export function rollbackToVersion(
  type: 'blog' | 'service',
  slug: string,
  targetVersion: number,
  author: string
): { success: boolean; message: string; content?: any } {
  try {
    const versionFile = path.join(VERSIONS_DIR, type, slug, `v${targetVersion}.json`);

    if (!fs.existsSync(versionFile)) {
      return { success: false, message: `Version ${targetVersion} not found` };
    }

    const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    const currentFile = path.join(dir, `${slug}.json`);

    if (!fs.existsSync(currentFile)) {
      return { success: false, message: 'Current content not found' };
    }

    const currentContent = JSON.parse(fs.readFileSync(currentFile, 'utf-8'));

    // Restore content from version
    const restoredContent = { ...versionData.contentSnapshot };
    restoredContent.currentVersion += 1;
    restoredContent.status = 'draft'; // Rollback to draft

    // Add rollback to version history
    restoredContent.versionHistory.push({
      version: restoredContent.currentVersion,
      timestamp: new Date().toISOString(),
      author,
      action: 'rollback',
      changes: `Rolled back from v${currentContent.currentVersion} to v${targetVersion}`,
      contentSnapshot: { ...restoredContent }
    });

    // Save restored content
    fs.writeFileSync(currentFile, JSON.stringify(restoredContent, null, 2), 'utf-8');

    return {
      success: true,
      message: `Rolled back to version ${targetVersion}`,
      content: restoredContent
    };
  } catch (error) {
    console.error('Error rolling back:', error);
    return {
      success: false,
      message: `Failed to rollback: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get version history for content
 */
export function getVersionHistory(
  type: 'blog' | 'service',
  slug: string
): { success: boolean; versions?: VersionHistory[]; message: string } {
  try {
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    const filePath = path.join(dir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Content not found', versions: [] };
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return {
      success: true,
      versions: content.versionHistory || [],
      message: 'Version history retrieved'
    };
  } catch (error) {
    console.error('Error getting version history:', error);
    return {
      success: false,
      message: `Failed to get history: ${error instanceof Error ? error.message : 'Unknown error'}`,
      versions: []
    };
  }
}

/**
 * Get all content by status
 */
export function getContentByStatus(
  type: 'blog' | 'service',
  status: ContentStatus
): any[] {
  try {
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const items: any[] = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (content.status === status) {
        items.push(content);
      }
    }

    return items;
  } catch (error) {
    console.error('Error getting content by status:', error);
    return [];
  }
}

/**
 * Get scheduled content
 */
export function getScheduledContent(): Array<{ type: 'blog' | 'service'; item: any }> {
  try {
    const scheduled: Array<{ type: 'blog' | 'service'; item: any }> = [];

    // Check blog posts
    const blogPosts = getContentByStatus('blog', 'scheduled');
    blogPosts.forEach(post => {
      if (post.scheduledDate && new Date(post.scheduledDate) <= new Date()) {
        scheduled.push({ type: 'blog', item: post });
      }
    });

    return scheduled;
  } catch (error) {
    console.error('Error getting scheduled content:', error);
    return [];
  }
}

/**
 * Publish scheduled content
 */
export function publishScheduledContent(author: string): { success: boolean; published: number; message: string } {
  try {
    const scheduled = getScheduledContent();
    let publishedCount = 0;

    for (const { type, item } of scheduled) {
      changeContentStatus(type, item.slug, 'published', author);
      publishedCount++;
    }

    return {
      success: true,
      published: publishedCount,
      message: `Published ${publishedCount} scheduled items`
    };
  } catch (error) {
    console.error('Error publishing scheduled content:', error);
    return {
      success: false,
      published: 0,
      message: `Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Save version snapshot
 */
function saveVersionSnapshot(
  type: 'blog' | 'service',
  slug: string,
  version: number,
  content: any
): void {
  try {
    const versionDir = path.join(VERSIONS_DIR, type, slug);
    
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
    }

    const versionFile = path.join(versionDir, `v${version}.json`);
    fs.writeFileSync(versionFile, JSON.stringify(content, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving version snapshot:', error);
  }
}

/**
 * Get content preview (for draft preview)
 */
export function getContentPreview(type: 'blog' | 'service', slug: string): { success: boolean; content?: any; message: string } {
  try {
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    const filePath = path.join(dir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Content not found' };
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return { success: true, content, message: 'Preview retrieved' };
  } catch (error) {
    console.error('Error getting preview:', error);
    return {
      success: false,
      message: `Failed to get preview: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Delete content workflow
 */
export function deleteContentWorkflow(type: 'blog' | 'service', slug: string): { success: boolean; message: string } {
  try {
    const dir = type === 'blog' ? BLOG_WORKFLOW_DIR : SERVICE_WORKFLOW_DIR;
    const filePath = path.join(dir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Content not found' };
    }

    fs.unlinkSync(filePath);

    // Delete version history
    const versionDir = path.join(VERSIONS_DIR, type, slug);
    if (fs.existsSync(versionDir)) {
      fs.rmSync(versionDir, { recursive: true });
    }

    return {
      success: true,
      message: 'Content deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting content:', error);
    return {
      success: false,
      message: `Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

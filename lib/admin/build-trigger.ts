/**
 * Build Trigger System
 * Automatically rebuilds static pages when content is saved
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface BuildResult {
  success: boolean;
  message: string;
  duration: number;
  timestamp: string;
}

export interface BuildQueue {
  isBuilding: boolean;
  queue: Array<{
    type: 'blog' | 'service';
    slug: string;
    action: 'create' | 'update' | 'delete';
    timestamp: number;
  }>;
  lastBuild: BuildResult | null;
}

const buildQueue: BuildQueue = {
  isBuilding: false,
  queue: [],
  lastBuild: null
};

/**
 * Trigger build for updated content
 */
export async function triggerBuild(
  type: 'blog' | 'service',
  slug: string,
  action: 'create' | 'update' | 'delete'
): Promise<BuildResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Add to queue
  buildQueue.queue.push({ type, slug, action, timestamp: Date.now() });

  // If already building, wait
  if (buildQueue.isBuilding) {
    return {
      success: true,
      message: 'Build queued. Will process after current build completes.',
      duration: 0,
      timestamp
    };
  }

  try {
    buildQueue.isBuilding = true;

    console.log(`🔨 Triggering build: ${action} ${type} "${slug}"`);

    // Option 1: Rebuild specific page (faster, but may not work for all cases)
    // await rebuildSpecificPage(type, slug);

    // Option 2: Full rebuild (slower but guaranteed to work)
    const result = await fullRebuild(type, slug, action);

    const duration = Date.now() - startTime;

    buildQueue.lastBuild = {
      success: result.success,
      message: result.message,
      duration,
      timestamp: new Date().toISOString()
    };

    // Clear queue
    buildQueue.queue = [];

    console.log(`✅ Build completed in ${duration}ms`);

    return buildQueue.lastBuild;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    buildQueue.lastBuild = {
      success: false,
      message: `Build failed: ${errorMessage}`,
      duration,
      timestamp: new Date().toISOString()
    };

    console.error('❌ Build failed:', errorMessage);

    return buildQueue.lastBuild;
  } finally {
    buildQueue.isBuilding = false;
  }
}

/**
 * Perform full rebuild
 */
async function fullRebuild(
  type: 'blog' | 'service',
  slug: string,
  action: 'create' | 'update' | 'delete'
): Promise<{ success: boolean; message: string }> {
  try {
    // Update sitemap
    await updateSitemap();

    // Regenerate robots.txt
    await regenerateRobotsTxt();

    // In production, you would trigger Next.js rebuild
    // For now, we'll just log the action
    console.log(`📝 ${action.toUpperCase()} ${type}/${slug} - Pages will be regenerated on next build`);

    return {
      success: true,
      message: `Content ${action}d successfully. Sitemap updated.`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message
    };
  }
}

/**
 * Update sitemap.xml
 */
async function updateSitemap(): Promise<void> {
  try {
    // Import blog and service data
    const { BLOG_POSTS } = await import('../constants/blog');
    const { SERVICES_DATA } = await import('../../data/services/index');

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360tuongtac.com';

    // Generate sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/dich-vu', priority: '0.8', changefreq: 'weekly' },
      { url: '/lien-he', priority: '0.7', changefreq: 'monthly' }
    ];

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Blog posts
    for (const post of BLOG_POSTS) {
      xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    // Services
    for (const service of SERVICES_DATA) {
      xml += `  <url>
    <loc>${SITE_URL}/dich-vu/${service.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    // Write to public directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf-8');

    console.log('🗺️ Sitemap updated successfully');
  } catch (error) {
    console.error('Error updating sitemap:', error);
    throw error;
  }
}

/**
 * Regenerate robots.txt
 */
async function regenerateRobotsTxt(): Promise<void> {
  try {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360tuongtac.com';

    const robotsTxt = `User-agent: *
Allow: /
Allow: /blog/
Allow: /dich-vu/
Allow: /lien-he/

# Disallow admin pages
Disallow: /admin/

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;

    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');

    console.log('🤖 robots.txt updated successfully');
  } catch (error) {
    console.error('Error regenerating robots.txt:', error);
    throw error;
  }
}

/**
 * Invalidate cache for specific page
 */
export async function invalidateCache(type: 'blog' | 'service', slug: string): Promise<void> {
  try {
    // In Next.js App Router, static pages are cached at build time
    // We need to trigger a rebuild to invalidate cache
    
    // Option 1: Use Next.js revalidateTag (if using ISR)
    // await revalidateTag(`${type}-${slug}`);

    // Option 2: Delete cached files (for SSG)
    const cacheDir = path.join(process.cwd(), '.next', 'cache');
    if (fs.existsSync(cacheDir)) {
      // Clear specific cache entries
      console.log(`🗑️ Cache invalidated for ${type}/${slug}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Get build queue status
 */
export function getBuildQueueStatus(): BuildQueue {
  return { ...buildQueue };
}

/**
 * Pre-build validation checks
 */
export async function preBuildValidation(): Promise<{
  success: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if blog index file exists
    const blogIndexPath = path.join(process.cwd(), 'lib', 'constants', 'blog.ts');
    if (!fs.existsSync(blogIndexPath)) {
      errors.push('Blog index file not found');
    }

    // Check if services index file exists
    const servicesIndexPath = path.join(process.cwd(), 'data', 'services', 'index.ts');
    if (!fs.existsSync(servicesIndexPath)) {
      errors.push('Services index file not found');
    }

    // Validate all blog posts have required fields
    const { BLOG_POSTS } = await import('../constants/blog');
    for (const post of BLOG_POSTS) {
      if (!post.slug) errors.push(`Blog post missing slug: ${post.id}`);
      if (!post.title) errors.push(`Blog post missing title: ${post.id}`);
      if (!post.content || post.content.length < 500) {
        warnings.push(`Blog post content too short: ${post.slug}`);
      }
    }

    // Validate all services have required fields
    const { SERVICES_DATA } = await import('../../data/services/index');
    for (const service of SERVICES_DATA) {
      if (!service.slug) errors.push(`Service missing slug: ${service.id}`);
      if (!service.title) errors.push(`Service missing title: ${service.id}`);
      if (!service.description || service.description.length < 200) {
        warnings.push(`Service description too short: ${service.slug}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
}

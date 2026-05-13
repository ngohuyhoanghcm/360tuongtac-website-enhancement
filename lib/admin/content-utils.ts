/**
 * Content Management Utilities
 * Search, filtering, bulk operations, scheduling, and export/import
 */

import fs from 'fs';
import path from 'path';
import { BlogPostData, ServiceData } from './file-writer';

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  minSEOScore?: number;
  featured?: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

export interface ContentExport {
  type: 'blog' | 'service';
  format: 'json' | 'csv' | 'markdown';
  data: any[];
  exportDate: string;
  totalCount: number;
}

/**
 * Search blog posts with filters
 */
export function searchBlogPosts(filters: SearchFilters = {}): BlogPostData[] {
  try {
    const blogDir = path.join(process.cwd(), 'data', 'blog');
    
    if (!fs.existsSync(blogDir)) {
      console.warn('[searchBlogPosts] Blog directory not found:', blogDir);
      return [];
    }
    
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    const posts: BlogPostData[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(blogDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse TypeScript export to extract blog post data
        const post = parseBlogPostFromTSFile(fileContent);
        if (post && matchesFilters(post, filters)) {
          posts.push(post);
        }
      } catch (error) {
        console.error(`Error parsing ${file}:`, error);
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

/**
 * Search services with filters
 */
export function searchServices(filters: SearchFilters = {}): ServiceData[] {
  try {
    const serviceDir = path.join(process.cwd(), 'data', 'services');
    
    if (!fs.existsSync(serviceDir)) {
      console.warn('[searchServices] Services directory not found:', serviceDir);
      return [];
    }
    
    const files = fs.readdirSync(serviceDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    const services: ServiceData[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(serviceDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const service = parseServiceFromFile(content);
        if (service && matchesServiceFilters(service, filters)) {
          services.push(service);
        }
      } catch (error) {
        console.error(`Error parsing ${file}:`, error);
      }
    }

    return services.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error searching services:', error);
    return [];
  }
}

/**
 * Bulk update blog posts
 */
export function bulkUpdateBlogPosts(
  slugs: string[],
  updates: Partial<BlogPostData>,
  author: string
): BulkOperationResult {
  const result: BulkOperationResult = {
    success: true,
    processed: slugs.length,
    succeeded: 0,
    failed: 0,
    errors: []
  };

  for (const slug of slugs) {
    try {
      const blogDir = path.join(process.cwd(), 'lib', 'constants');
      const filePath = path.join(blogDir, `${slug}.ts`);

      if (!fs.existsSync(filePath)) {
        result.failed++;
        result.errors.push(`Post "${slug}" not found`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const post = parseBlogPostFromFile(content);

      if (!post) {
        result.failed++;
        result.errors.push(`Failed to parse post "${slug}"`);
        continue;
      }

      // Apply updates
      const updatedPost = { ...post, ...updates };

      // Save updated post
      fs.writeFileSync(filePath, generateBlogPostTS(updatedPost), 'utf-8');
      result.succeeded++;
    } catch (error) {
      result.failed++;
      result.errors.push(`Error updating "${slug}": ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  result.success = result.failed === 0;
  return result;
}

/**
 * Bulk delete blog posts
 */
export function bulkDeleteBlogPosts(slugs: string[]): BulkOperationResult {
  const result: BulkOperationResult = {
    success: true,
    processed: slugs.length,
    succeeded: 0,
    failed: 0,
    errors: []
  };

  for (const slug of slugs) {
    try {
      const blogDir = path.join(process.cwd(), 'lib', 'constants');
      const filePath = path.join(blogDir, `${slug}.ts`);

      if (!fs.existsSync(filePath)) {
        result.failed++;
        result.errors.push(`Post "${slug}" not found`);
        continue;
      }

      fs.unlinkSync(filePath);
      result.succeeded++;
    } catch (error) {
      result.failed++;
      result.errors.push(`Error deleting "${slug}": ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  result.success = result.failed === 0;
  return result;
}

/**
 * Schedule content for future publishing
 */
export function scheduleContent(
  type: 'blog' | 'service',
  slug: string,
  publishDate: string
): { success: boolean; message: string } {
  try {
    const scheduleDir = path.join(process.cwd(), 'data', 'schedule');
    
    if (!fs.existsSync(scheduleDir)) {
      fs.mkdirSync(scheduleDir, { recursive: true });
    }

    const scheduleFile = path.join(scheduleDir, `${type}-${slug}.json`);
    const scheduleData = {
      type,
      slug,
      publishDate,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    fs.writeFileSync(scheduleFile, JSON.stringify(scheduleData, null, 2), 'utf-8');

    return {
      success: true,
      message: `Scheduled ${type} "${slug}" for ${publishDate}`
    };
  } catch (error) {
    console.error('Error scheduling content:', error);
    return {
      success: false,
      message: `Failed to schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get scheduled content
 */
export function getScheduledContent(): Array<{
  type: 'blog' | 'service';
  slug: string;
  publishDate: string;
  status: string;
}> {
  try {
    const scheduleDir = path.join(process.cwd(), 'data', 'schedule');
    
    if (!fs.existsSync(scheduleDir)) {
      return [];
    }

    const files = fs.readdirSync(scheduleDir).filter(f => f.endsWith('.json'));
    const scheduled: any[] = [];

    for (const file of files) {
      const filePath = path.join(scheduleDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      scheduled.push(data);
    }

    return scheduled.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
  } catch (error) {
    console.error('Error getting scheduled content:', error);
    return [];
  }
}

/**
 * Export content to JSON
 */
export function exportContent(
  type: 'blog' | 'service',
  format: 'json' | 'csv' | 'markdown' = 'json'
): ContentExport {
  try {
    let data: any[] = [];

    if (type === 'blog') {
      data = searchBlogPosts();
    } else {
      data = searchServices();
    }

    return {
      type,
      format,
      data,
      exportDate: new Date().toISOString(),
      totalCount: data.length
    };
  } catch (error) {
    console.error('Error exporting content:', error);
    return {
      type,
      format,
      data: [],
      exportDate: new Date().toISOString(),
      totalCount: 0
    };
  }
}

/**
 * Import content from JSON
 */
export function importContent(
  type: 'blog' | 'service',
  jsonData: string
): BulkOperationResult {
  const result: BulkOperationResult = {
    success: true,
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: []
  };

  try {
    const items = JSON.parse(jsonData);
    result.processed = items.length;

    for (const item of items) {
      try {
        if (type === 'blog') {
          const filePath = path.join(process.cwd(), 'lib', 'constants', `${item.slug}.ts`);
          fs.writeFileSync(filePath, generateBlogPostTS(item), 'utf-8');
        } else {
          const filePath = path.join(process.cwd(), 'data', 'services', `${item.slug}.ts`);
          fs.writeFileSync(filePath, generateServiceTS(item), 'utf-8');
        }
        result.succeeded++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Error importing "${item.slug}": ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }

    result.success = result.failed === 0;
  } catch (error) {
    result.success = false;
    result.errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return result;
}

/**
 * Get content statistics
 */
export function getContentStats(): {
  totalBlogPosts: number;
  totalServices: number;
  avgSEOScore: number;
  categories: Record<string, number>;
  recentPosts: number;
} {
  try {
    const blogPosts = searchBlogPosts();
    const services = searchServices();

    const categories: Record<string, number> = {};
    let totalSEOScore = 0;

    blogPosts.forEach(post => {
      categories[post.category] = (categories[post.category] || 0) + 1;
      totalSEOScore += post.seoScore || 0;
    });

    const recentPosts = blogPosts.filter(post => {
      const daysDiff = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length;

    return {
      totalBlogPosts: blogPosts.length,
      totalServices: services.length,
      avgSEOScore: blogPosts.length > 0 ? Math.round(totalSEOScore / blogPosts.length) : 0,
      categories,
      recentPosts
    };
  } catch (error) {
    console.error('Error getting content stats:', error);
    return {
      totalBlogPosts: 0,
      totalServices: 0,
      avgSEOScore: 0,
      categories: {},
      recentPosts: 0
    };
  }
}

// Helper functions

/**
 * Parse blog post from TypeScript export file (data/blog/*.ts)
 */
function parseBlogPostFromTSFile(content: string): BlogPostData | null {
  try {
    const extractField = (field: string): string => {
      // Try single quotes first, then double quotes
      const matchSingle = content.match(new RegExp(`${field}:\\s*'([^']*)'`));
      if (matchSingle) return matchSingle[1];
      const matchDouble = content.match(new RegExp(`${field}:\\s*"([^"]*)"`));
      return matchDouble ? matchDouble[1] : '';
    };

    const extractArray = (field: string): string[] => {
      const match = content.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
      if (!match) return [];
      return match[1].match(/"([^"]*)"|'([^']*)'/g)?.map(s => s.replace(/"/g, '').replace(/'/g, '')) || [];
    };

    // Extract date - handle DD/MM/YYYY format
    const dateStr = extractField('date');
    let parsedDate = dateStr;
    if (dateStr && dateStr.includes('/')) {
      // Convert DD/MM/YYYY to ISO format for sorting
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        parsedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    return {
      id: extractField('id'),
      slug: extractField('slug'),
      title: extractField('title'),
      excerpt: extractField('excerpt'),
      content: '', // Will be populated from content field if needed
      author: extractField('author'),
      date: dateStr, // Keep original DD/MM/YYYY format for display
      readTime: extractField('readTime'),
      category: extractField('category'),
      tags: extractArray('tags'),
      imageUrl: extractField('featuredImage') || extractField('imageUrl'),
      imageAlt: extractField('alt') || extractField('imageAlt'),
      metaTitle: extractField('metaTitle'),
      metaDescription: extractField('metaDescription'),
      featured: content.includes('featured: true'),
      seoScore: 0 // Will be calculated by auditBlogSEO
    };
  } catch (error) {
    console.error('Error parsing blog post from TS file:', error);
    return null;
  }
}

function parseBlogPostFromFile(content: string): BlogPostData | null {
  try {
    const extractField = (field: string): string => {
      const match = content.match(new RegExp(`${field}:\\s*"([^"]*)"`));
      return match ? match[1] : '';
    };

    const extractArray = (field: string): string[] => {
      const match = content.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
      if (!match) return [];
      return match[1].match(/"([^"]*)"/g)?.map(s => s.replace(/"/g, '')) || [];
    };

    return {
      id: extractField('id'),
      slug: extractField('slug'),
      title: extractField('title'),
      excerpt: extractField('excerpt'),
      content: '',
      author: extractField('author'),
      date: extractField('date'),
      readTime: extractField('readTime'),
      category: extractField('category'),
      tags: extractArray('tags'),
      imageUrl: extractField('imageUrl'),
      imageAlt: extractField('imageAlt'),
      metaTitle: extractField('metaTitle'),
      metaDescription: extractField('metaDescription'),
      featured: content.includes('featured: true'),
      seoScore: 0
    };
  } catch (error) {
    return null;
  }
}

function parseServiceFromFile(content: string): ServiceData | null {
  try {
    const extractField = (field: string): string => {
      const match = content.match(new RegExp(`${field}:\\s*"([^"]*)"`));
      return match ? match[1] : '';
    };

    const extractArray = (field: string): string[] => {
      const match = content.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
      if (!match) return [];
      return match[1].match(/"([^"]*)"/g)?.map(s => s.replace(/"/g, '')) || [];
    };

    return {
      id: extractField('id'),
      slug: extractField('slug'),
      name: extractField('name'),
      shortDescription: extractField('shortDescription'),
      description: '',
      icon: extractField('icon'),
      gradient: extractField('gradient'),
      price: extractField('price'),
      features: extractArray('features'),
      benefits: extractArray('benefits'),
      suitableFor: extractArray('suitableFor'),
      metaTitle: extractField('metaTitle'),
      metaDescription: extractField('metaDescription')
    };
  } catch (error) {
    return null;
  }
}

function matchesFilters(post: BlogPostData, filters: SearchFilters): boolean {
  if (filters.query) {
    const query = filters.query.toLowerCase();
    const matchesTitle = post.title.toLowerCase().includes(query);
    const matchesContent = post.content.toLowerCase().includes(query);
    const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(query));
    
    if (!matchesTitle && !matchesContent && !matchesTags) {
      return false;
    }
  }

  if (filters.category && post.category !== filters.category) {
    return false;
  }

  if (filters.tags && filters.tags.length > 0) {
    const hasTag = filters.tags.some(tag => post.tags.includes(tag));
    if (!hasTag) return false;
  }

  if (filters.dateFrom && new Date(post.date) < new Date(filters.dateFrom)) {
    return false;
  }

  if (filters.dateTo && new Date(post.date) > new Date(filters.dateTo)) {
    return false;
  }

  if (filters.author && post.author !== filters.author) {
    return false;
  }

  if (filters.minSEOScore && (post.seoScore || 0) < filters.minSEOScore) {
    return false;
  }

  if (filters.featured !== undefined && post.featured !== filters.featured) {
    return false;
  }

  return true;
}

function matchesServiceFilters(service: ServiceData, filters: SearchFilters): boolean {
  if (filters.query) {
    const query = filters.query.toLowerCase();
    const matchesName = service.name.toLowerCase().includes(query);
    const matchesDesc = service.description.toLowerCase().includes(query);
    
    if (!matchesName && !matchesDesc) {
      return false;
    }
  }

  return true;
}

function generateBlogPostTS(post: BlogPostData): string {
  return `import { BlogPost } from './blog';

export const ${post.id}: BlogPost = {
  id: "${post.id}",
  slug: "${post.slug}",
  title: "${post.title}",
  excerpt: "${post.excerpt}",
  content: \`${post.content}\`,
  author: "${post.author}",
  date: "${post.date}",
  readTime: "${post.readTime}",
  category: "${post.category}",
  tags: [${post.tags.map(t => `"${t}"`).join(', ')}],
  imageUrl: "${post.imageUrl}",
  imageAlt: "${post.imageAlt}",
  metaTitle: "${post.metaTitle || ''}",
  metaDescription: "${post.metaDescription || ''}",
  featured: ${post.featured || false},
  seoScore: ${post.seoScore || 0}
};
`;
}

function generateServiceTS(service: ServiceData): string {
  return `import { ServiceItem } from './index';

export const ${service.id}: ServiceItem = {
  id: "${service.id}",
  slug: "${service.slug}",
  name: "${service.name}",
  shortDescription: "${service.shortDescription}",
  description: \`${service.description}\`,
  icon: "${service.icon}",
  gradient: "${service.gradient}",
  price: "${service.price}",
  features: [${service.features.map(f => `"${f}"`).join(', ')}],
  benefits: [${service.benefits.map(b => `"${b}"`).join(', ')}],
  suitableFor: [${service.suitableFor.map(s => `"${s}"`).join(', ')}],
  metaTitle: "${service.metaTitle || ''}",
  metaDescription: "${service.metaDescription || ''}"
};
`;
}

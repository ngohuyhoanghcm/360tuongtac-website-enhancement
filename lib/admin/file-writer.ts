/**
 * File Writer Utility for HYBRID Content Management System
 * Handles reading/writing blog posts and services as TypeScript files
 * Updates index files automatically
 */

import fs from 'fs';
import path from 'path';

// Base paths
const PROJECT_ROOT = process.cwd();
const BLOG_DATA_DIR = path.join(PROJECT_ROOT, 'lib', 'constants');
const SERVICES_DATA_DIR = path.join(PROJECT_ROOT, 'data', 'services');
const BLOG_INDEX_FILE = path.join(BLOG_DATA_DIR, 'blog.ts');
const SERVICES_INDEX_FILE = path.join(SERVICES_DATA_DIR, 'index.ts');

export interface BlogPostData {
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
}

export interface ServiceData {
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
}

/**
 * Save blog post as TypeScript file
 */
export async function saveBlogPost(post: BlogPostData): Promise<{ success: boolean; message: string }> {
  try {
    // Generate file content
    const fileContent = generateBlogPostFile(post);
    
    // Write file
    const filePath = path.join(BLOG_DATA_DIR, `${post.slug}.ts`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    
    // Update index file
    await updateBlogIndex();
    
    return {
      success: true,
      message: `Blog post "${post.title}" saved successfully`
    };
  } catch (error) {
    console.error('Error saving blog post:', error);
    return {
      success: false,
      message: `Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generate TypeScript file content for blog post
 */
function generateBlogPostFile(post: BlogPostData): string {
  return `import { BlogPost } from './blog';

export const ${post.id}: BlogPost = {
  id: "${post.id}",
  slug: "${post.slug}",
  title: "${escapeString(post.title)}",
  excerpt: "${escapeString(post.excerpt)}",
  content: \`${escapeTemplateString(post.content)}\`,
  author: "${escapeString(post.author)}",
  date: "${post.date}",
  readTime: "${post.readTime}",
  category: "${post.category}",
  tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}],
  imageUrl: "${post.imageUrl}",
  imageAlt: "${escapeString(post.imageAlt)}",
  metaTitle: "${escapeString(post.metaTitle || post.title)}",
  metaDescription: "${escapeString(post.metaDescription || post.excerpt)}",
  featured: ${post.featured || false},
  seoScore: ${post.seoScore || 0}
};
`;
}

/**
 * Update blog index file to include new post
 */
async function updateBlogIndex(): Promise<void> {
  try {
    // Read all blog post files
    const files = fs.readdirSync(BLOG_DATA_DIR)
      .filter(file => file.endsWith('.ts') && file !== 'blog.ts' && !file.startsWith('_'));
    
    // Generate import statements
    const imports = files.map(file => {
      const slug = file.replace('.ts', '');
      const id = slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      return `import { ${id} } from './${slug}';`;
    }).join('\n');
    
    // Generate array
    const postIds = files.map(file => {
      const slug = file.replace('.ts', '');
      const id = slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      return `  ${id}`;
    }).join(',\n');
    
    // Read existing blog.ts to preserve type definitions
    const existingContent = fs.readFileSync(BLOG_INDEX_FILE, 'utf-8');
    
    // Extract type definitions (everything before imports)
    const typeSection = existingContent.split('import')[0] || '';
    
    // Generate new content
    const newContent = `${typeSection}
${imports}

export const allBlogPosts: BlogPost[] = [
${postIds}
];
`;
    
    fs.writeFileSync(BLOG_INDEX_FILE, newContent, 'utf-8');
  } catch (error) {
    console.error('Error updating blog index:', error);
    throw error;
  }
}

/**
 * Save service as TypeScript file
 */
export async function saveService(service: ServiceData): Promise<{ success: boolean; message: string }> {
  try {
    // Generate file content
    const fileContent = generateServiceFile(service);
    
    // Write file
    const filePath = path.join(SERVICES_DATA_DIR, `${service.slug}.ts`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    
    // Update index file
    await updateServicesIndex();
    
    return {
      success: true,
      message: `Service "${service.name}" saved successfully`
    };
  } catch (error) {
    console.error('Error saving service:', error);
    return {
      success: false,
      message: `Failed to save service: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generate TypeScript file content for service
 */
function generateServiceFile(service: ServiceData): string {
  return `import { ServiceItem } from './index';

export const ${service.id}: ServiceItem = {
  id: "${service.id}",
  slug: "${service.slug}",
  name: "${escapeString(service.name)}",
  shortDescription: "${escapeString(service.shortDescription)}",
  description: \`${escapeTemplateString(service.description)}\`,
  icon: "${service.icon}",
  gradient: "${service.gradient}",
  price: "${escapeString(service.price)}",
  features: [${service.features.map(f => `"${f}"`).join(', ')}],
  benefits: [${service.benefits.map(b => `"${b}"`).join(', ')}],
  suitableFor: [${service.suitableFor.map(s => `"${s}"`).join(', ')}],
  metaTitle: "${escapeString(service.metaTitle || service.name)}",
  metaDescription: "${escapeString(service.metaDescription || service.shortDescription)}"
};
`;
}

/**
 * Update services index file
 */
async function updateServicesIndex(): Promise<void> {
  try {
    // Read all service files
    const files = fs.readdirSync(SERVICES_DATA_DIR)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts' && !file.startsWith('_'));
    
    // Generate import statements
    const imports = files.map(file => {
      const slug = file.replace('.ts', '');
      const id = slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      return `import { ${id} } from './${slug}';`;
    }).join('\n');
    
    // Generate array
    const serviceIds = files.map(file => {
      const slug = file.replace('.ts', '');
      const id = slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      return `  ${id}`;
    }).join(',\n');
    
    // Read existing index.ts to preserve type definitions
    const existingContent = fs.readFileSync(SERVICES_INDEX_FILE, 'utf-8');
    
    // Extract type definitions
    const typeSection = existingContent.split('import')[0] || '';
    
    // Generate new content
    const newContent = `${typeSection}
${imports}

export const allServices: ServiceItem[] = [
${serviceIds}
];

export default allServices;
`;
    
    fs.writeFileSync(SERVICES_INDEX_FILE, newContent, 'utf-8');
  } catch (error) {
    console.error('Error updating services index:', error);
    throw error;
  }
}

/**
 * Delete blog post
 */
export async function deleteBlogPost(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    const filePath = path.join(BLOG_DATA_DIR, `${slug}.ts`);
    
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `Blog post "${slug}" not found`
      };
    }
    
    fs.unlinkSync(filePath);
    await updateBlogIndex();
    
    return {
      success: true,
      message: `Blog post "${slug}" deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      message: `Failed to delete blog post: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Delete service
 */
export async function deleteService(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    const filePath = path.join(SERVICES_DATA_DIR, `${slug}.ts`);
    
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `Service "${slug}" not found`
      };
    }
    
    fs.unlinkSync(filePath);
    await updateServicesIndex();
    
    return {
      success: true,
      message: `Service "${slug}" deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      success: false,
      message: `Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Escape string for safe embedding in TypeScript
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * Escape template literal string
 */
function escapeTemplateString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
}

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPostData[] {
  try {
    const files = fs.readdirSync(BLOG_DATA_DIR)
      .filter(file => file.endsWith('.ts') && file !== 'blog.ts' && !file.startsWith('_'));
    
    const posts: BlogPostData[] = [];
    
    for (const file of files) {
      const filePath = path.join(BLOG_DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Parse file content to extract blog post data
      const post = parseBlogPostFile(content);
      if (post) {
        posts.push(post);
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * Parse blog post file content
 */
function parseBlogPostFile(content: string): BlogPostData | null {
  try {
    // Simple regex-based parsing (in production, use AST parser)
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
      content: '', // Extracted separately if needed
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
    console.error('Error parsing blog post file:', error);
    return null;
  }
}

/**
 * Get all services
 */
export function getAllServices(): ServiceData[] {
  try {
    const files = fs.readdirSync(SERVICES_DATA_DIR)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts' && !file.startsWith('_'));
    
    const services: ServiceData[] = [];
    
    for (const file of files) {
      const filePath = path.join(SERVICES_DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const service = parseServiceFile(content);
      if (service) {
        services.push(service);
      }
    }
    
    return services;
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

/**
 * Parse service file content
 */
function parseServiceFile(content: string): ServiceData | null {
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
      description: '', // Extracted separately if needed
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
    console.error('Error parsing service file:', error);
    return null;
  }
}

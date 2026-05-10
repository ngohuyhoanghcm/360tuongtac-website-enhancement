/**
 * Script to rebuild blog.ts index from all blog posts in data/blog/
 * Run: npx tsx scripts/rebuild-blog-index.ts
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const BLOG_DATA_DIR = path.join(PROJECT_ROOT, 'data', 'blog');
const BLOG_INDEX_FILE = path.join(PROJECT_ROOT, 'lib', 'constants', 'blog.ts');

function generateSafeId(slug: string): string {
  let id = slug.replace(/-([a-z0-9])/g, (match, letter) => letter.toUpperCase());
  
  if (/^[0-9]/.test(id)) {
    id = 'post_' + id;
  }
  
  id = id.replace(/[^a-zA-Z0-9_]/g, '');
  
  return id;
}

async function rebuildBlogIndex() {
  try {
    console.log('🔄 Rebuilding blog index from data/blog/...');
    
    // Read all blog post files from data/blog/
    const files = fs.readdirSync(BLOG_DATA_DIR)
      .filter(file => file.endsWith('.ts') && !file.startsWith('_'));
    
    console.log(`📁 Found ${files.length} blog posts in data/blog/`);
    
    // Extract variable names from each file
    const fileData = files.map(file => {
      const slug = file.replace('.ts', '');
      const filePath = path.join(BLOG_DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract exported variable name: export const variableName: BlogPost = {
      const match = content.match(/export\s+const\s+(\w+):\s*BlogPost/);
      const variableName = match ? match[1] : generateSafeId(slug);
      
      return {
        slug,
        variableName,
        file
      };
    });
    
    // Generate import statements
    const imports = fileData.map(({ slug, variableName }) => {
      return `import { ${variableName} } from '../data/blog/${slug}';`;
    }).join('\n');
    
    // Generate array
    const postIds = fileData.map(({ variableName }) => {
      return `  ${variableName}`;
    }).join(',\n');
    
    // Generate new blog.ts content
    const newContent = `export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  authorImage?: string;
  featuredImage: string;
  alt: string;
  slug: string;
  featured?: boolean;
  readTime?: string;
  tags?: string[];
  relatedServices?: string[];
  relatedPosts?: string[];
  chart?: {
    type: 'Bar' | 'Area' | 'Pie';
    data: any[];
    xAxisKey?: string;
    dataKey: string;
    nameKey?: string;
    title?: string;
    description?: string;
  };
}

// Auto-generated from data/blog/ directory
// DO NOT EDIT MANUALLY - Run: npx tsx scripts/rebuild-blog-index.ts

${imports}

export const allBlogPosts: BlogPost[] = [
${postIds}
];

// Alias for backwards compatibility
export const BLOG_POSTS: typeof allBlogPosts = allBlogPosts;
`;
    
    // Write to lib/constants/blog.ts
    fs.writeFileSync(BLOG_INDEX_FILE, newContent, 'utf-8');
    
    console.log('✅ Blog index rebuilt successfully!');
    console.log(`📝 Total posts: ${files.length}`);
    console.log(`📄 File: ${BLOG_INDEX_FILE}`);
    console.log('\n📋 Posts imported:');
    fileData.forEach(({ slug, variableName }) => {
      console.log(`  - ${variableName} (from ${slug})`);
    });
    
  } catch (error) {
    console.error(' Error rebuilding blog index:', error);
    process.exit(1);
  }
}

// Run the script
rebuildBlogIndex();

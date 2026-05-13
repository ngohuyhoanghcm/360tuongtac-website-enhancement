/**
 * Related Content Suggestion Module
 * Auto-suggests related services and blog posts based on content similarity
 * 
 * Features:
 * - Analyze current post tags/category to find related content
 * - Suggest services based on category matching
 * - Suggest blog posts based on tag similarity
 * - Provide fallback suggestions when AI doesn't return fields
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RelatedContentSuggestions {
  relatedServices: string[];
  relatedPosts: string[];
}

/**
 * Get all available service slugs
 */
function getAvailableServices(): string[] {
  try {
    const servicesDir = path.join(process.cwd(), 'data', 'services');
    const files = fs.readdirSync(servicesDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts');
    
    return files.map(file => file.replace('.ts', ''));
  } catch (error) {
    console.error('[Related Content] Error reading services:', error);
    return [];
  }
}

/**
 * Get all available blog post slugs with their metadata
 */
function getAvailableBlogPosts(): Array<{ slug: string; tags: string[]; category: string }> {
  try {
    const blogDir = path.join(process.cwd(), 'data', 'blog');
    const files = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts');
    
    const posts: Array<{ slug: string; tags: string[]; category: string }> = [];
    
    for (const file of files) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract tags (simple regex parsing)
      const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);
      const tags = tagsMatch 
        ? tagsMatch[1].match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || []
        : [];
      
      // Extract category
      const categoryMatch = content.match(/category:\s*"([^"]+)"/);
      const category = categoryMatch ? categoryMatch[1] : 'General';
      
      posts.push({
        slug: file.replace('.ts', ''),
        tags,
        category
      });
    }
    
    return posts;
  } catch (error) {
    console.error('[Related Content] Error reading blog posts:', error);
    return [];
  }
}

/**
 * Suggest related services based on category and content
 */
export function suggestRelatedServices(
  category: string,
  tags: string[],
  count: number = 3
): string[] {
  const availableServices = getAvailableServices();
  const suggestions: string[] = [];
  
  // Category to service mapping (based on actual service slugs)
  const categoryServiceMap: Record<string, string[]> = {
    'TikTok': [
      'tang-mat-livestream-tiktok',
      'tang-like-tiktok',
      'tang-follow-tiktok',
      'seeding-comment-tiktok',
      'tang-view-video-tiktok',
      'seeding-danh-gia-tiktok-shop'
    ],
    'Facebook': [
      'tang-like-facebook',
      'tang-member-group-facebook',
      'tang-mat-livestream-facebook'
    ],
    'Instagram': [
      'tang-follow-instagram'
    ],
    'YouTube': [
      'tang-sub-youtube'
    ],
    'Website': [
      'traffic-website'
    ]
  };
  
  // Get services for this category
  const categoryServices = categoryServiceMap[category] || [];
  
  // Add category-matched services first
  for (const service of categoryServices) {
    if (availableServices.includes(service) && suggestions.length < count) {
      suggestions.push(service);
    }
  }
  
  // If we still need more services, add from other categories
  if (suggestions.length < count) {
    for (const service of availableServices) {
      if (!suggestions.includes(service) && suggestions.length < count) {
        suggestions.push(service);
      }
    }
  }
  
  console.log(`[Related Content] Suggested ${suggestions.length} services for category "${category}"`);
  return suggestions.slice(0, count);
}

/**
 * Suggest related blog posts based on tags and category
 */
export function suggestRelatedPosts(
  currentSlug: string,
  tags: string[],
  category: string,
  count: number = 5
): string[] {
  const availablePosts = getAvailableBlogPosts();
  const suggestions: Array<{ slug: string; score: number }> = [];
  
  // Filter out current post
  const otherPosts = availablePosts.filter(post => post.slug !== currentSlug);
  
  // Calculate relevance score for each post
  for (const post of otherPosts) {
    let score = 0;
    
    // Category match (highest priority)
    if (post.category === category) {
      score += 10;
    }
    
    // Tag similarity
    const commonTags = tags.filter(tag => 
      post.tags.some(postTag => 
        postTag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(postTag.toLowerCase())
      )
    );
    score += commonTags.length * 5;
    
    // Only add posts with some relevance
    if (score > 0) {
      suggestions.push({ slug: post.slug, score });
    }
  }
  
  // Sort by score (descending) and take top N
  suggestions.sort((a, b) => b.score - a.score);
  const topSuggestions = suggestions.slice(0, count).map(s => s.slug);
  
  // If we don't have enough suggestions, add random posts
  if (topSuggestions.length < count) {
    const remainingPosts = otherPosts
      .filter(post => !topSuggestions.includes(post.slug))
      .map(post => post.slug);
    
    // Shuffle and add
    const shuffled = remainingPosts.sort(() => Math.random() - 0.5);
    topSuggestions.push(...shuffled.slice(0, count - topSuggestions.length));
  }
  
  console.log(`[Related Content] Suggested ${topSuggestions.length} posts for tags: ${tags.join(', ')}`);
  return topSuggestions.slice(0, count);
}

/**
 * Generate related content suggestions with fallback logic
 * Uses AI-provided suggestions if available, otherwise auto-generates
 */
export function generateRelatedContentSuggestions(
  aiSuggestions: {
    relatedServices?: string[];
    relatedPosts?: string[];
    suggestedServices?: string[]; // Legacy field
  },
  postMetadata: {
    slug: string;
    category: string;
    tags: string[];
  }
): RelatedContentSuggestions {
  const suggestions: RelatedContentSuggestions = {
    relatedServices: [],
    relatedPosts: []
  };
  
  // 1. Handle relatedServices
  if (aiSuggestions.relatedServices && aiSuggestions.relatedServices.length > 0) {
    // Use AI-provided suggestions
    suggestions.relatedServices = aiSuggestions.relatedServices.slice(0, 3);
    console.log('[Related Content] Using AI-provided relatedServices');
  } else if (aiSuggestions.suggestedServices && aiSuggestions.suggestedServices.length > 0) {
    // Fallback to legacy field
    suggestions.relatedServices = aiSuggestions.suggestedServices.slice(0, 3);
    console.log('[Related Content] Using legacy suggestedServices field');
  } else {
    // Auto-generate based on category and tags
    suggestions.relatedServices = suggestRelatedServices(
      postMetadata.category,
      postMetadata.tags,
      3
    );
    console.log('[Related Content] Auto-generated relatedServices');
  }
  
  // 2. Handle relatedPosts
  if (aiSuggestions.relatedPosts && aiSuggestions.relatedPosts.length > 0) {
    // Use AI-provided suggestions
    suggestions.relatedPosts = aiSuggestions.relatedPosts.slice(0, 5);
    console.log('[Related Content] Using AI-provided relatedPosts');
  } else {
    // Auto-generate based on tags and category
    suggestions.relatedPosts = suggestRelatedPosts(
      postMetadata.slug,
      postMetadata.tags,
      postMetadata.category,
      5
    );
    console.log('[Related Content] Auto-generated relatedPosts');
  }
  
  return suggestions;
}

/**
 * Content Validation System
 * Validates blog posts and services against schemas and SEO requirements
 */

import { z } from 'zod';
import { BlogPostData, ServiceData } from './file-writer';

// Zod schemas for validation
export const BlogPostSchema = z.object({
  id: z.string().min(1, 'ID là bắt buộc'),
  slug: z.string()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
    .max(100, 'Slug không được vượt quá 100 ký tự'),
  title: z.string()
    .min(10, 'Title phải có ít nhất 10 ký tự')
    .max(70, 'Title không được vượt quá 70 ký tự (SEO limit)'),
  excerpt: z.string()
    .min(50, 'Excerpt phải có ít nhất 50 ký tự')
    .max(160, 'Excerpt không được vượt quá 160 ký tự'),
  content: z.string()
    .min(500, 'Content phải có ít nhất 500 từ')
    .max(50000, 'Content không được vượt quá 50,000 ký tự'),
  author: z.string().min(2, 'Author phải có ít nhất 2 ký tự'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date phải có định dạng YYYY-MM-DD'),
  readTime: z.string().regex(/^\d+\s+phút$/, 'ReadTime phải có định dạng "X phút"'),
  category: z.string().min(1, 'Category là bắt buộc'),
  tags: z.array(z.string())
    .min(3, 'Phải có ít nhất 3 tags')
    .max(10, 'Không được vượt quá 10 tags'),
  imageUrl: z.string()
    .min(1, 'ImageUrl là bắt buộc')
    .refine((val) => {
      // Allow both URLs and local paths
      return val.startsWith('http') || val.startsWith('/') || val.startsWith('./');
    }, 'ImageUrl phải là URL hoặc path hợp lệ'),
  imageAlt: z.string()
    .min(15, 'ImageAlt phải có ít nhất 15 ký tự')
    .max(125, 'ImageAlt không được vượt quá 125 ký tự'),
  metaTitle: z.string()
    .min(30, 'MetaTitle nên có ít nhất 30 ký tự')
    .max(60, 'MetaTitle không được vượt quá 60 ký tự')
    .optional(),
  metaDescription: z.string()
    .min(120, 'MetaDescription nên có ít nhất 120 ký tự')
    .max(155, 'MetaDescription không được vượt quá 155 ký tự')
    .optional(),
  featured: z.boolean().optional(),
  seoScore: z.number().min(0).max(100).optional()
});

export const ServiceSchema = z.object({
  id: z.string().min(1, 'ID là bắt buộc'),
  slug: z.string()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
    .max(100, 'Slug không được vượt quá 100 ký tự'),
  name: z.string()
    .min(5, 'Name phải có ít nhất 5 ký tự')
    .max(60, 'Name không được vượt quá 60 ký tự'),
  shortDescription: z.string()
    .min(20, 'ShortDescription phải có ít nhất 20 ký tự')
    .max(160, 'ShortDescription không được vượt quá 160 ký tự'),
  description: z.string()
    .min(200, 'Description phải có ít nhất 200 từ')
    .max(10000, 'Description không được vượt quá 10,000 ký tự'),
  icon: z.string().min(1, 'Icon là bắt buộc'),
  gradient: z.string().min(1, 'Gradient là bắt buộc'),
  price: z.string().min(1, 'Price là bắt buộc'),
  features: z.array(z.string())
    .min(3, 'Phải có ít nhất 3 features')
    .max(20, 'Không được vượt quá 20 features'),
  benefits: z.array(z.string())
    .min(3, 'Phải có ít nhất 3 benefits')
    .max(15, 'Không được vượt quá 15 benefits'),
  suitableFor: z.array(z.string())
    .min(2, 'Phải có ít nhất 2 đối tượng phù hợp')
    .max(10, 'Không được vượt quá 10 đối tượng'),
  metaTitle: z.string()
    .min(30, 'MetaTitle nên có ít nhất 30 ký tự')
    .max(60, 'MetaTitle không được vượt quá 60 ký tự')
    .optional(),
  metaDescription: z.string()
    .min(120, 'MetaDescription nên có ít nhất 120 ký tự')
    .max(155, 'MetaDescription không được vượt quá 155 ký tự')
    .optional()
});

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  seoScore: number;
}

/**
 * Validate blog post
 */
export function validateBlogPost(post: Partial<BlogPostData>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let seoScore = 100;

  // Validate with Zod
  const zodResult = BlogPostSchema.safeParse(post);
  if (!zodResult.success) {
    console.log('[Zod Validation] Failed - Issues:');
    zodResult.error.issues.forEach((issue: any, index: number) => {
      console.log(`  ${index + 1}. Path: ${issue.path?.join('.')}, Code: ${issue.code}, Message: ${issue.message}`);
    });
    errors.push(...zodResult.error.issues.map((e: any) => e.message));
  }

  // SEO-specific validations
  if (post.title) {
    const titleLength = post.title.length;
    if (titleLength < 50) {
      warnings.push('⚠️ Title nên có 50-70 ký tự để tối ưu SEO');
      seoScore -= 10;
    } else if (titleLength > 70) {
      errors.push('❌ Title quá dài (tối đa 70 ký tự)');
      seoScore -= 15;
    }
  }

  if (post.excerpt) {
    const excerptLength = post.excerpt.length;
    if (excerptLength < 120) {
      warnings.push('⚠️ Excerpt nên có 120-160 ký tự');
      seoScore -= 10;
    } else if (excerptLength > 160) {
      errors.push('❌ Excerpt quá dài (tối đa 160 ký tự)');
      seoScore -= 15;
    }
  }

  if (post.content) {
    const contentLength = post.content.length;
    if (contentLength < 1500) {
      warnings.push('⚠️ Content nên có ít nhất 1500 ký tự');
      seoScore -= 15;
    } else if (contentLength < 3000) {
      warnings.push('⚠️ Content nên có ít nhất 3000 ký tự để SEO tốt hơn');
      seoScore -= 5;
    }
  }

  if (post.tags && post.tags.length < 3) {
    errors.push('❌ Cần ít nhất 3 tags');
    seoScore -= 10;
  }

  if (post.imageAlt && post.imageAlt.length < 15) {
    errors.push('❌ Image Alt phải có ít nhất 15 ký tự');
    seoScore -= 10;
  }

  // Check for keywords in title
  if (post.title) {
    const hasKeyword = /(hướng dẫn|cách|gì|là gì|tốt nhất|chi tiết|đầy đủ|2025)/i.test(post.title);
    if (!hasKeyword) {
      warnings.push('⚠️ Title nên chứa từ khóa SEO');
      seoScore -= 5;
    }
  }

  // Check for Vietnamese diacritics in slug
  if (post.slug) {
    if (/[^a-z0-9-]/.test(post.slug)) {
      errors.push('❌ Slug không được chứa tiếng Việt có dấu');
      seoScore -= 20;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    seoScore: Math.max(0, Math.min(100, seoScore))
  };
}

/**
 * Validate service
 */
export function validateService(service: Partial<ServiceData>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let seoScore = 100;

  // Validate with Zod
  const zodResult = ServiceSchema.safeParse(service);
  if (!zodResult.success) {
    errors.push(...zodResult.error.issues.map((e: any) => e.message));
  }

  // SEO-specific validations
  if (service.name) {
    const nameLength = service.name.length;
    if (nameLength < 20) {
      warnings.push('⚠️ Name nên có 20-60 ký tự để tối ưu SEO');
      seoScore -= 5;
    }
  }

  if (service.shortDescription) {
    const descLength = service.shortDescription.length;
    if (descLength < 100) {
      warnings.push('⚠️ ShortDescription nên có 100-160 ký tự');
      seoScore -= 10;
    }
  }

  if (service.description) {
    const descLength = service.description.length;
    if (descLength < 1000) {
      warnings.push('⚠️ Description nên có ít nhất 1000 ký tự');
      seoScore -= 15;
    }
  }

  if (service.features && service.features.length < 5) {
    warnings.push('⚠️ Nên có ít nhất 5 features');
    seoScore -= 5;
  }

  if (service.benefits && service.benefits.length < 5) {
    warnings.push('⚠️ Nên có ít nhất 5 benefits');
    seoScore -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    seoScore: Math.max(0, Math.min(100, seoScore))
  };
}

/**
 * Check slug uniqueness
 */
export function checkSlugUniqueness(slug: string, type: 'blog' | 'service', existingSlugs: string[]): boolean {
  return !existingSlugs.includes(slug);
}

/**
 * Generate slug from Vietnamese text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Estimate read time from content
 */
export function estimateReadTime(content: string): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200); // 200 words per minute
  return `${minutes} phút`;
}

/**
 * Validate content quality
 */
export function validateContentQuality(content: string): {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  hasHeadings: boolean;
  hasLists: boolean;
  hasImages: boolean;
  readability: 'easy' | 'medium' | 'hard';
} {
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = (content.match(/[.!?]/g) || []).length;
  const paragraphCount = content.split(/\n\n+/).length;
  const hasHeadings = /^#{1,6}\s/m.test(content);
  const hasLists = /^[-*]\s/m.test(content);
  const hasImages = /!\[.*?\]\(.*?\)/.test(content);
  
  // Simple readability score (Flesch-Kincaid simplified)
  const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
  let readability: 'easy' | 'medium' | 'hard' = 'medium';
  
  if (avgSentenceLength < 15) {
    readability = 'easy';
  } else if (avgSentenceLength > 25) {
    readability = 'hard';
  }

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    hasHeadings,
    hasLists,
    hasImages,
    readability
  };
}

/**
 * Auto-generate meta title
 */
export function autoGenerateMetaTitle(title: string, category?: string): string {
  if (category) {
    return `${title} | ${category} - 360TuongTac`;
  }
  return `${title} - 360TuongTac`;
}

/**
 * Auto-generate meta description
 */
export function autoGenerateMetaDescription(content: string, maxLength: number = 155): string {
  // Get first paragraph or sentence
  const firstParagraph = content.split(/\n\n+/)[0] || '';
  const firstSentence = firstParagraph.split(/[.!?]/)[0] || '';
  
  // Clean and truncate
  let description = firstSentence.trim();
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
}

/**
 * Calculate content readability score
 */
export function calculateReadabilityScore(content: string): number {
  const words = content.split(/\s+/).length;
  const sentences = (content.match(/[.!?]/g) || []).length;
  const paragraphs = content.split(/\n\n+/).length;
  
  if (sentences === 0) return 0;
  
  const avgSentenceLength = words / sentences;
  const avgParagraphLength = words / Math.max(paragraphs, 1);
  
  let score = 100;
  
  // Penalize long sentences
  if (avgSentenceLength > 25) {
    score -= (avgSentenceLength - 25) * 2;
  }
  
  // Penalize long paragraphs
  if (avgParagraphLength > 150) {
    score -= (avgParagraphLength - 150) / 10;
  }
  
  // Reward structured content
  const hasHeadings = /^#{1,6}\s/m.test(content);
  const hasLists = /^[-*]\s/m.test(content);
  if (hasHeadings) score += 5;
  if (hasLists) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

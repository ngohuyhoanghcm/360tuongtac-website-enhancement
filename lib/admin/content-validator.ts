/**
 * Content Validator Module
 * Validates AI-generated blog posts before saving
 * 
 * Features:
 * - Validate required fields
 * - Check content length requirements
 * - Validate HTML structure
 * - Validate image URLs and alt text
 * - SEO requirements validation
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate blog post data before saving
 */
export function validateBlogPostContent(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. Validate required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length < 10) {
    errors.push('Title must be at least 10 characters');
  } else if (data.title.length > 100) {
    warnings.push(`Title is too long (${data.title.length} chars, max 100 recommended)`);
  }
  
  if (!data.excerpt || data.excerpt.trim().length === 0) {
    errors.push('Excerpt is required');
  } else if (data.excerpt.length < 50) {
    errors.push('Excerpt must be at least 50 characters for SEO');
  } else if (data.excerpt.length > 200) {
    warnings.push(`Excerpt is too long (${data.excerpt.length} chars, max 160 recommended for meta description)`);
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required');
  } else if (data.content.length < 500) {
    errors.push(`Content is too short (${data.content.length} chars, minimum 500 required)`);
  } else if (data.content.length < 1500) {
    warnings.push(`Content is short (${data.content.length} chars, 1500+ recommended for SEO)`);
  }
  
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push('At least one tag is required');
  } else if (data.tags.length > 10) {
    warnings.push(`Too many tags (${data.tags.length}, maximum 10 recommended)`);
  }
  
  // 2. Validate image fields
  if (!data.featuredImage && !data.imageUrl) {
    warnings.push('No featured image provided');
  }
  
  if (data.featuredImage || data.imageUrl) {
    const imageUrl = data.featuredImage || data.imageUrl;
    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      errors.push('Image URL must be a non-empty string');
    }
  }
  
  if (!data.alt && !data.imageAlt) {
    warnings.push('No alt text for image (bad for SEO and accessibility)');
  } else if ((data.alt || data.imageAlt).length < 10) {
    warnings.push('Alt text should be descriptive (at least 10 characters)');
  }
  
  // 3. Validate HTML structure (basic check)
  if (data.content && data.content.includes('```')) {
    warnings.push('Content still contains markdown code blocks - conversion may have failed');
  }
  
  // Check for unclosed HTML tags (basic validation)
  if (data.content) {
    const openTags = (data.content.match(/<[^/][^>]*[^/]>/g) || []).length;
    const closeTags = (data.content.match(/<\/[^>]+>/g) || []).length;
    // Self-closing tags
    const selfClosing = (data.content.match(/<[^>]+\/>/g) || []).length;
    
    if (Math.abs(openTags - closeTags - selfClosing) > 5) {
      warnings.push(`Possible HTML structure issues: ${openTags} opening tags vs ${closeTags} closing tags`);
    }
  }
  
  // 4. SEO validations
  if (data.metaTitle && data.metaTitle.length > 70) {
    warnings.push(`Meta title is too long (${data.metaTitle.length} chars, max 70 for SEO)`);
  }
  
  if (data.metaDescription && data.metaDescription.length > 160) {
    warnings.push(`Meta description is too long (${data.metaDescription.length} chars, max 160 for SEO)`);
  }
  
  // 5. Validate author
  if (!data.author || data.author.trim().length === 0) {
    warnings.push('No author specified');
  }
  
  // 6. Validate date
  if (!data.date) {
    warnings.push('No date specified');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Normalize blog post data - map fields correctly
 */
export function normalizeBlogPostData(data: any): any {
  return {
    ...data,
    // Map imageUrl to featuredImage if needed
    featuredImage: data.featuredImage || data.imageUrl || '/images/blog/default.webp',
    imageUrl: data.imageUrl || data.featuredImage,  // Keep both for compatibility
    
    // Map imageAlt to alt if needed
    alt: data.alt || data.imageAlt || data.title || 'Blog post image',
    imageAlt: data.imageAlt || data.alt || data.title || 'Blog post image',
    
    // Ensure arrays exist
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedServices: Array.isArray(data.relatedServices) ? data.relatedServices : [],
    relatedPosts: Array.isArray(data.relatedPosts) ? data.relatedPosts : [],
    
    // Ensure optional fields have defaults
    category: data.category || 'General',
    author: data.author || '360TuongTac Team',
    date: data.date || new Date().toISOString().split('T')[0],
    readTime: data.readTime || `${Math.ceil((data.content?.length || 0) / 1000)} phút`,
    featured: data.featured || false,
    seoScore: data.seoScore || 0,
  };
}

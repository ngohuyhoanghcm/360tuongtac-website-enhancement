/**
 * SEO Optimizer
 * Advanced SEO/GEO/AEO optimization for blog content
 * 
 * Features:
 * - SEO scoring and recommendations
 * - GEO optimization (Generative Engine Optimization)
 * - AEO optimization (Answer Engine Optimization)
 * - Content structure analysis
 * - Keyword density analysis
 */

import { auditBlogSEO } from './seo-audit';
import { BlogPostData } from './file-writer';

export interface SEOOptimizationResult {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
    suggestion: string;
  }>;
  recommendations: string[];
  optimizedContent?: string;
  metadata: {
    titleLength: number;
    contentLength: number;
    keywordDensity: number;
    headingCount: number;
    imageCount: number;
    linkCount: number;
    faqCount: number;
  };
}

/**
 * Comprehensive SEO optimization
 */
export async function optimizeContentForSEO(
  content: string,
  options: {
    title?: string;
    excerpt?: string;
    keywords?: string[];
    category?: string;
    targetScore?: number;
  }
): Promise<SEOOptimizationResult> {
  const issues: SEOOptimizationResult['issues'] = [];
  const recommendations: string[] = [];

  // Create mock blog post for validation
  const mockPost: BlogPostData = {
    id: '999',
    slug: 'temp-slug',
    title: options.title || '',
    excerpt: options.excerpt || '',
    content,
    category: options.category || 'General',
    tags: options.keywords || [],
    author: 'Admin',
    date: new Date().toISOString().split('T')[0],
    readTime: `${Math.ceil(content.length / 1000)} min`,
    imageUrl: '',
    imageAlt: '',
    metaTitle: options.title || '',
    metaDescription: options.excerpt || '',
  };

  // Run SEO audit
  const audit = auditBlogSEO(mockPost);

  // Analyze content
  const metadata = analyzeContent(content, options.keywords || []);

  // Check title
  if (options.title) {
    if (options.title.length < 50) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title quá ngắn',
        suggestion: 'Title nên từ 50-70 ký tự để tối ưu SEO'
      });
    } else if (options.title.length > 70) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title quá dài',
        suggestion: 'Title nên dưới 70 ký tự để không bị cắt trên Google'
      });
    }
  }

  // Check content length
  if (content.length < 1500) {
    issues.push({
      type: 'critical',
      category: 'content',
      message: 'Nội dung quá ngắn',
      suggestion: 'Nội dung nên tối thiểu 1500 ký tự, lý tưởng 2000-3000+ ký tự'
    });
    recommendations.push('Thêm nội dung chi tiết, examples, case studies');
  }

  // Check keyword density
  if (options.keywords && options.keywords.length > 0) {
    const primaryKeyword = options.keywords[0];
    const density = calculateKeywordDensity(content, primaryKeyword);
    
    if (density < 0.01) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: `Keyword density quá thấp cho "${primaryKeyword}"`,
        suggestion: 'Keyword density nên từ 1-3%'
      });
    } else if (density > 0.03) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: `Keyword density quá cao cho "${primaryKeyword}"`,
        suggestion: 'Keyword density nên dưới 3% để tránh keyword stuffing'
      });
    }
  }

  // Check headings structure
  const headingCount = (content.match(/^#{1,6}\s+/gm) || []).length;
  if (headingCount < 3) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'Thiếu headings',
      suggestion: 'Thêm ít nhất 3-5 headings (H2, H3) để cải thiện structure'
    });
    recommendations.push('Thêm H2 cho các section chính, H3 cho sub-sections');
  }

  // Check for FAQ section
  const hasFAQ = content.toLowerCase().includes('câu hỏi thường gặp') || 
                 content.toLowerCase().includes('faq') ||
                 /#[#]{1,2}\s+câu hỏi/i.test(content);
  
  if (!hasFAQ) {
    issues.push({
      type: 'info',
      category: 'geo',
      message: 'Thiếu FAQ section',
      suggestion: 'Thêm FAQ section để tối ưu GEO và AEO'
    });
    recommendations.push('Thêm 3-5 câu hỏi thường gặp với câu trả lời chi tiết');
  }

  // Check for internal linking suggestions
  if (!content.includes('[[') && !content.includes('dịch vụ') && !content.includes('link')) {
    recommendations.push('Thêm internal links đến các dịch vụ liên quan');
  }

  // GEO Optimization checks
  if (!hasFAQ) {
    recommendations.push('Thêm format Q&A cho các câu hỏi phổ biến trong ngành');
  }

  // AEO Optimization checks
  const hasDirectAnswers = /\b(là|có|nên|cách)\b.*\?/i.test(content);
  if (!hasDirectAnswers) {
    recommendations.push('Thêm các câu trả lời trực tiếp cho câu hỏi phổ biến');
  }

  // Calculate overall score
  const criticalIssues = issues.filter(i => i.type === 'critical').length;
  const warningIssues = issues.filter(i => i.type === 'warning').length;
  
  let score = 100 - (criticalIssues * 20) - (warningIssues * 10);
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    issues,
    recommendations,
    metadata
  };
}

/**
 * Analyze content metadata
 */
function analyzeContent(content: string, keywords: string[]): SEOOptimizationResult['metadata'] {
  const titleLength = 0; // Will be set from options
  const contentLength = content.length;
  const keywordDensity = keywords.length > 0 ? calculateKeywordDensity(content, keywords[0]) : 0;
  const headingCount = (content.match(/^#{1,6}\s+/gm) || []).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  const faqCount = countFAQs(content);

  return {
    titleLength,
    contentLength,
    keywordDensity,
    headingCount,
    imageCount,
    linkCount,
    faqCount
  };
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content: string, keyword: string): number {
  const contentLower = content.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  const keywordCount = (contentLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
  const wordCount = contentLower.split(/\s+/).length;
  
  return wordCount > 0 ? keywordCount / wordCount : 0;
}

/**
 * Count FAQ sections
 */
function countFAQs(content: string): number {
  const faqPatterns = [
    /câu hỏi.*\?/gi,
    /faq/gi,
    /hỏi đáp/gi,
    /thắc mắc.*\?/gi
  ];

  let count = 0;
  faqPatterns.forEach(pattern => {
    count += (content.match(pattern) || []).length;
  });

  return count;
}

/**
 * Generate SEO-optimized title suggestions
 */
export function generateTitleSuggestions(
  topic: string,
  keywords: string[]
): string[] {
  const suggestions: string[] = [];
  const primaryKeyword = keywords[0] || topic;

  // Different title formulas
  suggestions.push(`${primaryKeyword}: Hướng dẫn chi tiết 2024`);
  suggestions.push(`Cách ${primaryKeyword} hiệu quả nhất`);
  suggestions.push(`${primaryKeyword} là gì? Tất tần tật từ A-Z`);
  suggestions.push(`Top 10 ${primaryKeyword} tốt nhất hiện nay`);
  suggestions.push(`Bí mật ${primaryKeyword} mà ít người biết`);
  suggestions.push(`${primaryKeyword}: Cẩm nang toàn tập cho người mới`);

  return suggestions.slice(0, 5);
}

/**
 * Generate meta description suggestions
 */
export function generateMetaDescriptionSuggestions(
  title: string,
  content: string,
  keywords: string[]
): string[] {
  const suggestions: string[] = [];
  const primaryKeyword = keywords[0] || '';

  // Extract first meaningful paragraph
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const firstParagraph = paragraphs[0]?.substring(0, 155) || '';

  if (firstParagraph) {
    suggestions.push(firstParagraph);
  }

  suggestions.push(`Khám phá ${primaryKeyword} với hướng dẫn chi tiết. Tìm hiểu cách ${title.toLowerCase()} hiệu quả nhất. Đọc ngay!`);
  suggestions.push(`${title} - Tổng hợp thông tin đầy đủ nhất về ${primaryKeyword}. Cập nhật 2024.`);
  suggestions.push(`Bạn muốn biết về ${primaryKeyword}? Bài viết này sẽ giải đáp tất cả. Click để tìm hiểu!`);

  return suggestions.slice(0, 3).map(desc => desc.substring(0, 160));
}

/**
 * Generate FAQ suggestions
 */
export function generateFAQSuggestions(
  topic: string,
  keywords: string[]
): Array<{ question: string; answer: string }> {
  const primaryKeyword = keywords[0] || topic;

  return [
    {
      question: `${primaryKeyword} là gì?`,
      answer: `${primaryKeyword} là một dịch vụ/công cụ giúp người dùng... [Giải thích chi tiết]`
    },
    {
      question: `Tại sao nên sử dụng ${primaryKeyword}?`,
      answer: `Sử dụng ${primaryKeyword} mang lại nhiều lợi ích như: [Liệt kê 3-5 lợi ích chính]`
    },
    {
      question: `Cách sử dụng ${primaryKeyword} như thế nào?`,
      answer: `Để sử dụng ${primaryKeyword} hiệu quả, bạn cần: [Hướng dẫn step-by-step]`
    },
    {
      question: `${primaryKeyword} có miễn phí không?`,
      answer: `[Giải thích về pricing và các gói dịch vụ]`
    },
    {
      question: `So sánh ${primaryKeyword} với các giải pháp khác?`,
      answer: `${primaryKeyword} có những ưu điểm nổi bật so với đối thủ: [So sánh chi tiết]`
    }
  ];
}

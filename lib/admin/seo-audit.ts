/**
 * SEO Audit System
 * Comprehensive SEO scoring, issue detection, and performance tracking
 */

import { BlogPostData, ServiceData } from './file-writer';

export interface SEOIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'title' | 'meta' | 'content' | 'images' | 'links' | 'technical' | 'schema';
  message: string;
  recommendation: string;
  impact: number; // 0-100 impact on SEO
}

export interface SEOScore {
  overall: number; // 0-100
  title: number;
  meta: number;
  content: number;
  images: number;
  links: number;
  technical: number;
  schema: number;
  issues: SEOIssue[];
  passedChecks: number;
  totalChecks: number;
  timestamp: string;
}

export interface SEOAuditReport {
  type: 'blog' | 'service';
  slug: string;
  title: string;
  score: SEOScore;
  auditDate: string;
  previousScore?: number;
  trend: 'improving' | 'declining' | 'stable';
}

/**
 * Comprehensive SEO audit for blog post
 */
export function auditBlogSEO(post: BlogPostData): SEOScore {
  const issues: SEOIssue[] = [];
  let passedChecks = 0;
  let totalChecks = 0;

  // Title Analysis
  const titleScore = auditTitle(post, issues);
  passedChecks += titleScore.passed;
  totalChecks += titleScore.total;

  // Meta Description Analysis
  const metaScore = auditMetaDescription(post, issues);
  passedChecks += metaScore.passed;
  totalChecks += metaScore.total;

  // Content Analysis
  const contentScore = auditContent(post, issues);
  passedChecks += contentScore.passed;
  totalChecks += contentScore.total;

  // Image Analysis
  const imageScore = auditImages(post, issues);
  passedChecks += imageScore.passed;
  totalChecks += imageScore.total;

  // Technical SEO
  const technicalScore = auditTechnicalSEO(post, issues);
  passedChecks += technicalScore.passed;
  totalChecks += technicalScore.total;

  // Schema Markup
  const schemaScore = auditSchemaMarkup(post, issues);
  passedChecks += schemaScore.passed;
  totalChecks += schemaScore.total;

  // Calculate overall score
  const overall = Math.round(
    (titleScore.score * 0.20 +
     metaScore.score * 0.20 +
     contentScore.score * 0.25 +
     imageScore.score * 0.10 +
     technicalScore.score * 0.15 +
     schemaScore.score * 0.10)
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    title: titleScore.score,
    meta: metaScore.score,
    content: contentScore.score,
    images: imageScore.score,
    links: 0, // Reserved for future
    technical: technicalScore.score,
    schema: schemaScore.score,
    issues,
    passedChecks,
    totalChecks,
    timestamp: new Date().toISOString()
  };
}

/**
 * Comprehensive SEO audit for service
 */
export function auditServiceSEO(service: ServiceData): SEOScore {
  const issues: SEOIssue[] = [];
  let passedChecks = 0;
  let totalChecks = 0;

  // Title Analysis
  const titleScore = auditServiceTitle(service, issues);
  passedChecks += titleScore.passed;
  totalChecks += titleScore.total;

  // Meta Description Analysis
  const metaScore = auditServiceMeta(service, issues);
  passedChecks += metaScore.passed;
  totalChecks += metaScore.total;

  // Content Analysis
  const contentScore = auditServiceContent(service, issues);
  passedChecks += contentScore.passed;
  totalChecks += contentScore.total;

  // Technical SEO
  const technicalScore = auditServiceTechnical(service, issues);
  passedChecks += technicalScore.passed;
  totalChecks += technicalScore.total;

  // Schema Markup
  const schemaScore = auditServiceSchema(service, issues);
  passedChecks += schemaScore.passed;
  totalChecks += schemaScore.total;

  // Calculate overall score
  const overall = Math.round(
    (titleScore.score * 0.20 +
     metaScore.score * 0.20 +
     contentScore.score * 0.30 +
     technicalScore.score * 0.15 +
     schemaScore.score * 0.15)
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    title: titleScore.score,
    meta: metaScore.score,
    content: contentScore.score,
    images: 100, // Services don't always need images
    links: 0,
    technical: technicalScore.score,
    schema: schemaScore.score,
    issues,
    passedChecks,
    totalChecks,
    timestamp: new Date().toISOString()
  };
}

// Helper audit functions

function auditTitle(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 4;

  // Check title length
  if (post.title.length < 50) {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'title',
      message: 'Title quá ngắn (dưới 50 ký tự)',
      recommendation: 'Nên có 50-70 ký tự để hiển thị tốt trên Google',
      impact: 30
    });
  } else if (post.title.length > 70) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Title quá dài (trên 70 ký tự)',
      recommendation: 'Google sẽ cắt title dài, nên giữ 50-70 ký tự',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check for keywords
  const hasKeyword = /(hướng dẫn|cách|gì|là gì|tốt nhất|chi tiết|đầy đủ|2025|2026)/i.test(post.title);
  if (!hasKeyword) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Title không chứa từ khóa SEO',
      recommendation: 'Thêm từ khóa như "hướng dẫn", "cách", "tốt nhất"',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check for brand
  if (!/360/i.test(post.title)) {
    score -= 10;
    issues.push({
      severity: 'info',
      category: 'title',
      message: 'Title không đề cập thương hiệu',
      recommendation: 'Cân nhắc thêm "360TuongTac" vào title',
      impact: 10
    });
  } else {
    passed++;
  }

  // Check uniqueness
  if (post.title === post.excerpt) {
    score -= 40;
    issues.push({
      severity: 'critical',
      category: 'title',
      message: 'Title trùng với excerpt',
      recommendation: 'Title và excerpt phải khác nhau',
      impact: 40
    });
  } else {
    passed++;
  }

  return { score: Math.max(0, score), passed, total };
}

function auditMetaDescription(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 3;

  const desc = post.metaDescription || post.excerpt;

  if (desc.length < 120) {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'meta',
      message: 'Meta description quá ngắn',
      recommendation: 'Nên có 120-155 ký tự',
      impact: 30
    });
  } else if (desc.length > 155) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Meta description quá dài',
      recommendation: 'Google sẽ cắt mô tả dài, nên giữ 120-155 ký tự',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check for CTA
  const hasCTA = /(khám phá|tìm hiểu|học cách|đăng ký|liên hệ)/i.test(desc);
  if (!hasCTA) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Meta description không có call-to-action',
      recommendation: 'Thêm CTA như "Khám phá ngay", "Tìm hiểu thêm"',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check for keyword
  if (desc.toLowerCase().includes(post.title.toLowerCase().substring(0, 10))) {
    passed++;
  } else {
    score -= 15;
    issues.push({
      severity: 'info',
      category: 'meta',
      message: 'Meta description không chứa từ khóa chính',
      recommendation: 'Nên include từ khóa chính từ title',
      impact: 15
    });
  }

  return { score: Math.max(0, score), passed, total };
}

function auditContent(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 5;

  // Content length
  if (post.content.length < 1500) {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'content',
      message: 'Content quá ngắn (dưới 1500 ký tự)',
      recommendation: 'Nên có ít nhất 1500 ký tự để SEO tốt',
      impact: 30
    });
  } else if (post.content.length < 3000) {
    score -= 10;
    passed++;
  } else {
    passed++;
  }

  // Check for headings
  const hasHeadings = /^#{1,6}\s/m.test(post.content);
  if (!hasHeadings) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Content không có headings (H1, H2, H3)',
      recommendation: 'Sử dụng Markdown headings để cấu trúc content',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check for lists
  const hasLists = /^[-*]\s/m.test(post.content);
  if (!hasLists) {
    score -= 10;
    issues.push({
      severity: 'info',
      category: 'content',
      message: 'Content không có danh sách',
      recommendation: 'Sử dụng bullet points hoặc numbered lists',
      impact: 10
    });
  } else {
    passed++;
  }

  // Check for paragraphs
  const paragraphs = post.content.split(/\n\n+/).length;
  if (paragraphs < 3) {
    score -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Content có quá ít đoạn văn',
      recommendation: 'Nên có ít nhất 3-5 đoạn văn',
      impact: 15
    });
  } else {
    passed++;
  }

  // Readability
  const avgSentenceLength = post.content.split(/[.!?]/).length / Math.max(post.content.split(/\s+/).length / 200, 1);
  if (avgSentenceLength > 25) {
    score -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Câu văn quá dài, khó đọc',
      recommendation: 'Sử dụng câu ngắn hơn (dưới 25 từ)',
      impact: 15
    });
  } else {
    passed++;
  }

  return { score: Math.max(0, score), passed, total };
}

function auditImages(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 3;

  // Check image URL
  if (!post.imageUrl) {
    score -= 40;
    issues.push({
      severity: 'critical',
      category: 'images',
      message: 'Thiếu featured image',
      recommendation: 'Thêm featured image chất lượng cao',
      impact: 40
    });
  } else {
    passed++;
  }

  // Check alt text
  if (!post.imageAlt || post.imageAlt.length < 15) {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'images',
      message: 'Alt text quá ngắn hoặc thiếu',
      recommendation: 'Alt text nên có 15-125 ký tự, mô tả chi tiết',
      impact: 30
    });
  } else if (post.imageAlt.length > 125) {
    score -= 15;
    issues.push({
      severity: 'warning',
      category: 'images',
      message: 'Alt text quá dài',
      recommendation: 'Alt text nên có 15-125 ký tự',
      impact: 15
    });
  } else {
    passed++;
  }

  // Check image format
  if (post.imageUrl && !/\.(jpg|jpeg|png|webp|avif)/i.test(post.imageUrl)) {
    score -= 15;
    issues.push({
      severity: 'info',
      category: 'images',
      message: 'Format image không tối ưu',
      recommendation: 'Sử dụng WebP hoặc AVIF để tối ưu performance',
      impact: 15
    });
  } else {
    passed++;
  }

  return { score: Math.max(0, score), passed, total };
}

function auditTechnicalSEO(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 4;

  // Check slug format
  if (!/^[a-z0-9-]+$/.test(post.slug)) {
    score -= 25;
    issues.push({
      severity: 'critical',
      category: 'technical',
      message: 'Slug không đúng format',
      recommendation: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang',
      impact: 25
    });
  } else {
    passed++;
  }

  // Check tags
  if (!post.tags || post.tags.length < 3) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'technical',
      message: 'Thiếu tags (cần ít nhất 3)',
      recommendation: 'Thêm 3-10 tags liên quan',
      impact: 20
    });
  } else {
    passed++;
  }

  // Check category
  if (!post.category) {
    score -= 15;
    issues.push({
      severity: 'warning',
      category: 'technical',
      message: 'Thiếu category',
      recommendation: 'Gán category cho bài viết',
      impact: 15
    });
  } else {
    passed++;
  }

  // Check date
  if (!post.date) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'technical',
      message: 'Thiếu ngày đăng',
      recommendation: 'Thêm ngày đăng bài viết',
      impact: 20
    });
  } else {
    passed++;
  }

  return { score: Math.max(0, score), passed, total };
}

function auditSchemaMarkup(post: BlogPostData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 3;

  // Check if has meta title
  if (post.metaTitle) {
    passed++;
  } else {
    score -= 30;
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: 'Thiếu meta title',
      recommendation: 'Thêm meta title tối ưu cho SEO',
      impact: 30
    });
  }

  // Check if has meta description
  if (post.metaDescription) {
    passed++;
  } else {
    score -= 30;
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: 'Thiếu meta description',
      recommendation: 'Thêm meta description 120-155 ký tự',
      impact: 30
    });
  }

  // Check if featured
  if (post.featured) {
    passed++;
  } else {
    score -= 10;
    issues.push({
      severity: 'info',
      category: 'schema',
      message: 'Bài viết không được đánh dấu featured',
      recommendation: 'Đánh dấu featured cho bài viết quan trọng',
      impact: 10
    });
  }

  return { score: Math.max(0, score), passed, total };
}

// Service-specific audit functions (similar structure)
function auditServiceTitle(service: ServiceData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 3;

  if (service.name.length < 20) {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'title',
      message: 'Tên dịch vụ quá ngắn',
      recommendation: 'Nên có 20-60 ký tự',
      impact: 30
    });
  } else if (service.name.length > 60) {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Tên dịch vụ quá dài',
      recommendation: 'Nên có 20-60 ký tự',
      impact: 20
    });
  } else {
    passed++;
  }

  if (/^[A-Z]/.test(service.name)) {
    passed++;
  } else {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Tên dịch vụ không viết hoa chữ cái đầu',
      recommendation: 'Viết hoa chữ cái đầu tiên',
      impact: 20
    });
  }

  if (service.name.toLowerCase().includes('tăng') || service.name.toLowerCase().includes('dịch vụ')) {
    passed++;
  } else {
    score -= 15;
    issues.push({
      severity: 'info',
      category: 'title',
      message: 'Tên dịch vụ không chứa từ khóa chính',
      recommendation: 'Nên include từ khóa như "tăng", "dịch vụ"',
      impact: 15
    });
  }

  return { score: Math.max(0, score), passed, total };
}

function auditServiceMeta(service: ServiceData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 2;

  const desc = service.metaDescription || service.shortDescription;

  if (desc.length >= 100 && desc.length <= 160) {
    passed++;
  } else {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'meta',
      message: 'Mô tả dịch vụ không đúng độ dài',
      recommendation: 'Nên có 100-160 ký tự',
      impact: 30
    });
  }

  if (/(uy tín|chất lượng|chuyên nghiệp|giá rẻ)/i.test(desc)) {
    passed++;
  } else {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Mô tả không có từ ngữ thu hút',
      recommendation: 'Thêm từ như "uy tín", "chất lượng", "chuyên nghiệp"',
      impact: 20
    });
  }

  return { score: Math.max(0, score), passed, total };
}

function auditServiceContent(service: ServiceData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 4;

  if (service.description.length >= 1000) {
    passed++;
  } else {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'content',
      message: 'Mô tả dịch vụ quá ngắn',
      recommendation: 'Nên có ít nhất 1000 ký tự',
      impact: 30
    });
  }

  if (service.features.length >= 5) {
    passed++;
  } else {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Thiếu features (cần ít nhất 5)',
      recommendation: 'Thêm ít nhất 5 tính năng nổi bật',
      impact: 20
    });
  }

  if (service.benefits.length >= 5) {
    passed++;
  } else {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Thiếu benefits (cần ít nhất 5)',
      recommendation: 'Thêm ít nhất 5 lợi ích',
      impact: 20
    });
  }

  if (service.suitableFor.length >= 3) {
    passed++;
  } else {
    score -= 15;
    issues.push({
      severity: 'info',
      category: 'content',
      message: 'Thiếu đối tượng phù hợp',
      recommendation: 'Thêm ít nhất 3 đối tượng phù hợp',
      impact: 15
    });
  }

  return { score: Math.max(0, score), passed, total };
}

function auditServiceTechnical(service: ServiceData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 2;

  if (/^[a-z0-9-]+$/.test(service.slug)) {
    passed++;
  } else {
    score -= 30;
    issues.push({
      severity: 'critical',
      category: 'technical',
      message: 'Slug không đúng format',
      recommendation: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang',
      impact: 30
    });
  }

  if (service.price && service.price.length > 0) {
    passed++;
  } else {
    score -= 20;
    issues.push({
      severity: 'warning',
      category: 'technical',
      message: 'Thiếu thông tin giá',
      recommendation: 'Thêm giá hoặc "Liên hệ"',
      impact: 20
    });
  }

  return { score: Math.max(0, score), passed, total };
}

function auditServiceSchema(service: ServiceData, issues: SEOIssue[]): { score: number; passed: number; total: number } {
  let score = 100;
  let passed = 0;
  let total = 2;

  if (service.metaTitle) {
    passed++;
  } else {
    score -= 25;
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: 'Thiếu meta title',
      recommendation: 'Thêm meta title cho dịch vụ',
      impact: 25
    });
  }

  if (service.metaDescription) {
    passed++;
  } else {
    score -= 25;
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: 'Thiếu meta description',
      recommendation: 'Thêm meta description 100-160 ký tự',
      impact: 25
    });
  }

  return { score: Math.max(0, score), passed, total };
}

/**
 * Generate SEO audit report
 */
export function generateSEOAuditReport(
  type: 'blog' | 'service',
  slug: string,
  currentScore: SEOScore,
  previousScore?: number
): SEOAuditReport {
  const trend = previousScore
    ? currentScore.overall > previousScore
      ? 'improving'
      : currentScore.overall < previousScore
        ? 'declining'
        : 'stable'
    : 'stable';

  return {
    type,
    slug,
    title: slug,
    score: currentScore,
    auditDate: new Date().toISOString(),
    previousScore,
    trend
  };
}

/**
 * Get SEO issues by severity
 */
export function getIssuesBySeverity(issues: SEOIssue[], severity: 'critical' | 'warning' | 'info'): SEOIssue[] {
  return issues.filter(issue => issue.severity === severity);
}

/**
 * Get SEO score grade
 */
export function getSEOScoreGrade(score: number): { grade: string; color: string; message: string } {
  if (score >= 90) {
    return { grade: 'A+', color: 'green', message: 'Xuất sắc' };
  } else if (score >= 80) {
    return { grade: 'A', color: 'green', message: 'Tốt' };
  } else if (score >= 70) {
    return { grade: 'B', color: 'yellow', message: 'Khá' };
  } else if (score >= 60) {
    return { grade: 'C', color: 'orange', message: 'Trung bình' };
  } else {
    return { grade: 'D', color: 'red', message: 'Cần cải thiện' };
  }
}

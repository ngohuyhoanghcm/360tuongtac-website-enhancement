/**
 * Monitoring & Reporting System
 * Content performance dashboards, SEO tracking, engagement metrics, and audit trails
 */

import fs from 'fs';
import path from 'path';
import { BlogPostData, ServiceData } from './file-writer';
import { auditBlogSEO, auditServiceSEO, SEOScore } from './seo-audit';
import { getContentStats } from './content-utils';

export interface PerformanceMetrics {
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
}

export interface SEOTrend {
  date: string;
  score: number;
  ranking?: number;
}

export interface AuditTrailEntry {
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'rollback';
  type: 'blog' | 'service';
  slug: string;
  user: string;
  details: string;
  ip?: string;
}

export interface DashboardData {
  overview: {
    totalBlogPosts: number;
    totalServices: number;
    avgSEOScore: number;
    publishedThisMonth: number;
    scheduledCount: number;
    draftCount: number;
  };
  seoPerformance: {
    excellentCount: number;
    goodCount: number;
    fairCount: number;
    poorCount: number;
    topPerformers: Array<{ slug: string; title: string; score: number }>;
    needsImprovement: Array<{ slug: string; title: string; score: number }>;
  };
  contentActivity: {
    recentPosts: Array<{ slug: string; title: string; date: string; status: string }>;
    recentServices: Array<{ slug: string; name: string; date: string }>;
  };
  auditTrail: AuditTrailEntry[];
}

const AUDIT_LOG_FILE = path.join(process.cwd(), 'data', 'audit', 'audit-log.json');
const SEO_TRENDS_DIR = path.join(process.cwd(), 'data', 'analytics', 'seo-trends');
const METRICS_DIR = path.join(process.cwd(), 'data', 'analytics', 'metrics');

// Initialize directories
function initializeAnalyticsDirs() {
  [path.join(process.cwd(), 'data', 'audit'), SEO_TRENDS_DIR, METRICS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

initializeAnalyticsDirs();

/**
 * Log audit trail entry
 */
export function logAuditTrail(entry: Omit<AuditTrailEntry, 'timestamp'>): void {
  try {
    const auditLog: AuditTrailEntry[] = fs.existsSync(AUDIT_LOG_FILE)
      ? JSON.parse(fs.readFileSync(AUDIT_LOG_FILE, 'utf-8'))
      : [];

    const newEntry: AuditTrailEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    auditLog.unshift(newEntry);

    // Keep only last 1000 entries
    if (auditLog.length > 1000) {
      auditLog.length = 1000;
    }

    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(auditLog, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error logging audit trail:', error);
  }
}

/**
 * Get audit trail
 */
export function getAuditTrail(
  filters?: {
    type?: 'blog' | 'service';
    action?: string;
    user?: string;
    dateFrom?: string;
    dateTo?: string;
  },
  limit: number = 50
): AuditTrailEntry[] {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) {
      return [];
    }

    let auditLog: AuditTrailEntry[] = JSON.parse(fs.readFileSync(AUDIT_LOG_FILE, 'utf-8'));

    // Apply filters
    if (filters?.type) {
      auditLog = auditLog.filter(entry => entry.type === filters.type);
    }

    if (filters?.action) {
      auditLog = auditLog.filter(entry => entry.action === filters.action);
    }

    if (filters?.user) {
      auditLog = auditLog.filter(entry => entry.user === filters.user);
    }

    if (filters?.dateFrom) {
      auditLog = auditLog.filter(entry => new Date(entry.timestamp) >= new Date(filters.dateFrom!));
    }

    if (filters?.dateTo) {
      auditLog = auditLog.filter(entry => new Date(entry.timestamp) <= new Date(filters.dateTo!));
    }

    return auditLog.slice(0, limit);
  } catch (error) {
    console.error('Error getting audit trail:', error);
    return [];
  }
}

/**
 * Generate dashboard data
 */
export function generateDashboardData(): DashboardData {
  const stats = getContentStats();

  // Get all blog posts and audit SEO
  const blogPosts = searchAllBlogPosts();
  const seoScores = blogPosts.map((post: any) => ({
    slug: post.slug,
    title: post.title,
    score: auditBlogSEO({
      ...post,
      id: post.id ? post.id.toString() : '',
      readTime: post.readTime || '5 phút',
      tags: post.tags || [],
      imageUrl: post.featuredImage || post.imageUrl,
      imageAlt: post.alt || post.imageAlt,
      metaTitle: post.metaTitle || `${post.title} | Blog - 360TuongTac`,
      metaDescription: post.metaDescription || post.excerpt,
      featured: post.featured || false,
    })
  }));

  // Categorize by score
  const excellentCount = seoScores.filter(s => s.score.overall >= 90).length;
  const goodCount = seoScores.filter(s => s.score.overall >= 80 && s.score.overall < 90).length;
  const fairCount = seoScores.filter(s => s.score.overall >= 70 && s.score.overall < 80).length;
  const poorCount = seoScores.filter(s => s.score.overall < 70).length;

  // Top performers
  const topPerformers = seoScores
    .sort((a, b) => b.score.overall - a.score.overall)
    .slice(0, 5)
    .map(s => ({ slug: s.slug, title: s.title, score: s.score.overall }));

  // Needs improvement
  const needsImprovement = seoScores
    .filter(s => s.score.overall < 70)
    .sort((a, b) => a.score.overall - b.score.overall)
    .slice(0, 5)
    .map(s => ({ slug: s.slug, title: s.title, score: s.score.overall }));

  // Recent posts
  const recentPosts = blogPosts
    .slice(0, 10)
    .map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      status: 'published'
    }));

  // Get recent services
  const services = searchAllServices();
  const recentServices = services
    .slice(0, 5)
    .map(service => ({
      slug: service.slug,
      name: service.name,
      date: new Date().toISOString().split('T')[0]
    }));

  // Get audit trail
  const auditTrail = getAuditTrail({}, 20);

  return {
    overview: {
      totalBlogPosts: stats.totalBlogPosts,
      totalServices: stats.totalServices,
      avgSEOScore: seoScores.length > 0 
        ? Math.round(seoScores.reduce((sum, s) => sum + s.score.overall, 0) / seoScores.length)
        : 0,
      publishedThisMonth: stats.recentPosts,
      scheduledCount: 0, // Would need workflow data
      draftCount: 0 // Would need workflow data
    },
    seoPerformance: {
      excellentCount,
      goodCount,
      fairCount,
      poorCount,
      topPerformers,
      needsImprovement
    },
    contentActivity: {
      recentPosts,
      recentServices
    },
    auditTrail
  };
}

/**
 * Track SEO score over time
 */
export function trackSEOScore(
  type: 'blog' | 'service',
  slug: string,
  score: SEOScore
): void {
  try {
    const trendFile = path.join(SEO_TRENDS_DIR, `${type}-${slug}.json`);
    
    const trends: SEOTrend[] = fs.existsSync(trendFile)
      ? JSON.parse(fs.readFileSync(trendFile, 'utf-8'))
      : [];

    const newTrend: SEOTrend = {
      date: new Date().toISOString().split('T')[0],
      score: score.overall
    };

    trends.push(newTrend);

    // Keep only last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const filteredTrends = trends.filter(t => new Date(t.date) >= ninetyDaysAgo);

    fs.writeFileSync(trendFile, JSON.stringify(filteredTrends, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error tracking SEO score:', error);
  }
}

/**
 * Get SEO trend for content
 */
export function getSEOTrend(type: 'blog' | 'service', slug: string): SEOTrend[] {
  try {
    const trendFile = path.join(SEO_TRENDS_DIR, `${type}-${slug}.json`);
    
    if (!fs.existsSync(trendFile)) {
      return [];
    }

    return JSON.parse(fs.readFileSync(trendFile, 'utf-8'));
  } catch (error) {
    console.error('Error getting SEO trend:', error);
    return [];
  }
}

/**
 * Save performance metrics
 */
export function savePerformanceMetrics(
  type: 'blog' | 'service',
  slug: string,
  metrics: PerformanceMetrics
): void {
  try {
    const metricsFile = path.join(METRICS_DIR, `${type}-${slug}.json`);
    
    const metricsHistory = fs.existsSync(metricsFile)
      ? JSON.parse(fs.readFileSync(metricsFile, 'utf-8'))
      : { history: [] };

    metricsHistory.history.push({
      date: new Date().toISOString().split('T')[0],
      ...metrics
    });

    // Keep only last 90 entries
    if (metricsHistory.history.length > 90) {
      metricsHistory.history = metricsHistory.history.slice(-90);
    }

    fs.writeFileSync(metricsFile, JSON.stringify(metricsHistory, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving performance metrics:', error);
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(type: 'blog' | 'service', slug: string): PerformanceMetrics[] {
  try {
    const metricsFile = path.join(METRICS_DIR, `${type}-${slug}.json`);
    
    if (!fs.existsSync(metricsFile)) {
      return [];
    }

    const data = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
    return data.history || [];
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return [];
  }
}

/**
 * Generate SEO audit report for all content
 */
export function generateSEOAuditReport(): {
  blogPosts: Array<{ slug: string; title: string; score: SEOScore }>;
  services: Array<{ slug: string; name: string; score: SEOScore }>;
  overallScore: number;
  criticalIssues: number;
  warnings: number;
} {
  const blogPosts = searchAllBlogPosts();
  const services = searchAllServices();

  const blogScores = blogPosts.map((post: any) => ({
    slug: post.slug,
    title: post.title,
    score: auditBlogSEO({
      ...post,
      id: post.id ? post.id.toString() : '',
      readTime: post.readTime || '5 phút',
      tags: post.tags || [],
      imageUrl: post.featuredImage || post.imageUrl,
      imageAlt: post.alt || post.imageAlt,
      metaTitle: post.metaTitle || `${post.title} | Blog - 360TuongTac`,
      metaDescription: post.metaDescription || post.excerpt,
      featured: post.featured || false,
    })
  }));

  const serviceScores = services.map(service => ({
    slug: service.slug,
    name: service.name,
    score: auditServiceSEO(service)
  }));

  const allScores = [...blogScores.map(b => b.score.overall), ...serviceScores.map(s => s.score.overall)];
  const overallScore = allScores.length > 0
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
    : 0;

  const criticalIssues = [...blogScores, ...serviceScores].reduce((count, item) => {
    return count + item.score.issues.filter(i => i.severity === 'critical').length;
  }, 0);

  const warnings = [...blogScores, ...serviceScores].reduce((count, item) => {
    return count + item.score.issues.filter(i => i.severity === 'warning').length;
  }, 0);

  return {
    blogPosts: blogScores,
    services: serviceScores,
    overallScore,
    criticalIssues,
    warnings
  };
}

/**
 * Get content health summary
 */
export function getContentHealthSummary(): {
  totalContent: number;
  healthyContent: number;
  needsAttention: number;
  criticalIssues: number;
  healthScore: number;
} {
  const auditReport = generateSEOAuditReport();
  const totalContent = auditReport.blogPosts.length + auditReport.services.length;
  
  const healthyContent = [...auditReport.blogPosts, ...auditReport.services]
    .filter(item => item.score.overall >= 80).length;
  
  const needsAttention = [...auditReport.blogPosts, ...auditReport.services]
    .filter(item => item.score.overall >= 60 && item.score.overall < 80).length;
  
  const criticalIssues = auditReport.criticalIssues;
  
  const healthScore = totalContent > 0
    ? Math.round((healthyContent / totalContent) * 100)
    : 0;

  return {
    totalContent,
    healthyContent,
    needsAttention,
    criticalIssues,
    healthScore
  };
}

// Helper functions

function searchAllBlogPosts(): BlogPostData[] {
  // Import existing blog posts
  try {
    const { BLOG_POSTS } = require('@/lib/constants/blog');
    return BLOG_POSTS;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

function searchAllServices(): ServiceData[] {
  // Import existing services
  try {
    const { SERVICES_DATA } = require('@/data/services/index');
    return SERVICES_DATA;
  } catch (error) {
    console.error('Error loading services:', error);
    return [];
  }
}

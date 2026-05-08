/**
 * API Route: SEO Audit
 * GET /api/admin/seo-audit
 */

import { NextRequest, NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/constants/blog';
import { SERVICES_DATA } from '@/data/services';
import { auditBlogSEO } from '@/lib/admin/seo-audit';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Audit all blog posts
    const blogAudits = BLOG_POSTS.map(post => {
      const audit = auditBlogSEO({
        id: post.id.toString(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.date,
        readTime: post.readTime || '5 phút',
        category: post.category,
        tags: post.tags || [],
        imageUrl: post.featuredImage,
        imageAlt: post.alt,
        metaTitle: `${post.title} | Blog - 360TuongTac`,
        metaDescription: post.excerpt,
        featured: post.featured || false,
      });

      return {
        slug: post.slug,
        title: post.title,
        score: {
          overall: audit.overall,
          title: audit.title,
          meta: audit.meta,
          content: audit.content,
          images: audit.images,
          technical: audit.technical,
          issues: audit.issues,
        }
      };
    });

    // For services, we'll provide simplified audits
    // (Full service audit would need ServiceData format)
    const serviceAudits = SERVICES_DATA.map(service => ({
      slug: service.slug,
      title: service.title,
      score: {
        overall: 85, // Placeholder - would need full ServiceData for real audit
        issues: []
      }
    }));

    // Calculate overall stats
    const allScores = blogAudits.map(a => a.score.overall);
    const overallScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;
    
    // Count critical issues and warnings
    const criticalIssues = blogAudits.reduce((count, audit) => 
      count + audit.score.issues.filter((i: any) => i.severity === 'critical').length, 0);
    
    const warnings = blogAudits.reduce((count, audit) => 
      count + audit.score.issues.filter((i: any) => i.severity === 'warning').length, 0);

    return NextResponse.json({
      success: true,
      overallScore,
      blogPosts: blogAudits,
      services: serviceAudits,
      criticalIssues,
      warnings,
      totalPosts: blogAudits.length,
      totalServices: serviceAudits.length
    });
  } catch (error) {
    console.error('Error generating SEO audit:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

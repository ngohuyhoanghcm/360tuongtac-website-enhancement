/**
 * API Route: Save Blog Post
 * POST /api/admin/blog/save
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveBlogPost, BlogPostData } from '@/lib/admin/file-writer';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';
import { validateBlogPost, generateSlug, estimateReadTime } from '@/lib/admin/validation';
import { generateBlogSEO } from '@/lib/admin/seo-generator';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title);

    // Estimate read time
    const readTime = body.readTime || estimateReadTime(body.content);

    // Auto-generate meta title and description if not provided
    const metaTitle = body.metaTitle || `${body.title} | Blog - 360TuongTac`;
    const metaDescription = body.metaDescription || body.excerpt;

    // Create blog post data
    const blogPost: BlogPostData = {
      id: body.id || `blog_${Date.now()}`,
      slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || '360TuongTac Team',
      date: body.date || new Date().toISOString().split('T')[0],
      readTime,
      category: body.category,
      tags: body.tags || [],
      imageUrl: body.imageUrl || '/images/blog/default.jpg',
      imageAlt: body.imageAlt || body.title,
      metaTitle,
      metaDescription,
      featured: body.featured || false
    };

    // Validate
    const validation = validateBlogPost(blogPost);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validation.errors,
          warnings: validation.warnings
        },
        { status: 400 }
      );
    }

    // Calculate SEO score
    blogPost.seoScore = validation.seoScore;

    // Save file
    const result = await saveBlogPost(blogPost);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    // Generate SEO data
    const seoData = generateBlogSEO(blogPost);

    return NextResponse.json({
      success: true,
      message: result.message,
      slug: blogPost.slug,
      seoScore: blogPost.seoScore,
      seoData,
      validation: {
        warnings: validation.warnings
      }
    });
  } catch (error) {
    console.error('Error saving blog post:', error);
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

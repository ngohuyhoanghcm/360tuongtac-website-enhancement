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
    let metaTitle = body.metaTitle;
    if (!metaTitle || metaTitle.length > 60) {
      // Truncate to 60 chars max, keep it SEO-friendly
      const baseTitle = body.title || '';
      if (baseTitle.length <= 50) {
        metaTitle = `${baseTitle} | 360TuongTac`;
      } else {
        // Truncate title to fit within 60 chars with suffix
        const maxTitleLength = 60 - ' | 360TuongTac'.length; // ~46 chars
        metaTitle = `${baseTitle.substring(0, maxTitleLength)}... | 360TuongTac`;
      }
    }
    
    // Auto-generate excerpt from content if missing or too short
    let excerpt = body.excerpt;
    if (!excerpt || excerpt.length < 50) {
      // Generate from first 150 chars of content
      excerpt = body.content?.substring(0, 150).trim() + '...' || 'Bài viết về ' + body.title;
      // Ensure it's within 50-160 chars
      if (excerpt.length < 50) {
        excerpt = excerpt.padEnd(50, '.');
      }
      if (excerpt.length > 160) {
        excerpt = excerpt.substring(0, 157) + '...';
      }
    }
    
    // Auto-generate metaDescription - ensure 120-155 chars for SEO
    let metaDescription = body.metaDescription;
    if (!metaDescription || metaDescription.length < 120) {
      // Generate from excerpt or content
      const source = excerpt || body.content?.substring(0, 200) || '';
      if (source.length < 120) {
        // Pad with relevant SEO text
        metaDescription = source + ' Tìm hiểu chi tiết về ' + (body.title || 'chủ đề này') + ' tại 360TuongTac.';
      } else {
        metaDescription = source;
      }
      // Ensure within 120-155 chars
      if (metaDescription.length < 120) {
        metaDescription = metaDescription.padEnd(120, '.');
      }
      if (metaDescription.length > 155) {
        metaDescription = metaDescription.substring(0, 152) + '...';
      }
    }
    
    // Auto-generate tags from category if missing
    let tags = body.tags || [];
    if (!Array.isArray(tags) || tags.length < 3) {
      // Generate default tags from category
      const category = body.category || 'General';
      tags = [
        category.toLowerCase(),
        '360tuongtac',
        body.title?.split(' ').slice(0, 2).join(' ').toLowerCase() || 'content',
        '2026',
        'hướng-dẫn'
      ].slice(0, 5);
    }
    
    // Create blog post data
    const blogPost: BlogPostData = {
      id: body.id || `blog_${Date.now()}`,
      slug,
      title: body.title,
      excerpt,
      content: body.content,
      author: body.author || '360TuongTac Team',
      date: body.date || new Date().toISOString().split('T')[0],
      readTime,
      category: body.category || 'General',
      tags,
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

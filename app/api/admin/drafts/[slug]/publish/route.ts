/**
 * API endpoint để publish draft sau khi admin approve
 * POST /api/admin/drafts/[slug]/publish
 * 
 * Workflow:
 * 1. Lấy draft từ data/workflow/blog/[slug].json
 * 2. Validate và optimize SEO nếu cần
 * 3. Publish vào data/blog/[slug].ts
 * 4. Update status trong workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentPreview, changeContentStatus } from '@/lib/admin/publishing-workflow';
import { saveBlogPost } from '@/lib/admin/file-writer';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Authentication
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const { slug } = await params;

    // 2. Get draft from workflow
    const previewResult = getContentPreview('blog', slug);
    
    if (!previewResult.success || !previewResult.content) {
      return NextResponse.json({
        success: false,
        message: `Draft not found: ${slug}`
      }, { status: 404 });
    }

    const draft = previewResult.content;

    // 3. Validate draft is in 'review' status
    if (draft.status !== 'review') {
      return NextResponse.json({
        success: false,
        message: `Draft status is '${draft.status}', must be 'review' to publish`
      }, { status: 400 });
    }

    // 4. Create published blog post
    const publishedPost = {
      id: draft.id || String(Date.now()),
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt || draft.content.substring(0, 200),
      content: draft.content,
      category: draft.category || 'General',
      tags: draft.tags || [],
      author: draft.author || '360TuongTac Team',
      date: draft.date || new Date().toISOString().split('T')[0],
      readTime: draft.readTime || `${Math.ceil((draft.content?.length || 0) / 1000)} phút`,
      imageUrl: draft.imageUrl || '/images/blog/default.jpg',
      imageAlt: draft.imageAlt || draft.title,
      metaTitle: draft.metaTitle || `${draft.title} | Blog - 360TuongTac`,
      metaDescription: draft.metaDescription || draft.excerpt || '',
      seoScore: draft.seoScore || 0,
      featured: draft.featured || false,
    };

    // 5. Save to data/blog/ (publish!)
    const saveResult = await saveBlogPost(publishedPost);

    if (!saveResult.success) {
      return NextResponse.json({
        success: false,
        message: `Failed to publish: ${saveResult.message}`
      }, { status: 500 });
    }

    // 6. Update workflow status to 'published'
    const statusResult = changeContentStatus(
      'blog',
      slug,
      'published',
      draft.author || 'Admin'
    );

    if (!statusResult.success) {
      console.error('[Publish API] Failed to update workflow status:', statusResult.message);
    }

    return NextResponse.json({
      success: true,
      message: `Blog post "${draft.title}" published successfully!`,
      slug: draft.slug,
      url: `/blog/${draft.slug}`
    });

  } catch (error) {
    console.error('[Publish API] Error:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

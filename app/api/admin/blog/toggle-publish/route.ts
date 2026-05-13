/**
 * API Route: Toggle Blog Post Publish Status
 * POST /api/admin/blog/toggle-publish
 */

import { NextRequest, NextResponse } from 'next/server';
import { toggleBlogPostPublish } from '@/lib/admin/file-writer';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const body = await request.json();
    const { slug, published } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    if (published === undefined) {
      return NextResponse.json(
        { success: false, message: 'Published status is required' },
        { status: 400 }
      );
    }

    // Toggle publish status
    const result = await toggleBlogPostPublish(slug, published);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      slug,
      published
    });
  } catch (error) {
    console.error('Error toggling publish status:', error);
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

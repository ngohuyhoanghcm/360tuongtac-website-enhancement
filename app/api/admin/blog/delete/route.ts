/**
 * API Route: Delete Blog Post
 * POST /api/admin/blog/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteBlogPost } from '@/lib/admin/file-writer';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    // Delete blog post
    const result = await deleteBlogPost(slug);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      slug
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
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

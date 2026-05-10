/**
 * GET /api/admin/drafts/[slug]/preview
 * Get draft preview for editing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentPreview } from '@/lib/admin/publishing-workflow';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Authentication
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const { slug } = await params;

    // 2. Get draft preview
    const result = getContentPreview('blog', slug);

    if (!result.success || !result.content) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Draft not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      message: 'Draft preview retrieved'
    });

  } catch (error) {
    console.error('[Draft Preview API] Error:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to get draft preview: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

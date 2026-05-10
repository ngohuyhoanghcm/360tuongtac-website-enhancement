/**
 * DELETE /api/admin/drafts/[slug]
 * Delete a draft
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteContentWorkflow } from '@/lib/admin/publishing-workflow';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Authentication
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') as 'blog' | 'service') || 'blog';

    // 2. Delete draft
    const result = deleteContentWorkflow(type, slug);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Draft "${slug}" deleted successfully`
    });

  } catch (error) {
    console.error('[Delete Draft API] Error:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to delete draft: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

/**
 * Draft Status Management API
 * POST /api/admin/drafts/[slug]/status - Change draft status
 * DELETE /api/admin/drafts/[slug] - Delete draft
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  changeContentStatus,
  deleteContentWorkflow
} from '@/lib/admin/publishing-workflow';

// POST /api/admin/drafts/[slug]/status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const { action, type = 'blog', reason } = body;

    // Map UI actions to workflow statuses
    let newStatus: string;
    switch (action) {
      case 'approve':
        newStatus = 'published';
        break;
      case 'reject':
        newStatus = 'draft';
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    // Change status
    const result = changeContentStatus(
      type as 'blog' | 'service',
      slug,
      newStatus as any,
      'Admin',
      reason || `Status changed via API: ${action}`
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Draft ${action}d successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[API] Error updating draft status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update draft status' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/drafts/[slug]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'blog';

    // Delete draft
    const result = deleteContentWorkflow(type as 'blog' | 'service', slug);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Draft deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[API] Error deleting draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}

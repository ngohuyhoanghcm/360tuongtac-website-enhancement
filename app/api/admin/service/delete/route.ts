/**
 * API Route: Delete Service
 * DELETE /api/admin/service/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteService } from '@/lib/admin/file-writer';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    // Delete service
    const result = await deleteService(slug);

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
    console.error('Error deleting service:', error);
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

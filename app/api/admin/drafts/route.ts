/**
 * Drafts Management API
 * GET /api/admin/drafts - Get all drafts by status
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getContentByStatus
} from '@/lib/admin/publishing-workflow';

// GET /api/admin/drafts?status=pending
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'review'; // review = pending

    // Get drafts by status
    const drafts = getContentByStatus('blog', status as any);
    const services = getContentByStatus('service', status as any);

    // Format for UI
    const formattedDrafts = [
      ...drafts.map((draft: any) => ({
        id: draft.id,
        slug: draft.slug,
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category,
        tags: draft.tags,
        status: draft.status === 'review' ? 'pending' : draft.status,
        createdAt: draft.versionHistory?.[0]?.timestamp || draft.date,
        createdBy: draft.author,
        seoScore: draft.seoScore,
        type: 'blog' as const,
      })),
      ...services.map((service: any) => ({
        id: service.id,
        slug: service.slug,
        title: service.name,
        excerpt: service.shortDescription,
        content: service.description,
        category: 'Service',
        tags: [],
        status: service.status === 'review' ? 'pending' : service.status,
        createdAt: service.versionHistory?.[0]?.timestamp,
        createdBy: 'Admin',
        seoScore: undefined,
        type: 'service' as const,
      }))
    ];

    return NextResponse.json({
      success: true,
      drafts: formattedDrafts,
      total: formattedDrafts.length
    });

  } catch (error) {
    console.error('[API] Error fetching drafts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

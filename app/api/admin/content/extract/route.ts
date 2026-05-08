/**
 * Content Extraction API
 * POST /api/admin/content/extract
 * 
 * Extracts content from URLs for preview and analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractContentFromURL } from '@/lib/admin/content-extractor';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'Missing URL parameter' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('[API] Extracting content from URL:', url);

    // 3. Extract content
    const extracted = await extractContentFromURL(url);

    // 4. Return extracted content
    return NextResponse.json({
      success: true,
      extracted: {
        title: extracted.title,
        content: extracted.content,
        excerpt: extracted.excerpt,
        author: extracted.author,
        date: extracted.date,
        imageCount: extracted.images.length,
        firstImage: extracted.images[0] || null,
        metadata: extracted.metadata
      },
      stats: {
        contentLength: extracted.content.length,
        wordCount: extracted.content.split(/\s+/).length,
        estimatedReadTime: `${Math.ceil(extracted.content.length / 1000)} phút`
      }
    });

  } catch (error) {
    console.error('[API] Content extraction error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to extract content',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

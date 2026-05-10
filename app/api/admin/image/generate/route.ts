/**
 * AI Image Generation API
 * POST /api/admin/image/generate
 * 
 * Generates images using AI (Google Imagen or DALL-E 3)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateImage, generateImagePromptFromContent } from '@/lib/admin/image-generator';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    // 2. Parse request
    const body = await request.json();
    const { prompt, slug, title, content, category, size, style } = body;

    // Either prompt or (title + content) is required
    if (!prompt && (!title || !content)) {
      return NextResponse.json(
        { success: false, message: 'Missing prompt or title+content' },
        { status: 400 }
      );
    }

    // Generate prompt from title/content if not provided
    const imagePrompt = prompt || generateImagePromptFromContent(
      title,
      content,
      category || 'General'
    );

    console.log('[API] Generating image with prompt:', imagePrompt.substring(0, 100));

    // 3. Generate image
    const result = await generateImage({
      prompt: imagePrompt,
      slug: slug, // Pass slug for consistent file naming
      size: size || '1792x1024',
      style: style || 'photographic'
    });

    // 4. Return result
    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        alt: result.alt,
        cached: result.cached || false, // Return cache status
        message: result.cached ? 'Image loaded from cache' : 'Image generated successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to generate image',
          error: result.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[API] Image generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

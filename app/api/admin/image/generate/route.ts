/**
 * AI Image Generation API
 * POST /api/admin/image/generate
 * 
 * Generates images using AI (Google Imagen or DALL-E 3)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateImage, generateImagePromptFromContent } from '@/lib/admin/image-generator';

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
    const { prompt, title, content, category, size, style } = body;

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
      size: size || '1792x1024',
      style: style || 'photographic'
    });

    // 4. Return result
    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        alt: result.alt,
        message: 'Image generated successfully'
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

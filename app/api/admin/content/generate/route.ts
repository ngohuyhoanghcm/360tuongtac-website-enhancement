/**
 * AI Content Generation API
 * POST /api/admin/content/generate
 * 
 * Generates blog posts using AI from:
 * - URL content extraction
 * - Topic expansion
 * - Text rewriting
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiContentGenerator } from '@/lib/admin/ai-content-generator';
import { saveBlogPost, BlogPostData } from '@/lib/admin/file-writer';
import { saveBlogPostWorkflow, type BlogPostWorkflow, type ContentStatus } from '@/lib/admin/publishing-workflow';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';
import { generateImage, generateImagePromptFromContent } from '@/lib/admin/image-generator';

// Generation job storage (in-memory for now, should use Redis in production)
const generationJobs = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    // 2. Parse request body with error handling
    let body;
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          { success: false, message: 'Content-Type must be application/json' },
          { status: 400 }
        );
      }
      
      const rawBody = await request.text();
      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'Request body is empty' },
          { status: 400 }
        );
      }
      
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('[API] Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid JSON in request body',
          error: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 400 }
      );
    }
    
    const { inputType, input, options, autoSave } = body;

    // Validation
    if (!inputType || !input) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: inputType, input' },
        { status: 400 }
      );
    }

    if (!['url', 'topic', 'text'].includes(inputType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid inputType. Must be: url, topic, or text' },
        { status: 400 }
      );
    }

    console.log(`[API] Content generation request: type=${inputType}, input=${input.substring(0, 50)}...`);

    // 3. Create generation job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    generationJobs.set(jobId, {
      id: jobId,
      status: 'queued',
      progress: 0,
      inputType,
      input,
      createdAt: new Date().toISOString()
    });

    // 4. Generate content based on input type
    let result;
    
    updateJobStatus(jobId, 'generating', 20);

    switch (inputType) {
      case 'url':
        result = await aiContentGenerator.generateFromURL(input, options);
        break;
      
      case 'topic':
        result = await aiContentGenerator.generateFromTopic(input, options);
        break;
      
      case 'text':
        result = await aiContentGenerator.generateFromText(input, options);
        break;
      
      default:
        throw new Error('Invalid input type');
    }

    updateJobStatus(jobId, 'completed', 100, result);

    // 5. Generate image if requested
    let imageUrl = result.blogPost?.imageUrl || '/images/blog/placeholder.webp';
    let imageAlt = result.blogPost?.imageAlt || '';

    if (options?.generateImage && result.success && result.blogPost?.title && result.blogPost?.content) {
      updateJobStatus(jobId, 'generating_image', 85);
      
      try {
        console.log('[API] Generating image for:', result.blogPost.title);
        
        // Generate image prompt from content
        const imagePrompt = generateImagePromptFromContent(
          result.blogPost.title,
          result.blogPost.content,
          result.blogPost.category || options.category || 'General'
        );

        // Generate image
        const imageResult = await generateImage({
          prompt: imagePrompt,
          slug: result.blogPost.slug, // Pass slug for consistent file naming (e.g., 'cach-tang-tuong-tac-tiktok-hieu-qua.webp')
          size: '1792x1024',
          style: 'photographic'
        });

        if (imageResult.success && imageResult.imageUrl) {
          imageUrl = imageResult.imageUrl;
          imageAlt = imageResult.alt || result.blogPost.title;
          console.log('[API] Image generated successfully:', imageUrl);
        } else {
          console.warn('[API] Image generation failed:', imageResult.error);
          // Continue without image - not critical
        }
      } catch (imageError) {
        console.error('[API] Error generating image:', imageError);
        // Continue without image - not critical
      }
    }

    // 6. Auto-save as DRAFT if requested (NOT publish!)
    if (autoSave && result.success && result.blogPost) {
      updateJobStatus(jobId, 'saving_draft', 90);

      try {
        // Generate proper metaDescription if missing or too short
        let metaDescription = result.blogPost.metaDescription || result.blogPost.excerpt || '';
        if (metaDescription.length < 120 && result.blogPost.content) {
          // Extract first meaningful paragraph from content
          const paragraphs = result.blogPost.content.split(/<p>|\n\n+/).filter(p => p.trim().length > 100);
          if (paragraphs.length > 0) {
            metaDescription = paragraphs[0].replace(/<[^>]+>/g, '').trim().substring(0, 150);
            // Ensure minimum length
            if (metaDescription.length < 120) {
              metaDescription = metaDescription.padEnd(120, '.') + ' Hướng dẫn chi tiết.';
            }
          }
        }
        
        // Auto-truncate metaTitle to 60 chars if too long (SEO requirement)
        let metaTitle = result.blogPost.metaTitle || `${result.blogPost.title} | Blog - 360TuongTac`;
        if (metaTitle.length > 60) {
          console.warn(`[API] MetaTitle too long (${metaTitle.length} chars), truncating to 60`);
          // Truncate at word boundary to avoid cutting mid-word
          metaTitle = metaTitle.substring(0, 57).trim() + '...';
        }
        
        // Auto-truncate metaDescription to 155 chars if too long (SEO requirement)
        if (metaDescription.length > 155) {
          console.warn(`[API] MetaDescription too long (${metaDescription.length} chars), truncating to 155`);
          metaDescription = metaDescription.substring(0, 152).trim() + '...';
        }
        
        // Create draft workflow object with status 'review'
        const draftPost: BlogPostWorkflow = {
          id: String(Date.now()),
          slug: result.blogPost.slug || '',
          title: result.blogPost.title || '',
          excerpt: result.blogPost.excerpt || '',
          content: result.blogPost.content || '',
          author: result.blogPost.author || 'AI Content Hub',
          date: result.blogPost.date || new Date().toISOString().split('T')[0],
          readTime: `${Math.ceil((result.blogPost.content?.length || 0) / 1000)} phút`,
          category: result.blogPost.category || 'General',
          tags: result.blogPost.tags || [],
          imageUrl: imageUrl, // Use generated image or default
          imageAlt: imageAlt,
          metaTitle: metaTitle, // Use truncated version
          metaDescription: metaDescription, // Use truncated version
          featured: false,
          seoScore: result.seoScore || 0,
          status: 'review' as ContentStatus, // DRAFT STATUS - needs approval
          versionHistory: [],
          currentVersion: 1,
        };

        // Save as DRAFT to data/workflow/blog/ (NOT to data/blog/!)
        const saveResult = saveBlogPostWorkflow(draftPost);
        
        if (saveResult.success) {
          updateJobStatus(jobId, 'draft_saved', 100, { slug: draftPost.slug });
          
          return NextResponse.json({
            success: true,
            message: `Content generated and saved as DRAFT for review`,
            jobId,
            slug: draftPost.slug,
            status: 'review',
            redirectUrl: `/admin/drafts`, // Redirect to drafts page
            blogPost: draftPost,
            seoScore: result.seoScore,
            suggestions: result.suggestions
          });
        }
      } catch (saveError) {
        console.error('[API] Error saving draft:', saveError);
        // Continue without saving - return generated content
      }
    }

    // 7. Return result with image info
    return NextResponse.json({
      success: result.success,
      jobId,
      blogPost: {
        ...result.blogPost,
        imageUrl,
        imageAlt
      },
      seoScore: result.seoScore,
      suggestions: result.suggestions,
      errors: result.errors,
      imageGenerated: options?.generateImage ? true : false
    });

  } catch (error) {
    console.error('[API] Content generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate content',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/content/generate?jobId=xxx
 * Check generation job status
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    const job = generationJobs.get(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('[API] Error checking job status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update job status helper
 */
function updateJobStatus(jobId: string, status: string, progress: number, result?: any) {
  const job = generationJobs.get(jobId);
  if (job) {
    job.status = status;
    job.progress = progress;
    if (result) {
      job.result = result;
    }
    if (status === 'completed' || status === 'failed') {
      job.completedAt = new Date().toISOString();
    }
    generationJobs.set(jobId, job);
  }
}

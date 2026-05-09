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
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

// Generation job storage (in-memory for now, should use Redis in production)
const generationJobs = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    // 2. Parse request body
    const body = await request.json();
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

    // 5. Auto-save if requested
    if (autoSave && result.success && result.blogPost) {
      updateJobStatus(jobId, 'saving', 90);

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
        
        const completePost: BlogPostData = {
          id: String(Date.now()),
          slug: result.blogPost.slug || '',
          title: result.blogPost.title || '',
          excerpt: result.blogPost.excerpt || '',
          content: result.blogPost.content || '',
          category: result.blogPost.category || 'General',
          tags: result.blogPost.tags || [],
          author: result.blogPost.author || '360TuongTac Team',
          date: result.blogPost.date || new Date().toISOString().split('T')[0],
          readTime: `${Math.ceil((result.blogPost.content?.length || 0) / 1000)} phút`,
          imageUrl: result.blogPost.imageUrl || '/images/blog/placeholder.webp',
          imageAlt: result.blogPost.imageAlt || `${result.blogPost.title} - 360TuongTac`,
          metaTitle: result.blogPost.metaTitle || `${result.blogPost.title} | Blog - 360TuongTac`,
          metaDescription: metaDescription,
          seoScore: result.seoScore || 0,
        };

        const saveResult = await saveBlogPost(completePost);
        
        if (saveResult.success) {
          updateJobStatus(jobId, 'saved', 100, { slug: completePost.slug });
          
          return NextResponse.json({
            success: true,
            message: 'Content generated and saved successfully',
            jobId,
            slug: completePost.slug,
            blogPost: completePost,
            seoScore: result.seoScore,
            suggestions: result.suggestions
          });
        }
      } catch (saveError) {
        console.error('[API] Error saving blog post:', saveError);
        // Continue without saving - return generated content
      }
    }

    // 6. Return result
    return NextResponse.json({
      success: result.success,
      jobId,
      blogPost: result.blogPost,
      seoScore: result.seoScore,
      suggestions: result.suggestions,
      errors: result.errors
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

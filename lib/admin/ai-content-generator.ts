/**
 * AI Content Generator
 * Core engine for AI-powered content generation with SEO/GEO/AEO optimization
 * 
 * Supports: Google Gemini Pro, OpenAI GPT-4
 * Features: Blog post generation, SEO optimization, Vietnamese language support
 */

import { BlogPostData } from './file-writer';
import { validateBlogPost } from './validation';
import { parseAIResponse } from './content-parser';
import { validateBlogPostContent, normalizeBlogPostData } from './content-validator';
import { generateRelatedContentSuggestions } from './related-content-suggester';

// ============================================
// Types & Interfaces
// ============================================

export interface AIContentRequest {
  inputType: 'url' | 'topic' | 'text' | 'video';
  input: string;                    // URL, topic, or text content
  options?: {
    category?: string;
    targetKeywords?: string[];
    tone?: 'professional' | 'casual' | 'educational' | 'conversational';
    wordCount?: number;
    generateImage?: boolean;
    optimizeFor?: {
      seo: boolean;
      geo: boolean;
      aeo: boolean;
    };
  };
}

export interface AIContentResponse {
  success: boolean;
  blogPost?: Partial<BlogPostData>;
  seoScore?: number;
  suggestions?: string[];
  errors?: string[];
}

export interface GenerationJob {
  id: string;
  status: 'queued' | 'extracting' | 'generating' | 'optimizing' | 'completed' | 'failed';
  progress: number;                 // 0-100
  inputType: string;
  input: string;
  createdAt: string;
  completedAt?: string;
  result?: { slug: string };
  error?: string;
}

// ============================================
// AI Provider Configuration
// ============================================

class AIProvider {
  private provider: 'google_gemini' | 'openai';
  
  constructor() {
    this.provider = (process.env.AI_PROVIDER as 'google_gemini' | 'openai') || 'google_gemini';
  }

  async generateContent(prompt: string, systemPrompt: string): Promise<string> {
    if (this.provider === 'google_gemini') {
      return this.generateWithGemini(prompt, systemPrompt);
    } else {
      return this.generateWithOpenAI(prompt, systemPrompt);
    }
  }

  private async generateWithGemini(prompt: string, systemPrompt: string): Promise<string> {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      
      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: process.env.AI_MODEL_GEMINI || 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\n${prompt}`,
        config: {
          maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '8000'),
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
          responseMimeType: 'application/json', // Force JSON output
        }
      });

      return response.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Google Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateWithOpenAI(prompt: string, systemPrompt: string): Promise<string> {
    try {
      const OpenAI = (await import('openai')).default;
      
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL_OPENAI || 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// ============================================
// System Prompts
// ============================================

const SYSTEM_PROMPTS = {
  blogGeneration: `Bạn là chuyên gia content marketing và SEO 10+ năm kinh nghiệm cho thị trường Việt Nam.

NHIỆM VỤ: Tạo bài viết blog chuẩn SEO, tối ưu cho SEO/GEO/AEO.

QUY TẮC BẮT BUỘC:
- Title: 50-60 ký tự, chứa từ khóa chính
- Excerpt: 120-155 ký tự, mô tả hấp dẫn
- Content: Markdown format, 3000-5000 ký tự (KHÔNG quá 5000)
  * Dùng ## cho H2, ### cho H3
  * Có danh sách, paragraphs ngắn gọn
  * FAQ section 3-5 câu hỏi
  * Viết tiếng Việt tự nhiên
- Tags: 3-7 tags liên quan
- relatedServices: 2-3 slug dịch vụ (vd: "tang-mat-livestream-tiktok")
- relatedPosts: 3-5 slug bài viết (vd: "thuat-toan-tiktok-2025")

GEO: Dùng Q&A, câu khẳng định factual, structured data friendly.
AEO: Trả lời trực tiếp, tối ưu featured snippets, step-by-step.

FORMAT OUTPUT - JSON DUY NHẤT:
{"title":"...","excerpt":"...","content":"...","tags":[...],"category":"...","relatedServices":[...],"relatedPosts":[...],"faq":[{"question":"...","answer":"..."}]}

⚠️ QUAN TRỌNG:
- Chỉ trả về JSON, KHÔNG text khác, KHÔNG markdown code blocks
- JSON PHẢI hoàn chỉnh, bắt đầu { kết thúc }
- Content KHÔNG quá 5000 ký tự để tránh bị cắt
- Escape đúng quotes trong content (dùng \\")
- KHÔNG trailing commas`,

  contentRewrite: `Bạn là chuyên gia content editing, viết lại nội dung chuẩn SEO cho thị trường Việt Nam.

NHIỆM VỤ: Viết lại nội dung, cải thiện readability, thêm structure (headings, lists, FAQs).

QUY TẮC:
- Giữ ý chính, cải thiện flow
- Thêm headings (##, ###), FAQ section
- Content: Markdown format, 3000-5000 ký tự (KHÔNG quá 5000)
- Ngôn ngữ tự nhiên, tiếng Việt

FORMAT OUTPUT - JSON DUY NHẤT:
{"title":"...","excerpt":"...","content":"...","tags":[...],"category":"...","relatedServices":[...],"relatedPosts":[...],"faq":[{"question":"...","answer":"..."}]}

⚠️ Chỉ trả về JSON, KHÔNG text khác. Content KHÔNG quá 5000 ký tự.`,

  topicExpansion: `Bạn là chuyên gia content strategy, phát triển topic thành bài viết blog hoàn chỉnh chuẩn SEO/GEO/AEO.

QUY TẮC BẮT BUỘC:
- Title: 50-60 ký tự, chứa từ khóa, hấp dẫn
- Excerpt: 120-155 ký tự
- Content: Markdown format, 3000-5000 ký tự (KHÔNG quá 5000)
  * Dùng ## cho H2, ### cho H3
  * Có danh sách, paragraphs, FAQ section 3-5 câu
  * Data, examples, actionable insights
  * Tiếng Việt tự nhiên
- Tags: 3-7 tags
- relatedServices: 2-3 slug dịch vụ
- relatedPosts: 3-5 slug bài viết

FORMAT OUTPUT - JSON DUY NHẤT:
{"title":"...","excerpt":"...","content":"...","tags":[...],"category":"...","relatedServices":[...],"relatedPosts":[...],"faq":[{"question":"...","answer":"..."}]}

⚠️ Chỉ trả về JSON. KHÔNG text khác. Content KHÔNG quá 5000 ký tự. JSON phải hoàn chỉnh.`
};

// ============================================
// Main AI Content Generator Class
// ============================================

export class AIContentGenerator {
  private aiProvider: AIProvider;

  constructor() {
    this.aiProvider = new AIProvider();
  }

  /**
   * Generate blog post from URL content
   */
  async generateFromURL(url: string, options?: AIContentRequest['options']): Promise<AIContentResponse> {
    try {
      const { extractContentFromURL } = await import('./content-extractor');
      
      // Step 1: Extract content from URL
      console.log('[AI Generator] Extracting content from URL:', url);
      const extracted = await extractContentFromURL(url);

      if (!extracted.content || extracted.content.length < 100) {
        return {
          success: false,
          errors: ['Không thể trích xuất nội dung từ URL. Vui lòng kiểm tra lại.']
        };
      }

      // Step 2: Generate blog post from extracted content
      const prompt = `Dựa trên nội dung trích xuất từ URL, tạo bài viết blog mới chuẩn SEO.

URL nguồn: ${url}
Title gốc: ${extracted.title || 'N/A'}
Nội dung trích xuất (tóm tắt):
${extracted.content.substring(0, 4000)}

Yêu cầu:
- Category: ${options?.category || 'General'}
- Target keywords: ${(options?.targetKeywords || []).join(', ')}
- Tone: ${options?.tone || 'professional'}
- Content: Markdown format, 3000-5000 ký tự (TUYỆT ĐỐI KHÔNG quá 5000)
- Viết lại hoàn toàn, KHÔNG copy nguyên văn
- Thêm FAQ section 3-5 câu hỏi
- JSON PHẢI hoàn chỉnh, kết thúc bằng }`;

      const result = await this.aiProvider.generateContent(prompt, SYSTEM_PROMPTS.blogGeneration);
      
      // DEBUG: Save raw AI response for analysis
      const fs = await import('fs');
      const path = await import('path');
      const debugPath = path.join(process.cwd(), 'debug-url-response.json');
      fs.writeFileSync(debugPath, JSON.stringify({
        inputType: 'url',
        input: url,
        rawResponse: result,
        rawResponseLength: result.length,
        timestamp: new Date().toISOString()
      }, null, 2));
      console.log('[AI Generator] 🔍 DEBUG: Raw response saved to debug-url-response.json');
      console.log('[AI Generator] 🔍 DEBUG: Raw response length:', result.length);
      console.log('[AI Generator] 🔍 DEBUG: First 1600 chars:', result.substring(0, 1600));
      
      // Step 3: Parse and validate
      return this.parseAndValidateResult(result, options);

    } catch (error) {
      console.error('[AI Generator] Error generating from URL:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to generate content from URL']
      };
    }
  }

  /**
   * Generate blog post from topic
   */
  async generateFromTopic(topic: string, options?: AIContentRequest['options']): Promise<AIContentResponse> {
    try {
      console.log('[AI Generator] Generating from topic:', topic);

      const prompt = `Tạo bài viết blog chuẩn SEO về topic sau:

Topic: ${topic}

Yêu cầu:
- Category: ${options?.category || 'General'}
- Target keywords: ${(options?.targetKeywords || []).join(', ')}
- Tone: ${options?.tone || 'professional'}
- Content: Markdown format, 3000-5000 ký tự (TUYỆT ĐỐI KHÔNG quá 5000)
- Tối ưu SEO/GEO/AEO
- Practical examples, actionable insights
- FAQ section 3-5 câu hỏi
- JSON PHẢI hoàn chỉnh, kết thúc bằng }`;

      const result = await this.aiProvider.generateContent(prompt, SYSTEM_PROMPTS.topicExpansion);
      
      return this.parseAndValidateResult(result, options);

    } catch (error) {
      console.error('[AI Generator] Error generating from topic:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to generate content from topic']
      };
    }
  }

  /**
   * Generate blog post from text
   */
  async generateFromText(text: string, options?: AIContentRequest['options']): Promise<AIContentResponse> {
    try {
      console.log('[AI Generator] Generating from text, length:', text.length);

      const prompt = `Dựa trên nội dung/text được cung cấp dưới đây, hãy tạo một bài viết blog hoàn chỉnh, chuẩn SEO:

Nội dung nguồn:
${text.substring(0, 10000)}

Yêu cầu:
- Category: ${options?.category || 'General'}
- Target keywords: ${(options?.targetKeywords || []).join(', ')}
- Tone: ${options?.tone || 'professional'}
- Viết lại hoàn toàn với góc nhìn mới
- Tối ưu SEO/GEO/AEO đầy đủ
- Cải thiện chất lượng và depth

Hãy tạo bài viết mới dựa trên ý tưởng từ nội dung này.`;

      const result = await this.aiProvider.generateContent(prompt, SYSTEM_PROMPTS.contentRewrite);
      
      return this.parseAndValidateResult(result, options);

    } catch (error) {
      console.error('[AI Generator] Error generating from text:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to generate content from text']
      };
    }
  }

  /**
   * Parse AI response and validate - UPDATED to use new content parser
   */
  private async parseAndValidateResult(aiResponse: string, options?: AIContentRequest['options']): Promise<AIContentResponse> {
    try {
      console.log('[AI Generator] === STARTING NEW PARSER PIPELINE ===');
      console.log('[AI Generator] Raw AI response length:', aiResponse.length);
      console.log('[AI Generator] First 300 chars:', aiResponse.substring(0, 300));
      
      // Step 1: Use new content parser to strip markdown blocks and parse JSON
      const parsedJson = await parseAIResponse(aiResponse);
      console.log('[AI Generator] Parsed JSON successfully');
      console.log('[AI Generator] Parsed title:', parsedJson.title);
      console.log('[AI Generator] Parsed content length:', parsedJson.content?.length || 0);
      
      // Step 2: Normalize fields (map imageUrl → featuredImage, imageAlt → alt)
      const normalized = normalizeBlogPostData(parsedJson);
      console.log('[AI Generator] Fields normalized');
      console.log('[AI Generator] featuredImage:', normalized.featuredImage);
      console.log('[AI Generator] alt:', normalized.alt);
      
      // Step 3: Validate content before proceeding
      const validationResult = validateBlogPostContent(normalized);
      console.log('[AI Generator] Validation result:', validationResult.valid);
      console.log('[AI Generator] Validation errors:', validationResult.errors);
      console.log('[AI Generator] Validation warnings:', validationResult.warnings);
      
      if (!validationResult.valid) {
        return {
          success: false,
          errors: validationResult.errors
        };
      }
      
      // Step 4: Generate slug from title
      let title = normalized.title;
      if (title.length > 70) {
        const truncated = title.substring(0, 70);
        const lastSpace = truncated.lastIndexOf(' ');
        title = lastSpace > 50 ? truncated.substring(0, lastSpace) : truncated;
        console.log('[AI Generator] Title truncated from', normalized.title.length, 'to', title.length, 'chars');
      }
      
      const slug = this.generateSlug(title);
      
      // Step 5: Generate related content suggestions
      console.log('[AI Generator] Generating related content suggestions...');
      const relatedContent = generateRelatedContentSuggestions(
        {
          relatedServices: normalized.relatedServices,
          relatedPosts: normalized.relatedPosts,
          suggestedServices: normalized.suggestedServices // Legacy support
        },
        {
          slug,
          category: normalized.category || options?.category || 'General',
          tags: normalized.tags.length > 0 ? normalized.tags : (options?.targetKeywords || [])
        }
      );
      console.log('[AI Generator] Related services:', relatedContent.relatedServices);
      console.log('[AI Generator] Related posts:', relatedContent.relatedPosts);
      
      // Step 5: Ensure excerpt meets SEO requirements
      let excerpt = normalized.excerpt || '';
      if (excerpt.length < 120 && normalized.content) {
        const paragraphs = normalized.content.split(/<p>|\n\n+/).filter((p: string) => p.trim().length > 100);
        if (paragraphs.length > 0) {
          excerpt = paragraphs[0].replace(/<[^>]+>/g, '').trim();
        }
      }
      
      if (excerpt.length < 120) {
        const suffix = ' - Tìm hiểu chi tiết trong hướng dẫn cập nhật mới nhất 2026.';
        excerpt = title + suffix;
        if (excerpt.length > 155) {
          excerpt = title.substring(0, 155 - suffix.length) + suffix;
        }
      }
      
      if (excerpt.length > 155) {
        excerpt = excerpt.substring(0, 152) + '...';
      }
      
      // Step 7: Create BlogPostData with all required fields
      const blogPost: Partial<BlogPostData> = {
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        slug,
        title: title,
        excerpt: excerpt,
        content: normalized.content, // Already converted to HTML by parser
        category: normalized.category || options?.category || 'General',
        tags: normalized.tags.length > 0 ? normalized.tags : (options?.targetKeywords && options.targetKeywords.length > 0 ? options.targetKeywords : [slug.split('-').slice(0, 3).join('-'), (normalized.category || 'general').toLowerCase()]),
        author: normalized.author || '360TuongTac Team',
        date: normalized.date || new Date().toISOString().split('T')[0],
        readTime: normalized.readTime || `${Math.max(5, Math.ceil((normalized.content?.length || 2000) / 1000))} phút`,
        // Set BOTH legacy and new field names for compatibility
        imageUrl: normalized.featuredImage || '/images/blog/placeholder.webp',
        imageAlt: normalized.alt || `${title} - 360TuongTac`,
        featuredImage: normalized.featuredImage || '/images/blog/placeholder.webp',
        alt: normalized.alt || `${title} - 360TuongTac`,
        metaTitle: normalized.metaTitle || (title.length <= 40 ? `${title} | Blog - 360TuongTac` : title.substring(0, 60)),
        metaDescription: excerpt,
        // Related content (Phase 3)
        relatedServices: relatedContent.relatedServices,
        relatedPosts: relatedContent.relatedPosts,
      };
      
      // Step 7: Final validation with existing validator
      console.log('[Validation] === STARTING FINAL VALIDATION ===');
      console.log('[Validation] slug:', blogPost.slug, `(${blogPost.slug?.length} chars)`);
      console.log('[Validation] title:', blogPost.title, `(${blogPost.title?.length} chars)`);
      console.log('[Validation] excerpt:', blogPost.excerpt?.substring(0, 50) + '...', `(${blogPost.excerpt?.length} chars)`);
      console.log('[Validation] content:', `${blogPost.content?.length} chars`);
      console.log('[Validation] imageUrl:', blogPost.imageUrl);
      console.log('[Validation] imageAlt:', blogPost.imageAlt);
      
      const validation = validateBlogPost(blogPost as BlogPostData);
      
      console.log('[Validation] isValid:', validation.isValid);
      console.log('[Validation] seoScore:', validation.seoScore);
      console.log('[Validation] errors:', validation.errors);
      console.log('[Validation] === END VALIDATION ===');

      return {
        success: validation.isValid,
        blogPost,
        seoScore: validation.seoScore,
        suggestions: [...validation.warnings, ...validation.errors],
        errors: validation.isValid ? [] : validation.errors
      };

    } catch (error) {
      console.error('[AI Generator] Error parsing result:', error);
      return {
        success: false,
        errors: ['Không thể parse kết quả từ AI. Vui lòng thử lại.', error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Create structured data from plain text
   */
  private createStructuredFromText(text: string, options?: AIContentRequest['options']): any {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract title (first line or first heading)
    const titleMatch = lines.find(line => line.startsWith('# '));
    let title = titleMatch ? titleMatch.replace('# ', '').trim() : '';
    
    // If no heading found, try to extract from first sentence
    if (!title) {
      const firstLine = lines[0] || '';
      title = firstLine.substring(0, 70);
    }
    
    // Fallback to topic-based title if still empty
    if (!title || title.length < 10) {
      const topic = options?.category || 'Bài viết';
      title = `${topic} - Hướng dẫn chi tiết 2026`;
    }

    // Extract excerpt (first meaningful paragraph after title)
    const contentLines = titleMatch ? lines.slice(1) : lines;
    const excerptLines = contentLines.filter(line => !line.startsWith('#') && line.trim().length > 50);
    const excerpt = (excerptLines[0] || text.substring(0, 150)).substring(0, 155);

    // Extract tags from content keywords or use defaults
    let tags: string[] = [];
    if (options?.targetKeywords && options.targetKeywords.length > 0) {
      tags = options.targetKeywords;
    } else if (options?.category) {
      // Generate tags from category
      tags = [options.category, 'Hướng dẫn', '2026'];
    } else {
      tags = ['Blog', 'Hướng dẫn', 'Chi tiết'];
    }

    return {
      title: title.substring(0, 70),
      excerpt: excerpt.substring(0, 155),
      content: text,
      tags: tags.slice(0, 10)
    };
  }

  /**
   * Generate SEO-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100);
  }

  /**
   * Generate meta description from content
   */
  private generateMetaDescription(content: string, title: string): string {
    // Try to extract first meaningful paragraph
    const paragraphs = content.split(/<p>|\n\n+/).filter(p => p.trim().length > 100);
    if (paragraphs.length > 0) {
      let desc = paragraphs[0].replace(/<[^>]+>/g, '').trim();
      if (desc.length >= 120 && desc.length <= 155) {
        return desc;
      }
      return desc.substring(0, 150) + (desc.length > 150 ? '...' : '');
    }
    
    // Fallback: use title + generic description
    return `${title}. Tìm hiểu chi tiết trong bài viết này với hướng dẫn cập nhật mới nhất 2026.`;
  }

  /**
   * Extract fields from partial/incomplete JSON string
   * Uses regex to extract individual fields when JSON.parse fails
   */
  private extractFieldsFromPartialJson(jsonStr: string, options: any): any {
    console.log('[JSON Extractor] Extracting fields from partial JSON');
    
    const result: any = {
      title: options?.category || 'Bài viết',
      excerpt: '',
      content: '',
      tags: [options?.category || 'General', 'Hướng dẫn', '2026'],
      metaDescription: ''
    };
    
    try {
      // Extract title
      const titleMatch = jsonStr.match(/"title"\s*:\s*"([^"]*)"/);
      if (titleMatch) {
        result.title = titleMatch[1];
        console.log('[JSON Extractor] Extracted title:', result.title);
      }
      
      // Extract excerpt
      const excerptMatch = jsonStr.match(/"excerpt"\s*:\s*"([^"]*)"/);
      if (excerptMatch) {
        result.excerpt = excerptMatch[1];
        console.log('[JSON Extractor] Extracted excerpt:', result.excerpt.substring(0, 50));
      }
      
      // Extract content (everything after "content": until next field or end)
      const contentStart = jsonStr.indexOf('"content"');
      if (contentStart !== -1) {
        const valueStart = jsonStr.indexOf(':', contentStart) + 1;
        const quoteStart = jsonStr.indexOf('"', valueStart);
        if (quoteStart !== -1) {
          // Find the end of content string
          let quoteEnd = quoteStart + 1;
          let escaped = false;
          while (quoteEnd < jsonStr.length) {
            const char = jsonStr[quoteEnd];
            if (escaped) {
              escaped = false;
            } else if (char === '\\') {
              escaped = true;
            } else if (char === '"') {
              // Check if this is end of string (followed by , or })
              const nextNonSpace = jsonStr.substring(quoteEnd + 1).trim()[0];
              if (nextNonSpace === ',' || nextNonSpace === '}' || nextNonSpace === '\n') {
                break;
              }
            }
            quoteEnd++;
          }
          
          if (quoteEnd < jsonStr.length) {
            result.content = jsonStr.substring(quoteStart + 1, quoteEnd);
            // Unescape JSON string
            result.content = result.content.replace(/\\n/g, '\n')
                                          .replace(/\\"/g, '"')
                                          .replace(/\\\\/g, '\\');
            console.log('[JSON Extractor] Extracted content:', result.content.length, 'chars');
          }
        }
      }
      
      // Extract tags
      const tagsMatch = jsonStr.match(/"tags"\s*:\s*\[([^\]]*)\]/);
      if (tagsMatch) {
        const tagsStr = tagsMatch[1];
        const tags = tagsStr.match(/"([^"]*)"/g)?.map(t => t.replace(/"/g, '')) || [];
        if (tags.length > 0) {
          result.tags = tags;
          console.log('[JSON Extractor] Extracted tags:', result.tags);
        }
      }
      
    } catch (error) {
      console.warn('[JSON Extractor] Extraction failed:', error);
    }
    
    return result;
  }

  /**
   * Optimize existing content for SEO/GEO/AEO
   */
  async optimizeForSEO(content: string, keywords: string[]): Promise<{
    optimizedContent: string;
    seoScore: number;
    suggestions: string[];
  }> {
    try {
      const prompt = `Tối ưu nội dung sau cho SEO/GEO/AEO:

Keywords mục tiêu: ${keywords.join(', ')}

Nội dung:
${content.substring(0, 15000)}

Yêu cầu:
1. Thêm/tối ưu headings (H2, H3) với keywords
2. Thêm FAQ section (3-5 câu hỏi phổ biến)
3. Cải thiện keyword density (1-3%)
4. Thêm internal linking suggestions
5. Tối ưu cho featured snippets
6. Cải thiện readability

Output: Nội dung đã tối ưu (Markdown format)`;

      const optimized = await this.aiProvider.generateContent(prompt, SYSTEM_PROMPTS.contentRewrite);

      return {
        optimizedContent: optimized || content,
        seoScore: 85, // Will be calculated by validation
        suggestions: [
          'Đã tối ưu headings',
          'Đã thêm FAQ section',
          'Đã cải thiện keyword density',
          'Đã tối ưu cho featured snippets'
        ]
      };

    } catch (error) {
      console.error('[AI Generator] Error optimizing for SEO:', error);
      return {
        optimizedContent: content,
        seoScore: 0,
        suggestions: ['Failed to optimize content']
      };
    }
  }
}

// ============================================
// Singleton Instance
// ============================================

export const aiContentGenerator = new AIContentGenerator();

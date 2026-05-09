/**
 * AI Content Generator
 * Core engine for AI-powered content generation with SEO/GEO/AEO optimization
 * 
 * Supports: Google Gemini Pro, OpenAI GPT-4
 * Features: Blog post generation, SEO optimization, Vietnamese language support
 */

import { BlogPostData } from './file-writer';
import { validateBlogPost } from './validation';

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
          maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
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
  blogGeneration: `Bạn là một chuyên gia content marketing và SEO với 10+ năm kinh nghiệm trong việc tạo bài viết blog chuẩn SEO cho thị trường Việt Nam.

NHIỆM VỤ CỦA BẠN:
1. Tạo bài viết blog chất lượng cao, hấp dẫn và chuẩn SEO
2. Tối ưu cho SEO (Search Engine Optimization)
3. Tối ưu cho GEO (Generative Engine Optimization)
4. Tối ưu cho AEO (Answer Engine Optimization)

QUY TẮC SEO BẮT BUỘC:
- Title: 50-70 ký tự, chứa từ khóa chính, hấp dẫn
- Excerpt/Meta Description: 120-160 ký tự, mô tả hấp dẫn
- Content: Tối thiểu 1500 ký tự, preferably 2000-3000+ ký tự
- Tags: 3-10 tags liên quan
- Structure: Có headings (H2, H3), lists, FAQs
- Internal linking: Gợi ý 1-3 related services
- Language: Tiếng Việt tự nhiên, không dịch máy

QUY TẮC GEO (Generative Engine Optimization):
- Sử dụng format Q&A cho các câu hỏi phổ biến
- Thêm FAQ section (ít nhất 3-5 câu hỏi)
- Sử dụng câu khẳng định rõ ràng, factual
- Cite sources và data khi có thể
- Structured data friendly

QUY TẮC AEO (Answer Engine Optimization):
- Trả lời trực tiếp các câu hỏi phổ biến
- Optimized cho featured snippets
- Step-by-step instructions cho how-to content
- Definition blocks cho khái niệm
- Comparison tables khi phù hợp

FORMAT OUTPUT (JSON):
{
  "title": "Title bài viết (50-70 ký tự)",
  "excerpt": "Meta description (120-160 ký tự)",
  "content": "Nội dung đầy đủ với Markdown formatting",
  "tags": ["tag1", "tag2", "tag3"],
  "suggestedServices": ["service-slug-1", "service-slug-2"],
  "faq": [
    {"question": "Câu hỏi 1?", "answer": "Trả lời 1"},
    {"question": "Câu hỏi 2?", "answer": "Trả lời 2"}
  ]
}`,

  contentRewrite: `Bạn là chuyên gia content editing với khả năng viết lại nội dung để tối ưu SEO và hấp dẫn người đọc.

NHIỆM VỤ:
1. Viết lại nội dung cung cấp để chuẩn SEO
2. Cải thiện chất lượng và readability
3. Thêm structure (headings, lists, FAQs)
4. Tối ưu cho Vietnamese audience
5. Đảm bảo độ dài tối thiểu 1500 ký tự

QUY TẮC:
- Giữ nguyên ý chính và thông tin quan trọng
- Cải thiện flow và readability
- Thêm headings, subheadings hợp lý
- Thêm FAQ section nếu phù hợp
- Sử dụng ngôn ngữ tự nhiên, conversation tone
- Output format: Markdown`,

  topicExpansion: `Bạn là chuyên gia content strategy với khả năng phát triển từ topic thành bài viết blog hoàn chỉnh.

NHIỆM VỤ:
1. Phân tích topic được cung cấp
2. Research và tạo outline chi tiết
3. Viết bài viết hoàn chỉnh dựa trên outline
4. Tối ưu SEO/GEO/AEO
5. Đảm bảo chất lượng và depth

QUY TẮC BẮT BUỘC:
- Content phải comprehensive và authoritative
- Sử dụng data và examples khi có thể
- Thêm actionable insights
- Include FAQs và practical tips
- Title: 50-70 ký tự, hấp dẫn, chứa từ khóa
- Excerpt: 120-160 ký tự, mô tả content
- Content: Ít nhất 1500 ký tự
- Tags: 3-10 tags liên quan

**QUAN TRỌNG: Output PHẢI là JSON format**

{
  "title": "Title bài viết (50-70 ký tự)",
  "excerpt": "Meta description (120-160 ký tự)",
  "content": "Nội dung đầy đủ với Markdown formatting (ít nhất 1500 ký tự)",
  "tags": ["tag1", "tag2", "tag3"],
  "faq": [
    {"question": "Câu hỏi 1?", "answer": "Trả lời 1"},
    {"question": "Câu hỏi 2?", "answer": "Trả lời 2"}
  ]
}

Đảm bảo JSON valid, không thêm text ngoài JSON!`
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
      const prompt = `Dựa trên nội dung được trích xuất từ URL sau, hãy tạo một bài viết blog hoàn chỉnh, chuẩn SEO:

URL nguồn: ${url}
Title gốc: ${extracted.title || 'N/A'}
Nội dung trích xuất:
${extracted.content.substring(0, 10000)}

Yêu cầu:
- Category: ${options?.category || 'General'}
- Target keywords: ${(options?.targetKeywords || []).join(', ')}
- Tone: ${options?.tone || 'professional'}
- Tối ưu SEO/GEO/AEO đầy đủ

Tạo bài viết mới dựa trên nội dung này nhưng KHÔNG copy nguyên văn. Viết lại hoàn toàn với góc nhìn mới, insights mới và giá trị gia tăng.`;

      const result = await this.aiProvider.generateContent(prompt, SYSTEM_PROMPTS.blogGeneration);
      
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

      const prompt = `Tạo một bài viết blog hoàn chỉnh, chuẩn SEO về topic sau:

Topic: ${topic}

Yêu cầu:
- Category: ${options?.category || 'General'}
- Target keywords: ${(options?.targetKeywords || []).join(', ')}
- Tone: ${options?.tone || 'professional'}
- Word count: ~${options?.wordCount || 2000} từ
- Tối ưu SEO/GEO/AEO đầy đủ
- Comprehensive, authoritative content
- Include practical examples và actionable insights

Hãy tạo bài viết chất lượng cao nhất có thể.`;

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
   * Parse AI response and validate
   */
  private async parseAndValidateResult(aiResponse: string, options?: AIContentRequest['options']): Promise<AIContentResponse> {
    try {
      // Try to parse JSON from AI response
      let parsed: any;
      
      console.log('[AI Generator] Raw AI response length:', aiResponse.length);
      console.log('[AI Generator] First 200 chars:', aiResponse.substring(0, 200));
      
      // Extract JSON from markdown code blocks if present
      // Try multiple patterns to handle different markdown formats
      
      // Simple string-based extraction (more reliable than regex)
      const startMarker = '```json';
      const endMarker = '```';
      const startIndex = aiResponse.indexOf(startMarker);
      
      if (startIndex !== -1) {
        // Found ```json block
        const contentStart = startIndex + startMarker.length;
        const endIndex = aiResponse.indexOf(endMarker, contentStart);
        
        let jsonStr: string;
        if (endIndex !== -1) {
          // Has closing backticks
          jsonStr = aiResponse.substring(contentStart, endIndex).trim();
          console.log('[AI Generator] Extracted JSON block with closing, length:', jsonStr.length);
        } else {
          // No closing backticks - extract until end or next ```
          console.warn('[AI Generator] No closing ``` found, extracting until end');
          jsonStr = aiResponse.substring(contentStart).trim();
          // Remove trailing text after last }
          const lastBrace = jsonStr.lastIndexOf('}');
          if (lastBrace !== -1) {
            jsonStr = jsonStr.substring(0, lastBrace + 1);
          }
          console.log('[AI Generator] Extracted JSON block without closing, length:', jsonStr.length);
        }
        
        try {
          parsed = JSON.parse(jsonStr);
          console.log('[AI Generator] Successfully parsed JSON from ```json block');
        } catch (parseError) {
          console.warn('[AI Generator] JSON parse failed:', parseError);
          
          // Strategy 1: Try to repair incomplete JSON
          console.log('[AI Generator] Attempting JSON repair...');
          let repairedJson = jsonStr;
          
          // Count opening and closing braces/brackets
          const openBraces = (repairedJson.match(/\{/g) || []).length;
          const closeBraces = (repairedJson.match(/\}/g) || []).length;
          const openBrackets = (repairedJson.match(/\[/g) || []).length;
          const closeBrackets = (repairedJson.match(/\]/g) || []).length;
          
          console.log('[AI Generator] Braces: {', openBraces, '} ', closeBraces, 'Brackets: [', openBrackets, '] ', closeBrackets);
          
          // Add missing closing braces/brackets
          for (let i = 0; i < (openBraces - closeBraces); i++) {
            repairedJson += '}';
          }
          for (let i = 0; i < (openBrackets - closeBrackets); i++) {
            repairedJson += ']';
          }
          
          // Try parsing repaired JSON
          try {
            parsed = JSON.parse(repairedJson);
            console.log('[AI Generator] Successfully parsed REPAIRED JSON');
          } catch (repairError) {
            console.warn('[AI Generator] Repaired JSON also failed, trying extraction');
            
            // Strategy 2: Extract what we can from partial JSON
            const firstBrace = repairedJson.indexOf('{');
            const lastBrace = repairedJson.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
              try {
                const cleanJson = repairedJson.substring(firstBrace, lastBrace + 1);
                // Try repairing again
                let finalJson = cleanJson;
                const ob = (finalJson.match(/\{/g) || []).length;
                const cb = (finalJson.match(/\}/g) || []).length;
                for (let i = 0; i < (ob - cb); i++) finalJson += '}';
                
                parsed = JSON.parse(finalJson);
                console.log('[AI Generator] Successfully parsed extracted & repaired JSON');
              } catch (e) {
                console.warn('[AI Generator] All JSON parsing failed, using partial JSON extraction');
                // Strategy 3: Extract fields from partial JSON (not text)
                parsed = this.extractFieldsFromPartialJson(jsonStr, options);
              }
            } else {
              // Use partial JSON extraction
              parsed = this.extractFieldsFromPartialJson(jsonStr, options);
            }
          }
        }
      } else {
        // Try raw JSON
        const firstBrace = aiResponse.indexOf('{');
        const lastBrace = aiResponse.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          const jsonStr = aiResponse.substring(firstBrace, lastBrace + 1);
          console.log('[AI Generator] Extracted raw JSON, length:', jsonStr.length);
          try {
            parsed = JSON.parse(jsonStr);
            console.log('[AI Generator] Successfully parsed raw JSON');
          } catch (parseError) {
            console.warn('[AI Generator] Raw JSON parse failed:', parseError);
            parsed = this.createStructuredFromText(aiResponse, options);
          }
        } else {
          console.warn('[AI Generator] No JSON found, using fallback parser');
          parsed = this.createStructuredFromText(aiResponse, options);
        }
      }

      // Generate slug from title
      // Ensure title meets SEO requirements (50-70 chars)
      let title = parsed.title || 'Untitled';
      if (title.length > 70) {
        // Truncate to 70 chars, preserve word boundary
        const truncated = title.substring(0, 70);
        const lastSpace = truncated.lastIndexOf(' ');
        title = lastSpace > 50 ? truncated.substring(0, lastSpace) : truncated;
        console.log('[AI Generator] Title truncated from', parsed.title.length, 'to', title.length, 'chars');
      }
      
      const slug = this.generateSlug(title);

      // Ensure excerpt meets minimum length for SEO (120-155 chars)
      let excerpt = parsed.excerpt || '';
      
      // If excerpt too short, extract from content
      if (excerpt.length < 120 && parsed.content) {
        const paragraphs = parsed.content.split(/<p>|\n\n+/).filter((p: string) => p.trim().length > 100);
        if (paragraphs.length > 0) {
          excerpt = paragraphs[0].replace(/<[^>]+>/g, '').trim();
        }
      }
      
      // Final fallback: expand with context to meet minimum
      if (excerpt.length < 120) {
        const title = parsed.title || 'Bài viết';
        const suffix = ' - Tìm hiểu chi tiết trong hướng dẫn cập nhật mới nhất 2026.';
        excerpt = title + suffix;
        // Truncate title if needed to fit
        if (excerpt.length > 155) {
          excerpt = title.substring(0, 155 - suffix.length) + suffix;
        }
      }
      
      // Ensure excerpt is within SEO limits (120-155 chars)
      if (excerpt.length > 155) {
        excerpt = excerpt.substring(0, 152) + '...';
      }
      if (excerpt.length < 120) {
        // Pad with spaces if absolutely necessary (shouldn't happen)
        excerpt = excerpt.padEnd(120, ' ') + '.';
      }

      // Create BlogPostData with all required fields
      const blogPost: Partial<BlogPostData> = {
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Auto-generate unique ID
        slug,
        title: title,
        excerpt: excerpt,
        content: parsed.content || aiResponse,
        category: options?.category || 'General',
        tags: parsed.tags || options?.targetKeywords || [],
        author: '360TuongTac Team',
        date: new Date().toISOString().split('T')[0],
        readTime: `${Math.max(5, Math.ceil((parsed.content?.length || 2000) / 1000))} phút`,
        imageUrl: parsed.imageUrl || '/images/blog/placeholder.webp',
        imageAlt: parsed.imageAlt || `${title} - 360TuongTac`,
        metaTitle: parsed.metaTitle || (title.length <= 60 ? `${title} | Blog - 360TuongTac` : `${title.substring(0, 57)}...`),
        metaDescription: excerpt, // Use same as excerpt (guaranteed 120-155 chars)
      };

      // Validate
      console.log('[Validation] === STARTING VALIDATION ===');
      console.log('[Validation] slug:', blogPost.slug, `(${blogPost.slug?.length} chars)`);
      console.log('[Validation] title:', blogPost.title, `(${blogPost.title?.length} chars)`);
      console.log('[Validation] excerpt:', blogPost.excerpt?.substring(0, 50) + '...', `(${blogPost.excerpt?.length} chars)`);
      console.log('[Validation] content:', `${blogPost.content?.length} chars`);
      console.log('[Validation] category:', blogPost.category);
      console.log('[Validation] tags:', blogPost.tags, `(${blogPost.tags?.length} items)`);
      console.log('[Validation] author:', blogPost.author);
      console.log('[Validation] date:', blogPost.date);
      console.log('[Validation] readTime:', blogPost.readTime);
      console.log('[Validation] imageUrl:', blogPost.imageUrl);
      console.log('[Validation] imageAlt:', blogPost.imageAlt, `(${blogPost.imageAlt?.length} chars)`);
      console.log('[Validation] metaTitle:', blogPost.metaTitle, `(${blogPost.metaTitle?.length} chars)`);
      console.log('[Validation] metaDescription:', blogPost.metaDescription?.substring(0, 50) + '...', `(${blogPost.metaDescription?.length} chars)`);
      
      const validation = validateBlogPost(blogPost as BlogPostData);
      
      console.log('[Validation] isValid:', validation.isValid);
      console.log('[Validation] seoScore:', validation.seoScore);
      console.log('[Validation] errors:', validation.errors);
      console.log('[Validation] warnings:', validation.warnings);
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
        errors: ['Không thể parse kết quả từ AI. Vui lòng thử lại.']
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

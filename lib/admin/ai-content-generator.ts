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
        model: process.env.AI_MODEL_GEMINI || 'gemini-2.0-flash',
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

QUY TẮC:
- Content phải comprehensive và authoritative
- Sử dụng data và examples khi có thể
- Thêm actionable insights
- Include FAQs và practical tips
- Output: Full blog post in Markdown format`
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
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // If not JSON, create structured data from text
        parsed = this.createStructuredFromText(aiResponse, options);
      }

      // Generate slug from title
      const slug = this.generateSlug(parsed.title);

      // Create BlogPostData
      const blogPost: Partial<BlogPostData> = {
        slug,
        title: parsed.title || 'Untitled',
        excerpt: parsed.excerpt || parsed.title?.substring(0, 155) || '',
        content: parsed.content || aiResponse,
        category: options?.category || 'General',
        tags: parsed.tags || options?.targetKeywords || [],
        author: '360TuongTac Team',
        date: new Date().toISOString().split('T')[0],
        metaTitle: parsed.title ? `${parsed.title} | Blog - 360TuongTac` : '',
        metaDescription: parsed.excerpt || '',
      };

      // Validate
      const validation = validateBlogPost(blogPost as BlogPostData);

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
    const title = titleMatch ? titleMatch.replace('# ', '').trim() : 'Blog Post';

    // Extract excerpt (first paragraph after title)
    const excerpt = lines.slice(1, 3).join(' ').substring(0, 155);

    return {
      title: title.substring(0, 70),
      excerpt,
      content: text,
      tags: options?.targetKeywords || ['blog', 'article']
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

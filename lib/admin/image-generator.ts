/**
 * AI Image Generator
 * Generate images using prioritized providers:
 * 1. ChatGPT Image 2.0 (Primary - Best Quality)
 * 2. Gemini API - Nano Banana Model (Secondary - Fast)
 * 3. DALL-E 3 (Fallback - Reliable)
 * 4. Google Imagen (Legacy Fallback)
 * 
 * Features:
 * - Featured image generation
 * - Multiple size support
 * - Auto WebP conversion
 * - SEO-optimized alt text
 * - Smart fallback chain
 */

import * as fs from 'fs';
import * as path from 'path';
import { getCachedImage, cacheImage } from './image-cache';

export interface ImageGenerationRequest {
  prompt: string;
  slug?: string; // Blog post slug for filename (e.g., 'cach-tang-tuong-tac-tiktok-hieu-qua')
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  style?: 'photographic' | 'digital-art' | 'illustration' | 'realistic';
  quality?: 'standard' | 'hd';
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  alt?: string;
  error?: string;
  cached?: boolean; // NEW: Indicates if image was from cache
}

/**
 * Generate image from prompt with priority-based provider selection
 * Priority: ChatGPT Image 2.0 > Gemini Nano Banana > DALL-E 3 > Google Imagen
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  // Check cache first
  const cachedUrl = getCachedImage(request.prompt, request.size, request.style);
  if (cachedUrl) {
    console.log('[Image Cache] HIT! Returning cached image');
    return {
      success: true,
      imageUrl: cachedUrl,
      alt: generateAltText(request.prompt),
      cached: true // Mark as cached
    };
  }

  // Not in cache, try providers in priority order
  const primaryProvider = (process.env.IMAGE_PROVIDER as string) || 'chatgpt_image_2';
  
  let result: ImageGenerationResponse | undefined;
  
  // Priority 1: ChatGPT Image 2.0
  if (primaryProvider === 'chatgpt_image_2' && process.env.OPENAI_API_KEY) {
    console.log('[Image Generator] Trying ChatGPT Image 2.0 (Priority 1)');
    result = await generateWithChatGPTImage2(request);
    if (result.success) {
      console.log('[Image Generator] ✅ ChatGPT Image 2.0 succeeded');
    } else {
      console.warn('[Image Generator] ⚠️ ChatGPT Image 2.0 failed, trying next provider');
    }
  }
  
  // Priority 2: Gemini API - Nano Banana Model
  if (!result?.success && (primaryProvider === 'gemini_nano_banana' || primaryProvider === 'chatgpt_image_2') && process.env.GOOGLE_GEMINI_API_KEY) {
    console.log('[Image Generator] Trying Gemini Nano Banana (Priority 2)');
    result = await generateWithGeminiNanoBanana(request);
    if (result.success) {
      console.log('[Image Generator] ✅ Gemini Nano Banana succeeded');
    } else {
      console.warn('[Image Generator] ⚠️ Gemini Nano Banana failed, trying next provider');
    }
  }
  
  // Priority 3: DALL-E 3
  if (!result?.success && process.env.DALLE3_API_KEY) {
    console.log('[Image Generator] Trying DALL-E 3 (Priority 3 - Fallback)');
    result = await generateWithDalle3(request);
    if (result.success) {
      console.log('[Image Generator] ✅ DALL-E 3 succeeded');
    } else {
      console.warn('[Image Generator] ️ DALL-E 3 failed, trying next provider');
    }
  }
  
  // Priority 4: Google Imagen (Legacy)
  if (!result?.success && process.env.GOOGLE_IMAGEN_API_KEY) {
    console.log('[Image Generator] Trying Google Imagen (Priority 4 - Legacy Fallback)');
    result = await generateWithImagen(request);
    if (result.success) {
      console.log('[Image Generator] ✅ Google Imagen succeeded');
    } else {
      console.warn('[Image Generator] ⚠️ Google Imagen failed');
    }
  }
  
  // All providers failed
  if (!result?.success) {
    console.error('[Image Generator] ❌ All image providers failed, using SVG placeholder');
    result = generateSvgPlaceholderSync(request);
  }
  
  // Cache the result if successful
  if (result.success && result.imageUrl) {
    cacheImage(request.prompt, result.imageUrl, request.size, request.style);
    result.cached = false; // Mark as newly generated
  }
  
  return result;
}

/**
 * Generate image using ChatGPT Image 2.0 (via OpenAI API)
 * Converts to WebP format and optimizes to 1200x630
 */
async function generateWithChatGPTImage2(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const OpenAI = (await import('openai')).default;
    const sharp = (await import('sharp')).default;
    
    console.log('[ChatGPT Image 2.0] Generating image:', request.prompt.substring(0, 100));

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ChatGPT Image 2.0 uses gpt-image-1 model
    // Note: This model has different parameter requirements than DALL-E 3
    const response = await openai.images.generate({
      model: "gpt-image-1", // ChatGPT Image 2.0 model
      prompt: request.prompt,
      n: 1,
      size: "1792x1024", // Get high-res, then resize
      quality: "high" // gpt-image-1 uses 'high' not 'hd'
      // Removed: response_format - not supported by gpt-image-1
    });

    const imageUrl = response.data?.[0]?.url;

    if (imageUrl) {
      // Download image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Convert to WebP and optimize to 1200x630
      const slug = request.slug || `chatgpt-${Date.now()}`;
      const filename = `${slug}.webp`;
      const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
      
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filepath = path.join(publicDir, filename);
      
      // Convert to WebP with optimization
      await sharp(imageBuffer)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .webp({ quality: 85, effort: 6 })
        .toFile(filepath);
      
      const fileSize = fs.statSync(filepath).size;
      console.log(`[ChatGPT Image 2.0] Saved: ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);

      return {
        success: true,
        imageUrl: `/images/blog/${filename}`,
        alt: generateAltText(request.prompt)
      };
    }

    return {
      success: false,
      error: 'No image URL returned from ChatGPT Image 2.0'
    };

  } catch (error) {
    console.error('[ChatGPT Image 2.0] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate with ChatGPT Image 2.0'
    };
  }
}

/**
 * Generate image using Gemini API - Nano Banana Model
 * Fast generation with good quality
 * Converts to WebP format and optimizes to 1200x630
 */
async function generateWithGeminiNanoBanana(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const sharp = (await import('sharp')).default;
    
    console.log('[Gemini Nano Banana] Generating image:', request.prompt.substring(0, 100));

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

    // Try Nano Banana model (fast generation)
    const models = [
      'gemini-2.0-flash-exp-image-generation', // Nano Banana - fast
      'gemini-2.0-flash', // Fallback
    ];

    let lastError: any;
    
    for (const model of models) {
      try {
        console.log(`[Gemini Nano Banana] Trying model: ${model}`);
        
        const response = await ai.models.generateImages({
          model: model,
          prompt: request.prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '16:9', // Standard for blog featured images
            // Removed: negativePrompt - not supported in Gemini API
          }
        });

        // Get base64 image data
        if (response.generatedImages && response.generatedImages.length > 0) {
          const imageData = response.generatedImages[0].image?.imageBytes;
          
          if (imageData) {
            // Convert to WebP and optimize to 1200x630
            const slug = request.slug || `gemini-${Date.now()}`;
            const filename = `${slug}.webp`;
            const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
            
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }

            const filepath = path.join(publicDir, filename);
            
            // Convert to WebP with optimization
            await sharp(Buffer.from(imageData, 'base64'))
              .resize(1200, 630, { fit: 'cover', position: 'center' })
              .webp({ quality: 85, effort: 6 })
              .toFile(filepath);
            
            const fileSize = fs.statSync(filepath).size;
            console.log(`[Gemini Nano Banana] Saved: ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);

            return {
              success: true,
              imageUrl: `/images/blog/${filename}`,
              alt: generateAltText(request.prompt)
            };
          }
        }

        return {
          success: false,
          error: 'No image generated'
        };
        
      } catch (modelError: any) {
        console.warn(`[Gemini Nano Banana] Model ${model} failed:`, modelError.message);
        lastError = modelError;
        
        // If it's a 404 (model not found), try next model
        if (modelError.status === 404 || modelError.message?.includes('not found')) {
          continue;
        }
        
        // For other errors, throw immediately
        throw modelError;
      }
    }
    
    // All models failed
    console.warn('[Gemini Nano Banana] All models failed');
    return {
      success: false,
      error: lastError?.message || 'All Gemini models failed'
    };

  } catch (error) {
    console.error('[Gemini Nano Banana] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate with Gemini Nano Banana'
    };
  }
}

/**
 * Synchronous SVG placeholder generation for fallback
 */
function generateSvgPlaceholderSync(request: ImageGenerationRequest): ImageGenerationResponse {
  try {
    // Extract key concepts from prompt for SVG
    const keywords = request.prompt
      .split(/[,\.]/)[0] // First sentence
      .substring(0, 50)
      .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
      .trim();
    
    // Create SVG with gradient background and text
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="280" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
        ${keywords}
      </text>
      <text x="600" y="340" font-family="Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">
        AI Generated Content
      </text>
      <text x="600" y="400" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">
        360TuongTac.com
      </text>
    </svg>`;

    // Save SVG
    const filename = `ai-placeholder-${Date.now()}.svg`;
    const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, svg, 'utf-8');

    console.log(`[Image Generator] SVG placeholder saved: ${filename}`);
    
    return {
      success: true,
      imageUrl: `/images/blog/${filename}`,
      alt: generateAltText(request.prompt)
    };
  } catch (error: any) {
    console.error('[Image Generator] SVG placeholder generation failed:', error);
    return {
      success: false,
      error: 'Image generation failed',
      imageUrl: '/images/blog/placeholder.webp'
    };
  }
}

/**
 * Generate image using Google Imagen
 * Converts to WebP format and optimizes to 1200x630 (matching existing blog posts)
 */
async function generateWithImagen(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const sharp = (await import('sharp')).default;
    
    console.log('[Image Generator] Generating with Google Imagen:', request.prompt);

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_IMAGEN_API_KEY });

    // Updated models list with current API versions (as of 2026-05)
    // Note: Model availability changes frequently, check Google AI Studio for latest
    const models = [
      'imagen-4.0-ultra-generate-preview-05-05',  // Latest ultra quality
      'imagen-4.0-generate-preview-05-05',        // Latest standard
      'imagen-3.0-generate-002',                   // Previous stable
      'imagen-3.0-fast-generate-001',              // Fast generation
      'imagen-2.0'                                  // Legacy fallback
    ];

    let lastError: any;
    
    for (const model of models) {
      try {
        console.log(`[Image Generator] Trying model: ${model}`);
        
        const response = await ai.models.generateImages({
          model: model,
          prompt: request.prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '16:9', // Standard for blog featured images
          }
        });

        // Get base64 image data
        if (response.generatedImages && response.generatedImages.length > 0) {
          const imageData = response.generatedImages[0].image?.imageBytes;
          
          if (imageData) {
            // Convert to WebP and optimize to 1200x630 (matching existing blog posts)
            const slug = request.slug || `ai-${Date.now()}`;
            const filename = `${slug}.webp`; // Use slug-based naming
            const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
            
            // Ensure directory exists
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }

            const filepath = path.join(publicDir, filename);
            
            // Convert to WebP with optimization (matching existing blog standard)
            await sharp(Buffer.from(imageData, 'base64'))
              .resize(1200, 630, { fit: 'cover', position: 'center' })
              .webp({ quality: 85, effort: 6 })
              .toFile(filepath);
            
            const fileSize = fs.statSync(filepath).size;
            console.log(`[Image Generator] Google Imagen saved: ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);

            return {
              success: true,
              imageUrl: `/images/blog/${filename}`,
              alt: generateAltText(request.prompt)
            };
          }
        }

        return {
          success: false,
          error: 'No image generated'
        };
        
      } catch (modelError: any) {
        console.warn(`[Image Generator] Model ${model} failed:`, modelError.message);
        lastError = modelError;
        
        // If it's a 404 (model not found), try next model
        if (modelError.status === 404 || modelError.message?.includes('not found')) {
          continue;
        }
        
        // For other errors, throw immediately
        throw modelError;
      }
    }
    
    // All models failed - use AI-generated SVG placeholder as fallback
    console.warn('[Image Generator] All Imagen models failed, using SVG placeholder');
    return generateSvgPlaceholder(request);

  } catch (error) {
    console.error('[Image Generator] Google Imagen error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image with Google Imagen'
    };
  }
}

/**
 * Generate image using DALL-E 3
 * Converts to WebP format and optimizes to 1200x630 (matching existing blog posts)
 */
async function generateWithDalle3(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const OpenAI = (await import('openai')).default;
    const sharp = (await import('sharp')).default;
    
    console.log('[Image Generator] Generating with DALL-E 3:', request.prompt);

    const openai = new OpenAI({ apiKey: process.env.DALLE3_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: request.prompt,
      n: 1,
      size: "1792x1024", // Get high-res from DALL-E, then resize
      quality: "standard",
      response_format: 'url'
    });

    const imageUrl = response.data?.[0]?.url;

    if (imageUrl) {
      // Download image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Convert to WebP and optimize to 1200x630 (matching existing blog posts)
      const slug = request.slug || `ai-${Date.now()}`;
      const filename = `${slug}.webp`; // Use slug-based naming
      const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
      
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filepath = path.join(publicDir, filename);
      
      // Convert PNG to WebP with optimization (matching existing blog standard)
      await sharp(imageBuffer)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .webp({ quality: 85, effort: 6 }) // 85% quality for balance
        .toFile(filepath);
      
      const fileSize = fs.statSync(filepath).size;
      console.log(`[Image Generator] DALL-E 3 saved: ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);

      return {
        success: true,
        imageUrl: `/images/blog/${filename}`,
        alt: generateAltText(request.prompt)
      };
    }

    return {
      success: false,
      error: 'No image URL returned'
    };

  } catch (error) {
    console.error('[Image Generator] DALL-E 3 error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image with DALL-E 3'
    };
  }
}

/**
 * Generate SEO-optimized alt text from prompt
 * Pattern: "Hình ảnh 3D Isometric [description] - [Title] - 360TuongTac"
 * Matching existing blog posts standard
 */
function generateAltText(prompt: string): string {
  // Clean prompt for description part
  const description = prompt
    .replace(/photorealistic|high quality|professional|featured image/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract title from prompt (usually at the end after last dash or colon)
  const parts = prompt.split(/[:|-]/);
  const title = parts.length > 1 ? parts[parts.length - 1].trim() : description;
  
  // Build alt text matching existing blog pattern
  const alt = `Hình ảnh 3D Isometric ${description} - ${title} - 360TuongTac`;
  
  return alt.substring(0, 125); // Max 125 characters for alt text
}

/**
 * Generate image prompt from blog content
 */
export function generateImagePromptFromContent(title: string, content: string, category: string): string {
  // Extract key themes from content
  const keywords = extractKeywords(content, 5);
  
  const prompt = `Professional blog featured image: ${title}. ${keywords.join(', ')}. Clean, modern design, high quality, suitable for ${category} category blog post. Minimalist style, bright colors.`;
  
  return prompt.substring(0, 1000); // DALL-E 3 max: 1000 chars
}

/**
 * Generate SVG placeholder as fallback when all Imagen models fail
 */
async function generateSvgPlaceholder(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    // Extract key concepts from prompt for SVG
    const keywords = request.prompt
      .split(/[,\.]/)[0] // First sentence
      .substring(0, 50)
      .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
      .trim();
    
    // Create SVG with gradient background and text
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="280" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
        ${keywords}
      </text>
      <text x="600" y="340" font-family="Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">
        AI Generated Content
      </text>
      <text x="600" y="400" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">
        360TuongTac.com
      </text>
    </svg>`;

    // Save SVG
    const filename = `ai-placeholder-${Date.now()}.svg`;
    const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, svg, 'utf-8');

    console.log(`[Image Generator] SVG placeholder saved: ${filename}`);
    
    return {
      success: true,
      imageUrl: `/images/blog/${filename}`,
      alt: generateAltText(request.prompt)
    };
  } catch (error: any) {
    console.error('[Image Generator] SVG placeholder generation failed:', error);
    return {
      success: false,
      error: 'Image generation failed',
      imageUrl: '/images/blog/placeholder.webp'
    };
  }
}

/**
 * Extract keywords from content
 */
function extractKeywords(content: string, count: number): string[] {
  // Simple keyword extraction (frequency-based)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const stopWords = new Set(['this', 'that', 'these', 'those', 'with', 'from', 'have', 'been', 'were', 'will', 'would', 'could', 'should']);
  
  const frequency: Record<string, number> = {};
  
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * Generate multiple images for a blog post
 */
export async function generateMultipleImages(
  title: string, 
  content: string, 
  category: string,
  count: number = 1
): Promise<ImageGenerationResponse[]> {
  const results: ImageGenerationResponse[] = [];
  
  const basePrompt = generateImagePromptFromContent(title, content, category);
  
  for (let i = 0; i < count; i++) {
    const variationPrompt = `${basePrompt} Variation ${i + 1}`;
    
    const result = await generateImage({
      prompt: variationPrompt,
      size: '1792x1024',
      style: 'photographic'
    });
    
    results.push(result);
    
    // Add delay to avoid rate limiting
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

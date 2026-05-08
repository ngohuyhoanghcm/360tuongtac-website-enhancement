/**
 * AI Image Generator
 * Generate images using Google Imagen or DALL-E 3
 * 
 * Features:
 * - Featured image generation
 * - Multiple size support
 * - Auto WebP conversion
 * - SEO-optimized alt text
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ImageGenerationRequest {
  prompt: string;
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
}

/**
 * Generate image from prompt
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const provider = (process.env.IMAGE_PROVIDER as 'google_imagen' | 'dalle3') || 'google_imagen';
  
  if (provider === 'google_imagen') {
    return generateWithImagen(request);
  } else {
    return generateWithDalle3(request);
  }
}

/**
 * Generate image using Google Imagen
 */
async function generateWithImagen(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    
    console.log('[Image Generator] Generating with Google Imagen:', request.prompt);

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_IMAGEN_API_KEY });

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: request.prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: request.size === '1024x1792' ? '9:16' : 
                     request.size === '1792x1024' ? '16:9' : '1:1',
      }
    });

    // Get base64 image data
    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageData = response.generatedImages[0].image?.imageBytes;
      
      if (imageData) {
        // Save to public directory
        const filename = `ai-${Date.now()}.png`;
        const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
        
        // Ensure directory exists
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        const filepath = path.join(publicDir, filename);
        fs.writeFileSync(filepath, Buffer.from(imageData, 'base64'));

        return {
          success: true,
          imageUrl: `/images/blog/${filename}`,
          imageBase64: `data:image/png;base64,${imageData}`,
          alt: generateAltText(request.prompt)
        };
      }
    }

    return {
      success: false,
      error: 'No image generated'
    };

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
 */
async function generateWithDalle3(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const OpenAI = (await import('openai')).default;
    
    console.log('[Image Generator] Generating with DALL-E 3:', request.prompt);

    const openai = new OpenAI({ apiKey: process.env.DALLE3_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: request.prompt,
      n: 1,
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
      response_format: 'url'
    });

    const imageUrl = response.data?.[0]?.url;

    if (imageUrl) {
      // Download and save image
      const filename = `ai-${Date.now()}.png`;
      const publicDir = path.join(process.cwd(), 'public', 'images', 'blog');
      
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filepath = path.join(publicDir, filename);
      
      // Fetch and save image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(imageBuffer));

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
 */
function generateAltText(prompt: string): string {
  // Clean and optimize prompt for alt text
  const alt = prompt
    .replace(/photorealistic|high quality|professional/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
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

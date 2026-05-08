/**
 * Content Extractor
 * Extract content from URLs, videos, and documents
 * 
 * Features:
 * - Web page content extraction
 * - YouTube transcript extraction
 * - Document text extraction
 * - Clean content parsing
 */

import * as cheerio from 'cheerio';

export interface ExtractedContent {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date?: string;
  images: string[];
  metadata: {
    description?: string;
    keywords?: string[];
    language?: string;
    [key: string]: any;
  };
}

/**
 * Extract content from URL
 */
export async function extractContentFromURL(url: string): Promise<ExtractedContent> {
  try {
    console.log('[Content Extractor] Fetching URL:', url);

    const timeout = parseInt(process.env.CONTENT_EXTRACTION_TIMEOUT || '30000');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return parseHTML(html, url);

  } catch (error) {
    console.error('[Content Extractor] Error extracting from URL:', error);
    throw new Error(`Failed to extract content from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse HTML and extract content
 */
function parseHTML(html: string, url: string): ExtractedContent {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script').remove();
  $('style').remove();
  $('nav').remove();
  $('header').remove();
  $('footer').remove();
  $('.sidebar').remove();
  $('.advertisement').remove();
  $('.ads').remove();

  // Extract title
  const title = $('title').text().trim() || 
                $('h1').first().text().trim() || 
                $('meta[property="og:title"]').attr('content') ||
                '';

  // Extract meta description
  const description = $('meta[name="description"]').attr('content') ||
                      $('meta[property="og:description"]').attr('content') ||
                      '';

  // Extract author
  const author = $('meta[name="author"]').attr('content') ||
                 $('meta[property="article:author"]').attr('content') ||
                 '';

  // Extract date
  const date = $('meta[property="article:published_time"]').attr('content') ||
               $('time').attr('datetime') ||
               '';

  // Extract main content
  let content = '';
  
  // Try to find main content container
  const mainContent = $('article').first() || 
                      $('main').first() || 
                      $('[role="main"]').first() ||
                      $('.content').first() ||
                      $('.post-content').first() ||
                      $('.entry-content').first();

  if (mainContent.length > 0) {
    content = extractTextFromElement($, mainContent);
  } else {
    // Fallback: extract from body
    content = extractTextFromElement($, $('body'));
  }

  // Extract images
  const images: string[] = [];
  $('img').each((_, element) => {
    const src = $(element).attr('src');
    if (src && !src.startsWith('data:')) {
      // Convert relative URL to absolute
      const absoluteUrl = new URL(src, url).href;
      images.push(absoluteUrl);
    }
  });

  // Extract keywords
  const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()) : [];

  // Extract language
  const language = $('html').attr('lang') || 'vi';

  // Limit content length
  const maxLength = parseInt(process.env.CONTENT_MAX_LENGTH || '50000');
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + '...';
  }

  return {
    title,
    content,
    excerpt: description || content.substring(0, 200),
    author,
    date,
    images,
    metadata: {
      description,
      keywords,
      language,
    }
  };
}

/**
 * Extract clean text from HTML element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromElement($: any, element: any): string {
  let text = '';
  
  // Get headings
  element.find('h1, h2, h3, h4, h5, h6').each(function(this: any) {
    const headingText = $(this).text().trim();
    if (headingText) {
      text += `\n## ${headingText}\n\n`;
    }
  });

  // Get paragraphs
  element.find('p').each(function(this: any) {
    const content = $(this).text().trim();
    if (content && content.length > 50) {
      text += `${content}\n\n`;
    }
  });

  // Get lists
  element.find('ul, ol').each(function(this: any) {
    $(this).find('li').each(function(this: any) {
      const content = $(this).text().trim();
      if (content) {
        text += `- ${content}\n`;
      }
    });
    text += '\n';
  });

  // If no structured content found, get all text
  if (!text.trim()) {
    text = element.text().trim();
  }

  return text.trim();
}

/**
 * Extract YouTube video transcript (placeholder - requires YouTube API)
 */
export async function extractFromYouTube(videoUrl: string): Promise<ExtractedContent> {
  // Note: This requires YouTube Data API v3
  // For now, return placeholder
  console.log('[Content Extractor] YouTube extraction not yet implemented');
  
  return {
    title: 'YouTube Video',
    content: '',
    excerpt: 'YouTube transcript extraction requires API key',
    images: [],
    metadata: {}
  };
}

/**
 * Extract content from multiple URLs (batch processing)
 */
export async function extractFromMultipleURLs(urls: string[]): Promise<Map<string, ExtractedContent>> {
  const results = new Map<string, ExtractedContent>();
  
  for (const url of urls) {
    try {
      const content = await extractContentFromURL(url);
      results.set(url, content);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[Content Extractor] Failed to extract ${url}:`, error);
      results.set(url, {
        title: '',
        content: '',
        images: [],
        metadata: {}
      });
    }
  }
  
  return results;
}

/**
 * API Route: SEO Audit for Custom URL
 * POST /api/admin/seo-audit/url
 * 
 * Accepts a URL and performs SEO analysis on that page
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

interface URLOptions {
  url: string;
}

interface URLSEOAnalysis {
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  images: { src: string; alt: string }[];
  links: { href: string; text: string; internal: boolean }[];
  wordCount: number;
  content: string;
  canonical: string;
  ogTags: Record<string, string>;
  performance: {
    htmlSize: number;
    hasViewport: boolean;
    hasCharset: boolean;
  };
}

/**
 * Fetch and parse HTML content from URL
 */
async function fetchAndParseURL(url: string): Promise<URLSEOAnalysis> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 360TuongTac-SEO-Bot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Parse HTML
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["']/i);
    const charsetMatch = html.match(/<meta[^>]*charset=/i);

    // Extract headings
    const h1Matches = html.match(/<h1[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h1>/gi) || [];
    const h2Matches = html.match(/<h2[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h2>/gi) || [];
    const h3Matches = html.match(/<h3[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h3>/gi) || [];

    // Extract images
    const imgMatches = html.match(/<img[^>]+>/gi) || [];
    const images = imgMatches.map(img => {
      const srcMatch = img.match(/src=["']([^"']*)["']/i);
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      return {
        src: srcMatch?.[1] || '',
        alt: altMatch?.[1] || '',
      };
    });

    // Extract links
    const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi) || [];
    const baseUrl = new URL(url).origin;
    const links = linkMatches.map(link => {
      const hrefMatch = link.match(/href=["']([^"']*)["']/i);
      const textMatch = link.match(/>([^<]*)<\/a>/i);
      const href = hrefMatch?.[1] || '';
      return {
        href,
        text: textMatch?.[1] || '',
        internal: href.startsWith('/') || href.includes(baseUrl),
      };
    });

    // Extract OG tags
    const ogTags: Record<string, string> = {};
    const ogMatches = html.match(/<meta[^>]*property=["']og:([^"']*)["'][^>]*content=["']([^"']*)["']/gi) || [];
    ogMatches.forEach(match => {
      const propMatch = match.match(/property=["']og:([^"']*)["']/i);
      const contentMatch = match.match(/content=["']([^"']*)["']/i);
      if (propMatch && contentMatch) {
        ogTags[propMatch[1]] = contentMatch[1];
      }
    });

    // Extract text content (remove HTML tags)
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

    return {
      title: titleMatch?.[1] || '',
      metaDescription: metaDescMatch?.[1] || '',
      headings: {
        h1: h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim()),
        h2: h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim()),
        h3: h3Matches.map(h => h.replace(/<[^>]+>/g, '').trim()),
      },
      images,
      links,
      wordCount,
      content: textContent.substring(0, 5000), // Limit content
      canonical: canonicalMatch?.[1] || '',
      ogTags,
      performance: {
        htmlSize: html.length,
        hasViewport: !!viewportMatch,
        hasCharset: !!charsetMatch,
      },
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Analyze SEO for fetched URL content
 */
function analyzeURLSEO(analysis: URLSEOAnalysis, url: string) {
  const issues: any[] = [];
  let scores = {
    title: 100,
    meta: 100,
    content: 100,
    images: 100,
    technical: 100,
    schema: 100,
  };

  // Title Analysis
  if (!analysis.title) {
    scores.title -= 50;
    issues.push({
      severity: 'critical',
      category: 'title',
      message: 'Thiếu title tag',
      recommendation: 'Thêm <title> tag với nội dung mô tả trang',
      impact: 50,
    });
  } else if (analysis.title.length < 30) {
    scores.title -= 25;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Title quá ngắn',
      recommendation: 'Title nên có 50-60 ký tự',
      impact: 25,
    });
  } else if (analysis.title.length > 70) {
    scores.title -= 15;
    issues.push({
      severity: 'warning',
      category: 'title',
      message: 'Title quá dài',
      recommendation: 'Title nên có 50-60 ký tự để không bị cắt',
      impact: 15,
    });
  }

  // Multiple H1 check
  if (analysis.headings.h1.length === 0) {
    scores.content -= 30;
    issues.push({
      severity: 'critical',
      category: 'content',
      message: 'Thiếu H1 heading',
      recommendation: 'Thêm ít nhất 1 H1 tag cho trang',
      impact: 30,
    });
  } else if (analysis.headings.h1.length > 1) {
    scores.content -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: `Có ${analysis.headings.h1.length} H1 tags (nên chỉ có 1)`,
      recommendation: 'Chỉ nên có 1 H1 tag per page',
      impact: 15,
    });
  }

  // Meta Description
  if (!analysis.metaDescription) {
    scores.meta -= 40;
    issues.push({
      severity: 'critical',
      category: 'meta',
      message: 'Thiếu meta description',
      recommendation: 'Thêm <meta name="description"> với 120-155 ký tự',
      impact: 40,
    });
  } else if (analysis.metaDescription.length < 100) {
    scores.meta -= 20;
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Meta description quá ngắn',
      recommendation: 'Meta description nên có 120-155 ký tự',
      impact: 20,
    });
  } else if (analysis.metaDescription.length > 160) {
    scores.meta -= 15;
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Meta description quá dài',
      recommendation: 'Meta description nên có 120-155 ký tự',
      impact: 15,
    });
  }

  // Content Analysis
  if (analysis.wordCount < 300) {
    scores.content -= 35;
    issues.push({
      severity: 'critical',
      category: 'content',
      message: `Content quá ngắn (${analysis.wordCount} từ)`,
      recommendation: 'Nên có ít nhất 300 từ cho SEO tốt',
      impact: 35,
    });
  } else if (analysis.wordCount < 600) {
    scores.content -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: `Content hơi ngắn (${analysis.wordCount} từ)`,
      recommendation: 'Nên có ít nhất 600 từ',
      impact: 15,
    });
  }

  // Headings structure
  if (analysis.headings.h2.length === 0 && analysis.wordCount > 300) {
    scores.content -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Thiếu H2 headings',
      recommendation: 'Thêm H2 headings để cấu trúc content',
      impact: 15,
    });
  }

  // Images Analysis
  const imagesWithoutAlt = analysis.images.filter(img => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    const percentage = (imagesWithoutAlt.length / Math.max(analysis.images.length, 1)) * 100;
    if (percentage > 50) {
      scores.images -= 30;
      issues.push({
        severity: 'critical',
        category: 'images',
        message: `${imagesWithoutAlt.length}/${analysis.images.length} images thiếu alt text`,
        recommendation: 'Thêm alt text cho tất cả images',
        impact: 30,
      });
    } else if (percentage > 0) {
      scores.images -= 15;
      issues.push({
        severity: 'warning',
        category: 'images',
        message: `${imagesWithoutAlt.length} images thiếu alt text`,
        recommendation: 'Thêm alt text cho images',
        impact: 15,
      });
    }
  }

  if (analysis.images.length === 0 && analysis.wordCount > 200) {
    scores.images -= 20;
    issues.push({
      severity: 'info',
      category: 'images',
      message: 'Không có images trên trang',
      recommendation: 'Thêm images để tăng engagement',
      impact: 20,
    });
  }

  // Technical SEO
  if (!analysis.canonical) {
    scores.technical -= 15;
    issues.push({
      severity: 'warning',
      category: 'technical',
      message: 'Thiếu canonical URL',
      recommendation: 'Thêm <link rel="canonical"> tag',
      impact: 15,
    });
  }

  if (!analysis.performance.hasViewport) {
    scores.technical -= 20;
    issues.push({
      severity: 'critical',
      category: 'technical',
      message: 'Thiếu viewport meta tag',
      recommendation: 'Thêm <meta name="viewport"> cho mobile-friendly',
      impact: 20,
    });
  }

  if (!analysis.performance.hasCharset) {
    scores.technical -= 10;
    issues.push({
      severity: 'info',
      category: 'technical',
      message: 'Thiếu charset declaration',
      recommendation: 'Thêm <meta charset="UTF-8">',
      impact: 10,
    });
  }

  // Schema/OG Tags
  const ogTagCount = Object.keys(analysis.ogTags).length;
  if (ogTagCount === 0) {
    scores.schema -= 25;
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: 'Thiếu Open Graph tags',
      recommendation: 'Thêm OG tags (og:title, og:description, og:image) cho social sharing',
      impact: 25,
    });
  } else if (ogTagCount < 3) {
    scores.schema -= 10;
    issues.push({
      severity: 'info',
      category: 'schema',
      message: `Chỉ có ${ogTagCount} OG tags`,
      recommendation: 'Nên có ít nhất og:title, og:description, og:image',
      impact: 10,
    });
  }

  // Calculate overall score
  const overall = Math.round(
    scores.title * 0.20 +
    scores.meta * 0.20 +
    scores.content * 0.25 +
    scores.images * 0.10 +
    scores.technical * 0.15 +
    scores.schema * 0.10
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    title: Math.max(0, Math.min(100, scores.title)),
    meta: Math.max(0, Math.min(100, scores.meta)),
    content: Math.max(0, Math.min(100, scores.content)),
    images: Math.max(0, Math.min(100, scores.images)),
    technical: Math.max(0, Math.min(100, scores.technical)),
    schema: Math.max(0, Math.min(100, scores.schema)),
    issues,
    analysis,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    // Parse request body
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid URL format. Must be a valid http/https URL' },
        { status: 400 }
      );
    }

    // Fetch and parse URL
    const analysis = await fetchAndParseURL(url);

    // Analyze SEO
    const seoResults = analyzeURLSEO(analysis, url);

    return NextResponse.json({
      success: true,
      url,
      analysis: {
        title: analysis.title,
        metaDescription: analysis.metaDescription,
        wordCount: analysis.wordCount,
        headings: analysis.headings,
        imagesCount: analysis.images.length,
        linksCount: analysis.links.length,
        canonical: analysis.canonical,
        ogTags: analysis.ogTags,
      },
      seo: {
        overall: seoResults.overall,
        title: seoResults.title,
        meta: seoResults.meta,
        content: seoResults.content,
        images: seoResults.images,
        technical: seoResults.technical,
        schema: seoResults.schema,
        issues: seoResults.issues,
      },
    });
  } catch (error) {
    console.error('Error auditing URL:', error);
    
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

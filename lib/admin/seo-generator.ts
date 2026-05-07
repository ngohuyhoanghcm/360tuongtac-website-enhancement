/**
 * Auto SEO Generation System
 * Automatically generates SEO metadata, schemas, and Open Graph tags
 */

import { BlogPostData, ServiceData } from './file-writer';

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTags: {
    title: string;
    description: string;
    image: string;
    type: string;
    locale: string;
    siteName: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: string;
  hreflang: Array<{
    lang: string;
    url: string;
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360tuongtac.com';
const SITE_NAME = '360TuongTac';

/**
 * Generate SEO data for blog post
 */
export function generateBlogSEO(post: BlogPostData): SEOData {
  const url = `${SITE_URL}/blog/${post.slug}`;
  
  // Meta title
  const metaTitle = post.metaTitle || `${post.title} | Blog - ${SITE_NAME}`;
  
  // Meta description
  const metaDescription = post.metaDescription || post.excerpt;
  
  // JSON-LD Schema (Article)
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": post.tags.join(', ')
  }, null, 2);

  return {
    metaTitle,
    metaDescription,
    canonicalUrl: url,
    ogTags: {
      title: metaTitle,
      description: metaDescription,
      image: post.imageUrl,
      type: 'article',
      locale: 'vi_VN',
      siteName: SITE_NAME
    },
    twitterCard: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      image: post.imageUrl
    },
    jsonLd,
    hreflang: [
      { lang: 'vi', url },
      { lang: 'x-default', url }
    ]
  };
}

/**
 * Generate SEO data for service
 */
export function generateServiceSEO(service: ServiceData): SEOData {
  const url = `${SITE_URL}/dich-vu/${service.slug}`;
  
  // Meta title
  const metaTitle = service.metaTitle || `${service.name} | Dịch vụ - ${SITE_NAME}`;
  
  // Meta description
  const metaDescription = service.metaDescription || service.shortDescription;
  
  // JSON-LD Schema (Service)
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "areaServed": {
      "@type": "Country",
      "name": "Vietnam"
    },
    "serviceType": service.name,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": service.price.replace(/[^0-9]/g, ''),
      "availability": "https://schema.org/InStock"
    }
  }, null, 2);

  return {
    metaTitle,
    metaDescription,
    canonicalUrl: url,
    ogTags: {
      title: metaTitle,
      description: metaDescription,
      image: `${SITE_URL}/images/services/${service.slug}.jpg`,
      type: 'website',
      locale: 'vi_VN',
      siteName: SITE_NAME
    },
    twitterCard: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      image: `${SITE_URL}/images/services/${service.slug}.jpg`
    },
    jsonLd,
    hreflang: [
      { lang: 'vi', url },
      { lang: 'x-default', url }
    ]
  };
}

/**
 * Generate sitemap XML entry
 */
export function generateSitemapEntry(
  url: string,
  lastmod: string = new Date().toISOString().split('T')[0],
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.7
): string {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Allow: /blog/
Allow: /dich-vu/
Allow: /lien-he/

# Disallow admin pages
Disallow: /admin/

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Generate internal linking suggestions for blog post
 */
export function suggestInternalLinks(
  currentPost: BlogPostData,
  allPosts: BlogPostData[],
  limit: number = 5
): BlogPostData[] {
  return allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      
      // Same category
      if (post.category === currentPost.category) score += 10;
      
      // Shared tags
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 5;
      
      // Recent posts
      const postDate = new Date(post.date);
      const currentDate = new Date(currentPost.date);
      const daysDiff = Math.abs(postDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 30) score += 5;
      
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }, null, 2);
}

/**
 * Generate FAQ schema for blog posts
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }, null, 2);
}

/**
 * Validate SEO score
 */
export function calculateDetailedSEOSEOScore(data: {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imageAlt: string;
  hasFeaturedImage: boolean;
}): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  // Title (weight: 25)
  if (data.title.length < 50) {
    score -= 15;
    issues.push('⚠️ Title nên có 50-70 ký tự');
  } else if (data.title.length > 70) {
    score -= 10;
    issues.push('⚠️ Title quá dài (max 70 ký tự)');
  }

  // Excerpt/Meta Description (weight: 25)
  if (data.excerpt.length < 120) {
    score -= 15;
    issues.push('⚠️ Excerpt nên có 120-160 ký tự');
  } else if (data.excerpt.length > 160) {
    score -= 10;
    issues.push('⚠️ Excerpt quá dài (max 160 ký tự)');
  }

  // Content (weight: 30)
  if (data.content.length < 1500) {
    score -= 20;
    issues.push('⚠️ Content nên có ít nhất 1500 ký tự');
  } else if (data.content.length < 3000) {
    score -= 5;
    issues.push('⚠️ Content nên có ít nhất 3000 ký tự');
  }

  // Tags (weight: 10)
  if (data.tags.length < 3) {
    score -= 10;
    issues.push('⚠️ Cần ít nhất 3 tags');
  }

  // Image Alt (weight: 5)
  if (data.imageAlt.length < 15) {
    score -= 5;
    issues.push('⚠️ Image Alt nên có ít nhất 15 ký tự');
  }

  // Featured Image (weight: 5)
  if (!data.hasFeaturedImage) {
    score -= 5;
    issues.push('⚠️ Nên có featured image');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues
  };
}

/**
 * Generate Open Graph HTML tags
 */
export function generateOGTagsHTML(seo: SEOData): string {
  return `
    <meta property="og:title" content="${seo.ogTags.title}" />
    <meta property="og:description" content="${seo.ogTags.description}" />
    <meta property="og:image" content="${seo.ogTags.image}" />
    <meta property="og:type" content="${seo.ogTags.type}" />
    <meta property="og:locale" content="${seo.ogTags.locale}" />
    <meta property="og:site_name" content="${seo.ogTags.siteName}" />
    <meta property="og:url" content="${seo.canonicalUrl}" />
    
    <meta name="twitter:card" content="${seo.twitterCard.card}" />
    <meta name="twitter:title" content="${seo.twitterCard.title}" />
    <meta name="twitter:description" content="${seo.twitterCard.description}" />
    <meta name="twitter:image" content="${seo.twitterCard.image}" />
    
    <link rel="canonical" href="${seo.canonicalUrl}" />
    
    ${seo.hreflang.map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.url}" />`).join('\n    ')}
  `;
}

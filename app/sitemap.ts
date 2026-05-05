import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/constants/blog';
import { ALL_SLUGS as SERVICE_SLUGS } from '@/data/services';

const BASE_URL = 'https://360tuongtac.com';

function parseDate(dateStr: string) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const [day, month, year] = dateStr.split('/');
  if (day && month && year) {
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const serviceUrls = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/dich-vu/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dich-vu`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bang-gia`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/lien-he`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...serviceUrls,
    ...blogUrls,
  ];
}

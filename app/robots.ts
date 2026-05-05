import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'Bingbot', 'Googlebot'],
        allow: '/',
      },
    ],
    sitemap: 'https://grow.360tuongtac.com/sitemap.xml',
  };
}

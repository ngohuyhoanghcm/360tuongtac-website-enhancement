import { Metadata } from 'next';
import { LandingPage } from '@/types/landing';

export function generateLandingPageMetadata(page: LandingPage): Metadata {
  return {
    title: `${page.metaTitle} | 360TuongTac`,
    description: page.metaDescription,
    alternates: {
      canonical: `https://360tuongtac.com/dich-vu/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://360tuongtac.com/dich-vu/${page.slug}`,
      siteName: '360TuongTac',
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
    other: {
      'geo.region': 'VN',
      'geo.placename': 'Vietnam',
      'geo.country': 'VN',
    },
  };
}

export function generateSchemas(page: LandingPage, slug: string) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": page.title,
    "description": page.metaDescription,
    "mainEntityOfPage": `https://360tuongtac.com/dich-vu/${slug}`,
    "provider": {
      "@type": "Organization",
      "name": "360TuongTac",
      "url": "https://360tuongtac.com",
      "logo": "https://360tuongtac.com/logo.png",
      "telephone": "+84-388-009-669",
      "sameAs": [
        "https://www.facebook.com/360tuongtac",
        "https://www.tiktok.com/@360tuongtac",
        "https://360tuongtac.com"
      ]
    },
    "serviceType": "Social Media Marketing",
    "areaServed": {
      "@type": "Country",
      "name": "Vietnam"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10247"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.content.faq.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://360tuongtac.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dịch vụ",
        "item": "https://360tuongtac.com/dich-vu"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": page.title,
        "item": `https://360tuongtac.com/dich-vu/${slug}`
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "360 Tương Tác",
    "url": "https://360tuongtac.com",
    "logo": "https://360tuongtac.com/logo.png",
    "description": "Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam",
    "sameAs": [
      "https://www.facebook.com/360tuongtac",
      "https://www.tiktok.com/@360tuongtac",
      "https://360tuongtac.com"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VN",
      "addressRegion": "Hồ Chí Minh"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-388-009-669",
      "contactType": "customer service"
    }
  };

  return [serviceSchema, faqSchema, breadcrumbSchema, organizationSchema];
}

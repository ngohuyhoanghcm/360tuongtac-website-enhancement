'use client';

import Script from 'next/script';

export function HomepageSchemas() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "360 Tương Tác",
    "url": "https://grow.360tuongtac.com",
    "logo": "https://grow.360tuongtac.com/logo.png",
    "description": "Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VN",
      "addressRegion": "Hồ Chí Minh"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-388-009-669",
      "contactType": "customer service",
      "availableLanguage": "Vietnamese"
    },
    "sameAs": [
      "https://www.facebook.com/360TuongTac",
      "https://www.tiktok.com/@360tuongtac.com"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "360 Tương Tác",
    "url": "https://grow.360tuongtac.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://grow.360tuongtac.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Dịch vụ tăng tương tác mạng xã hội",
    "description": "Tăng like, follow, view thật cho Facebook, TikTok, Instagram, YouTube",
    "brand": {
      "@type": "Brand",
      "name": "360TuongTac"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": "50000",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "360 Tương Tác"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Khách hàng"
      },
      "reviewBody": "Dịch vụ uy tín, giao hàng nhanh, hỗ trợ nhiệt tình"
    }
  };

  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <Script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}

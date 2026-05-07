'use client';

import { useState } from 'react';
import ServicesIndexHero from '@/components/services/ServicesIndexHero';
import PlatformFilterTabs from '@/components/services/PlatformFilterTabs';
import ServiceCardGrid from '@/components/services/ServiceCardGrid';
import WhyChooseUs from '@/components/services/WhyChooseUs';
import ServicesFinalCTA from '@/components/services/FinalCTA';
import { SERVICES_DATA } from '@/data/services';

export default function ServicesPage() {
  const [activePlatform, setActivePlatform] = useState('Tất cả');

  const platforms = Array.from(new Set(SERVICES_DATA.map((s) => s.platform)));

  const filteredServices = activePlatform === 'Tất cả' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter((s) => s.platform === activePlatform);

  return (
    <main className="min-h-screen">
      {/* Services Discovery Hero */}
      <ServicesIndexHero />

      <div className="container-max px-6">
        {/* Navigation & Filtering */}
        <PlatformFilterTabs 
          activePlatform={activePlatform} 
          setActivePlatform={setActivePlatform} 
          platforms={platforms} 
        />

        {/* Services Grid */}
        <ServiceCardGrid services={filteredServices} />
      </div>

      {/* Trust Pillars */}
      <WhyChooseUs />

      {/* Conversion Booster CTA */}
      <ServicesFinalCTA />
      
      {/* Schema.org for SEO (AEO Optimization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ Tăng Tương Tác Mạng Xã Hội 360TuongTac",
            "description": "Cung cấp các giải pháp tăng tương tác, seeding comment, tăng mắt livestream tự động và an toàn trên TikTok, Facebook, Instagram.",
            "provider": {
              "@type": "Organization",
              "name": "360TuongTac",
              "url": "https://360tuongtac.com"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1250"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Social Media Services",
              "itemListElement": SERVICES_DATA.map((s) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": s.title,
                  "description": s.description
                }
              }))
            }
          })
        }}
      />
    </main>
  );
}

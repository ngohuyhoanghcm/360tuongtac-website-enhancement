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
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Huyền Trang"
        },
        "reviewBody": "Dịch vụ buff view TikTok giúp livestream của tôi tăng từ 30 lên 800 viewers, đơn hàng tăng gấp 5 lần chỉ sau 2 tuần sử dụng."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "TechGear Store"
        },
        "reviewBody": "Buff follow Facebook giúp page tăng từ 500 lên 15,000 followers, độ trust tăng cao, chạy Ads hiệu quả hơn rất nhiều."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Linh Lan Boutique"
        },
        "reviewBody": "Instagram Reels từ vài trăm view đạt mốc 100K+ view, trở thành xu hướng nhờ gói buff push tương tác."
      }
    ]
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Dịch vụ buff view TikTok có an toàn không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hoàn toàn an toàn. Chúng tôi sử dụng hệ thống tài khoản thật, có đầy đủ avatar và hoạt động bình thường. Không yêu cầu mật khẩu tài khoản, chỉ cần link livestream hoặc ID kênh. Hệ thống hoạt động 24/7 với cơ chế bảo mật đa lớp, đảm bảo an toàn tuyệt đối cho tài khoản của bạn."
        }
      },
      {
        "@type": "Question",
        "name": "Làm thế nào để tăng viewer cho livestream TikTok?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Để tăng viewer livestream TikTok, bạn chỉ cần: (1) Đăng ký tài khoản tại 360TuongTac, (2) Nạp tiền vào tài khoản, (3) Chọn gói buff view phù hợp, (4) Dán link livestream và kích hoạt. Hệ thống sẽ tự động tăng viewer trong 5-15 phút, giúp livestream của bạn được TikTok đề xuất đến hàng nghìn người xem tiềm năng."
        }
      },
      {
        "@type": "Question",
        "name": "Giá dịch vụ tăng tương tác mạng xã hội bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Giá dịch vụ bắt đầu từ 50,000 VND cho các gói cơ bản. Chúng tôi cung cấp nhiều gói dịch vụ khác nhau phù hợp với nhu cầu: gói buff view TikTok từ 50K, gói buff follow Facebook từ 100K, gói buff like Instagram từ 80K. Tất cả dịch vụ đều có chính sách hoàn tiền nếu không hoàn thành."
        }
      },
      {
        "@type": "Question",
        "name": "Buff follow Facebook có ảnh hưởng đến page không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Không ảnh hưởng tiêu cực. Follow được tăng từ tài khoản thật, chất lượng cao, giúp tăng độ trust cho page. Page có nhiều follow sẽ được Facebook đánh giá cao hơn, dễ dàng chạy Ads và tiếp cận khách hàng tiềm năng. Nhiều khách hàng của chúng tôi đã tăng từ 500 lên 15,000 follow an toàn."
        }
      },
      {
        "@type": "Question",
        "name": "Thời gian triển khai dịch vụ tăng tương tác là bao lâu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hệ thống hoạt động tự động 24/7. Thông thường dịch vụ sẽ được kích hoạt sau 5-15 phút kể từ khi bạn hoàn tất đặt hàng. Tốc độ triển khai phụ thuộc vào gói dịch vụ bạn chọn, các gói VIP sẽ có tốc độ nhanh hơn. Bạn có thể theo dõi tiến độ trực tiếp trên dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Nếu đơn hàng không hoàn thành thì có được hoàn tiền không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có. Hệ thống có cơ chế tự động theo dõi đơn hàng. Nếu sau thời gian quy định đơn hàng chưa hoàn thành, chúng tôi sẽ tự động hoàn tiền vào số dư tài khoản của bạn. Bạn có thể sử dụng số dư này để đặt đơn hàng mới hoặc rút về tài khoản ngân hàng."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cách tăng viewer livestream TikTok",
    "description": "Hướng dẫn từng cách tăng viewer livestream TikTok bằng dịch vụ buff view của 360TuongTac",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Đăng ký tài khoản",
        "text": "Truy cập 360TuongTac.com và đăng ký tài khoản miễn phí. Chỉ cần email và mật khẩu, không yêu cầu xác thực phức tạp.",
        "url": "https://360tuongtac.com/home"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Nạp tiền vào tài khoản",
        "text": "Chọn phương thức thanh toán phù hợp: chuyển khoản ngân hàng, ví điện tử MoMo, ZaloPay hoặc thẻ cào điện thoại. Số tiền tối thiểu là 50,000 VND.",
        "url": "https://360tuongtac.com/home"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Chọn gói buff view",
        "text": "Vào phần Dịch vụ, chọn gói buff view TikTok phù hợp với nhu cầu. Có các gói từ 100 viewers đến 10,000 viewers.",
        "url": "https://360tuongtac.com/home"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Dán link livestream và kích hoạt",
        "text": "Copy link livestream TikTok của bạn, dán vào form đặt hàng và nhấn Kích hoạt. Hệ thống sẽ tự động tăng viewer trong 5-15 phút.",
        "url": "https://360tuongtac.com/home"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Tài khoản 360TuongTac"
      },
      {
        "@type": "HowToTool",
        "name": "Link livestream TikTok"
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://grow.360tuongtac.com"
      }
    ]
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
      <Script
        id="schema-faqpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <Script
        id="schema-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import PainPointSection from '@/components/landing/PainPointSection';
import EducationSection from '@/components/landing/EducationSection';
import SolutionSection from '@/components/landing/SolutionSection';
import StatsSection from '@/components/landing/StatsSection';
import ServicesGrid from '@/components/landing/ServicesGrid';
import ProcessSection from '@/components/landing/ProcessSection';
import PricingTable from '@/components/landing/PricingTable';
import CaseStudyGrid from '@/components/landing/CaseStudyGrid';
import FAQAccordion from '@/components/landing/FAQAccordion';
import FinalCTA from '@/components/landing/FinalCTA';
import StickyBottomCTA from '@/components/landing/StickyBottomCTA';
import { HomepageSchemas } from '@/components/seo/HomepageSchemas';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: '360 Tương Tác - Tăng Like, Follow, View Thật | TikTok, Facebook, Instagram',
  description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. Tăng like, follow, view thật cho Facebook, TikTok, Instagram, YouTube. 10K+ khách hàng tin dùng. Bảo mật tuyệt đối, giao hàng tự động 24/7.',
  
  // SEO Keywords from code.html
  keywords: ['tăng tương tác', 'tăng like facebook', 'tăng follow tiktok', 'tăng view instagram', 'tăng like tiktok', 'mua follow facebook', 'tăng subscribe youtube', 'marketing online', 'social media growth', '360 tương tác', 'tăng like giá rẻ', 'like thật 100%', 'dịch vụ tiktok', 'facebook marketing', 'instagram viral'],
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  
  alternates: {
    canonical: 'https://grow.360tuongtac.com',
    languages: {
      'vi': 'https://grow.360tuongtac.com/',
      'x-default': 'https://grow.360tuongtac.com/',
    },
  },
  
  openGraph: {
    title: '360 Tương Tác - Tăng Like, Follow, View Thật | TikTok, Facebook',
    description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. 10K+ khách hàng tin dùng. Bảo mật tuyệt đối, giao hàng tự động 24/7.',
    type: 'website',
    url: 'https://grow.360tuongtac.com',
    siteName: '360TuongTac',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://grow.360tuongtac.com/logo.png',
        width: 1200,
        height: 630,
        alt: '360 Tương Tác Logo',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: '360 Tương Tác - Tăng Like, Follow, View Thật',
    description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. 10K+ khách hàng tin dùng.',
    images: ['https://grow.360tuongtac.com/logo.png'],
  },
  
  other: {
    'geo.region': 'VN',
    'geo.country': 'VN',
    'geo.placename': '360TuongTac',
    'author': '360TuongTac',
    'twitter:image:width': '1200',
    'twitter:image:height': '630',
    'application-name': 'Nền tảng tăng trưởng mạng xã hội & tài khoản số cao cấp. ChatGPT, Netflix, Spotify, Canva, Proxy, CTV - Đại lý.',
  },
};

export default function Home() {
  return (
    <>
      <HomepageSchemas />
      
      {/* Breadcrumb Navigation for SEO */}
      <div className="container-max px-6 pt-24 md:pt-28">
        <Breadcrumbs 
          items={[
            { label: 'Trang chủ', href: '/' }
          ]} 
        />
      </div>
      
      <HeroSection />
      <PainPointSection />
      <EducationSection data={{
        title: 'Bí mật của những Livestream nghìn đơn',
        content: 'Bạn có bao giờ thắc mắc tại sao một số shop vừa lên live đã có hàng nghìn người xem, trong khi bạn chuẩn bị kỹ lưỡng nhưng chỉ lèo tèo vài mắt? \n\nCâu trả lời nằm ở "Mồi tương tác". Thuật toán TikTok và Facebook ưu tiên đề xuất những nội dung đang sôi nổi. Khi hệ thống nhận diện lượng người xem lớn và bình luận liên tục ngay từ đầu, nó sẽ tự động đẩy luồng livestream đến hàng chục nghìn người dùng tiềm năng.\n\nKhám phá dịch vụ buff view TikTok và buff follow Facebook để tăng trưởng bền vững.'
      }} />
      <SolutionSection />
      <StatsSection />
      <ServicesGrid />
      <ProcessSection />
      <PricingTable />
      <CaseStudyGrid />
      <FAQAccordion />
      <FinalCTA />
      <StickyBottomCTA />
    </>
  );
}

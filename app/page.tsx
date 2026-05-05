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

export const metadata: Metadata = {
  title: '360 Tương Tác - Tăng Like, Follow, View Thật | TikTok, Facebook, Instagram',
  description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. Tăng like, follow, view thật cho Facebook, TikTok, Instagram, YouTube. 10K+ khách hàng tin dùng.',
  alternates: {
    canonical: 'https://grow.360tuongtac.com',
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <PainPointSection />
      <EducationSection data={{
        title: 'Bí mật của những Livestream nghìn đơn',
        content: 'Bạn có bao giờ thắc mắc tại sao một số shop vừa lên live đã có hàng nghìn người xem, trong khi bạn chuẩn bị kỹ lưỡng nhưng chỉ lèo tèo vài mắt? \n\nCâu trả lời nằm ở "Mồi tương tác". Thuật toán TikTok và Facebook luôn ưu tiên đề xuất những nội dung đang có sự sôi nổi. Khi hệ thống nhận diện được lượng người xem lớn và bình luận liên tục ngay từ đầu, nó sẽ tự động đẩy luồng livestream của bạn đến hàng chục nghìn người dùng tiềm năng khác.'
      }} />
      <SolutionSection />
      <StatsSection />
      <ServicesGrid />
      <ProcessSection />
      <PricingTable />
      <CaseStudyGrid />
      <FAQAccordion />
      <FinalCTA />
    </>
  );
}

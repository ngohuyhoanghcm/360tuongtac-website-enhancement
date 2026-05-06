import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ | 360TuongTac',
  description: 'Liên hệ với đội ngũ chuyên gia 360TuongTac để được tư vấn giải pháp tăng trưởng mạng xã hội tốt nhất cho bạn. Hotline: 0388.00.9669.',
  alternates: {
    canonical: 'https://grow.360tuongtac.com/lien-he',
  },
};

export default function LienHeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

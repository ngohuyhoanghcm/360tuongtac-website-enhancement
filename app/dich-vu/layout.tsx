import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dịch Vụ Tăng Tương Tác | 360TuongTac',
  description: 'Khám phá đầy đủ các dịch vụ tăng tương tác mạng xã hội: TikTok, Facebook, Instagram, YouTube. Giải pháp an toàn, nhanh chóng, hiệu quả.',
  alternates: {
    canonical: 'https://360tuongtac.com/dich-vu',
  },
};

export default function DichVuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

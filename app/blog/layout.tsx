import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Học Viện 360TuongTac | Blog Chia Sẻ Kiến Thức SMM',
  description: 'Chia sẻ bí quyết tăng trưởng, thuật toán mạng xã hội và case study thực chiến từ đội ngũ chuyên gia 360TuongTac.',
  alternates: {
    canonical: 'https://grow.360tuongtac.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

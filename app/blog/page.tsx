'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import BlogHero from '@/components/blog/BlogHero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogGrid from '@/components/blog/BlogGrid';

const FEATURED_POST = {
  id: 'featured',
  title: 'Bí Quyết Đột Phá Doanh Thu Livestream TikTok Shop',
  excerpt: 'Hướng dẫn chi tiết cách kéo traffic tự nhiên và giữ chân người xem bằng kỹ thuật bão tương tác kết hợp seeding.',
  category: 'TIKTOK SHOP',
  date: '28/10/2023',
  author: 'Growth Team',
  image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
  slug: 'bi-quyet-dot-pha-doanh-thu-livestream'
};

const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Sai lầm khiến kênh TikTok bị bóp tương tác',
    excerpt: 'Đừng để công sức xây kênh đổ sông đổ biển chỉ vì những lỗi kỹ thuật nhỏ này trong quá trình đăng video.',
    category: 'Xây Kênh',
    date: '25/10/2023',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop',
    slug: '5-sai-lam-khien-kenh-tiktok-bi-bop-tuong-tac'
  },
  {
    id: 2,
    title: 'Khung giờ vàng đăng video lên xu hướng dễ nhất',
    excerpt: 'Thống kê mới nhất về thời gian online của người dùng Việt Nam. Đăng đúng lúc giúp x3 lượt tiếp cận tự nhiên.',
    category: 'Nghiên Cứu',
    date: '24/10/2023',
    author: 'Data Team',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    slug: 'khung-gio-vang-dang-video-len-xu-huong'
  },
  {
    id: 3,
    title: 'KOC Mới Nhận Booking Thế Nào Cho Chuyên Nghiệp?',
    excerpt: 'Hướng dẫn cách làm Profile đẹp và tận dụng seeded comments để tăng uy tín trong mắt các nhãn hàng lớn.',
    category: 'KOC',
    date: '20/10/2023',
    author: 'Chuyên gia',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    slug: 'koc-moi-nhan-booking-the-nao'
  },
  {
    id: 4,
    title: 'Nghệ Thuật Seeding Tự Nhiên, Không Phản Cảm',
    excerpt: 'Tuyệt chiêu điều hướng dư luận và tạo FOMO mua hàng thông qua hệ thống bình luận mồi hoàn hảo.',
    category: 'Marketing',
    date: '18/10/2023',
    author: '360TuongTac',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    slug: 'seeding-sao-cho-tu-nhien'
  },
  {
    id: 5,
    title: 'Cách tận dụng Facebook Reels để bán hàng 2024',
    excerpt: 'Reels đang là mỏ vàng traffic miễn phí từ Facebook. Bạn đã biết cách làm video chuẩn khung Reels?',
    category: 'Facebook',
    date: '15/10/2023',
    author: 'Social Team',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=800&auto=format&fit=crop',
    slug: 'cach-tan-dung-facebook-reels-de-ban-hang'
  },
  {
    id: 6,
    title: 'Instagram vs TikTok: Nên chọn nền tảng nào?',
    excerpt: 'Phân tích ưu nhược điểm của hai nền tảng mạng xã hội đang thống trị Gen Z hiện nay.',
    category: 'Chiến Lược',
    date: '10/10/2023',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800&auto=format&fit=crop',
    slug: 'instagram-vs-tiktok-nen-chon-nen-tang-nao'
  }
];

export default function BlogAcademy() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-32">
      <div className="container-max px-6">
        {/* Academy Hero */}
        <BlogHero />

        {/* Featured Content */}
        <FeaturedPost post={FEATURED_POST} />

        {/* Recent Posts Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="font-h1 text-2xl md:text-3xl font-black text-white uppercase tracking-widest antialiased">
            Bài viết gần đây
          </h2>
        </div>

        {/* Blog Grid */}
        <BlogGrid posts={BLOG_POSTS} />

        {/* Global Conversion CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-24"
        >
          <div className="bg-[#13121b] border border-white/10 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
             {/* Glow Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/10 to-[#FF2E63]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="font-h1 text-2xl md:text-4xl font-black text-white mb-6 tracking-tight antialiased">
                🚀 Sẵn sàng bứt phá tăng trưởng?
              </h3>
              <p className="font-body text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Hãy để các chuyên gia và công nghệ của 360TuongTac đồng hành cùng chiến dịch của bạn ngay hôm nay.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="https://360tuongtac.com/home?utm_source=grow&utm_medium=blog_index" 
                  className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-lg shadow-[0_0_40px_rgba(255,140,0,0.3)] hover:shadow-[0_0_50px_rgba(255,140,0,0.5)] transition-all duration-300 antialiased"
                >
                  Xem dịch vụ ngay
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

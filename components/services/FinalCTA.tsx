'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

interface FinalCTAProps {
  productUrl?: string;
  serviceSlug?: string;
}

export default function ServicesFinalCTA({ productUrl, serviceSlug }: FinalCTAProps) {
  const ctaUrl = productUrl 
    ? `${productUrl}?utm_source=grow.360tuongtac.com&utm_medium=landing_page&utm_campaign=${serviceSlug}&utm_content=final_cta`
    : "http://360tuongtac.com/auth/login";

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-max px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#13121b] border border-white/10 rounded-[4rem] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden group"
        >
          {/* Animated Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8C00]/5 blur-[120px] rounded-full group-hover:bg-[#FF8C00]/10 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF2E63]/5 blur-[120px] rounded-full group-hover:bg-[#FF2E63]/10 transition-colors duration-1000"></div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-8 px-6 py-2 rounded-full glass-panel border border-white/10"
            >
              <span className="font-stat text-xs font-black tracking-[0.3em] uppercase text-[#FF8C00]">Liên hệ ngay</span>
            </motion.div>

            <h2 className="font-h1 text-3xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight antialiased">
              Cảm thấy dịch vụ <br className="hidden md:block" /> 
              <span className="text-gradient">phù hợp với bạn?</span>
            </h2>
            
            <p className="font-body text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
              Đừng lo lắng, các chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn chiến lược 
              tăng trưởng tối ưu nhất cho kênh và ngân sách của bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href={ctaUrl} 
                  className="px-12 py-5 rounded-2xl bg-white text-slate-950 font-black text-lg shadow-xl hover:bg-[#00E5FF] hover:text-white transition-all duration-300 antialiased block"
                >
                  Đặt Mua Ngay
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="https://zalo.me/0388009669" 
                  target="_blank" rel="noopener noreferrer"
                  className="px-12 py-5 rounded-2xl glass-panel border border-white/10 text-white font-black text-lg hover:border-[#FF2E63]/40 transition-all duration-300 antialiased block"
                >
                  Tư Vấn Zalo
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

interface FinalCTAProps {
  productUrl?: string;
  serviceSlug?: string;
}

export default function ServicesFinalCTA({ productUrl, serviceSlug }: FinalCTAProps) {
  const ctaUrl = productUrl 
    ? `${productUrl}?utm_source=360tuongtac.com&utm_medium=landing_page&utm_campaign=${serviceSlug}&utm_content=final_cta`
    : "https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=final_cta&utm_content=dat_mua_ngay";

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-max px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-[4rem] p-12 md:p-24 text-center shadow-xl relative overflow-hidden group"
        >
          {/* Animated Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8C00]/5 blur-[120px] rounded-full group-hover:bg-[#FF8C00]/10 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF2E63]/5 blur-[120px] rounded-full group-hover:bg-[#FF2E63]/10 transition-colors duration-1000"></div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-8 px-6 py-2 rounded-full bg-gray-50 border border-gray-200"
            >
              <span className="font-stat text-xs font-black tracking-[0.3em] uppercase text-[#FF8C00]">Liên hệ ngay</span>
            </motion.div>

            <h2 className="font-h1 text-3xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight antialiased">
              Cảm thấy dịch vụ <br className="hidden md:block" /> 
              <span className="text-gradient">phù hợp với bạn?</span>
            </h2>
            
            <p className="font-body text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Đừng lo lắng, các chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn chiến lược 
              tăng trưởng tối ưu nhất cho kênh và ngân sách của bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="https://zalo.me/0388009669" 
                  target="_blank" rel="noopener noreferrer"
                  className="px-12 py-5 rounded-2xl bg-gray-900 text-white font-black text-lg shadow-xl hover:bg-[#00E5FF] transition-all duration-300 antialiased block"
                >
                  Tư Vấn Zalo
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href={ctaUrl} 
                  className="px-12 py-5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-black text-lg hover:border-[#FF2E63]/40 hover:bg-gray-100 transition-all duration-300 antialiased block"
                >
                  Đặt Mua Ngay
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

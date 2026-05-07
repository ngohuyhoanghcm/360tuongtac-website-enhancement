'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { CheckCircle, Shield, Award, MessageSquare, Zap } from 'lucide-react';

interface ServiceHeroProps {
  badge: string;
  title: string;
  description: string;
  productUrl?: string;
  serviceSlug?: string;
}

export default function ServiceHero({ badge, title, description, productUrl, serviceSlug }: ServiceHeroProps) {
  const ctaUrl = productUrl 
    ? `${productUrl}?utm_source=360tuongtac.com&utm_medium=landing_page&utm_campaign=${serviceSlug}&utm_content=hero_cta`
    : "https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=service_hero&utm_content=hero_cta";

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden border-b border-gray-200 bg-white">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF8C00]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF2E63]/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

      <div className="container-max px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF2E63] animate-ping"></span>
            <span className="font-stat text-[10px] font-black tracking-[0.3em] uppercase text-gray-600">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-h1 text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent antialiased"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-body text-gray-600 text-lg md:text-xl mb-12 leading-relaxed mx-auto max-w-3xl font-medium"
          >
            {description}
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href={ctaUrl} 
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-xl shadow-[0_0_40px_rgba(255,140,0,0.4)] hover:shadow-[0_0_50px_rgba(255,140,0,0.6)] transition-all duration-300 antialiased block"
              >
                Đặt Hàng Ngay
              </Link>
            </motion.div>
            
            <Link 
               href="https://zalo.me/0388009669" 
               target="_blank" rel="noopener noreferrer"
               className="px-12 py-5 rounded-2xl bg-white border border-gray-200 text-gray-900 font-black text-xl hover:bg-gray-50 transition-all duration-300 antialiased flex items-center gap-3 shadow-sm"
            >
              <MessageSquare size={24} className="text-[#00E5FF]" />
              Tư Vấn Zalo
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <CheckCircle size={16} className="text-emerald-500" />
              10K+ Đơn hàng thành công
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <Shield size={16} className="text-emerald-500" />
              Bảo mật tài khoản 100%
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <Award size={16} className="text-[#FF8C00]" />
              Cam kết hoàn tiền
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

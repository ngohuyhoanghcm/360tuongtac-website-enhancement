'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useRef, useState } from 'react';

const finalCtaContent = {
  badge: "BẮT ĐẦU NGAY",
  headline: {
    gradient: "Sẵn sàng bứt phá",
    white: "doanh thu của bạn?"
  },
  description: "Gia nhập cộng đồng 10,000+ nhà sáng tạo nội dung & doanh nghiệp đang bứt phá doanh số và thương hiệu một cách bền vững.",
  stats: [
    { value: "100+", label: "DỊCH VỤ", color: "from-[#FF8C00] to-[#FFA500]", glow: "rgba(255,140,0,0.5)" },
    { value: "24/7", label: "HỖ TRỢ", color: "from-[#FF2E63] to-[#FF6B9D]", glow: "rgba(255,46,99,0.5)" },
    { value: "100%", label: "TỰ ĐỘNG", color: "from-[#8B5CF6] to-[#A78BFA]", glow: "rgba(139,92,246,0.5)" }
  ],
  links: {
    primary: "https://360tuongtac.com/home?utm_source=grow&utm_medium=landing_page&utm_content=final_cta_v2",
    secondary: "https://zalo.me/0388009669?utm_source=grow&utm_medium=landing_page&utm_content=final_cta_v2"
  }
};

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const spotOpacity = useTransform(smoothX, [0, 400], [0, 1]); // Dummy transform to show it reacts

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#0a0a0f]">
      {/* Dynamic Background Aura */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[800px] bg-gradient-to-tr from-[#FF8C00]/20 via-[#FF2E63]/20 to-[#8B5CF6]/20 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="container-max relative z-10 px-4">
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#0D0D1A] rounded-[2.5rem] p-10 md:p-24 text-center relative overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
        >
          {/* Interactive Mouse Follow Spot */}
          <motion.div 
            style={{ 
              left: smoothX, 
              top: smoothY,
              opacity: isHovered ? 0.4 : 0
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FF8C00]/20 via-[#FF2E63]/20 to-transparent rounded-full blur-[100px] pointer-events-none transition-opacity duration-500"
          />

          {/* Floating Particle Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,46,99,0.05)_0%,_transparent_70%)] pointer-events-none"></div>

          <div className="relative z-10">
            {/* Top Badge with Neon Pulse */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-10 px-6 py-2 rounded-full bg-white/5 backdrop-blur-3xl border border-white/20 relative group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white flex items-center gap-2">
                <motion.span 
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[#FF8C00]"
                >
                  ⚡
                </motion.span> 
                {finalCtaContent.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <h2 className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent pb-4 drop-shadow-sm">
                {finalCtaContent.headline.gradient}
              </span>
              <span className="block text-white">
                {finalCtaContent.headline.white}
              </span>
            </h2>

            {/* Description */}
            <p className="font-body text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed opacity-90">
              {finalCtaContent.description}
            </p>

            {/* CTA Buttons with Shimmer & Pulse */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-24">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                <Link 
                  href={finalCtaContent.links.primary} 
                  className="relative block px-12 py-6 rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-xl overflow-hidden antialiased"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  Truy Cập Ngay
                </Link>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href={finalCtaContent.links.secondary} 
                  className="px-12 py-6 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-white font-black text-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 antialiased block"
                >
                  Tư Vấn Ngay
                </Link>
              </motion.div>
            </div>

            {/* Neon Trust Indicators */}
            <div className="relative pt-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
                {finalCtaContent.stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex flex-col items-center px-10 ${i !== 0 ? 'md:border-l border-white/5' : ''}`}
                    whileHover={{ y: -5 }}
                  >
                    <span 
                      className={`font-stat text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                      style={{ filter: `drop-shadow(0 0 10px ${stat.glow})` }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-500 group-hover:text-slate-400 transition-colors">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

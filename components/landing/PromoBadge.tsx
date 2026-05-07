'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';

/**
 * PromoBadge — Premium Time-Sensitive Promotional Banner
 * 
 * Design System: "360 Vibe" - Glassmorphism + 3D Isometric + Neon Gradients
 * 
 * Features:
 * - 3D isometric coin icon with neon glow
 * - Premium glassmorphism container with diffused neon borders
 * - Interactive CTA button with hover animations
 * - Vector clock icon replacing emoji
 * - Refined typography hierarchy
 * - Abstract tech background pattern
 * 
 * UX Principles:
 * - Visual hierarchy through color, size, and spacing
 * - Interactive feedback on hover states
 * - Clear information architecture
 * - WCAG compliant contrast ratios
 */

interface PromoContext {
  isActive: boolean;
  promoDay: number;
  periodLabel: string;
  ctaLabel: string;
  allDates: string;
}

export default function PromoBadge() {
  const [promo, setPromo] = useState<PromoContext | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();

    const periods = [
      { pre: 7, active: 8 },
      { pre: 17, active: 18 },
      { pre: 27, active: 28 },
    ];

    const period = periods.find((p) => p.pre === dayOfMonth || p.active === dayOfMonth);
    if (!period) return;

    const isActive = dayOfMonth === period.active;

    setPromo({
      isActive,
      promoDay: period.active,
      periodLabel: isActive 
        ? `Ưu đãi đang diễn ra hôm nay (ngày ${period.active})` 
        : `Sắp diễn ra vào ngày ${period.active}`,
      ctaLabel: isActive ? 'NẠP NGAY HÔM NAY' : 'CHUẨN BỊ SẴN SÀNG',
      allDates: 'Áp dụng: Ngày 8, 18, 28 hàng tháng',
    });
  }, []);

  if (!promo) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 20, x: '-50%' }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute left-1/2 bottom-12 z-20 hidden md:block"
      >
        <Link 
          href="https://360tuongtac.com/user/recharge?utm_source=grow&utm_medium=badge&utm_campaign=promo_recharge&utm_content=promo_badge"
          className="block relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.03] group"
          style={{ width: '420px' }}
        >
          {/* Abstract Tech Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,140,0,0.1) 2px, rgba(255,140,0,0.1) 4px)',
                 backgroundSize: '100% 8px'
               }} 
          />
          
          {/* Ambient gradient overlays */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            promo.isActive 
              ? 'bg-gradient-to-br from-[#FF8C00]/25 via-[#FF2E63]/15 to-[#8B5CF6]/20' 
              : 'bg-gradient-to-br from-[#FF8C00]/15 via-transparent to-[#FF2E63]/10'
          }`} />
          
          {/* Glassmorphism surface */}
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl" />
          
          {/* Neon border glow */}
          <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
            promo.isActive 
              ? 'shadow-[0_0_60px_rgba(255,140,0,0.3),inset_0_0_60px_rgba(255,140,0,0.1)] border border-[#FF8C00]/60' 
              : 'shadow-[0_0_40px_rgba(255,140,0,0.15),inset_0_0_40px_rgba(255,140,0,0.05)] border border-[#FF8C00]/40'
          }`} />
          
          {/* Active state pulse overlay */}
          {promo.isActive && (
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF8C00]/10 to-[#FF2E63]/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          
          {/* Content */}
          <div className="relative px-7 py-6 flex items-center gap-5">
            {/* 3D Isometric Coin Icon Container */}
            <div className="flex-shrink-0">
              <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                promo.isActive 
                  ? 'shadow-[0_0_30px_rgba(255,140,0,0.6),0_8px_32px_rgba(0,0,0,0.4)]' 
                  : 'shadow-[0_0_20px_rgba(255,140,0,0.4),0_4px_20px_rgba(0,0,0,0.3)]'
              }`}>
                {/* Glassmorphism background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF8C00]/20 via-[#FFD700]/10 to-[#FF2E63]/20 backdrop-blur-md border border-white/20" />
                
                {/* 3D Coin with neon gradient */}
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  promo.isActive
                    ? 'bg-gradient-to-br from-[#FFD700] via-[#FF8C00] to-[#FF2E63] shadow-[0_0_20px_rgba(255,140,0,0.8),inset_0_-2px_8px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.3)]'
                    : 'bg-gradient-to-br from-[#FFD700]/90 via-[#FF8C00]/90 to-[#FF2E63]/90 shadow-[0_0_15px_rgba(255,140,0,0.6),inset_0_-2px_8px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(255,255,255,0.2)]'
                }`}>
                  {/* Coin inner ring */}
                  <div className="absolute inset-1 rounded-full border-2 border-white/30" />
                  
                  {/* Dollar sign */}
                  <svg className="w-7 h-7 text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              {/* Title with neon gradient */}
              <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FF8C00] to-[#FF2E63] uppercase tracking-wide mb-2 drop-shadow-[0_2px_8px_rgba(255,140,0,0.4)]">
                Thưởng Nạp 10%
              </h3>
              
              {/* Time note with vector clock icon */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-shrink-0 w-4 h-4 text-[#FF8C00]">
                  <Clock className="w-full h-full" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-white/90 font-medium leading-relaxed">
                  {promo.periodLabel}
                </p>
              </div>
              
              {/* Interactive CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <div className={`relative px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider overflow-hidden transition-all duration-300 ${
                  promo.isActive
                    ? 'bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#FF2E63] text-white shadow-[0_0_25px_rgba(255,140,0,0.6),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_rgba(255,140,0,0.8),0_6px_24px_rgba(0,0,0,0.4)]'
                    : 'bg-gradient-to-r from-[#FF8C00]/80 via-[#FFD700]/80 to-[#FF2E63]/80 text-white shadow-[0_0_20px_rgba(255,140,0,0.4),0_2px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,140,0,0.6),0_4px_16px_rgba(0,0,0,0.3)]'
                }`}>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">{promo.ctaLabel}</span>
                </div>
              </motion.div>
              
              {/* Divider with neon glow */}
              <div className="mt-3 mb-2.5 h-px bg-gradient-to-r from-transparent via-[#FF8C00]/60 to-transparent shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
              
              {/* Disclaimer text */}
              <p className="text-[10px] text-slate-300/80 font-medium tracking-wide">
                {promo.allDates}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

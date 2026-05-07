'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * PromoBadge — Simple Promotional Badge
 * 
 * Design: Clean and minimal promotional banner
 * - Gradient coin icon
 * - Simple text layout
 * - Subtle hover effects
 */

export default function PromoBadge() {
  const [promo] = useState<boolean | null>(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    // Show on promotion days: 7-8, 17-18, 27-28
    const isPromoDay = (dayOfMonth === 7 || dayOfMonth === 8 || 
                        dayOfMonth === 17 || dayOfMonth === 18 || 
                        dayOfMonth === 27 || dayOfMonth === 28);
    
    return isPromoDay || null;
  });

  if (!promo) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 hidden md:block">
      <Link 
        href="https://360tuongtac.com/user/recharge?utm_source=grow&utm_medium=badge&utm_campaign=promo_recharge&utm_content=promo_badge"
        className="block glass-panel rounded-xl p-3 max-w-[280px] notification-fade notification-fade-delay-1 border border-[#FF8C00]/30 hover:border-[#FF8C00]/60 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {/* Coin Icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#FF8C00] flex items-center justify-center flex-shrink-0 animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          
          {/* Text Content */}
          <div>
            <div className="text-xs font-bold text-white">💰 THƯỞNG NẠP 10%</div>
            <div className="text-[10px] text-slate-300">
              Ngày <span className="text-[#FFD700] font-bold">8, 18, 28</span> hàng tháng
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

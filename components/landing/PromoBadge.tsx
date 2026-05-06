'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function PromoBadge() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const promoDays = [7, 8, 17, 18, 27, 28];
    if (promoDays.includes(dayOfMonth)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="absolute left-1/2 bottom-8 z-20 hidden md:block"
        >
          <Link href="https://360tuongtac.com/user/recharge?utm_source=grow&utm_medium=badge&utm_campaign=promo_recharge&utm_content=promo_badge" className="block glass-panel rounded-xl p-3 w-[260px] border border-[#FF8C00]/30 hover:border-[#FF8C00]/60 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#FF8C00] flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-tight">💰 Thưởng Nạp 10%</div>
                <div className="text-[10px] text-slate-300">Ngày <span className="text-[#FFD700] font-bold">8, 18, 28</span> hàng tháng</div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

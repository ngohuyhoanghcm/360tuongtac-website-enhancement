'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function ScrollTriggeredCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 60) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="container-max px-6 py-12"
        >
          <div className="bg-gradient-to-r from-[#FF8C00]/10 via-[#FF2E63]/10 to-[#8B5CF6]/10 border-2 border-[#FF8C00]/30 rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#FF2E63] flex items-center justify-center shadow-lg">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="font-h1 text-xl md:text-2xl font-black text-[var(--text-primary)] mb-2">
                    90% khách hàng chọn gói Buff Livestream
                  </h3>
                  <p className="font-body text-[var(--text-secondary)] text-sm md:text-base">
                    Giải pháp toàn diện nhất để tăng trưởng bền vững
                  </p>
                </div>
              </div>
              
              <Link
                href="https://360tuongtac.com/home?utm_source=grow&utm_medium=scroll_trigger&utm_campaign=homepage&utm_content=90_percent_choose_live&utm_term=mid_page"
                className="flex-shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                Xem gói này
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

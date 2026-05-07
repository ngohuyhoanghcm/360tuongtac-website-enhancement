'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

export default function StickyBottomCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA bar after scrolling 30% of the page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercentage > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Background blur */}
          <div className="absolute inset-0 bg-[var(--surface)]/95 backdrop-blur-lg"></div>
          
          {/* Border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#FF8C00]"></div>
          
          {/* Content */}
          <div className="relative px-4 py-3">
            <Link
              href="https://360tuongtac.com/home?utm_source=grow&utm_medium=sticky_cta&utm_campaign=homepage&utm_content=sticky_bottom_bar"
              className="block w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-center text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart size={16} />
                Đặt hàng ngay - Chỉ từ 10Đ
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

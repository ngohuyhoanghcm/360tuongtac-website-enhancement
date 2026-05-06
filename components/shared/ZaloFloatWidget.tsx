'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ZaloFloatWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Trigger 1: Show after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    // Trigger 2: Show when user scrolls down
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolled(true);
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="https://zalo.me/0388009669"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo với 360TuongTac"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 
                     flex items-center gap-2 md:gap-3
                     bg-[#0068FF] hover:bg-[#0056cc]
                     text-white 
                     px-4 py-2.5 md:px-6 md:py-3 
                     rounded-2xl md:rounded-2xl
                     shadow-[0_4px_20px_rgba(0,104,255,0.4)]
                     hover:shadow-[0_8px_30px_rgba(0,104,255,0.6)]
                     transition-all duration-300
                     cursor-pointer"
        >
          {/* Zalo Icon */}
          <svg 
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
          </svg>
          
          {/* Text - Hidden on mobile, visible on desktop */}
          <span className="text-xs md:text-sm font-bold hidden md:inline">
            Tư vấn Zalo
          </span>
          
          {/* Mobile-only icon indicator */}
          <span className="md:hidden text-[10px] font-bold">
            Zalo
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

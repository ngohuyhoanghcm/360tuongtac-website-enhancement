'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('exitPopupShown', 'true');
  }, []);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('exitPopupShown')) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves at the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible, handleClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#FF2E63]/30 transition-all"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#FF2E63] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle size={40} className="text-white" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="font-h1 text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-4">
                Chờ đã!
              </h3>
              <p className="font-body text-[var(--text-secondary)] text-base md:text-lg mb-8 leading-relaxed">
                Nhận tư vấn <span className="text-[#FF8C00] font-bold">MIỄN PHÍ</span> từ chuyên gia trong 5 phút.
                <br />
                Chúng tôi sẽ giúp bạn chọn giải pháp phù hợp nhất!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4">
                <Link
                  href="https://zalo.me/0388009669?utm_source=grow&utm_medium=exit_intent&utm_campaign=homepage&utm_content=free_consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-base uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  onClick={handleClose}
                >
                  <MessageCircle size={20} />
                  Inbox Zalo ngay
                </Link>

                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-bold text-sm hover:bg-[var(--bg-secondary)] transition-all"
                >
                  Tiếp tục xem
                </button>
              </div>

              {/* Trust badge */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="font-body text-[var(--text-muted)] text-xs">
                  ✓ 10K+ khách hàng đã tin dùng &nbsp;|&nbsp; ✓ Tư vấn miễn phí 100%
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

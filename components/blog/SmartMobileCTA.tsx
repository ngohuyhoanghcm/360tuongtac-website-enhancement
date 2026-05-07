'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const trigger = document.getElementById('mobile-cta-trigger');
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show CTA when user has scrolled past 40% of article
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-40% 0px 0px 0px' }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-0 right-0 z-50 px-6 block md:hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
      }`}
    >
      <Link 
        href="/dich-vu" 
        className="flex items-center justify-between p-4 glass-panel rounded-2xl shadow-lg hover:border-[#FF8C00]/30 transition-all"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Cần hỗ trợ?</span>
          <span className="text-[var(--text-primary)] font-semibold text-sm">Khám phá dịch vụ 360TuongTac</span>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-lg text-white font-bold text-xs">
          Xem ngay
        </div>
      </Link>
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ContextualSectionCTAProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
  delay?: number;
}

export default function ContextualSectionCTA({ 
  text, 
  href, 
  variant = 'primary',
  delay = 0
}: ContextualSectionCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center py-8"
        >
          <Link
            href={href}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
              variant === 'primary'
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white shadow-lg hover:shadow-xl'
                : 'bg-[var(--surface)] border-2 border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white'
            }`}
          >
            {text}
            <ArrowRight 
              size={18} 
              className="transform group-hover:translate-x-1 transition-transform" 
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

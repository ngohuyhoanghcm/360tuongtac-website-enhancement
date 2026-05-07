'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Link as LinkIcon, Share2, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

function IconButton({ children, onClick, active = false }: IconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255,140,0,0.3)' }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${active ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]' : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'}`}
      aria-label="Share action"
    >
      {children}
    </motion.button>
  );
}

function getCanNativeShare() {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

export default function SocialShare({ url, title, layout = 'horizontal', className = '' }: SocialShareProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check native share capability on mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        url: url,
      });
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const containerClasses = layout === 'horizontal'
    ? "flex items-center gap-3"
    : "flex flex-col items-center gap-3";

  return (
    <div className={`relative ${className}`}>
      <div className={containerClasses}>
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1 lg:mb-0 lg:hidden">
          Chia sẻ
        </div>
        
        {canNativeShare && (
          <IconButton onClick={handleNativeShare}>
            <Share2 size={16} />
          </IconButton>
        )}
        
        <IconButton onClick={shareOnFacebook}>
          <Facebook size={16} />
        </IconButton>
        
        <IconButton onClick={handleCopyLink} active={isCopied}>
          {isCopied ? <Check size={16} /> : <LinkIcon size={16} />}
        </IconButton>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={`absolute ${layout === 'horizontal' ? 'bottom-full left-1/2 -translate-x-1/2 mb-3' : 'left-full top-1/2 -translate-y-1/2 ml-3'} whitespace-nowrap bg-gray-900 dark:bg-[var(--surface)] dark:text-[var(--text-primary)] text-white text-xs font-medium px-4 py-2 rounded-lg shadow-lg z-50`}
          >
            Đã sao chép liên kết! 🚀
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

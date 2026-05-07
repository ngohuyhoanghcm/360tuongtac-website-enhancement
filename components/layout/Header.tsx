'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const { scrollDirection, isAtTop } = useScrollDirection();

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Blog', href: '/blog' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];

  const isHidden = scrollDirection === 'down' && !isAtTop;

  return (
    <motion.header 
      initial={{ y: 0 }}
      animate={{ y: isHidden ? -120 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 md:top-6 left-0 right-0 z-50 px-0 md:px-8 pointer-events-none"
    >
      <div className="container-max px-4 md:px-0">
        <div 
          className={`pointer-events-auto transition-all duration-500 rounded-none md:rounded-2xl flex justify-between items-center w-full py-4 px-6 md:px-8 ${
            isAtTop 
              ? 'bg-transparent border-transparent' 
              : 'glass-panel'
          }`}
        >
          {/* Logo */}
          <div className="flex-1 md:flex-none">
            <Link 
              href="/" 
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent tracking-tighter font-h antialiased hover:opacity-80 transition-opacity" 
              aria-label="360 Tương Tác - Trang chủ"
            >
              360 Tương Tác
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-h font-black text-[11px] lg:text-[12px] tracking-widest uppercase antialiased" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  className={`relative px-2 py-1 transition-all group ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
                  href={link.href}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="headerNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
  
          <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-end">
            {/* Theme Toggle - Desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            <Link 
              href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=header_mobile&utm_content=thu_ngay" 
              className="md:hidden bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-[0_0_15px_rgba(255,46,99,0.3)] active:scale-95 transition-all duration-300"
            >
              Thử ngay
            </Link>
            <Link 
              href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=header_desktop&utm_content=bắt_đầu_ngay" 
              className="hidden md:inline-block bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl font-black text-[11px] lg:text-[12px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:shadow-[0_0_30px_rgba(255,46,99,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

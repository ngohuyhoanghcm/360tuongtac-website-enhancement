'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, BookOpen, MessageCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

const NAV_ITEMS = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Dịch vụ', href: '/dich-vu', icon: Layers },
  { name: 'Action', href: 'https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=bottom_nav&utm_content=action_button', icon: Zap, isAction: true },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Liên hệ', href: '/lien-he', icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { scrollDirection, isAtTop } = useScrollDirection();

  const isHidden = scrollDirection === 'down' && !isAtTop;

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isHidden ? 100 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden pb-safe pointer-events-none"
    >
      <div className="mx-4 mb-4 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-2xl flex items-center justify-around py-3 px-1 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key="action-button"
                href={item.href}
                className="relative -top-4 flex flex-col items-center gap-1 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-full shadow-[0_0_20px_rgba(255,46,99,0.5)] border border-white/20"
                >
                  <Icon size={24} className="text-white" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -inset-2 bg-white/20 rounded-full blur-md"
                  />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 group px-2"
            >
              <motion.div
                whileTap={{ scale: 0.8, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavGlow"
                    className="absolute -inset-3 bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] rounded-full blur-xl opacity-30"
                  />
                )}
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
              </motion.div>
              <span
                className={`text-[8px] font-bold tracking-tight transition-colors duration-300 uppercase ${
                  isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {item.name}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] shadow-[0_0_8px_rgba(255,46,99,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';

// Social Brand Icons Data
const SOCIAL_BRANDS = [
  {
    name: 'TikTok',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.14-1.17-.11 3.52.02 7.02-.12 10.53-.29 3.03-2.52 5.62-5.59 6.22-3.13.79-6.61-.83-7.91-3.83-1.63-3.23.01-7.61 3.49-8.49 1.17-.33 2.45-.2 3.56.31V17.3c-.63-.37-1.39-.49-2.12-.35-1.42.34-2.31 1.91-1.89 3.29.41 1.45 2.11 2.17 3.4 1.57.8-.35 1.25-1.22 1.23-2.07.03-6.52.01-13.04.02-19.56z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    icon: (
      <svg className="w-6 h-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'X',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: 10, suffix: 'K+', label: 'Khách hàng' },
  { value: 5, suffix: 'M+', label: 'Đơn hàng' },
  { value: 99, suffix: '%', label: 'Hài lòng' },
  { value: 24, label: 'Hỗ trợ', secondarySuffix: '/7' },
];

function Counter({ value, suffix = '', secondarySuffix = '' }: { value: number; suffix?: string; secondarySuffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const spring = useSpring(0, { stiffness: 40, damping: 25, mass: 1 });
  const display = useTransform(spring, (current) => {
    const val = Math.floor(current);
    return `${val}${suffix}${secondarySuffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.div 
      ref={ref} 
      className="font-stat text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] bg-clip-text text-transparent"
    >
      {display}
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container-max relative z-10">
        {/* Social Icons Row */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {SOCIAL_BRANDS.map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="group-hover:scale-110 transition-transform text-white/90">
                {brand.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Panel */}
        <div className="bg-[#13121b] border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 max-w-5xl mx-auto shadow-2xl relative overflow-hidden md:before:absolute md:before:inset-0 md:before:bg-gradient-to-br md:before:from-white/5 md:before:to-transparent md:before:opacity-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 relative">
            {STATS.map((stat, i) => (
              <div 
                key={i} 
                className={`text-center space-y-3 px-4 ${
                  i !== 0 ? 'lg:border-l border-white/10' : ''
                } ${
                  i % 2 !== 0 ? 'sm:border-l lg:border-l border-white/10' : ''
                } ${
                  i === 2 ? 'sm:border-l-0 lg:border-l border-white/10' : ''
                }`}
                // Combined logic for responsive dividers
              >
                <div className="flex justify-center items-baseline">
                   <Counter value={stat.value} suffix={stat.suffix} secondarySuffix={stat.secondarySuffix} />
                </div>
                <div className="text-[#9CA3AF] font-body text-sm md:text-base font-medium uppercase tracking-widest opacity-80 pt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

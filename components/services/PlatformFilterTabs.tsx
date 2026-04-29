'use client';

import { motion } from 'motion/react';

interface PlatformFilterTabsProps {
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
  platforms: string[];
}

export default function PlatformFilterTabs({ activePlatform, setActivePlatform, platforms }: PlatformFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16">
      <button
        onClick={() => setActivePlatform('Tất cả')}
        className={`px-6 py-2.5 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 ${
          activePlatform === 'Tất cả'
            ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] border-transparent text-white shadow-lg'
            : 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
        }`}
      >
        Tất cả
      </button>

      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => setActivePlatform(platform)}
          className={`px-6 py-2.5 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 ${
            activePlatform === platform
              ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] border-transparent text-white shadow-lg'
              : 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          {platform}
        </button>
      ))}
    </div>
  );
}

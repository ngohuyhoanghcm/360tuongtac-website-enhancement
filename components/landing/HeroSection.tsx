'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ThumbsUp, Camera } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';
import dynamic from 'next/dynamic';
import PromoBadge from './PromoBadge';

const DynamicBadges = dynamic(() => import('./DynamicBadges'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Starfield */}
        <div className="absolute inset-0 opacity-15 animate-starfield" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>
      
      {/* Dynamic Gradient Orbs */}
      <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-[#FF8C00]/20 via-[#FF2E63]/15 to-transparent rounded-full blur-[100px] animate-float-orb pointer-events-none"></div>
      <div className="absolute bottom-20 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-[#8B5CF6]/20 via-[#FF2E63]/10 to-transparent rounded-full blur-[120px] animate-float-orb pointer-events-none" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.12),transparent_70%)] pointer-events-none"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Floating Badges */}
      <DynamicBadges />
      <PromoBadge />

      <div className="container-max relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <h1 className="font-h text-3xl md:text-5xl lg:text-7xl mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent font-black tracking-tight drop-shadow-sm">Tăng Trưởng Mạng Xã Hội</span>
            <span className="block text-white font-black tracking-tight mt-2 drop-shadow-lg">Đa Nền Tảng & Hiệu Quả</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base md:text-xl text-on-surface-variant/80 max-w-2xl md:max-w-3xl mx-auto mb-10 md:mb-14 leading-relaxed">
            Giải pháp marketing 360° giúp thương hiệu của bạn bứt phá trên Facebook, TikTok, Instagram, YouTube. Tăng tương tác thật, tiếp cận khách hàng tiềm năng và thúc đẩy doanh số.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 flex-wrap">
            <Link 
              href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=homepage_primary&utm_content=hero_truy_cap_ngay" 
              onClick={() => trackCTAClick('hero_truy_cap_ngay', 'homepage', 'https://360tuongtac.com/home')}
              className="btn-primary group">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Truy Cập Ngay
              </span>
            </Link>
            <Link 
              href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=homepage_primary&utm_content=hero_xem_dich_vu" 
              onClick={() => trackCTAClick('hero_xem_dich_vu', 'homepage', 'https://360tuongtac.com/home')}
              className="btn-secondary">
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Xem Dịch Vụ
            </Link>
            <Link href="https://zalo.me/0388009669" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>
              Tư Vấn Zalo
            </Link>
          </div>
        </motion.div>

        {/* Floating Social Icons (Orbit) */}
        <div className="relative mt-24 h-40 max-w-lg mx-auto pointer-events-none overflow-visible">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-around items-center">
            <div className="orbit-1">
              <div className="w-14 h-14 rounded-xl bg-[#1877F2] flex items-center justify-center shadow-[0_0_20px_rgba(24,119,242,0.6)] border-2 border-[#1877F2]/50">
                <ThumbsUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="orbit-2">
              <div className="w-14 h-14 rounded-xl bg-[#0866FF] flex items-center justify-center shadow-[0_0_20px_rgba(8,102,255,0.6)] border-2 border-[#0866FF]/50 p-3">
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9a3 3 0 0 1 3-3h3v3h-3v3h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </div>
            </div>
            <div className="orbit-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-[0_0_20px_rgba(238,42,123,0.6)] border-2 border-[#ee2a7b]/50">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="orbit-4">
              <div className="w-14 h-14 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] border-2 border-[#FF0000]/50 p-3">
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            <div className="orbit-5">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center shadow-[0_0_20px_rgba(255,0,80,0.6)] border-2 border-[#FE2C55]/50 overflow-hidden relative">
                <div style={{ position: 'absolute', inset: 2, background: '#000', borderRadius: 10, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

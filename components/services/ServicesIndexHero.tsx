'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function ServicesIndexHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-r from-[#FF8C00]/10 via-[#FF2E63]/10 to-[#8B5CF6]/10 rounded-full blur-[120px] -z-10 opacity-60"></div>
      
      <div className="container-max px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass-panel border border-white/10 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-[#FF8C00] animate-pulse"></span>
            <span className="font-stat text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">HUB TIẾP THỊ 360</span>
          </div>

          <h1 className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white antialiased">
            Dịch Vụ Tăng Trưởng <br className="hidden md:block" /> 
            <span className="bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent italic">Mạng Xã Hội Toàn Diện</span>
          </h1>
          
          <p className="font-body text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium opacity-90">
            Giải pháp &quot;bẻ khóa&quot; thuật toán hàng đầu Việt Nam. Tăng trưởng an toàn, 
            kích hoạt đề xuất tự nhiên và tối ưu hóa chuyển đổi cho mọi chiến dịch của bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="#service-grid" 
                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black text-lg shadow-[0_0_40px_rgba(255,140,0,0.3)] hover:shadow-[0_0_50px_rgba(255,140,0,0.5)] transition-all duration-300 antialiased block"
              >
                Khám phá dịch vụ
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                 href="https://zalo.me/0388009669"
                 target="_blank" rel="noopener noreferrer"
                 className="px-10 py-5 rounded-2xl glass-panel border border-white/20 text-white font-black text-lg 
                            hover:bg-white/10 hover:border-[#00E5FF]/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]
                            transition-all duration-300 antialiased flex items-center gap-3 group"
              >
                <svg className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
                <span>Tư vấn Zalo</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

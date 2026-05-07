'use client';

import { motion } from 'motion/react';

export default function BlogHero() {
  return (
    <div className="text-center mb-16 md:mb-24 relative pt-12 md:pt-20">
      {/* Background Breathing Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-64 bg-gradient-to-r from-[#FF8C00]/20 to-[#FF2E63]/20 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-lg">
           <svg className="w-4 h-4 text-[#FF8C00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-600">KIẾN THỨC GROWTH</span>
        </div>

        <h1 className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-gray-900 antialiased">
          Học Viện <span className="bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent">360TuongTac</span>
        </h1>
        
        <p className="font-body text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Cập nhật thuật toán liên tục. Chia sẻ bí quyết xây dựng đa kênh, bùng nổ doanh số từ các chuyên gia tăng trưởng hàng đầu Việt Nam.
        </p>
      </motion.div>
    </div>
  );
}

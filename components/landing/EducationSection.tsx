'use client';

import { motion } from 'motion/react';

interface EducationSectionProps {
  data: {
    title: string;
    content: string;
  };
}

export default function EducationSection({ data }: EducationSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0d0d1a]">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF2E63]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container-max px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#FF8C00]/30 bg-[#FF8C00]/10 backdrop-blur-md">
              <span className="text-[10px] font-black tracking-[0.3em] text-[#FF8C00] uppercase antialiased">Kiến thức chuyên sâu</span>
            </div>
            
            <h2 className="font-h1 text-3xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tight antialiased">
              {data.title}
            </h2>
            
            <div className="font-body text-slate-400 text-lg leading-relaxed font-medium space-y-6 opacity-90 prose prose-invert max-w-none">
              {data.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="glass-panel p-2 rounded-[3.5rem] border border-white/5 relative z-10">
              <div className="bg-[#1a1926] rounded-[3rem] p-12 md:p-16 aspect-square flex flex-col items-center justify-center text-center">
                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FF2E63] flex items-center justify-center mb-8 shadow-2xl">
                    <span className="text-5xl font-black text-white italic">360°</span>
                 </div>
                 <h3 className="font-h1 text-2xl font-bold text-white mb-4">Chiến lược tăng trưởng</h3>
                 <p className="text-slate-400 font-medium">Bí kíp vận hành thuật toán thông minh được đúc kết từ 5+ năm kinh nghiệm trong ngành.</p>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-10 -right-10 w-40 h-40 grid grid-cols-4 gap-4 opacity-20 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

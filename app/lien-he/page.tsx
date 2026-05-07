"use client";

import { Phone, Mail, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-secondary)] overflow-hidden py-24 mt-16 sm:mt-24">
      {/* Background Gradients & Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF8C00]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF2E63]/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-[#8B5CF6]/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/mesh-pattern.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse shadow-[0_0_10px_#FF8C00]"></span>
            <span className="font-stat text-xs font-semibold text-[#FF8C00] tracking-wider uppercase">Sẵn sàng hỗ trợ 24/7</span>
          </div>
          <h1 className="font-h1 text-5xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight">KẾT NỐI <span className="bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] text-transparent bg-clip-text">BỨT PHÁ</span></h1>
          <p className="font-body text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
            Mở khóa tiềm năng tăng trưởng với hệ sinh thái 360TuongTac. Đội ngũ chuyên gia luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
          </p>
        </motion.div>

        {/* Huge Glassmorphism Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[var(--surface)] backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-xl p-6 md:p-8 lg:p-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-transparent pointer-events-none"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT SIDE: Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
              <div className="space-y-6">
                
                {/* Social Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
                  <a href="https://zalo.me/0388009669" target="_blank" rel="noreferrer" className="relative group overflow-hidden rounded-2xl p-[1px]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#0068FF] to-[#00E5FF] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <div className="relative flex items-center justify-center gap-2 py-3 bg-[var(--bg-secondary)] rounded-2xl transition-all duration-500 group-hover:bg-[var(--surface-hover)] h-full">
                      <span className="font-h1 font-bold text-[var(--text-primary)] text-sm tracking-wide text-center">Zalo<br/>Tư Vấn</span>
                    </div>
                  </a>
                  
                  <a href="https://zalo.me/g/stizun489" target="_blank" rel="noreferrer" className="relative group overflow-hidden rounded-2xl p-[1px]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#0068FF] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <div className="relative flex items-center justify-center gap-2 py-3 bg-[var(--bg-secondary)] rounded-2xl transition-all duration-500 group-hover:bg-[var(--surface-hover)] h-full">
                      <span className="font-h1 font-bold text-[var(--text-primary)] text-sm tracking-wide text-center">Nhóm<br/>Zalo</span>
                    </div>
                  </a>

                  <a href="https://t.me/CSKH360TuongTac" target="_blank" rel="noreferrer" className="relative group overflow-hidden rounded-2xl p-[1px]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#229ED9] to-[#8B5CF6] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <div className="relative flex items-center justify-center gap-2 py-3 bg-[var(--bg-secondary)] rounded-2xl transition-all duration-500 group-hover:bg-[var(--surface-hover)] h-full">
                      <span className="font-h1 font-bold text-[var(--text-primary)] text-sm tracking-wide text-center">Telegram<br/>CSKH</span>
                    </div>
                  </a>
                </div>

                {/* 3D Isometric Styled Cards */}
                <div className="group relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl hover:border-[#FF8C00]/50 transition-all duration-500 overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/0 to-[#FF8C00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#FF2E63] p-[1px] shadow-[0_10px_20px_rgba(255,140,0,0.3)] transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center">
                        <Phone className="text-[#FF8C00] drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]" size={28} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-stat text-sm font-bold text-[var(--text-muted)] tracking-wider uppercase mb-1">Hotline VIP</h3>
                      <p className="font-h1 font-bold text-2xl text-[var(--text-primary)] group-hover:text-[#FF8C00] transition-colors">0388.00.9669</p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl hover:border-[#FF2E63]/50 transition-all duration-500 overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E63]/0 to-[#FF2E63]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF2E63] to-[#8B5CF6] p-[1px] shadow-[0_10px_20px_rgba(255,46,99,0.3)] transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center">
                        <Mail className="text-[#FF2E63] drop-shadow-[0_0_8px_rgba(255,46,99,0.8)]" size={28} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-stat text-sm font-bold text-[var(--text-muted)] tracking-wider uppercase mb-1">Email Support</h3>
                      <p className="font-h1 font-bold text-xl text-[var(--text-primary)] group-hover:text-[#FF2E63] transition-colors">contact@flowra.vn</p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl hover:border-[#8B5CF6]/50 transition-all duration-500 overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/0 to-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#00E5FF] p-[1px] shadow-[0_10px_20px_rgba(139,92,246,0.3)] transform group-hover:scale-110 transition-transform duration-500">
                      <div className="w-full h-full bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center">
                        <MapPin className="text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" size={28} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-stat text-sm font-bold text-[var(--text-muted)] tracking-wider uppercase mb-1">HQ Office</h3>
                      <p className="font-body font-medium text-[var(--text-primary)] text-lg pr-4 group-hover:text-[#8B5CF6] transition-colors">
                        403A, lô N07, cc K26, Gò Vấp, HCM
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

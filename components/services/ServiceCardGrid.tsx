'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Rocket, MessageSquare, UserPlus, ThumbsUp, Play, Users, Instagram, Youtube, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ServiceItem } from '@/data/services';

const ICONS: Record<string, any> = {
  Rocket,
  MessageSquare,
  UserPlus,
  ThumbsUp,
  Play,
  Users,
  Instagram,
  Youtube,
  Globe
};

interface ServiceCardGridProps {
  services: ServiceItem[];
}

export default function ServiceCardGrid({ services }: ServiceCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24" id="service-grid">
      <AnimatePresence mode="popLayout">
        {services.map((service) => {
          const Icon = ICONS[service.icon] || Rocket;
          
          return (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="h-full glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-[#FF2E63]/30 transition-all duration-500 flex flex-col relative overflow-hidden bg-[#13121b]/40 backdrop-blur-2xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-6 right-6 z-10">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FF2E63] to-[#FF8C00] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      HOT
                    </span>
                  </div>
                )}

                <div className="mb-8 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#FF2E63] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Icon size={32} className="text-white" />
                  </div>
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    {service.platform}
                  </span>
                </div>

                <h3 className="font-h1 text-2xl font-black text-white mb-4 leading-tight tracking-tight group-hover:text-[#FF8C00] transition-colors">
                  {service.title}
                </h3>

                <p className="font-body text-slate-400 text-sm md:text-base mb-10 leading-relaxed font-medium line-clamp-3">
                  {service.description}
                </p>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                   <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Giá khởi điểm</p>
                      <p className="text-white font-black text-xl md:text-2xl">{service.startingPrice}</p>
                   </div>
                   
                   <Link 
                      href={`/dich-vu/${service.slug}`} 
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-[#FF8C00] hover:to-[#FF2E63] hover:border-transparent transition-all duration-300"
                    >
                      <ArrowRight size={20} />
                   </Link>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF2E63]/0 to-[#FF2E63]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

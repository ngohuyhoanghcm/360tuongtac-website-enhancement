'use client';

import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

interface FeaturedPostProps {
  post: {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    author: string;
    image: string;
    slug: string;
  };
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="mb-20 md:mb-32"
    >
      <div className="glass-panel p-4 md:p-6 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
        {/* Glow Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#FF2E63]/10 to-transparent opacity-50 pointer-events-none"></div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Container */}
          <div className="relative aspect-[16/10] lg:aspect-auto h-full min-h-[300px] md:min-h-[450px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
              unoptimized
            />
            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E63] to-[#FF8C00] text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                NỔI BẬT
              </span>
            </div>
            {/* Edge Glow */}
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
          </div>

          {/* Content Container */}
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#FF8C00] text-xs font-black tracking-widest uppercase px-3 py-1 bg-[#FF8C00]/10 border border-[#FF8C00]/20 rounded-lg">
                {post.category}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Calendar size={14} className="text-[#FF2E63]" />
                <span>{post.date}</span>
              </div>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-h1 text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1] md:leading-tight group-hover:bg-gradient-to-r group-hover:from-[#FF8C00] group-hover:to-[#FF2E63] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {post.title}
              </h2>
            </Link>

            <p className="font-body text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-normal">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-0.5 overflow-hidden">
                  <div className="w-full h-full bg-[#13121b] rounded-xl flex items-center justify-center text-white/50">
                    <User size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{post.author}</h4>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-black">Biên tập viên</p>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`} className="group/btn flex items-center gap-3 text-white font-black text-sm tracking-widest uppercase hover:text-[#FF8C00] transition-colors relative overflow-hidden">
                Đọc tiếp
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} className="text-[#FF8C00]" />
                </motion.div>
                {/* Underline Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] group-hover/btn:w-full transition-all duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

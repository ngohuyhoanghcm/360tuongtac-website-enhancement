'use client';

import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  slug: string;
  color?: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Xây Kênh': 'shadow-[0_0_15px_rgba(255,140,0,0.4)] border-[#FF8C00]/30 text-[#FF8C00]',
  'Nghiên Cứu': 'shadow-[0_0_15px_rgba(0,242,254,0.4)] border-[#00F2FE]/30 text-[#00F2FE]',
  'KOC': 'shadow-[0_0_15px_rgba(139,92,246,0.4)] border-[#8B5CF6]/30 text-[#8B5CF6]',
  'Default': 'shadow-[0_0_15px_rgba(255,46,99,0.4)] border-[#FF2E63]/30 text-[#FF2E63]'
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
      {posts.map((post, i) => {
        const catStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Default'];
        
        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group"
          >
            <div className="bg-[#13121b] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-white/20 hover:bg-[#1a1924] transition-all duration-500 shadow-2xl relative">
              {/* Image with Zoom Effect */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
                <div className="absolute top-5 left-5 z-20">
                  <span className={`px-4 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border text-[10px] font-black uppercase tracking-widest ${catStyle}`}>
                    {post.category}
                  </span>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#13121b] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Calendar size={12} className="text-[#FF2E63]" />
                  <span>{post.date}</span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-h1 text-xl md:text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#FF8C00] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="font-body text-slate-400 text-sm md:text-base mb-8 line-clamp-3 leading-relaxed font-medium">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                      <User size={14} />
                    </div>
                    <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{post.author}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} className="group/link inline-flex items-center gap-2 text-white font-black text-[11px] tracking-widest uppercase hover:text-[#FF8C00] transition-colors">
                    Chi tiết 
                    <ArrowRight size={16} className="text-[#FF8C00] transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

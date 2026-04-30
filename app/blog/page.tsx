'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Clock, ChevronRight, Filter } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/lib/constants/blog';

const CATEGORIES = ['Tất cả', 'Thuật toán', 'Seeding', 'TikTok Shop', 'Case Study'];

const CATEGORY_COLORS: Record<string, string> = {
  'Thuật toán': 'shadow-[0_0_15px_rgba(0,242,254,0.4)] border-[#00F2FE]/30 text-[#00F2FE]',
  'Seeding': 'shadow-[0_0_15px_rgba(255,140,0,0.4)] border-[#FF8C00]/30 text-[#FF8C00]',
  'TikTok Shop': 'shadow-[0_0_15px_rgba(139,92,246,0.4)] border-[#8B5CF6]/30 text-[#8B5CF6]',
  'Case Study': 'shadow-[0_0_15px_rgba(255,46,99,0.4)] border-[#FF2E63]/30 text-[#FF2E63]',
  'Default': 'shadow-[0_0_15px_rgba(255,255,255,0.4)] border-white/30 text-white'
};

export default function BlogAcademy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset to first page when filtering
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  const otherPosts = filteredPosts.filter(p => p.id !== featuredPost.id);
  
  const totalPages = Math.ceil(otherPosts.length / POSTS_PER_PAGE);
  const currentPosts = otherPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-32">
      <div className="container-max px-6">
        {/* Blog Hero & Search */}
        <div className="text-center pt-20 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="font-h1 text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight text-white antialiased">
              Học Viện <span className="bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent">360TuongTac</span>
            </h1>
            <p className="font-body text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Chia sẻ bí quyết tăng trưởng, thuật toán mạng xã hội và case study thực chiến.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/20 to-[#FF2E63]/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-panel border border-white/10 rounded-2xl flex items-center px-6 py-4 shadow-2xl">
                <Search size={20} className="text-slate-500 mr-4" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết, chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full font-medium placeholder:text-slate-600"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-[#FF8C00]/30 to-[#8B5CF6]/30 rounded-full blur-[120px] pointer-events-none -z-10"
          />
        </div>

        {/* Featured Post */}
        {!searchQuery && selectedCategory === 'Tất cả' && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#13121b] shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-0 overflow-hidden">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image  
                    src={featuredPost.featuredImage} 
                    alt={featuredPost.alt || featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] to-transparent md:block hidden"></div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-[#FF2E63]/10 border border-[#FF2E63]/30 text-[#FF2E63] text-[10px] font-black uppercase tracking-widest rounded-full">
                      Pillar Content
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} /> {featuredPost.readTime || '8 phút'} đọc
                    </span>
                  </div>
                  <h2 className="font-h1 text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight antialiased">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-[#FF8C00] transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={featuredPost.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=40&auto=format&fit=crop'} 
                        alt={featuredPost.author} 
                        width={40}
                        height={40}
                        sizes="40px"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-white/10 object-cover" 
                      />
                      <div>
                        <p className="text-white font-bold text-sm">{featuredPost.author}</p>
                        <p className="text-slate-500 text-xs">{featuredPost.date}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest group/link"
                    >
                      Đọc tiếp <ChevronRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white shadow-lg shadow-[#FF2E63]/20' 
                    : 'text-slate-500 hover:text-white bg-white/5 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <Filter size={14} /> {filteredPosts.length} Bài viết
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <AnimatePresence mode="popLayout">
            {currentPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group glass-panel border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#FF2E63]/30 hover:shadow-[0_0_40px_rgba(255,46,99,0.15)] transition-all flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image  
                    src={post.featuredImage} 
                    alt={post.alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 left-4 whitespace-nowrap px-3 py-1.5 bg-black/60 backdrop-blur-md border rounded-lg text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Default']}`}>
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span>{post.readTime || '5 phút'} ĐỌC</span>
                  </div>
                  <h3 className="font-h1 text-xl font-black text-white mb-4 group-hover:text-[#FF8C00] transition-colors leading-tight antialiased">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-white text-xs font-bold">{post.author}</span>
                    <Link href={`/blog/${post.slug}`} className="p-2 bg-white/5 rounded-lg text-white hover:bg-[#FF2E63] transition-colors">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                    currentPage === i + 1 
                      ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white shadow-lg shadow-[#FF2E63]/20' 
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-slate-500 font-h1 text-xl">Không tìm thấy bài viết nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
}


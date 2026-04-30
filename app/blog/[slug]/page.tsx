import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Mail, Calendar, User, Clock, ChevronLeft, ArrowRight, Share2, Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/lib/constants/blog';
import TableOfContents from '@/components/blog/TableOfContents';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import NavigationBack from '@/components/ui/NavigationBack';
import SocialShare from '@/components/blog/SocialShare';
import InteractiveChart from '@/components/blog/InteractiveChart';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | Học Viện 360TuongTac`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const bPost = post;
  
  // Try to parse FAQs from content specifically for FAQ schema
  const faqSchemaMatches = [...bPost.content.matchAll(/<li><strong>(Q\d+: (.*?))<\/strong><br>\s*A: (.*?)<\/li>/gi)];
  let faqJsonLd = null;
  if (faqSchemaMatches.length > 0) {
    faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqSchemaMatches.map(match => ({
        '@type': 'Question',
        name: match[2],
        acceptedAnswer: {
          '@type': 'Answer',
          text: match[3]
        }
      }))
    };
  }

  // JSON-LD Schemas
  const wordCount = post.content.split(/\s+/).length;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: '360TuongTac',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ais-dev-pchhg6c65q2vymp7lrkg6k-381323899482.asia-east1.run.app/logo.png',
      },
    },
    wordCount: wordCount,
    keywords: post.tags?.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://360tuongtac.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://360tuongtac.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://360tuongtac.com/blog/${post.slug}` },
    ],
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '360TuongTac',
    url: 'https://360tuongtac.com',
    logo: 'https://ais-dev-pchhg6c65q2vymp7lrkg6k-381323899482.asia-east1.run.app/logo.png',
    sameAs: [
      'https://www.facebook.com/360tuongtac',
      'https://www.tiktok.com/@360tuongtac'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="bg-[#0a0a0f] min-h-screen pb-24">
        {/* Post Hero */}
        <header className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
          <div className="container-max px-6 relative z-10">
            <NavigationBack href="/blog" label="← Quay lại Blog" />
            <Breadcrumbs 
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` },
                { label: post.title }
              ]} 
            />

            <div className="max-w-4xl mt-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="px-4 py-1.5 bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-[#FF8C00] text-[10px] font-black uppercase tracking-widest rounded-full">
                  {post.category}
                </span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> {post.readTime || '5 phút'} đọc
                </span>
              </div>

              <h1 className="font-h1 text-4xl md:text-5xl lg:text-6xl font-black text-white mb-10 leading-tight tracking-tight antialiased">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3">
                    <Image 
                      src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'} 
                      alt={post.author} 
                      width={48}
                      height={48}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-white/10 object-cover"
                    />
                  <div>
                    <p className="text-white font-black text-sm">{post.author}</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Growth Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <Calendar size={16} className="text-[#FF2E63]" /> {post.date}
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <SocialShare url={`https://360tuongtac.com/blog/${post.slug}`} title={post.title} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="container-max px-6 pt-16">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-16">
            
            {/* Article Body */}
            <main className="max-w-[720px] mx-auto xl:mx-0">
              <div 
                className="prose prose-invert prose-slate max-w-none 
                prose-headings:font-h1 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-16 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5
                prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12
                prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8 prose-p:font-medium
                prose-strong:text-white prose-strong:font-black
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-li:text-slate-400 prose-li:mb-2
                "
                dangerouslySetInnerHTML={{ __html: post.content || '<p>Đang cập nhật nội dung...</p>' }}
              />

              {/* Data Visualization */}
              {post.chart && (
                <div className="my-16">
                  <InteractiveChart
                    type={post.chart.type}
                    data={post.chart.data}
                    xAxisKey={post.chart.xAxisKey}
                    dataKey={post.chart.dataKey!}
                    nameKey={post.chart.nameKey}
                    title={post.chart.title}
                    description={post.chart.description}
                  />
                </div>
              )}

              {/* Inline CTA Box 1 */}
              <div className="my-16 p-8 md:p-12 glass-panel border border-[#FF8C00]/30 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8C00]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#FF8C00]/20 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <h4 className="font-h1 text-2xl font-black text-white mb-4">💡 Bạn muốn bùng nổ tương tác thật?</h4>
                  <p className="text-slate-400 mb-8 font-medium leading-relaxed">
                    Đừng chỉ đọc, hãy bắt đầu ngay. Hệ thống 360TuongTac giúp bạn kích hoạt thuật toán đề xuất chỉ sau vài phút.
                  </p>
                  <Link 
                    href="/dich-vu" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black rounded-xl shadow-lg shadow-[#FF2E63]/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Khám phá dịch vụ ngay <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Inline CTA Box 2 */}
              <div className="my-16 p-8 md:p-12 glass-panel border border-[#8B5CF6]/30 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8B5CF6]/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 group-hover:bg-[#8B5CF6]/20 transition-colors duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="flex-1">
                    <h4 className="font-h1 text-2xl font-black text-white mb-4">💎 Chiến dịch SMM chuyên nghiệp</h4>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      Sử dụng hệ thống seeding an toàn, bảo mật cao. Giúp doanh nghiệp của bạn vượt xa đối thủ cạnh tranh trên mọi nền tảng.
                    </p>
                  </div>
                  <Link 
                    href="https://zalo.me/0388009669" 
                    target="_blank" rel="noopener noreferrer"
                    className="whitespace-nowrap px-8 py-4 bg-white/5 border border-white/10 hover:border-[#8B5CF6] text-white font-black rounded-xl transition-all"
                  >
                    Tư vấn miễn phí qua Zalo
                  </Link>
                </div>
              </div>

              {/* Author Box Footer */}
              <div className="mt-16 xl:hidden">
                <SocialShare url={`https://360tuongtac.com/blog/${post.slug}`} title={post.title} className="justify-center flex" />
              </div>

              <footer className="mt-16 pt-12 border-t border-white/5">
                <div className="p-8 glass-panel border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center gap-8">
                  <Image 
                    src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'} 
                    alt={post.author} 
                    width={96}
                    height={96}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full border-4 border-white/5 object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h5 className="font-h1 text-xl font-black text-white mb-2 uppercase tracking-wide">Tác giả: {post.author}</h5>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                      Chuyên gia tư vấn chiến lược tăng trưởng đa nền tảng với hơn 5 năm kinh nghiệm thực chiến Social Commerce.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">
                      <Link href="https://zalo.me/0388009669" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0068FF]/10 text-[#00E5FF] hover:bg-[#0068FF]/20 border border-[#0068FF]/30 hover:border-[#00E5FF] rounded-xl transition-all font-bold text-sm">
                        <MessageCircle size={18} />
                        Liên hệ chuyên gia
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>

              {/* Internal Link Sync: Related Posts & Services */}
              <div className="mt-16 space-y-12">
                {post.relatedServices && post.relatedServices.length > 0 && (
                  <div>
                    <h3 className="font-h1 text-2xl font-black text-white mb-6">Dịch vụ Đề xuất (Related Services)</h3>
                    <div className="flex flex-wrap gap-4">
                      {post.relatedServices.map(slug => (
                        <Link key={slug} href={`/dich-vu/${slug}`} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:border-[#FF2E63] transition-colors font-medium">
                          Khám phá dịch vụ {slug.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                  <div>
                    <h3 className="font-h1 text-2xl font-black text-white mb-6">Bài viết cùng chủ đề</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.relatedPosts.map(slug => {
                        const related = BLOG_POSTS.find(p => p.slug === slug);
                        if (!related) return null;
                        return (
                          <Link key={slug} href={`/blog/${slug}`} className="group p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                            <h4 className="font-bold text-white mb-2 group-hover:text-[#FF8C00] transition-colors line-clamp-2">{related.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2">{related.excerpt}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Sidebar Hero, TOC & Share */}
            <aside className="space-y-8">
              {/* Sidebar Hero Image + CTA Block */}
              <div className="relative group">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-4 sm:p-6 transition-colors duration-500 shadow-[0_0_40px_rgba(255,140,0,0.15)] group-hover:shadow-[0_0_40px_rgba(255,46,99,0.25)]">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <Image 
                      src={post.featuredImage} 
                      alt={post.alt || post.title} 
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover rounded-2xl filter brightness-110 contrast-105 group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Link 
                      href="http://360tuongtac.com/auth/login" 
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black rounded-xl shadow-[0_0_20px_rgba(255,46,99,0.3)] hover:shadow-[0_0_30px_rgba(255,46,99,0.5)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
                    >
                      Bắt đầu ngay
                    </Link>
                  </div>
                </div>
              </div>

              <TableOfContents />
              <div className="hidden xl:block sticky top-32">
                <SocialShare url={`https://360tuongtac.com/blog/${post.slug}`} title={post.title} layout="vertical" />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-24 left-0 right-0 z-50 px-6 block md:hidden pointer-events-none">
        <Link 
          href="/dich-vu" 
          className="pointer-events-auto flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dịch vụ đề xuất</span>
            <span className="text-white font-black text-sm">Tăng Tương Tác Thật</span>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-lg text-white font-bold text-xs">
            Dùng thử ngay
          </div>
        </Link>
      </div>
    </>
  );
}

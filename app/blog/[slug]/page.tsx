import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Mail, Calendar, User, Clock, ChevronLeft, ArrowRight, Share2, Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/lib/constants/blog';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import NavigationBack from '@/components/ui/NavigationBack';
import SocialShare from '@/components/blog/SocialShare';

const InteractiveChart = dynamic(() => import('@/components/blog/InteractiveChart'));
const TableOfContents = dynamic(() => import('@/components/blog/TableOfContents'));

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
    alternates: {
      canonical: `https://grow.360tuongtac.com/blog/${post.slug}`,
    },
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
        url: 'https://grow.360tuongtac.com/logo.png',
      },
    },
    wordCount: wordCount,
    keywords: post.tags?.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://grow.360tuongtac.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://grow.360tuongtac.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://grow.360tuongtac.com/blog/${post.slug}` },
    ],
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '360TuongTac',
    url: 'https://grow.360tuongtac.com',
    logo: 'https://grow.360tuongtac.com/logo.png',
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

      <article className="min-h-screen pb-24">
        {/* Post Hero */}
        <header className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[var(--bg)]" />
          {/* Neon Glow Shadows */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#FF8C00]/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
          
          <div className="container-max px-6 relative z-10">
            <div className="glass-panel rounded-3xl p-8 md:p-12">
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
                  <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> {post.readTime || '5 phút'} đọc
                  </span>
                </div>

                <h1 className="font-h1 text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-10 leading-tight tracking-tight antialiased">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-8 border-t border-[var(--border)] pt-8">
                  <div className="flex items-center gap-3">
                      <Image 
                        src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'} 
                        alt={post.author} 
                        width={48}
                        height={48}
                        sizes="48px"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border border-[var(--border)] object-cover"
                      />
                    <div>
                      <p className="text-[var(--text-primary)] font-black text-sm">{post.author}</p>
                      <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Growth Expert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm">
                    <Calendar size={16} className="text-[#FF2E63]" /> {post.date}
                  </div>
                  <div className="flex items-center gap-4 ml-auto">
                    <SocialShare url={`https://grow.360tuongtac.com/blog/${post.slug}`} title={post.title} />
                  </div>
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
                className="prose prose-gray prose-lg max-w-none 
                prose-headings:font-h1 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[var(--text-primary)]
                prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-16 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[var(--border)]
                prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12
                prose-p:text-[var(--text-secondary)] prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8 prose-p:font-medium
                prose-strong:text-[var(--text-primary)] prose-strong:font-black
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-li:text-[var(--text-secondary)] prose-li:mb-2
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

              {/* Soft Inline CTA - Replaces aggressive boxes */}
              <div className="my-12 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:border-[#FF8C00]/30 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed">
                       Cần tăng tương tác thật cho kênh của bạn? <span className="text-[var(--text-primary)] font-semibold">360TuongTac</span> hỗ trợ kích hoạt thuật toán đề xuất chỉ sau vài phút.
                    </p>
                  </div>
                  <Link 
                    href="/dich-vu" 
                    className="whitespace-nowrap px-5 py-2.5 bg-[var(--surface)] border border-[var(--border)] group-hover:border-[#FF8C00]/50 text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--surface-hover)] transition-all text-sm flex items-center gap-2"
                  >
                    Khám phá dịch vụ <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Zalo CTA - Softer version at end of article */}
              <div className="my-12 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:border-[#8B5CF6]/30 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed">
                      💬 Cần tư vấn chiến lược SMM chuyên nghiệp? Đội ngũ chuyên gia sẵn sàng hỗ trợ.
                    </p>
                  </div>
                  <Link 
                    href="https://zalo.me/0388009669" 
                    target="_blank" rel="noopener noreferrer"
                    className="whitespace-nowrap px-5 py-2.5 bg-gradient-to-r from-[#0068FF] to-[#00E5FF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#0068FF]/25 transition-all text-sm"
                  >
                    Tư vấn qua Zalo
                  </Link>
                </div>
              </div>

              {/* Author Box Footer */}
              <div className="mt-16 xl:hidden">
                <SocialShare url={`https://grow.360tuongtac.com/blog/${post.slug}`} title={post.title} className="justify-center flex" />
              </div>

              <footer className="mt-16 pt-12 border-t border-[var(--border)]">
                <div className="glass-panel p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-8">
                  <Image 
                    src={post.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'} 
                    alt={post.author} 
                    width={96}
                    height={96}
                    sizes="96px"
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full border-2 border-[var(--border)] object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h5 className="font-h1 text-xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-wide">Tác giả: {post.author}</h5>
                    <p className="text-[var(--text-muted)] font-medium leading-relaxed mb-6">
                      Chuyên gia tư vấn chiến lược tăng trưởng đa nền tảng với hơn 5 năm kinh nghiệm thực chiến Social Commerce.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">
                      <Link href="https://zalo.me/0388009669" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0068FF] to-[#00E5FF] text-white hover:shadow-lg hover:shadow-[#0068FF]/25 border border-transparent rounded-xl transition-all font-bold text-sm">
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
                    <h3 className="font-h1 text-2xl font-black text-[var(--text-primary)] mb-6">Dịch vụ Đề xuất (Related Services)</h3>
                    <div className="flex flex-wrap gap-4">
                      {post.relatedServices.map(slug => (
                        <Link key={slug} href={`/dich-vu/${slug}`} className="px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#FF2E63] transition-colors font-medium">
                          Khám phá dịch vụ {slug.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                  <div>
                    <h3 className="font-h1 text-2xl font-black text-[var(--text-primary)] mb-6">Bài viết cùng chủ đề</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.relatedPosts.map(slug => {
                        const related = BLOG_POSTS.find(p => p.slug === slug);
                        if (!related) return null;
                        return (
                          <Link key={slug} href={`/blog/${slug}`} className="group p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:bg-[var(--surface-hover)] transition-colors">
                            <h4 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[#FF8C00] transition-colors line-clamp-2">{related.title}</h4>
                            <p className="text-sm text-[var(--text-muted)] line-clamp-2">{related.excerpt}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Trigger for smart mobile CTA - positioned at 40% of article */}
            <div id="mobile-cta-trigger" className="absolute" style={{ top: '40%' }} />

            {/* Sidebar Hero, TOC & Share */}
            <aside className="space-y-8">
              {/* Sidebar Hero Image + CTA Block */}
              <div className="relative group">
                <div className="glass-panel rounded-3xl p-4 sm:p-6 transition-colors duration-500">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <Image 
                      src={post.featuredImage} 
                      alt={post.alt || post.title} 
                      fill
                      priority
                      sizes="(max-width: 1280px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                      className="object-cover rounded-2xl filter brightness-110 contrast-105 group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Link 
                      href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=blog_sidebar&utm_content=bắt_đầu_ngay" 
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
                    >
                      Bắt đầu ngay
                    </Link>
                  </div>
                </div>
              </div>

              <TableOfContents />
              <div className="hidden xl:block sticky top-32">
                <SocialShare url={`https://grow.360tuongtac.com/blog/${post.slug}`} title={post.title} layout="vertical" />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Smart Mobile CTA - Only appears after scrolling past 40% of content */}
      <SmartMobileCTA />
    </>
  );
}

// Client component for smart mobile CTA
const SmartMobileCTA = dynamic(() => import('@/components/blog/SmartMobileCTA'));

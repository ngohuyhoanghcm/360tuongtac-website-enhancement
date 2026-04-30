import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateLandingPageMetadata, generateSchemas } from '@/lib/seo';
import ServiceHero from '@/components/landing/ServiceHero';
import PainPointSection from '@/components/landing/PainPointSection';
import EducationSection from '@/components/landing/EducationSection';
import SolutionSection from '@/components/landing/SolutionSection';
import PricingTable from '@/components/landing/PricingTable';
import ProcessSection from '@/components/landing/ProcessSection';
import CaseStudyGrid from '@/components/landing/CaseStudyGrid';
import FAQAccordion from '@/components/landing/FAQAccordion';
import FinalCTA from '@/components/services/FinalCTA';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import NavigationBack from '@/components/ui/NavigationBack';
import SocialShare from '@/components/blog/SocialShare';
import { LandingPage } from '@/types/landing';
import { SERVICES_LIST, ALL_SLUGS } from '@/data/services';

// Mock data generator for the 12 services
// In production, this would come from a content API or file
async function getLandingPage(slug: string): Promise<LandingPage | null> {
  const service = SERVICES_LIST[slug as keyof typeof SERVICES_LIST];
  return service || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return { title: 'Dịch vụ không tồn tại' };
  return generateLandingPageMetadata(page);
}

export async function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }));
}


export default async function LandingPageFactory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getLandingPage(slug);

  if (!page) notFound();

  const schemas = generateSchemas(page, slug);

  // Extract base product url from the first package or default to homepage
  const baseProductUrl = page.content.pricing?.packages?.[0]?.productUrl || 'https://360tuongtac.com/home';

  return (
    <main className="bg-[#0D0D1A] min-h-screen">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Navigation & Breadcrumbs */}
      <div className="pt-24 pb-4">
        <div className="container-max px-6">
          <NavigationBack href="/dich-vu" label="← Tất cả dịch vụ" />
          <Breadcrumbs 
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Dịch vụ', href: '/dich-vu' },
              { label: page.content.hero.badge || page.content.hero.title }
            ]} 
          />
        </div>
      </div>

      {/* Hero Section */}
      <ServiceHero 
        badge={page.content.hero.badge}
        title={page.content.hero.title}
        description={page.content.hero.subtitle}
        productUrl={baseProductUrl}
        serviceSlug={slug}
      />

      {/* Pain Points */}
      <PainPointSection data={page.content.painPoints} />

      {/* Education Section */}
      <EducationSection data={page.content.education} />

      {/* Solution Section */}
      <SolutionSection data={page.content.solution} productUrl={baseProductUrl} serviceSlug={slug} />

      {/* Pricing Table */}
      <PricingTable data={page.content.pricing} serviceName={page.slug} />

      {/* Process Section */}
      <ProcessSection data={page.content.process} />

      {/* Testimonials (Case Studies) */}
      <CaseStudyGrid />

      {/* FAQ Section */}
      <FAQAccordion data={page.content.faq} />

      {/* Mobile Share Section */}
      <div className="xl:hidden container-max px-6 py-12 border-t border-white/5 flex flex-col items-center">
        <h4 className="font-h1 text-sm font-black text-white mb-6 uppercase tracking-widest text-center">Chia sẻ dịch vụ</h4>
        <SocialShare url={`https://360tuongtac.com/dich-vu/${slug}`} title={page.title || page.content.hero.title} />
      </div>

      {/* Floating Desktop Share */}
      <div className="hidden xl:block fixed right-6 top-[40%] z-50">
        <div className="p-4 glass-panel border border-white/5 rounded-2xl shadow-xl">
          <SocialShare url={`https://360tuongtac.com/dich-vu/${slug}`} title={page.title || page.content.hero.title} layout="vertical" />
        </div>
      </div>

      {/* Internal Link Sync: Related Posts */}
      {page.relatedPosts && page.relatedPosts.length > 0 && (
        <section className="py-24 bg-[#0a0a0f] border-t border-white/5">
          <div className="container-max px-6">
            <h2 className="font-h1 text-3xl font-black text-white mb-12 text-center">Kiến Thức Chuyên Môn</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {page.relatedPosts.map(postSlug => (
                  <a key={postSlug} href={`/blog/${postSlug}`} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <h3 className="font-bold text-white mb-3 group-hover:text-[#FF8C00] transition-colors">{postSlug.replace(/-/g, ' ')}</h3>
                    <div className="text-[#FF2E63] font-bold text-sm tracking-widest uppercase flex items-center gap-2">Tìm hiểu thêm <span className="group-hover:translate-x-1 transition-transform">→</span></div>
                  </a>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <FinalCTA productUrl={baseProductUrl} serviceSlug={slug} />
    </main>
  );
}

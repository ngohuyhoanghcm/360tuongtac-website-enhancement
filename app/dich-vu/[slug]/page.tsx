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

  return (
    <main className="bg-[#0D0D1A] min-h-screen">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero Section */}
      <ServiceHero 
        badge={page.content.hero.badge}
        title={page.content.hero.title}
        description={page.content.hero.subtitle}
      />

      {/* Pain Points */}
      <PainPointSection data={page.content.painPoints} />

      {/* Education Section */}
      <EducationSection data={page.content.education} />

      {/* Solution Section */}
      <SolutionSection data={page.content.solution} />

      {/* Pricing Table */}
      <PricingTable data={page.content.pricing} serviceName={page.slug} />

      {/* Process Section */}
      <ProcessSection data={page.content.process} />

      {/* Testimonials (Case Studies) */}
      <CaseStudyGrid />

      {/* FAQ Section */}
      <FAQAccordion data={page.content.faq} />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
}

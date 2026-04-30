export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  viewers?: number;
  features: string[];
  recommended?: boolean;
  productUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  customerName: string;
  before: string;
  after: string;
  result: string;
  testimonial: string;
  avatar?: string;
}

export interface LandingPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    trustBadges: string[];
  };
  painPoints: {
    title: string;
    items: string[];
  };
  education: {
    title: string;
    content: string;
  };
  solution: {
    title: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  pricing: {
    title: string;
    packages: PricingPackage[];
  };
  process: {
    title: string;
    steps: Array<{
      step: string;
      title: string;
      desc: string;
      icon: string;
    }>;
  };
  testimonials: {
    title: string;
    cases: Testimonial[];
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
}

export interface LandingPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: LandingPageContent;
  relatedServices?: string[];
  relatedPosts?: string[];
}

/**
 * GA4 Event Tracking Utilities
 * 
 * This module provides helper functions to track custom events in Google Analytics 4.
 * These events support the 4 conversion goals defined in the GA4 dashboard.
 * 
 * Goals:
 * 1. Service Page View (Micro-conversion)
 * 2. Contact Form Submission (Lead)
 * 3. CTA Click to 360tuongtac.com (Conversion)
 * 4. Blog Post Read >75% (Engagement)
 */

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Track CTA Click Event (Goal 3)
 * 
 * Use this when users click CTAs that redirect to 360tuongtac.com
 * 
 * Example:
 * <button onClick={() => trackCTAClick('hero_primary', 'homepage')}>
 *   Truy Cập Ngay
 * </button>
 */
export function trackCTAClick(
  ctaName: string,
  pageLocation: string,
  destinationUrl?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'conversion',
      event_label: ctaName,
      page_location: pageLocation,
      destination_url: destinationUrl || '',
      value: 1,
    });
  }
}

/**
 * Track Contact Form Submission (Goal 2)
 * 
 * Use this when users successfully submit the contact form
 * 
 * Example:
 * const handleSubmit = async (formData) => {
 *   const success = await submitForm(formData);
 *   if (success) {
 *     trackFormSubmission('contact', 'lien-he');
 *   }
 * };
 */
export function trackFormSubmission(
  formType: string,
  pageLocation: string,
  formData?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submission', {
      event_category: 'lead',
      event_label: formType,
      page_location: pageLocation,
      form_data: formData ? JSON.stringify(formData) : '',
      value: 1,
    });
  }
}

/**
 * Track Service Page View (Goal 1)
 * 
 * This is automatically tracked via page_view events, but you can
 * add explicit tracking for enhanced measurement.
 * 
 * Auto-tracked by GA4 on route change.
 */
export function trackServicePageView(
  serviceName: string,
  serviceSlug: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_page_view', {
      event_category: 'micro_conversion',
      event_label: serviceName,
      service_slug: serviceSlug,
      value: 1,
    });
  }
}

/**
 * Track Blog Post Read Progress (Goal 4)
 * 
 * Use this to track scroll depth on blog posts.
 * Call this at 25%, 50%, 75%, and 100% scroll.
 * 
 * Example:
 * useEffect(() => {
 *   const handleScroll = () => {
 *     const scrollPercent = calculateScrollPercent();
 *     if (scrollPercent >= 75 && !hasTracked75) {
 *       trackScrollDepth('blog-post-slug', 75);
 *       setHasTracked75(true);
 *     }
 *   };
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, []);
 */
export function trackScrollDepth(
  pageSlug: string,
  scrollPercent: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: pageSlug,
      scroll_percent: scrollPercent,
      value: scrollPercent >= 75 ? 1 : 0,
    });
  }
}

/**
 * Track External Link Click
 * 
 * Use this for any link that goes to an external domain
 * 
 * Example:
 * <a 
 *   href="https://360tuongtac.com/home"
 *   onClick={() => trackExternalLink('homepage_cta', 'https://360tuongtac.com/home')}
 * >
 */
export function trackExternalLink(
  linkName: string,
  destinationUrl: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'external_link_click', {
      event_category: 'outbound',
      event_label: linkName,
      destination_url: destinationUrl,
      value: 1,
    });
  }
}

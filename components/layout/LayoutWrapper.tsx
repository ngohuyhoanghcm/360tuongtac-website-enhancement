'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';
import { ZaloFloatWidget } from '@/components/shared/ZaloFloatWidget';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  // Admin routes: only render children (admin layout handles its own UI)
  if (isAdminRoute) {
    return (
      <>
        {gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
        {children}
      </>
    );
  }

  // Public routes: render full layout with Header, Footer, etc.
  return (
    <>
      {gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <ZaloFloatWidget />
    </>
  );
}

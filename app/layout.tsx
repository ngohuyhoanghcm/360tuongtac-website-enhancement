import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam',
});

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional" />
      </head>
      <body className={`${beVietnamPro.variable} ${inter.variable} ${spaceGrotesk.variable} font-body min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFFFF'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://grow.360tuongtac.com'),
  title: '360 Tương Tác - Tăng Like, Follow, View Thật | TikTok, Facebook, Instagram',
  description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. Tăng like, follow, view thật cho Facebook, TikTok, Instagram, YouTube. 10K+ khách hàng tin dùng.',
  alternates: {
    canonical: 'https://grow.360tuongtac.com',
  },
  openGraph: {
    title: '360 Tương Tác - Tăng Like, Follow, View Thật',
    description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. Dịch vụ buff view TikTok, buff follow Facebook, buff like Instagram an toàn, hiệu quả.',
    url: 'https://grow.360tuongtac.com',
    siteName: '360 Tương Tác',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '360 Tương Tác - Tăng Like, Follow, View Thật',
    description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam',
  },
  other: {
    'geo.region': 'VN',
    'geo.placename': 'Vietnam',
    'geo.country': 'VN',
    'google-site-verification': '', // Add your Google Search Console verification code here
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
};

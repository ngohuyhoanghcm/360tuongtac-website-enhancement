import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#13121b'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://360tuongtac.com'),
  title: '360 Tương Tác - Tăng Like, Follow, View Thật | TikTok, Facebook, Instagram',
  description: 'Nền tảng tăng trưởng mạng xã hội số 1 Việt Nam. Tăng like, follow, view thật cho Facebook, TikTok, Instagram, YouTube. 10K+ khách hàng tin dùng.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${beVietnamPro.variable} ${inter.variable} ${spaceGrotesk.variable} font-body bg-background-dark text-white min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

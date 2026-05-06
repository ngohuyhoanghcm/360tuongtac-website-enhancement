"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bảng giá', href: '/bang-gia' },
    { name: 'Quy trình', href: '/quy-trinh' },
    { name: 'Blog', href: '/blog' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#13121b]/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_20px_rgba(108,99,255,0.15)] font-h1 text-sm tracking-wide flex justify-between items-center h-20 px-6 lg:px-12">
      <div className="flex w-full justify-between items-center max-w-[1440px] mx-auto">
        <Link href="/" className="text-xl font-black text-white bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
          360 Tương Tác
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${isActive ? 'text-indigo-400 font-bold border-b-2 border-indigo-500 pb-1' : 'text-slate-400 hover:text-white'} hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
        <a href="https://360tuongtac.com/home?utm_source=grow&utm_medium=cta&utm_campaign=navbar&utm_content=bắt_đầu_ngay" className="bg-[#6C63FF] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_15px_rgba(108,99,255,0.4)] transition-all scale-95 active:scale-90">
          Bắt đầu ngay
        </a>
      </div>
    </nav>
  );
}

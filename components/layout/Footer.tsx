'use client';

import Link from 'next/link';
import { Facebook, Mail, MessageCircle, ChevronDown, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  services: {
    title: "DỊCH VỤ",
    links: [
      { name: "Tăng tương tác MXH", href: "https://360tuongtac.com/home" },
      { name: "Tài khoản Premium", href: "https://360tuongtac.com/product/all" },
      { name: "Proxy & Server", href: "https://360tuongtac.com/proxy/proxy-v4-static" },
      { name: "Bảng giá dịch vụ", href: "/bang-gia" },
      { name: "CTV - Đại lý", href: "https://360tuongtac.com/upgrade" }
    ]
  },
  accounts: {
    title: "TÀI KHOẢN HOT",
    links: [
      { name: "ChatGPT Plus", href: "https://360tuongtac.com/product/all" },
      { name: "Netflix Premium", href: "https://360tuongtac.com/product/all" },
      { name: "Spotify Premium", href: "https://360tuongtac.com/product/all" },
      { name: "Canva Pro", href: "https://360tuongtac.com/product/all" },
      { name: "Microsoft 365", href: "https://360tuongtac.com/product/all" }
    ]
  }
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 border-t border-gray-200">
      <div className="container-max pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-h bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent">360 Tương Tác</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-[260px]">
              Nền tảng tăng trưởng mạng xã hội & tài khoản số cao cấp.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="https://www.facebook.com/360TuongTac" className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors group">
                <Facebook className="w-5 h-5 text-gray-700 group-hover:text-[#1877F2] transition-colors" />
              </Link>
              <Link href="https://www.tiktok.com/@360tuongtac.com" className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors group">
                <svg className="w-5 h-5 text-gray-700 group-hover:text-[#00F2FE] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </Link>
              <Link href="https://youtube.com/@360tuongtac" className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors group">
                <Youtube className="w-5 h-5 text-gray-700 group-hover:text-[#FF0000] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Column 2: Dịch vụ */}
          <div>
            <h4 className="text-gray-900 text-sm font-bold tracking-wider mb-6">{FOOTER_LINKS.services.title}</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.services.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tài khoản hot */}
          <div>
            <h4 className="text-gray-900 text-sm font-bold tracking-wider mb-6">{FOOTER_LINKS.accounts.title}</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.accounts.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Hỗ trợ */}
          <div className="space-y-6">
            <h4 className="text-gray-900 text-sm font-bold tracking-wider mb-2">HỖ TRỢ & LIÊN HỆ</h4>
            <div className="space-y-4">
              <Link href="https://zalo.me/0388009669" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Zalo: 0388.009.669</span>
              </Link>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">contact@flowra.vn</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Link 
                href="https://360tuongtac.com/user/recharge" 
                className="bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white text-[12px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Nạp tiền
              </Link>
              <Link 
                href="https://360tuongtac.com/docs-api-v2" 
                className="bg-white border border-gray-200 text-gray-900 text-[12px] font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                API Docs
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-8">
        <div className="container-max flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Language Selector */}
            <button className="flex items-center gap-2.5 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
              <span className="text-lg leading-none">🇻🇳</span>
              Tiếng Việt
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
            <p className="text-gray-500 text-sm font-medium">
              © 2026 360TuongTac. Tất cả quyền được bảo lưu.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link href="https://360tuongtac.com/rule" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Điều khoản
            </Link>
            <Link href="https://360tuongtac.com/rule" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Bảo mật
            </Link>
            <Link href="https://zalo.me/0388009669" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Hỗ trợ Zalo
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

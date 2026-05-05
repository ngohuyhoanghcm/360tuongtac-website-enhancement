import { Check, Info } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: "Tương tác cơ bản",
    target: "Kênh mới / Cá nhân",
    price: "Chỉ từ 10Đ",
    description: "Giải pháp tiết kiệm nhất để tạo nền tảng ban đầu.",
    features: [
      "View video Tiktok dài/ngắn",
      "Like bài viết Facebook",
      "Tăng lượt hiển thị tương đối",
      "Tốc độ lên từ từ, tự nhiên",
      "Hỗ trợ qua Box Chat 24/7"
    ],
    buttonText: "Xem bảng giá chi tiết",
    popular: false,
    color: "primary"
  },
  {
    name: "Buff Livestream Toàn Diện",
    target: "TikTok Shop / Bán Hàng",
    price: "Siêu ưu đãi",
    description: "Bộ công cụ đầy đủ để có mắt xem và tương tác khi live.",
    features: [
      "Mắt xem Livestream ổn định",
      "Mưa Tim tự động trên Live",
      "Comment kịch bản điều hướng",
      "Share Live đa nền tảng",
      "Tốc độ lên ngay lập tức",
      "Cam kết bảo hành đứt cáp"
    ],
    buttonText: "Đăng ký dịch vụ này",
    popular: true,
    color: "accent"
  },
  {
    name: "Tài Khoản & Tools VIP",
    target: "Đại lý / Chuyên nghiệp",
    price: "Bảng giá Sỉ",
    description: "Bộ tài khoản Premium và Proxy dành riêng cho môi giới.",
    features: [
      "Nâng cấp chính chủ ChatGPT/Canva",
      "Proxy Việt Nam 4G Sạch",
      "Chính sách chiết khấu CTV - Đại lý",
      "Hỗ trợ tích hợp API riêng",
      "Support 1-1 chuyên sâu"
    ],
    buttonText: "Trở thành đối tác",
    popular: false,
    color: "success"
  }
];

import { PricingPackage } from '@/types/landing';

interface PricingTableProps {
  data?: {
    title: string;
    packages: PricingPackage[];
  };
  serviceName?: string;
}

export default function PricingTable({ data, serviceName }: PricingTableProps) {
  const displayTitle = data?.title || "Đầu Tư Thông Minh - Tăng Trưởng Vượt Bậc";
  const displayPackages = data?.packages 
    ? data.packages.map((pkg, idx) => ({
        name: pkg.name,
        target: idx === 0 ? "Kênh mới / Cá nhân" : idx === 1 ? "TikTok Shop / Bán Hàng" : "Đại lý / Chuyên nghiệp",
        price: pkg.price === 0 ? "Siêu ưu đãi" : `Từ ${pkg.price.toLocaleString('vi-VN')}Đ`,
        description: pkg.duration ? `Gói triển khai trong ${pkg.duration}` : "Giải pháp tiết kiệm nhất để tạo nền tảng ban đầu.",
        features: pkg.features,
        buttonText: pkg.recommended ? "Đăng ký dịch vụ này" : "Xem bảng giá chi tiết",
        popular: pkg.recommended || false,
        color: idx === 1 ? "accent" : idx === 2 ? "success" : "primary",
        url: pkg.productUrl
      }))
    : tiers.map(t => ({ ...t, url: 'https://360tuongtac.com/home' }));

  return (
    <section className="py-16 md:py-24 px-6 border-t border-white/5 bg-background-dark/80" id="pricing">
      <div className="container-max">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-primary/20 bg-primary/10">
            <span className="text-sm font-bold tracking-wider text-primary uppercase">Bảng Giá Linh Hoạt</span>
          </div>
          <h2 className="font-h text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {displayTitle}
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Chúng tôi không thu phí cố định hàng tháng. Bạn cấu hình từng gói dựa trên nhu cầu và chỉ trả phí cho những gì bạn sử dụng trên hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayPackages.map((tier, index) => (
            <div 
              key={index} 
              className={`glass-panel rounded-2xl p-8 relative flex flex-col ${tier.popular ? 'border-accent/40 shadow-xl shadow-accent/10 transform md:-translate-y-4' : 'border-white/10'}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-accent to-primary text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                  Lựa Chọn Tốt Nhất
                </div>
              )}
              
              <div className="mb-8">
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${tier.color === 'accent' ? 'text-accent' : tier.color === 'success' ? 'text-green-400' : 'text-primary'}`}>
                  {tier.target}
                </p>
                <h3 className="font-h text-2xl font-bold text-white mb-4">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-h text-3xl font-extrabold text-white">{tier.price}</span>
                </div>
                <p className="font-body text-text-secondary min-h-[48px]">{tier.description}</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="font-body text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={`${tier.url}?utm_source=360tuongtac.com&utm_medium=landing_page&utm_campaign=${serviceName || 'service'}&utm_content=pricing_tier_${index + 1}`} 
                className={`w-full py-4 rounded-lg font-bold text-center transition-all duration-300 ${tier.popular ? 'bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg hover:scale-105' : 'glass-modal text-white hover:bg-white/10 border border-white/20'}`}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-2 text-text-secondary text-sm">
          <Info className="w-4 h-4" />
          <span>Bảng giá chi tiết cho từng loại dịch vụ (Facebook, TikTok, SP Premium...) có sẵn sau khi đăng nhập.</span>
        </div>
      </div>
    </section>
  );
}

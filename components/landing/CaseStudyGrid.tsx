import { TrendingUp, Users, Eye } from 'lucide-react';

const caseStudies = [
  {
    name: "Huyền Trang Cosmetics",
    platform: "TikTok Live",
    initialState: "20-30 viewers/live",
    finalState: "500-800 viewers/live",
    result: "+150 đơn/phiên",
    description: "Nhờ gói mồi view và tương tác thông minh, tạo hiệu ứng chim mồi giúp giữ chân người xem thật. Tỷ lệ chuyển đổi tăng x5 lần chỉ sau 2 tuần.",
    icon: Eye
  },
  {
    name: "TechGear Store",
    platform: "Facebook Page",
    initialState: "500 likes, tương tác kém",
    finalState: "15,000 likes",
    result: "+Tăng độ Trust",
    description: "Xây dựng Profile chuyên nghiệp để chạy Ads hiệu quả hơn. Khách hàng tin tưởng Inbox mua các sản phẩm công nghệ giá trị cao.",
    icon: Users
  }
];

export default function CaseStudyGrid() {
  return (
    <section className="py-16 md:py-24 px-6 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="container-max">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-primary/20 bg-primary/10">
            <span className="text-sm font-bold tracking-wider text-primary uppercase">Câu Chuyện Thành Công</span>
          </div>
          <h2 className="font-h text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Họ Đã Tăng Trưởng Bứt Phá Như Thế Nào?
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Hàng ngàn nhà sáng tạo và doanh nghiệp đã thay đổi cục diện kinh doanh nhờ chiến lược mồi tương tác đúng cách.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div key={index} className="bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 group shadow-md hover:shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-h text-xl font-bold text-[var(--text-primary)] mb-1">{study.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full">
                    {study.platform}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                  <study.icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[#FF8C00] transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-3 py-6 border-y border-[var(--border)] mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-secondary)]">Trước khi áp dụng:</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{study.initialState}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-secondary)]">Kết quả hiện tại:</span>
                  <span className="text-sm font-bold text-[#FF2E63]">{study.finalState}</span>
                </div>
              </div>

              <p className="font-body text-[var(--text-secondary)] leading-relaxed text-sm mb-6 min-h-[80px]">
                {study.description}
              </p>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <span className="text-green-700 dark:text-green-400 font-bold font-h">{study.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

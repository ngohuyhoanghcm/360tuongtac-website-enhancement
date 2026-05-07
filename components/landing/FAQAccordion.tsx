'use client';

import { motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "Dịch vụ buff view TikTok có an toàn không?",
    a: "Hoàn toàn an toàn. Chúng tôi sử dụng hệ thống tài khoản thật, có đầy đủ avatar và hoạt động bình thường. Không yêu cầu mật khẩu tài khoản, chỉ cần link livestream hoặc ID kênh. Hệ thống hoạt động 24/7 với cơ chế bảo mật đa lớp, đảm bảo an toàn tuyệt đối cho tài khoản của bạn. Đã có hơn 10,000 khách hàng tin tưởng sử dụng dịch vụ buff view TikTok tại 360TuongTac."
  },
  {
    q: "Làm thế nào để tăng viewer cho livestream TikTok?",
    a: "Để tăng viewer livestream TikTok rất đơn giản: (1) Đăng ký tài khoản tại 360TuongTac.com, (2) Nạp tiền vào tài khoản với số tiền tối thiểu 50K, (3) Chọn gói buff view phù hợp, (4) Dán link livestream và nhấn kích hoạt. Hệ thống sẽ tự động tăng viewer trong 5-15 phút, giúp livestream của bạn được TikTok đề xuất đến hàng nghìn người xem tiềm năng."
  },
  {
    q: "Giá dịch vụ tăng tương tác mạng xã hội bao nhiêu tiền?",
    a: "Giá dịch vụ tăng tương tác bắt đầu từ 50,000 VND cho các gói cơ bản. Chúng tôi cung cấp nhiều gói dịch vụ khác nhau: gói buff view TikTok từ 50K, gói buff follow Facebook từ 100K, gói buff like Instagram từ 80K. Tất cả dịch vụ đều có chính sách hoàn tiền 100% nếu không hoàn thành đúng cam kết. Bạn có thể thanh toán qua chuyển khoản, MoMo, ZaloPay hoặc thẻ cào."
  },
  {
    q: "Buff follow Facebook có ảnh hưởng xấu đến page không?",
    a: "Không ảnh hưởng tiêu cực nhé bạn. Follow được tăng từ tài khoản thật, chất lượng cao, giúp tăng độ trust cho page. Page có nhiều follow sẽ được Facebook đánh giá cao hơn, dễ dàng chạy Ads và tiếp cận khách hàng tiềm năng. Nhiều khách hàng của chúng tôi đã tăng từ 500 lên 15,000 follow an toàn và hiệu quả."
  },
  {
    q: "Thời gian bắt đầu triển khai dịch vụ tăng tương tác là bao lâu?",
    a: "Hệ thống của chúng tôi hoạt động tự động 24/7, không cần chờ đợi. Thông thường dịch vụ sẽ được kích hoạt sau 5-15 phút kể từ khi bạn hoàn tất đặt hàng. Tốc độ triển khai phụ thuộc vào gói dịch vụ bạn chọn, các gói VIP sẽ có tốc độ nhanh hơn. Bạn có thể theo dõi tiến độ trực tiếp trên dashboard tài khoản."
  },
  {
    q: "Nếu đơn hàng không hoàn thành thì có được hoàn tiền không?",
    a: "Có chứ! Hệ thống có cơ chế tự động theo dõi đơn hàng 24/7. Nếu sau thời gian quy định đơn hàng chưa hoàn thành, chúng tôi sẽ tự động hoàn tiền 100% vào số dư tài khoản của bạn. Bạn có thể sử dụng số dư này để đặt đơn hàng mới hoặc rút về tài khoản ngân hàng bất cứ lúc nào."
  },
  {
    q: "Tài khoản buff view có bị drop không?",
    a: "Tài khoản buff view tại 360TuongTac có độ ổn định cao, tỷ lệ drop dưới 5%. Chúng tôi sử dụng nguồn tài khoản chất lượng cao, được tuyển chọn kỹ lưỡng. Trong trường hợp có drop, hệ thống sẽ tự động bù đắp trong thời gian bảo hành. Gói VIP có chính sách bảo hành lên đến 30 ngày."
  },
  {
    q: "Có thể buff tương tác cho Instagram Reels không?",
    a: "Có, chúng tôi hỗ trợ buff tương tác cho Instagram Reels. Dịch vụ bao gồm: buff view, buff like, buff comment và buff follow. Nhiều khách hàng đã thành công với việc buff Reels từ vài trăm view đạt mốc 100K+ view, thậm chí trở thành xu hướng trên Instagram."
  },
  {
    q: "Dịch vụ buff view TikTok có hỗ trợ cho YouTube không?",
    a: "Hiện tại chúng tôi hỗ trợ buff tương tác cho 4 nền tảng chính: TikTok, Facebook, Instagram và YouTube. Với YouTube, chúng tôi cung cấp dịch vụ buff view video, buff subscriber, buff like và buff comment. Tất cả đều sử dụng tài khoản thật, an toàn và hiệu quả."
  }
];

interface FAQAccordionProps {
  data?: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function FAQAccordion({ data }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const displayTitle = data?.title || "Câu hỏi thường gặp";
  const displayFaqs = data?.items 
    ? data.items.map(it => ({ q: it.question, a: it.answer }))
    : FAQS;

  return (
    <section className="py-24 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="container-max px-6">
        <div className="text-center mb-16">
          <h2 className="font-h1 text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight antialiased">
            {displayTitle.includes('thường gặp') ? (
              <>Câu hỏi <span className="text-gradient">thường gặp</span></>
            ) : displayTitle}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-hover)] transition-colors shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={20} className="text-[#FF8C00] group-hover:scale-110 transition-transform" />
                  <span className="font-h1 text-lg font-bold text-[var(--text-primary)] antialiased">{faq.q}</span>
                </div>
                <ChevronDown 
                   size={20} 
                   className={`text-[var(--text-muted)] transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6"
                >
                  <p className="font-body text-[var(--text-secondary)] leading-relaxed font-medium pt-2 border-t border-[var(--border)]">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

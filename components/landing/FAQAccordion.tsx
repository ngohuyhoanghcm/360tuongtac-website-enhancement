'use client';

import { motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  {
    q: "Hệ thống có yêu cầu mật khẩu tài khoản không?",
    a: "Tuyệt đối KHÔNG. Chúng tôi chỉ yêu cầu link bài viết hoặc ID kênh để triển khai dịch vụ. Quyền riêng tư của bạn là ưu tiên hàng đầu."
  },
  {
    q: "Thời gian bắt đầu triển khai là bao lâu?",
    a: "Hệ thống hoạt động tự động 24/7. Thông thường dịch vụ sẽ được kích hoạt sau 5-15 phút kể từ khi bạn hoàn tất đặt hàng."
  },
  {
    q: "Viewer/Follower có phải là tài khoản thật không?",
    a: "Chúng tôi sử dụng hệ thống tài khoản chất lượng cao, có đầy đủ avatar và hoạt động, đảm bảo an toàn tuyệt đối và duy trì tương tác tự nhiên."
  },
  {
    q: "Nếu đơn hàng không hoàn thành thì sao?",
    a: "Hệ thống có cơ chế tự động theo dõi. Nếu sau thời gian quy định đơn hàng chưa hoàn thành, chúng tôi sẽ tự động hoàn tiền vào số dư tài khoản của bạn."
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
    <section className="py-24 border-t border-gray-200 bg-gray-50">
      <div className="container-max px-6">
        <div className="text-center mb-16">
          <h2 className="font-h1 text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight antialiased">
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
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={20} className="text-[#FF8C00] group-hover:scale-110 transition-transform" />
                  <span className="font-h1 text-lg font-bold text-gray-900 antialiased">{faq.q}</span>
                </div>
                <ChevronDown 
                   size={20} 
                   className={`text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6"
                >
                  <p className="font-body text-gray-600 leading-relaxed font-medium pt-2 border-t border-gray-200">
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

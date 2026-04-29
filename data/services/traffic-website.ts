import { LandingPage } from '@/types/landing';

export const trafficWebsite: LandingPage = {
  slug: 'traffic-website',
  title: 'Tăng Traffic Website',
  metaTitle: 'Dịch Vụ Tăng Traffic Website Thật, SEO Tốt | 360TuongTac',
  metaDescription: 'Dịch vụ tăng traffic website uy tín. Tăng lượt truy cập từ Google Search, Social, Direct. Giúp đẩy thứ hạng từ khóa SEO nhanh chóng, an toàn.',
  content: {
    hero: {
      badge: '🌐 Tối ưu hóa thứ hạng SEO',
      title: 'Tăng Traffic Website',
      subtitle: 'Đẩy mạnh sức mạnh website của bạn với nguồn traffic chất lượng cao. Cải thiện chỉ số Alexa, giảm tỷ lệ thoát (Bounce Rate) và tăng uy tín với Google.',
      trustBadges: ['Traffic từ User thật', 'Hỗ trợ từ Google Search', 'An toàn cho Adsense']
    },
    painPoints: {
      title: 'Website của bạn đang gặp khó khăn vì vắng bóng người truy cập?',
      items: [
        'Thứ hạng SEO kém: Website mới lập hoặc từ khóa mãi không lên Top vì thiếu tín hiệu người dùng (Traffic).',
        'Tỷ lệ thoát (Bounce Rate) cao: Khách vào rồi ra ngay làm Google đánh giá website của bạn kém chất lượng.',
        'Thiếu uy tín doanh nghiệp: Khi đối tác check traffic qua Similarweb thấy con số quá thấp, họ sẽ nghi ngại quy mô công ty.',
        'Chỉ số On-page thấp: Thời gian người dùng ở lại trang (Time on site) quá ngắn khiến website khó được Google ưu ái.'
      ]
    },
    education: {
      title: 'Tác động của User Signals đối với thứ hạng tìm kiếm Google',
      content: `Trong kỷ nguyên SEO hiện đại, Google không còn chỉ nhìn vào Backlink hay Content. "Tín hiệu người dùng" (User Signals) đã trở thành yếu tố quyết định hàng đầu. Google sử dụng dữ liệu từ Chrome và Analytics để đo lường: Có bao nhiêu người vào trang? Họ ở lại bao lâu? Họ có click vào các link khác không?\n\nDịch vụ tăng traffic website của 360TuongTac cung cấp nguồn visitor chất lượng cao, mô phỏng hành vi người dùng thật. Chúng tôi hỗ trợ Traffic từ Google Search (Người dùng gõ từ khóa rồi click vào web bạn) - đây là loại traffic quý giá nhất giúp từ khóa lên Top nhanh chóng. Ngoài ra, việc duy trì một lượng traffic đều đặn giúp Website tăng chỉ số Trust (Độ tin cậy), từ đó các bài viết mới của bạn sẽ được Google Index nhanh hơn và có thứ hạng khởi đầu tốt hơn.`
    },
    solution: {
      title: 'Giải pháp Traffic đa kênh chuyên nghiệp',
      features: [
        { title: 'Nguồn Traffic đa dạng', description: 'Tùy chọn nguồn từ Social, Direct hoặc quan trọng nhất là Google Search Console.', icon: 'Share2' },
        { title: 'Time on site cao', description: 'User ở lại trang từ 60s - 180s, giúp giảm Bounce Rate cực kỳ hiệu quả.', icon: 'Clock' },
        { title: 'An toàn Analytic', description: 'Traffic hiển thị đầy đủ và rõ ràng trên Google Analytics GA4 và Search Console.', icon: 'BarChart' },
        { title: 'Không dùng Bot/Proxy', description: 'Cam kết nguồn người dùng từ thiết bị thật (Mobile & Desktop), an toàn 100% cho Google Adsense.', icon: 'UserCheck' }
      ]
    },
    pricing: {
      title: 'Bảng giá Tăng Traffic Website',
      packages: [
        { id: 'web-traf-basic', name: 'Gói Khởi Động', price: 350000, duration: '30 ngày', features: ['300-500 Traffic/ngày', 'Time on site 90s', 'Nguồn Direct/Social'], productUrl: 'https://360tuongtac.com/product/tang-traffic-website' },
        { id: 'web-traf-seo', name: 'Gói Đẩy Top SEO', price: 950000, duration: '30 ngày', features: ['1000 Traffic/ngày', 'Nguồn từ Google Search', 'Hỗ trợ đẩy từ khóa'], recommended: true, productUrl: 'https://360tuongtac.com/product/tang-traffic-website' },
        { id: 'web-traf-vip', name: 'Gói Doanh Nghiệp', price: 2500000, duration: '30 ngày', features: ['5000+ Traffic/ngày', 'Đa quốc gia/Việt Nam', 'Tư vấn chiến lược SEO'], productUrl: 'https://360tuongtac.com/product/tang-traffic-website' }
      ]
    },
    process: {
      title: '3 bước tăng sức mạnh Website',
      steps: [
        { step: '01', title: 'Cung cấp URL', desc: 'Gửi link website hoặc danh sách từ khóa bạn muốn đẩy traffic.', icon: 'Link' },
        { step: '02', title: 'Cấu hình lộ trình', desc: 'Chọn số lượng traffic hàng ngày và thời gian ở lại trang mong muốn.', icon: 'Sliders' },
        { step: '03', title: 'Theo dõi chỉ số', desc: 'Kiểm tra traffic đổ về trực tiếp trên Google Analytics của bạn.', icon: 'LineChart' }
      ]
    },
    testimonials: {
      title: 'Hiệu quả đo lường được',
      cases: [
        { customerName: 'Giám đốc Marketing Cty BĐS', before: 'Từ khóa ở trang 5 Google', after: 'Lên Top 3 sau 1 tháng', result: 'Tự động có 20-30 lead/ngày', testimonial: 'Traffic của 360TuongTac rất chất lượng, hiển thị rõ trong Analytics nên mình rất yên tâm chạy cho các dự án quan trọng.' }
      ]
    },
    faq: {
      title: 'Hỏi đáp về Traffic Website',
      items: [
        { question: 'Traffic này có bị Google phạt không?', answer: 'Không. Chúng tôi cung cấp người dùng thật từ hệ thống site vệ tinh, không dùng bot bẩn nên hoàn toàn an toàn cho SEO.' },
        { question: 'Có ảnh hưởng đến Google Adsense không?', answer: 'Traffic của chúng tôi an toàn cho Adsense. Tuy nhiên, nếu website của bạn mới, bạn nên tăng từ từ để đảm bảo tính tự nhiên nhất.' },
        { question: 'Tôi có thể xem traffic ở đâu?', answer: 'Bạn xem trực tiếp tại Google Analytics GA4 hoặc mục Dashboard của Google Search Console.' },
        { question: 'Traffic đến từ quốc gia nào?', answer: 'Tùy chọn. Chúng tôi có nguồn Traffic Việt Nam 100% hoặc Traffic quốc tế tùy vào thị trường mục tiêu của bạn.' },
        { question: 'Traffic Search là gì?', answer: 'Là loại traffic mà người dùng gõ từ khóa của bạn lên Google rồi mới click vào web. Đây là loại traffic tốt nhất cho SEO.' },
        { question: 'Thời gian ở lại trang là bao lâu?', answer: 'Trung bình từ 60-120 giây tùy vào gói bạn chọn, đảm bảo tỉ lệ thoát trang thấp.' },
        { question: 'Tôi có được bù nếu traffic không đủ không?', answer: 'Hệ thống tự động bù đủ số lượng visitor hàng ngày theo đúng gói bạn đã mua.' },
        { question: 'Nạp tiền vào website như thế nào?', answer: 'Bạn có thể nạp tiền tự động qua Ngân hàng hoặc ví MoMo ngay trên trang 360TuongTac.' }
      ]
    }
  }
};

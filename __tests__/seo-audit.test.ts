import { auditBlogSEO, SEOScore } from '@/lib/admin/seo-audit';

describe('SEO Audit Core Library', () => {
  describe('auditBlogSEO', () => {
    it('nên đánh giá tổng thể bài blog và trả về SEOScore', () => {
      const mockPost = {
        id: '1',
        title: 'Hướng dẫn tối ưu hóa SEO cho bài viết trên nền tảng Next.js',
        slug: 'huong-dan-toi-uu-hoa-seo-cho-bai-viet-nextjs',
        excerpt: 'Đây là một đoạn tóm tắt khá dài đủ 120 ký tự để SEO đánh giá tốt. Bài viết sẽ hướng dẫn bạn các bước chi tiết nhất từ A-Z.',
        content: 'Nội dung ngắn', // Nội dung ngắn sẽ bị trừ điểm (critical)
        category: 'Kỹ thuật',
        tags: ['SEO', 'Next.js', 'React'],
        date: '2026-05-12',
        imageUrl: '/images/test.jpg',
        imageAlt: 'Test image',
        author: 'Admin',
        metaTitle: 'Hướng dẫn tối ưu SEO | Blog',
        metaDescription: 'Đây là một đoạn tóm tắt khá dài đủ 120 ký tự để SEO đánh giá tốt. Bài viết sẽ hướng dẫn bạn các bước chi tiết nhất từ A-Z.'
      };

      const score: SEOScore = auditBlogSEO(mockPost);
      
      expect(score).toBeDefined();
      expect(score.overall).toBeLessThan(100); 
      expect(score.issues.length).toBeGreaterThan(0);
      
      // Kiểm tra có lỗi content ngắn không
      const contentIssue = score.issues.find(i => i.category === 'content' && i.severity === 'critical');
      expect(contentIssue).toBeDefined();
    });

    it('nên có điểm số tốt hơn khi bài viết chuẩn SEO', () => {
      const goodPost = {
        id: '2',
        title: 'Hướng dẫn chi tiết cách tăng tương tác trên TikTok Shop hiệu quả năm 2026',
        slug: 'cach-tang-tuong-tac-tiktok-hieu-qua',
        excerpt: 'Hướng dẫn chi tiết cách tăng tương tác trên TikTok Shop hiệu quả năm 2026. Khám phá ngay các mẹo giúp bạn bùng nổ doanh số bán hàng.',
        content: '# Tiêu đề 1\n\nĐoạn văn 1 dài đủ 1500 ký tự... '.repeat(100) + '\n\n- Điểm 1\n- Điểm 2', // Dài và có markdown
        category: 'TikTok',
        tags: ['TikTok', 'Marketing', 'Sales'],
        date: '2026-05-12',
        imageUrl: '/images/test.jpg',
        imageAlt: 'Mô tả hình ảnh chi tiết và chuẩn SEO trên 15 ký tự',
        author: 'Admin',
        metaTitle: 'Cách tăng tương tác TikTok Shop 2026',
        metaDescription: 'Hướng dẫn chi tiết cách tăng tương tác trên TikTok Shop hiệu quả năm 2026. Khám phá ngay các mẹo giúp bạn bùng nổ doanh số bán hàng.'
      };

      const score: SEOScore = auditBlogSEO(goodPost);
      
      expect(score).toBeDefined();
      expect(score.overall).toBeGreaterThan(70); // Bài tốt sẽ có điểm cao
    });
  });
});


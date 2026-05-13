'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/ui/ImageUploader';
import ContentPreviewModal from '@/components/ui/ContentPreviewModal';

export default function NewBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Thuật toán',
    tags: '',
    author: '360TuongTac Team',
    date: new Date().toLocaleDateString('vi-VN'),
    featuredImage: '',
    alt: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [seoScore, setSeoScore] = useState(0);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = ['Thuật toán', 'Seeding', 'TikTok Shop', 'Case Study'];

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    
    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
    
    // Calculate SEO score
    calculateSEOScore({ ...formData, title, slug });
  };

  const calculateSEOScore = (data: typeof formData) => {
    const issues: string[] = [];
    let score = 100;

    // Title length (50-70 chars)
    if (data.title.length < 50) {
      score -= 15;
      issues.push('⚠️ Title nên có 50-70 ký tự');
    } else if (data.title.length > 70) {
      score -= 10;
      issues.push('⚠️ Title quá dài (max 70 ký tự)');
    }

    // Excerpt length (120-160 chars)
    if (data.excerpt.length < 120) {
      score -= 15;
      issues.push('⚠️ Excerpt nên có 120-160 ký tự');
    } else if (data.excerpt.length > 160) {
      score -= 10;
      issues.push('⚠️ Excerpt quá dài (max 160 ký tự)');
    }

    // Content length (min 1500 chars)
    if (data.content.length < 1500) {
      score -= 20;
      issues.push('⚠️ Content nên có ít nhất 1500 ký tự');
    }

    // Tags
    if (data.tags.split(',').filter(t => t.trim()).length < 3) {
      score -= 10;
      issues.push('️ Nên có ít nhất 3 tags');
    }

    // Image alt text
    if (data.alt.length < 15) {
      score -= 10;
      issues.push('⚠️ Alt text nên có ít nhất 15 ký tự');
    }

    // Featured image
    if (!data.featuredImage) {
      score -= 10;
      issues.push('⚠️ Nên thêm featured image');
    }

    setSeoScore(Math.max(0, score));
    setSeoIssues(issues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (seoScore < 50) {
      if (!confirm(`SEO Score chỉ ${seoScore}/100. Bạn có muốn tiếp tục không?`)) {
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/blog/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()),
          author: formData.author,
          date: formData.date,
          imageUrl: formData.featuredImage,
          imageAlt: formData.alt,
          metaTitle: formData.metaTitle || `${formData.title} | Blog - 360TuongTac`,
          metaDescription: formData.metaDescription || formData.excerpt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save blog post');
      }

      setSuccess(true);
      
      // Redirect to blog list after 1 second
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-1">
              Thêm Blog Post Mới
            </h1>
            <p className="text-[var(--text-secondary)]">
              Tạo bài viết blog mới với SEO optimization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Lưu bài viết
          </button>
        </div>
      </div>

      {/* SEO Score Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            SEO Score
          </h2>
          <div className={`text-3xl font-black ${
            seoScore >= 80 ? 'text-green-500' :
            seoScore >= 60 ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            {seoScore}/100
          </div>
        </div>
        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              seoScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              seoScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{ width: `${seoScore}%` }}
          />
        </div>
        {seoIssues.length > 0 && (
          <div className="mt-4 space-y-2">
            {seoIssues.map((issue, idx) => (
              <p key={idx} className="text-sm text-[var(--text-secondary)]">
                {issue}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-green-500 font-semibold">✅ Bài viết đã được lưu thành công!</p>
          <p className="text-sm text-green-500/80 mt-1">Đang chuyển về danh sách...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-500 font-semibold">❌ Lỗi: {error}</p>
          <p className="text-sm text-red-500/80 mt-1">Vui lòng kiểm tra lại thông tin</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Title * <span className="text-[var(--text-muted)] font-normal">(50-70 ký tự)</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Viết title compelling cho bài viết..."
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {formData.title.length}/70 ký tự
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Slug * <span className="text-[var(--text-muted)] font-normal">(auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors font-mono"
                placeholder="auto-generated-from-title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="DD/MM/YYYY"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Author *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Tên tác giả"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Tags * <span className="text-[var(--text-muted)] font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => {
                  setFormData({ ...formData, tags: e.target.value });
                  calculateSEOScore({ ...formData, tags: e.target.value });
                }}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="tiktok, algorithm, livestream"
                required
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            Nội dung
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Excerpt * <span className="text-[var(--text-muted)] font-normal">(120-160 ký tự)</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => {
                  setFormData({ ...formData, excerpt: e.target.value });
                  calculateSEOScore({ ...formData, excerpt: e.target.value });
                }}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none"
                rows={3}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {formData.excerpt.length}/160 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Content * <span className="text-[var(--text-muted)] font-normal">(min 1500 ký tự)</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value });
                  calculateSEOScore({ ...formData, content: e.target.value });
                }}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={15}
                placeholder="Viết nội dung bài viết ở đây (support Markdown)..."
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {formData.content.length} ký tự
              </p>
            </div>
          </div>
        </div>

        {/* SEO & Images */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            SEO & Images
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Meta Title <span className="text-[var(--text-muted)] font-normal">(auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle || `${formData.title} | 360TuongTac`}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Auto-generated from title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Meta Description <span className="text-[var(--text-muted)] font-normal">(auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.metaDescription || formData.excerpt.substring(0, 155)}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Auto-generated from excerpt"
              />
            </div>

            <div>
              <ImageUploader
                value={formData.featuredImage}
                onChange={(url) => {
                  setFormData({ ...formData, featuredImage: url });
                  calculateSEOScore({ ...formData, featuredImage: url });
                }}
                label="Featured Image *"
                helpText="Kéo thả ảnh, tải lên từ máy, hoặc tạo bằng AI"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Alt Text * <span className="text-[var(--text-muted)] font-normal">(min 15 ký tự)</span>
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => {
                  setFormData({ ...formData, alt: e.target.value });
                  calculateSEOScore({ ...formData, alt: e.target.value });
                }}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Mô tả hình ảnh chi tiết..."
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu bài viết
              </>
            )}
          </button>
        </div>
      </form>

      <ContentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={{
          title: formData.title || 'Chưa có tiêu đề',
          excerpt: formData.excerpt,
          content: formData.content || 'Chưa có nội dung',
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()),
          imageUrl: formData.featuredImage,
          seoScore: seoScore
        }}
        mode="preview"
      />
    </div>
  );
}

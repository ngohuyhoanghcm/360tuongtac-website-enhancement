'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/constants/blog';

export default function EditBlogPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    // Find the blog post by slug
    const post = BLOG_POSTS.find(p => p.slug === slug);
    if (post) {
      setFormData(post);
    }
    setLoading(false);
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement save to file
    alert('✅ Bài viết đã được cập nhật!\n\nTính năng save to file sẽ được implement trong Phase 2.');
    
    // Redirect to blog list
    router.push('/admin/blog');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF2E63] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Không tìm thấy bài viết
        </h2>
        <Link
          href="/admin/blog"
          className="text-[#FF2E63] hover:underline"
        >
          ← Quay lại danh sách blog
        </Link>
      </div>
    );
  }

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
              Chỉnh sửa Blog Post
            </h1>
            <p className="text-[var(--text-secondary)]">
              {formData.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Eye size={18} />
            Xem bài viết
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Edit Form (Similar to new post form) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
              rows={15}
            />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-blue-500 mb-2">ℹ️ Phase 2 Feature</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Form chỉnh sửa đầy đủ với validation, SEO score, và auto-save sẽ được implement trong Phase 2.
          Hiện tại bạn có thể xem thông tin bài viết và structure của form.
        </p>
      </div>
    </div>
  );
}

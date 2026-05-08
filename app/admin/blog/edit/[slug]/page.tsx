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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Find the blog post by slug
    const post = BLOG_POSTS.find(p => p.slug === slug);
    if (post) {
      setFormData(post);
    }
    setLoading(false);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
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
          id: formData.id,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || '',
          content: formData.content,
          category: formData.category || '',
          tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map((t: string) => t.trim()),
          author: formData.author || '360TuongTac Team',
          date: formData.date || new Date().toISOString().split('T')[0],
          imageUrl: formData.imageUrl || formData.featuredImage || '/images/blog/default.jpg',
          imageAlt: formData.imageAlt || formData.alt || formData.title,
          metaTitle: formData.metaTitle || `${formData.title} | Blog - 360TuongTac`,
          metaDescription: formData.metaDescription || formData.excerpt || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog post');
      }

      setSuccess(true);
      
      // Redirect to blog list after 1 second
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
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
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-green-500 font-semibold">✅ Bài viết đã được cập nhật thành công!</p>
          <p className="text-sm text-green-500/80 mt-1">Đang chuyển về danh sách...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-500 font-semibold">❌ Lỗi: {error}</p>
          <p className="text-sm text-red-500/80 mt-1">Vui lòng kiểm tra lại thông tin</p>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
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
      </form>


    </div>
  );
}

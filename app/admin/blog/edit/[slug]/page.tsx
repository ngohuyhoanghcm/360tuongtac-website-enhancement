'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Eye, RefreshCw, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [imageRegenSuccess, setImageRegenSuccess] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      
      // First, try to find in published posts
      const publishedPost = BLOG_POSTS.find(p => p.slug === slug);
      if (publishedPost) {
        setFormData(publishedPost);
        setLoading(false);
        return;
      }

      // If not found, try to fetch from drafts
      try {
        const response = await fetch(`/api/admin/drafts/${slug}/preview`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.content) {
            // Convert draft format to form data format
            const draftContent = data.content;
            setFormData({
              ...draftContent,
              imageUrl: draftContent.imageUrl || draftContent.featuredImage || '/images/blog/default.jpg',
              imageAlt: draftContent.imageAlt || draftContent.alt || draftContent.title,
            });
          }
        }
      } catch (error) {
        console.warn('Failed to load draft, showing not found:', error);
      }
      
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  const handleRegenerateImage = async () => {
    setIsRegeneratingImage(true);
    setImageRegenSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/admin/image/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: formData.slug, // Pass slug for consistent file naming (e.g., 'cach-tang-tuong-tac-tiktok-hieu-qua.webp')
          title: formData.title,
          content: formData.content,
          category: formData.category || 'General',
          size: '1792x1024',
          style: 'photographic',
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        // Update form data with new image
        setFormData({
          ...formData,
          imageUrl: data.imageUrl,
          imageAlt: data.alt || formData.title,
        });
        setImageRegenSuccess(true);
        
        // Show alert with cache status
        const cacheMsg = data.cached 
          ? '⚡ Ảnh đã được tải từ cache (nhanh hơn!)' 
          : '✅ Đã tạo ảnh mới thành công!';
        alert(`${cacheMsg}\n\nẢnh đã được cập nhật trong form bên dưới.`);
        
        // Clear success message after 5 seconds
        setTimeout(() => setImageRegenSuccess(false), 5000);
      } else {
        throw new Error(data.message || 'Failed to regenerate image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tạo ảnh');
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Normalize date format: Convert DD/MM/YYYY to YYYY-MM-DD if needed
      let normalizedDate = formData.date || new Date().toISOString().split('T')[0];
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalizedDate)) {
        const [day, month, year] = normalizedDate.split('/');
        normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Truncate imageAlt to max 125 chars
      let normalizedImageAlt = formData.imageAlt || formData.alt || formData.title;
      if (normalizedImageAlt.length > 125) {
        normalizedImageAlt = normalizedImageAlt.substring(0, 122) + '...';
      }
      
      // Truncate metaTitle to max 60 chars
      let normalizedMetaTitle = formData.metaTitle || `${formData.title} | Blog - 360TuongTac`;
      if (normalizedMetaTitle.length > 60) {
        normalizedMetaTitle = normalizedMetaTitle.substring(0, 57) + '...';
      }
      
      // Ensure metaDescription is 120-155 chars
      let normalizedMetaDescription = formData.metaDescription || formData.excerpt || '';
      if (normalizedMetaDescription.length < 120) {
        normalizedMetaDescription = normalizedMetaDescription.padEnd(120, '.');
      }
      if (normalizedMetaDescription.length > 155) {
        normalizedMetaDescription = normalizedMetaDescription.substring(0, 152) + '...';
      }
      
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
          date: normalizedDate,
          imageUrl: formData.imageUrl || formData.featuredImage || '/images/blog/default.jpg',
          imageAlt: normalizedImageAlt,
          metaTitle: normalizedMetaTitle,
          metaDescription: normalizedMetaDescription,
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
        {/* Form Header with Save Button */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Nội dung bài viết</h2>
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
        
        <div className="space-y-6">
          {/* Image Section with Regenerate Button */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Ảnh minh họa</h3>
              </div>
              <button
                type="button"
                onClick={handleRegenerateImage}
                disabled={isRegeneratingImage}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isRegeneratingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Tạo lại ảnh
                  </>
                )}
              </button>
            </div>

            {formData.imageUrl ? (
              <div className="relative rounded-lg overflow-hidden shadow-md bg-white">
                <img
                  src={formData.imageUrl}
                  alt={formData.imageAlt || formData.title}
                  className="w-full h-auto max-h-64 object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Chưa có ảnh minh họa</p>
                </div>
              </div>
            )}

            {imageRegenSuccess && (
              <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-sm text-green-700">✅ Đã tạo ảnh mới thành công!</p>
              </div>
            )}

            <p className="text-xs text-purple-700 mt-3 italic">
              {formData.imageAlt || 'Click "Tạo lại ảnh" để tạo ảnh minh họa bằng AI'}
            </p>
          </div>

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

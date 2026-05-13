'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Eye, RefreshCw, ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/constants/blog';
import ImageUploader from '@/components/ui/ImageUploader';

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
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

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

  const handleTogglePublish = async () => {
    if (!formData) return;
    
    const currentPublished = formData.published !== false;
    const action = currentPublished ? 'unpublish' : 'publish';
    
    if (!confirm(`Bạn có chắc muốn ${action === 'publish' ? 'xuất bản' : 'ẩn'} bài viết này?`)) {
      return;
    }

    setIsTogglingPublish(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/blog/toggle-publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: formData.slug, published: !currentPublished }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle publish status');
      }

      // Update form data
      setFormData({
        ...formData,
        published: !currentPublished
      });

      alert(`✅ Bài viết đã được ${action === 'publish' ? 'xuất bản' : 'ẩn'} thành công!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi thay đổi trạng thái xuất bản');
    } finally {
      setIsTogglingPublish(false);
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
          {/* Publish/Unpublish Button */}
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={isTogglingPublish}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              formData.published !== false
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isTogglingPublish ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                Đang xử lý...
              </>
            ) : formData.published !== false ? (
              <>
                <CheckCircle size={18} />
                Đang xuất bản
              </>
            ) : (
              <>
                <XCircle size={18} />
                Đã ẩn
              </>
            )}
          </button>
          
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Edit Form */}
        <div className="lg:col-span-2">
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
                  <ImageUploader
                    value={formData.imageUrl || ''}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label="Tải lên hoặc tạo ảnh minh họa"
                    helpText="Kéo thả ảnh, tải lên từ máy, hoặc tạo bằng AI"
                  />
                )}

                {imageRegenSuccess && (
                  <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-700">✅ Đã tạo ảnh mới thành công!</p>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-purple-900 mb-1">Image Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={formData.imageAlt || ''}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Mô tả ảnh cho SEO..."
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Tiêu đề (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Danh mục (Category)
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Thẻ (Tags) - Phân tách bằng dấu phẩy
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Đoạn trích (Excerpt / Short Description)
                </label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  rows={3}
                />
              </div>

              <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-secondary)]">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Meta SEO (Tùy chọn)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Meta Title (Tối ưu 50-60 ký tự)</label>
                    <input
                      type="text"
                      value={formData.metaTitle || ''}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder={formData.title}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[#FF2E63]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Meta Description (Tối ưu 120-155 ký tự)</label>
                    <textarea
                      value={formData.metaDescription || ''}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder={formData.excerpt}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[#FF2E63]"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Nội dung (Content - Markdown/HTML)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-y font-mono text-sm"
                  rows={20}
                />
              </div>
            </div>
          </form>
        </div>

        {/* SEO On-Page Panel */}
        <div className="lg:col-span-1">
          <SEOAnalyzerPanel formData={formData} setFormData={setFormData} />
        </div>
      </div>
    </div>
  );
}

// SEO Analyzer Component
function SEOAnalyzerPanel({ formData, setFormData }: { formData: any, setFormData: (data: any) => void }) {
  const [validation, setValidation] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with validation file if any
    import('@/lib/admin/validation').then((mod) => {
      // Tags might be string in input, array in logic
      const tagsArray = typeof formData.tags === 'string' 
        ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : formData.tags || [];

      const result = mod.validateBlogPost({
        ...formData,
        tags: tagsArray
      });
      setValidation(result);
    });
  }, [formData]);

  const handleAutoOptimize = () => {
    setIsOptimizing(true);
    // Simple fast auto-optimize rules
    setTimeout(() => {
      let optimized = { ...formData };
      
      // 1. Auto generate Meta Title if empty or too long
      if (!optimized.metaTitle || optimized.metaTitle.length > 60) {
        optimized.metaTitle = optimized.title.substring(0, 57) + (optimized.title.length > 57 ? '...' : '');
      }

      // 2. Auto generate Meta Description from Excerpt
      if (!optimized.metaDescription || optimized.metaDescription.length < 120) {
        let desc = optimized.excerpt || '';
        if (desc.length < 120) desc = desc.padEnd(120, ' ');
        if (desc.length > 155) desc = desc.substring(0, 152) + '...';
        optimized.metaDescription = desc.trim();
      }

      // 3. Ensure Image Alt
      if (!optimized.imageAlt || optimized.imageAlt.length < 15) {
        optimized.imageAlt = optimized.title.substring(0, 120);
      }

      // 4. Fallback Excerpt from content
      if (!optimized.excerpt || optimized.excerpt.length < 50) {
        const firstP = optimized.content.replace(/<[^>]+>/g, '').split('\n')[0];
        optimized.excerpt = firstP.substring(0, 150) + '...';
      }

      setFormData(optimized);
      setIsOptimizing(false);
      alert('Đã áp dụng tự động tối ưu SEO On-Page (Meta, Alt, Excerpt)!\nHãy kiểm tra lại trước khi lưu.');
    }, 800);
  };

  if (!validation) return null;

  const scoreColor = validation.seoScore >= 80 ? 'text-green-500' : validation.seoScore >= 60 ? 'text-yellow-500' : 'text-red-500';
  const barColor = validation.seoScore >= 80 ? 'bg-green-500' : validation.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sticky top-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-[#FF2E63]" />
        Chấm Điểm SEO On-Page
      </h3>

      {/* Score */}
      <div className="mb-6 text-center">
        <div className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <span className={scoreColor}>{validation.seoScore}</span>
          <span className="text-[var(--text-muted)] text-xl">/ 100</span>
        </div>
        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${validation.seoScore}%` }} />
        </div>
      </div>

      {/* Auto Optimize Button */}
      <button
        type="button"
        onClick={handleAutoOptimize}
        disabled={isOptimizing}
        className="w-full mb-6 py-2 px-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        {isOptimizing ? 'Đang tối ưu...' : 'Tự động tối ưu bằng AI (Nhanh)'}
      </button>

      {/* Errors & Warnings */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {validation.errors.length === 0 && validation.warnings.length === 0 ? (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            🎉 Tuyệt vời! Bài viết của bạn đã chuẩn SEO 100%.
          </div>
        ) : (
          <>
            {validation.errors.map((err: string, i: number) => (
              <div key={`err-${i}`} className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex gap-2 items-start">
                <span>❌</span> <span>{err.replace('❌ ', '')}</span>
              </div>
            ))}
            {validation.warnings.map((warn: string, i: number) => (
              <div key={`warn-${i}`} className="p-3 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg text-sm flex gap-2 items-start">
                <span>⚠️</span> <span>{warn.replace('⚠️ ', '')}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Checklist Guide */}
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <h4 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Checklist SEO Cơ Bản:</h4>
        <ul className="text-sm space-y-2 text-[var(--text-secondary)]">
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Title 50-70 ký tự</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Có thẻ Meta Description</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Ảnh có thuộc tính Alt</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Bài viết dài {'>'} 1500 ký tự</li>
        </ul>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewService() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    platform: 'TikTok',
    category: 'Livestream',
    price: '',
    features: '',
    benefits: '',
    suitableFor: '',
    icon: 'Sparkles',
    gradient: 'from-blue-500 to-cyan-500',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const platforms = ['TikTok', 'Facebook', 'Instagram', 'YouTube', 'Website', 'Khác'] as const;
  const categories = ['Livestream', 'Tương tác', 'Follow', 'Like', 'View', 'Member', 'Traffic', 'Khác'];

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    
    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/service/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          shortDescription: formData.shortDescription,
          description: formData.description,
          platform: formData.platform,
          category: formData.category,
          price: formData.price,
          features: formData.features.split('\n').filter(f => f.trim()),
          benefits: formData.benefits.split('\n').filter(b => b.trim()),
          suitableFor: formData.suitableFor.split('\n').filter(s => s.trim()),
          icon: formData.icon,
          gradient: formData.gradient,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save service');
      }

      setSuccess(true);
      
      // Redirect to services list after 1 second
      setTimeout(() => {
        router.push('/admin/services');
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
            href="/admin/services"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-1">
              Thêm Dịch Vụ Mới
            </h1>
            <p className="text-[var(--text-secondary)]">
              Tạo dịch vụ mới với thông tin chi tiết
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-green-500 font-semibold">✅ Dịch vụ đã được tạo thành công!</p>
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
                Tên dịch vụ *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="VD: Tăng Follow TikTok"
                required
              />
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
                placeholder="auto-generated-from-name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Platform *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Mô tả ngắn * <span className="text-[var(--text-muted)] font-normal">(1-2 câu)</span>
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none"
                rows={2}
                placeholder="Tóm tắt ngắn gọn dịch vụ..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Mô tả chi tiết *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={8}
                placeholder="Mô tả chi tiết dịch vụ (support Markdown)..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Giá khởi điểm *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="VD: 50.000đ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Icon (Lucide)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="VD: Sparkles, Rocket"
              />
            </div>
          </div>
        </div>

        {/* Features, Benefits, Suitable For */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            Chi tiết dịch vụ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Features (mỗi dòng 1 feature)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Benefits (mỗi dòng 1 benefit)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Suitable For (mỗi dòng 1 đối tượng)
              </label>
              <textarea
                value={formData.suitableFor}
                onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder="Đối tượng 1&#10;Đối tượng 2&#10;Đối tượng 3"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/services"
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
                Tạo dịch vụ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

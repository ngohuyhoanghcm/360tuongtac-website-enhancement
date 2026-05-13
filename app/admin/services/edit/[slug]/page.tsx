'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/services';

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Features/Benefits/SuitableFor as multiline text for editing
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [suitableForText, setSuitableForText] = useState('');

  const platforms = ['TikTok', 'Facebook', 'Instagram', 'YouTube', 'Website', 'Khác'] as const;
  const categories = ['Livestream', 'Tương tác', 'Follow', 'Like', 'View', 'Member', 'Traffic', 'Shop', 'Cộng đồng', 'Website', 'Khác'];

  useEffect(() => {
    // Find the service by slug
    const found = SERVICES_DATA.find(s => s.slug === slug);
    if (found) {
      setService(found);
      // Initialize text fields from arrays (if they exist from SERVICES_LIST detail data)
      setFeaturesText((found as any).features?.join('\n') || '');
      setBenefitsText((found as any).benefits?.join('\n') || '');
      setSuitableForText((found as any).suitableFor?.join('\n') || '');
    }
    setLoading(false);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Parse features/benefits/suitableFor from text
      const features = featuresText.split('\n').filter(f => f.trim());
      const benefits = benefitsText.split('\n').filter(b => b.trim());
      const suitableFor = suitableForText.split('\n').filter(s => s.trim());

      // Auto-generate meta title if not set
      let metaTitle = service.metaTitle || `${service.title} | Dịch vụ - 360TuongTac`;
      if (metaTitle.length > 60) {
        metaTitle = metaTitle.substring(0, 57) + '...';
      }
      
      // Auto-generate meta description
      let metaDescription = service.metaDescription || service.description?.substring(0, 200) || '';
      if (metaDescription.length < 120) {
        metaDescription = metaDescription.padEnd(120, '.');
      }
      if (metaDescription.length > 155) {
        metaDescription = metaDescription.substring(0, 152) + '...';
      }

      // Auto-generate shortDescription
      let shortDescription = service.shortDescription || service.description?.substring(0, 150) || '';

      const response = await fetch('/api/admin/service/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: service.id,
          name: service.title,
          slug: service.slug,
          shortDescription,
          description: service.description,
          platform: service.platform,
          category: service.category,
          price: service.startingPrice,
          features,
          benefits,
          suitableFor,
          icon: service.icon || 'Sparkles',
          gradient: service.gradient || 'from-blue-500 to-cyan-500',
          metaTitle,
          metaDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update service');
      }

      setSuccess(true);
      
      // Redirect to services list after 1 second
      setTimeout(() => {
        router.push('/admin/services');
      }, 1000);
    } catch (err) {
      console.error('[Service Edit] Error:', err);
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

  if (!service) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Không tìm thấy dịch vụ
        </h2>
        <Link
          href="/admin/services"
          className="text-[#FF2E63] hover:underline"
        >
          ← Quay lại danh sách dịch vụ
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
            href="/admin/services"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-1">
              Chỉnh sửa Dịch vụ
            </h1>
            <p className="text-[var(--text-secondary)]">
              {service.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dich-vu/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Eye size={18} />
            Xem dịch vụ
          </Link>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-green-500 font-semibold">✅ Dịch vụ đã được cập nhật thành công!</p>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          {/* Form Header with Save Button */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Thông tin cơ bản</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => setService({ ...service, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Slug <span className="text-[var(--text-muted)] font-normal">(URL path)</span>
                </label>
                <input
                  type="text"
                  value={service.slug}
                  onChange={(e) => setService({ ...service, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Platform *
                </label>
                <select
                  value={service.platform}
                  onChange={(e) => setService({ ...service, platform: e.target.value })}
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
                  value={service.category}
                  onChange={(e) => setService({ ...service, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Mô tả ngắn <span className="text-[var(--text-muted)] font-normal">(1-2 câu)</span>
                </label>
                <textarea
                  value={service.shortDescription || service.description?.substring(0, 150) || ''}
                  onChange={(e) => setService({ ...service, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none"
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn dịch vụ..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Mô tả chi tiết *
                </label>
                <textarea
                  value={service.description}
                  onChange={(e) => setService({ ...service, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                  rows={6}
                  placeholder="Mô tả chi tiết dịch vụ (support Markdown)..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Giá khởi điểm *
                </label>
                <input
                  type="text"
                  value={service.startingPrice}
                  onChange={(e) => setService({ ...service, startingPrice: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  placeholder="VD: 50.000đ"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Icon (Lucide)
                </label>
                <input
                  type="text"
                  value={service.icon || ''}
                  onChange={(e) => setService({ ...service, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                  placeholder="VD: Sparkles, Rocket"
                />
              </div>
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
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder={"Feature 1\nFeature 2\nFeature 3"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Benefits (mỗi dòng 1 benefit)
              </label>
              <textarea
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder={"Benefit 1\nBenefit 2\nBenefit 3"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Suitable For (mỗi dòng 1 đối tượng)
              </label>
              <textarea
                value={suitableForText}
                onChange={(e) => setSuitableForText(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none font-mono"
                rows={6}
                placeholder={"Đối tượng 1\nĐối tượng 2\nĐối tượng 3"}
              />
            </div>
          </div>
        </div>

        {/* SEO Fields */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
            SEO Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Meta Title <span className="text-[var(--text-muted)] font-normal">(max 60 ký tự)</span>
              </label>
              <input
                type="text"
                value={service.metaTitle || `${service.title} | 360TuongTac`}
                onChange={(e) => setService({ ...service, metaTitle: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                placeholder="Auto-generated from title"
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {(service.metaTitle || `${service.title} | 360TuongTac`).length}/60 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Meta Description <span className="text-[var(--text-muted)] font-normal">(120-155 ký tự)</span>
              </label>
              <textarea
                value={service.metaDescription || service.description?.substring(0, 155) || ''}
                onChange={(e) => setService({ ...service, metaDescription: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none"
                rows={3}
                placeholder="Auto-generated from description"
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {(service.metaDescription || service.description?.substring(0, 155) || '').length}/155 ký tự
              </p>
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
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
      </form>
    </div>
  );
}

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

  useEffect(() => {
    // Find the service by slug
    const found = SERVICES_DATA.find(s => s.slug === slug);
    if (found) {
      setService(found);
    }
    setLoading(false);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[Service Edit] Form submitted!');
    console.log('[Service Edit] Service data:', service);
    
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('[Service Edit] Sending API request...');
      
      // Truncate metaTitle to max 60 chars
      let normalizedMetaTitle = service.metaTitle || `${service.title} | Dịch vụ - 360TuongTac`;
      if (normalizedMetaTitle.length > 60) {
        normalizedMetaTitle = normalizedMetaTitle.substring(0, 57) + '...';
      }
      
      // Ensure metaDescription is 120-155 chars
      let normalizedMetaDescription = service.metaDescription || service.description?.substring(0, 200) || '';
      if (normalizedMetaDescription.length < 120) {
        normalizedMetaDescription = normalizedMetaDescription.padEnd(120, '.');
      }
      if (normalizedMetaDescription.length > 155) {
        normalizedMetaDescription = normalizedMetaDescription.substring(0, 152) + '...';
      }
      
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
          shortDescription: service.description?.substring(0, 200) || '',
          description: service.description,
          platform: service.platform,
          category: service.category,
          price: service.startingPrice,
          features: service.features || [],
          benefits: service.benefits || [],
          suitableFor: service.suitableFor || [],
          icon: service.icon || 'Sparkles',
          gradient: service.gradient || 'from-blue-500 to-cyan-500',
          metaTitle: normalizedMetaTitle,
          metaDescription: normalizedMetaDescription,
        }),
      });

      console.log('[Service Edit] Response status:', response.status);
      const data = await response.json();
      console.log('[Service Edit] Response data:', data);

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
      <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        {/* Form Header with Save Button */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Thông tin dịch vụ</h2>
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
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Title
              </label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => setService({ ...service, title: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Platform
              </label>
              <input
                type="text"
                value={service.platform}
                onChange={(e) => setService({ ...service, platform: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Description
              </label>
              <textarea
                value={service.description}
                onChange={(e) => setService({ ...service, description: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Starting Price
              </label>
              <input
                type="text"
                value={service.startingPrice}
                onChange={(e) => setService({ ...service, startingPrice: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Category
              </label>
              <input
                type="text"
                value={service.category}
                onChange={(e) => setService({ ...service, category: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
              />
            </div>
          </div>
        </div>
      </form>


    </div>
  );
}

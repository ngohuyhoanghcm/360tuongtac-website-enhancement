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

  useEffect(() => {
    // Find the service by slug
    const found = SERVICES_DATA.find(s => s.slug === slug);
    if (found) {
      setService(found);
    }
    setLoading(false);
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement save to file
    alert('✅ Dịch vụ đã được cập nhật!\n\nTính năng save to file sẽ được implement trong Phase 2.');
    
    // Redirect to services list
    router.push('/admin/services');
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
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
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
      </div>

      {/* Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-blue-500 mb-2">ℹ️ Phase 2 Feature</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Form chỉnh sửa đầy đủ với pricing table editor, FAQ editor, và validation sẽ được implement trong Phase 2.
        </p>
      </div>
    </div>
  );
}

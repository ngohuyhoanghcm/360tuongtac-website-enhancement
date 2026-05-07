'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Edit, Eye, Filter } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';

export default function ServicesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Tất cả');

  const platforms = ['Tất cả', ...Array.from(new Set(SERVICES_DATA.map(s => s.platform)))];

  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'Tất cả' || service.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-2">
          Dịch vụ
        </h1>
        <p className="text-[var(--text-secondary)]">
          Quản lý tất cả dịch vụ ({SERVICES_DATA.length} dịch vụ)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[var(--text-muted)]" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#FF2E63]/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                  {service.description}
                </p>
              </div>
              {service.popular && (
                <span className="px-2 py-1 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white text-xs font-bold rounded-full whitespace-nowrap">
                  Popular
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500">
                {service.platform}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {service.category}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-lg font-black text-[#FF8C00]">
                {service.startingPrice}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dich-vu/${service.slug}`}
                  target="_blank"
                  className="p-2 text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                  title="Xem dịch vụ"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/admin/services/edit/${service.slug}`}
                  className="p-2 text-[var(--text-muted)] hover:text-[#FF8C00] transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
          <p className="text-[var(--text-muted)] text-lg">
            Không tìm thấy dịch vụ nào
          </p>
        </div>
      )}

      {/* Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-blue-500 mb-2">ℹ️ Phase 2 Feature</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Tính năng thêm dịch vụ mới sẽ được implement trong Phase 2. Hiện tại bạn có thể xem và chỉnh sửa các dịch vụ hiện có.
        </p>
      </div>
    </div>
  );
}

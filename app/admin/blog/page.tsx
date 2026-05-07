'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/constants/blog';

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-2">
            Blog Posts
          </h1>
          <p className="text-[var(--text-secondary)]">
            Quản lý tất cả bài viết blog ({BLOG_POSTS.length} bài)
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Thêm bài mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[var(--text-muted)]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="text-left px-6 py-4 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Ngày
                </th>
                <th className="text-left px-6 py-4 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="text-right px-6 py-4 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        /blog/{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {post.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: '85%' }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-500">
                        85
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                        title="Xem bài viết"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.slug}`}
                        className="p-2 text-[var(--text-muted)] hover:text-[#FF8C00] transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        title="Xóa"
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                            // TODO: Implement delete
                            alert('Tính năng xóa sẽ được implement trong Phase 2');
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] text-lg">
              Không tìm thấy bài viết nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

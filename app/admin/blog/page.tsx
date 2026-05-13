'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Eye, Filter, CheckCircle, XCircle, EyeOff } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/constants/blog';

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [seoScores, setSeoScores] = useState<Record<string, number>>({});
  const [loadingScores, setLoadingScores] = useState(true);

  // Fetch SEO scores from API
  useEffect(() => {
    const fetchSeoScores = async () => {
      try {
        const response = await fetch('/api/admin/seo-audit', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Map slug to score
          const scores: Record<string, number> = {};
          data.blogPosts?.forEach((post: any) => {
            scores[post.slug] = post.score.overall;
          });
          setSeoScores(scores);
        }
      } catch (error) {
        console.error('Error fetching SEO scores:', error);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchSeoScores();
  }, []);

  const categories = ['Tất cả', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    
    // Filter by publish status
    const isPublished = post.published !== false;
    const matchesPublishStatus = showUnpublished ? true : isPublished;
    
    return matchesSearch && matchesCategory && matchesPublishStatus;
  });

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
      return;
    }

    setDeletingSlug(slug);

    try {
      const response = await fetch('/api/admin/blog/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Lỗi: ${data.message}`);
        return;
      }

      alert('✅ Bài viết đã được xóa thành công!');
      
      // Reload page to refresh the list
      window.location.reload();
    } catch (error) {
      alert('❌ Đã có lỗi xảy ra khi xóa bài viết');
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleTogglePublish = async (slug: string, currentPublished: boolean) => {
    const action = currentPublished ? 'unpublish' : 'publish';
    if (!confirm(`Bạn có chắc muốn ${action === 'publish' ? 'xuất bản' : 'ẩn'} bài viết này?`)) {
      return;
    }

    setTogglingSlug(slug);

    try {
      const response = await fetch('/api/admin/blog/toggle-publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, published: !currentPublished }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Lỗi: ${data.message}`);
        return;
      }

      alert(`✅ Bài viết đã được ${action === 'publish' ? 'xuất bản' : 'ẩn'} thành công!`);
      
      // Update local state instead of full reload for better UX
      const updatedPosts = BLOG_POSTS.map(post => 
        post.slug === slug ? { ...post, published: !currentPublished } : post
      );
      
      // For now, reload to ensure consistency
      window.location.reload();
    } catch (error) {
      alert('❌ Đã có lỗi xảy ra khi thay đổi trạng thái xuất bản');
    } finally {
      setTogglingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-2">
            Blog Posts
          </h1>
          <p className="text-[var(--text-secondary)]">
            Quản lý tất cả bài viết blog
            <span className="ml-2 inline-flex items-center gap-2">
              <span className="text-green-600 font-semibold">
                {BLOG_POSTS.filter(p => p.published !== false).length} xuất bản
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-gray-500 font-semibold">
                {BLOG_POSTS.filter(p => p.published === false).length} đã ẩn
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {BLOG_POSTS.length} tổng
              </span>
            </span>
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
          {/* Publish Status Filter */}
          <button
            onClick={() => setShowUnpublished(!showUnpublished)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-semibold transition-colors ${
              showUnpublished
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {showUnpublished ? (
              <>
                <Eye size={18} />
                Tất cả bài viết
              </>
            ) : (
              <>
                <EyeOff size={18} />
                Chỉ bài đã xuất bản
              </>
            )}
          </button>
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
              {filteredPosts.map((post) => {
                const isPublished = post.published !== false;
                return (
                <tr key={post.id} className={`hover:bg-[var(--bg-secondary)] transition-colors ${
                  !isPublished ? 'opacity-60' : ''
                }`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {post.title}
                        </h3>
                        {!isPublished && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500/10 text-gray-500">
                            Đã ẩn
                          </span>
                        )}
                      </div>
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
                      {loadingScores ? (
                        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full"></div>
                      ) : (
                        <>
                          {(() => {
                            const score = seoScores[post.slug] || 0;
                            const scoreColor = score >= 80 ? 'text-green-500' :
                                              score >= 70 ? 'text-yellow-500' :
                                              'text-red-500';
                            const barColor = score >= 80 ? 'from-green-500 to-emerald-500' :
                                            score >= 70 ? 'from-yellow-500 to-orange-500' :
                                            'from-red-500 to-pink-500';
                            
                            return (
                              <>
                                <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-semibold ${scoreColor}`}>
                                  {score}
                                </span>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish/Unpublish Toggle */}
                      <button
                        className={`p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          post.published !== false 
                            ? 'text-green-500 hover:text-green-600' 
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                        title={post.published !== false ? 'Đang xuất bản - Click để ẩn' : 'Đã ẩn - Click để xuất bản'}
                        disabled={togglingSlug === post.slug}
                        onClick={() => handleTogglePublish(post.slug, post.published !== false)}
                      >
                        {togglingSlug === post.slug ? (
                          <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                        ) : post.published !== false ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                      </button>
                      
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
                        className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa"
                        disabled={deletingSlug === post.slug}
                        onClick={() => handleDelete(post.slug, post.title)}
                      >
                        {deletingSlug === post.slug ? (
                          <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })}
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

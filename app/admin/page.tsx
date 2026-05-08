'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Settings, TrendingUp, Users, Plus, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default values
        setDashboardData({
          overview: {
            totalBlogPosts: 0,
            totalServices: 0,
            avgSEOScore: 0,
            publishedThisMonth: 0,
          },
          contentActivity: {
            recentPosts: [],
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF2E63] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalPosts = dashboardData?.overview?.totalBlogPosts || 0;
  const totalServices = dashboardData?.overview?.totalServices || 0;
  const avgSEOScore = dashboardData?.overview?.avgSEOScore || 0;
  const recentPosts = dashboardData?.contentActivity?.recentPosts || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Tổng quan hệ thống quản lý nội dung 360TuongTac
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Tổng số
            </span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
            {totalPosts}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Blog Posts
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Settings className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Tổng số
            </span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
            {totalServices}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Dịch vụ
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Trung bình
            </span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
            {avgSEOScore}/100
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            SEO Score
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Tháng này
            </span>
          </div>
          <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
            {dashboardData?.overview?.publishedThisMonth || 0}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Bài mới
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/blog/new"
          className="group bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] rounded-2xl p-6 text-white hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black mb-2">Thêm Blog Post Mới</h3>
              <p className="text-white/80 text-sm">
                Tạo bài viết blog mới với SEO optimization
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#FF2E63]/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">
                Quản lý Dịch vụ
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Chỉnh sửa thông tin dịch vụ và pricing
              </p>
            </div>
            <div className="p-3 bg-[var(--bg-secondary)] rounded-xl group-hover:scale-110 transition-transform">
              <ArrowRight size={24} className="text-[var(--text-primary)]" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            Bài viết gần đây
          </h2>
          <Link
            href="/admin/blog"
            className="text-sm font-semibold text-[#FF2E63] hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post: any) => (
              <div
                key={post.slug}
                className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[var(--text-muted)]">
                      {post.date}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/blog/edit/${post.slug}`}
                  className="ml-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#FF2E63]/30 transition-colors whitespace-nowrap"
                >
                  Chỉnh sửa
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)]">Chưa có bài viết nào</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">
          💡 Mẹo SEO
        </h2>
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Meta title nên có 50-60 ký tự để hiển thị tốt trên Google</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Meta description nên có 120-155 ký tự</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Thêm ít nhất 1-3 related services để tăng internal linking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Image alt text nên mô tả chi tiết (tối thiểu 15 ký tự)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface SEOIssue {
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  recommendation: string;
}

interface SEOScore {
  overall: number;
  title: number;
  meta: number;
  content: number;
  images: number;
  technical: number;
  schema: number;
  issues: SEOIssue[];
}

export default function SEOAuditPage() {
  const [auditReport, setAuditReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  useEffect(() => {
    const fetchSEOAudit = async () => {
      try {
        const response = await fetch('/api/admin/seo-audit', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch SEO audit data');
        }

        const data = await response.json();
        setAuditReport(data);
      } catch (error) {
        console.error('Error fetching SEO audit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOAudit();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải báo cáo SEO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Audit Dashboard</h1>
          <p className="text-gray-600 mt-2">Kiểm tra và tối ưu SEO cho tất cả nội dung</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">{auditReport.overallScore}</div>
              <p className="text-sm text-gray-600 mt-2">Điểm SEO trung bình</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600">{auditReport.criticalIssues}</div>
              <p className="text-sm text-gray-600 mt-2">Lỗi nghiêm trọng</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-600">{auditReport.warnings}</div>
              <p className="text-sm text-gray-600 mt-2">Cảnh báo</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600">{auditReport.blogPosts.length}</div>
              <p className="text-sm text-gray-600 mt-2">Bài viết đã kiểm tra</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'critical'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nghiêm trọng
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cảnh báo
            </button>
          </div>
        </div>

        {/* Blog Posts SEO Scores */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bài viết</h2>
          <div className="space-y-4">
            {auditReport.blogPosts.map((post: any) => (
              <div key={post.slug} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-600">/{post.slug}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      post.score.overall >= 80 ? 'text-green-600' :
                      post.score.overall >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {post.score.overall}
                    </div>
                    <p className="text-xs text-gray-600">SEO Score</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      post.score.overall >= 80 ? 'bg-green-500' :
                      post.score.overall >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${post.score.overall}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Chạy lại SEO Audit
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}

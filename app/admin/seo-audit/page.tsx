'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

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
  const [runningAudit, setRunningAudit] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');
  
  // Custom URL audit states
  const [customUrl, setCustomUrl] = useState('');
  const [auditingUrl, setAuditingUrl] = useState(false);
  const [urlAuditResult, setUrlAuditResult] = useState<any>(null);
  const [urlAuditError, setUrlAuditError] = useState('');

  useEffect(() => {
    fetchSEOAudit();
  }, []);

  const fetchSEOAudit = async () => {
    try {
      setLoading(true);
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

  const handleRunAudit = async () => {
    setRunningAudit(true);
    try {
      // Force refresh audit data
      await fetchSEOAudit();
      alert('✅ SEO Audit đã được chạy lại thành công!');
    } catch (error) {
      console.error('Error running audit:', error);
      alert('❌ Có lỗi khi chạy SEO Audit');
    } finally {
      setRunningAudit(false);
    }
  };

  const handleAuditCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customUrl.trim()) {
      setUrlAuditError('Vui lòng nhập URL');
      return;
    }

    setAuditingUrl(true);
    setUrlAuditError('');
    setUrlAuditResult(null);

    try {
      const response = await fetch('/api/admin/seo-audit/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
        },
        body: JSON.stringify({ url: customUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to audit URL');
      }

      setUrlAuditResult(data);
    } catch (error) {
      console.error('Error auditing URL:', error);
      setUrlAuditError(error instanceof Error ? error.message : 'Có lỗi khi audit URL');
    } finally {
      setAuditingUrl(false);
    }
  };

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
          <button 
            onClick={handleRunAudit}
            disabled={runningAudit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {runningAudit ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Đang chạy audit...
              </>
            ) : (
              <>
                <Search size={18} />
                Chạy SEO Audit cho toàn bộ site
              </>
            )}
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Xuất báo cáo
          </button>
        </div>

        {/* Custom URL Audit Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Audit URL Tùy Chỉnh</h2>
          <p className="text-gray-600 mb-4">Nhập URL bất kỳ để kiểm tra SEO (ví dụ: https://example.com)</p>
          
          <form onSubmit={handleAuditCustomUrl} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={auditingUrl}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {auditingUrl ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang audit...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Audit URL
                  </>
                )}
              </button>
            </div>

            {urlAuditError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {urlAuditError}
              </div>
            )}
          </form>

          {/* URL Audit Results */}
          {urlAuditResult && (
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">📊 Kết quả SEO cho: {urlAuditResult.url}</h3>
                
                {/* Score Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      urlAuditResult.seo.overall >= 80 ? 'text-green-600' :
                      urlAuditResult.seo.overall >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {urlAuditResult.seo.overall}
                    </div>
                    <p className="text-xs text-gray-600">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{urlAuditResult.analysis.wordCount}</div>
                    <p className="text-xs text-gray-600">Từ</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{urlAuditResult.analysis.imagesCount}</div>
                    <p className="text-xs text-gray-600">Images</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{urlAuditResult.analysis.headings.h1.length}</div>
                    <p className="text-xs text-gray-600">H1 Tags</p>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Title', score: urlAuditResult.seo.title },
                    { label: 'Meta', score: urlAuditResult.seo.meta },
                    { label: 'Content', score: urlAuditResult.seo.content },
                    { label: 'Images', score: urlAuditResult.seo.images },
                    { label: 'Technical', score: urlAuditResult.seo.technical },
                    { label: 'Schema', score: urlAuditResult.seo.schema },
                  ].map((cat) => (
                    <div key={cat.label} className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                        <span className={`text-sm font-bold ${
                          cat.score >= 80 ? 'text-green-600' :
                          cat.score >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {cat.score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            cat.score >= 80 ? 'bg-green-500' :
                            cat.score >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${cat.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Issues */}
                {urlAuditResult.seo.issues.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">⚠️ Issues Found ({urlAuditResult.seo.issues.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {urlAuditResult.seo.issues.map((issue: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                            issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`text-sm font-bold ${
                              issue.severity === 'critical' ? 'text-red-700' :
                              issue.severity === 'warning' ? 'text-yellow-700' :
                              'text-blue-700'
                            }`}>
                              {issue.severity === 'critical' ? '❌' :
                               issue.severity === 'warning' ? '⚠️' : 'ℹ️'}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                              <p className="text-xs text-gray-600 mt-1"> {issue.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

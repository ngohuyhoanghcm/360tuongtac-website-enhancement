'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, Filter } from 'lucide-react';
import ContentPreviewModal from '@/components/ui/ContentPreviewModal';

interface Draft {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  createdBy: string;
  seoScore?: number;
  rejectReason?: string;
  type?: 'blog' | 'service';
}

export default function DraftApproval() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      // Map UI filter to API status
      const apiStatus = filter === 'all' ? undefined : 
                        filter === 'pending' ? 'review' :
                        filter === 'approved' ? 'published' :
                        filter === 'rejected' ? 'draft' : undefined;

      const params = apiStatus ? `?status=${apiStatus}` : '';
      
      const response = await fetch(`/api/admin/drafts${params}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }

      const data = await response.json();
      
      if (data.success) {
        setDrafts(data.drafts);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      // Fallback to empty array
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (draftId: string) => {
    try {
      const draft = drafts.find(d => d.id === draftId);
      if (!draft) return;

      const response = await fetch(`/api/admin/drafts/${draft.slug}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          type: draft.type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh drafts list
        fetchDrafts();
        alert('Đã duyệt bài viết!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error approving draft:', error);
      alert('Có lỗi xảy ra khi duyệt bài viết');
    }
  };

  const handleReject = async (draftId: string, reason?: string) => {
    try {
      const draft = drafts.find(d => d.id === draftId);
      if (!draft) return;

      const response = await fetch(`/api/admin/drafts/${draft.slug}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          type: draft.type,
          reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchDrafts();
        alert('Đã từ chối bài viết');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error rejecting draft:', error);
      alert('Có lỗi xảy ra khi từ chối bài viết');
    }
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm('Bạn có chắc muốn xóa draft này?')) {
      return;
    }

    try {
      const draft = drafts.find(d => d.id === draftId);
      if (!draft) return;

      const type = draft.type || 'blog';
      const response = await fetch(`/api/admin/drafts/${draft.slug}?type=${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        fetchDrafts();
        alert('Đã xóa draft');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Có lỗi xảy ra khi xóa draft');
    }
  };

  const filteredDrafts = drafts.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Đã từ chối',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Draft Approval
          </h1>
          <p className="text-gray-600 mt-1">Quản lý và duyệt bài viết AI-generated</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Drafts</div>
          <div className="text-2xl font-bold text-gray-900">{drafts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-yellow-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {drafts.filter(d => d.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-green-600">Approved</div>
          <div className="text-2xl font-bold text-green-600">
            {drafts.filter(d => d.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-red-600">Rejected</div>
          <div className="text-2xl font-bold text-red-600">
            {drafts.filter(d => d.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ duyệt' : f === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrafts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không có drafts nào
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{draft.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {draft.excerpt}
                      </div>
                      {draft.rejectReason && (
                        <div className="text-xs text-red-600 mt-1">
                          ❌ {draft.rejectReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {draft.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {draft.seoScore ? (
                        <span className={`text-lg font-bold ${
                          draft.seoScore >= 80 ? 'text-green-600' :
                          draft.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {draft.seoScore}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(draft.status)}
                        {getStatusBadge(draft.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {draft.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedDraft(draft);
                            setShowPreview(true);
                          }}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        
                        {draft.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(draft.id)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              title="Duyệt"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleReject(draft.id, 'Không đạt chất lượng')}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => router.push(`/admin/blog/edit/${draft.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(draft.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDraft && showPreview && (
        <ContentPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          content={{
            title: selectedDraft.title,
            excerpt: selectedDraft.excerpt,
            content: selectedDraft.content,
            category: selectedDraft.category,
            tags: selectedDraft.tags,
            seoScore: selectedDraft.seoScore,
          }}
          mode="approval"
          onApprove={() => handleApprove(selectedDraft.id)}
          onReject={() => handleReject(selectedDraft.id)}
          onEdit={() => {
            setShowPreview(false);
            router.push(`/admin/blog/edit/${selectedDraft.id}`);
          }}
        />
      )}
    </div>
  );
}

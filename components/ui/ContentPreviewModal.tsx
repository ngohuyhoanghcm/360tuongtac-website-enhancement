'use client';

import { useState } from 'react';
import { X, Eye, Edit, Check, Trash2, AlertCircle } from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl?: string;
    seoScore?: number;
  };
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  mode?: 'preview' | 'approval';
}

export default function ContentPreviewModal({
  isOpen,
  onClose,
  content,
  onEdit,
  onApprove,
  onReject,
  mode = 'preview'
}: ContentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'meta'>('preview');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove?.();
    onClose();
  };

  const handleReject = () => {
    if (showRejectReason && !rejectReason.trim()) {
      return;
    }
    onReject?.();
    onClose();
    setShowRejectReason(false);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'approval' ? 'Duyệt bài viết' : 'Xem trước nội dung'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'preview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Nội dung
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'meta'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Metadata
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
            {activeTab === 'preview' ? (
              <div className="p-6 space-y-6">
                {/* SEO Score */}
                {content.seoScore && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">SEO Score</span>
                      <span className={`text-2xl font-bold ${
                        content.seoScore >= 80 ? 'text-green-600' :
                        content.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {content.seoScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          content.seoScore >= 80 ? 'bg-green-600' :
                          content.seoScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${content.seoScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Featured Image */}
                {content.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={content.imageUrl}
                      alt={content.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {content.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {content.category}
                    </span>
                    {content.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Excerpt */}
                {content.excerpt && (
                  <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded">
                    <p className="text-gray-700 italic">{content.excerpt}</p>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {content.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {content.title}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{content.title.length} ký tự</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {content.excerpt || 'Chưa có'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{content.excerpt?.length || 0} ký tự</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {content.category}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {content.tags.length > 0 ? (
                      content.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Chưa có tags</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            {mode === 'approval' ? (
              showRejectReason ? (
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Lý do từ chối *
                    </span>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối..."
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={!rejectReason.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xác nhận từ chối
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectReason(false);
                        setRejectReason('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={onEdit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowRejectReason(true)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Duyệt & Xuất bản
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

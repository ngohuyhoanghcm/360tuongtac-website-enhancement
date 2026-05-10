'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Trash2, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BatchItem {
  id: string;
  topic: string;
  category: string;
  keywords: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  progress: number;
  slug?: string;
  error?: string;
}

export default function BatchContentGeneration() {
  const router = useRouter();
  const [items, setItems] = useState<BatchItem[]>([
    { id: '1', topic: '', category: 'General', keywords: '', status: 'pending', progress: 0 }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const [tone, setTone] = useState<'professional' | 'casual' | 'educational' | 'conversational'>('professional');

  const categories = [
    'TikTok', 'Facebook', 'Instagram', 'YouTube', 
    'Social Media', 'Marketing', 'Livestream', 'General'
  ];

  const addItem = () => {
    const newItem: BatchItem = {
      id: Date.now().toString(),
      topic: '',
      category: 'General',
      keywords: '',
      status: 'pending',
      progress: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BatchItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleBatchGenerate = async () => {
    // Validate all items have topics
    const validItems = items.filter(item => item.topic.trim());
    if (validItems.length === 0) {
      alert('Vui lòng nhập ít nhất một chủ đề');
      return;
    }

    setIsGenerating(true);

    // Process items sequentially
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.topic.trim()) continue;

      // Update status to generating
      updateItem(item.id, 'status', 'generating');
      updateItem(item.id, 'progress', 0);
      
      // Small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          updateItem(item.id, 'progress', (prev: number) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        const response = await fetch('/api/admin/content/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputType: 'topic',
            input: item.topic,
            options: {
              category: item.category,
              targetKeywords: item.keywords.split(',').map(k => k.trim()).filter(k => k),
              tone,
              generateImage,
            },
            autoSave: true,
          }),
        });

        clearInterval(progressInterval);

        const data = await response.json();

        if (data.success) {
          updateItem(item.id, 'status', 'success');
          updateItem(item.id, 'progress', 100);
          updateItem(item.id, 'slug', data.slug);
          
          // Small delay to show success state
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          throw new Error(data.message || 'Failed to generate');
        }
      } catch (error) {
        updateItem(item.id, 'status', 'error');
        updateItem(item.id, 'progress', 0);
        updateItem(item.id, 'error', error instanceof Error ? error.message : 'Unknown error');
        
        // Small delay to show error state
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsGenerating(false);
  };

  const successCount = items.filter(i => i.status === 'success').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            Tạo nội dung hàng loạt
          </h1>
          <p className="text-gray-600 mt-1">Tạo nhiều bài viết cùng lúc với AI</p>
        </div>
        <Link
          href="/admin/ai-content"
          className="text-blue-600 hover:underline"
        >
          ← Quay lại AI Content Hub
        </Link>
      </div>

      {/* Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn chung</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="educational">Educational</option>
              <option value="conversational">Conversational</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                Tạo ảnh minh họa
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Batch Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bài viết #{index + 1}</h3>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isGenerating}
                  className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề *</label>
                <input
                  type="text"
                  value={item.topic}
                  onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                  disabled={isGenerating}
                  placeholder="VD: Cách tăng tương tác TikTok 2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={item.keywords}
                onChange={(e) => updateItem(item.id, 'keywords', e.target.value)}
                disabled={isGenerating}
                placeholder="VD: tiktok, tương tác, marketing"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            {/* Progress Bar */}
            {item.status === 'generating' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Đang tạo... {item.progress}%</p>
              </div>
            )}

            {/* Success */}
            {item.status === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">✅ Tạo thành công!</span>
                {item.slug && (
                  <button
                    onClick={() => router.push(`/admin/blog/edit/${item.slug}`)}
                    className="ml-auto text-sm text-green-700 hover:underline"
                  >
                    Chỉnh sửa →
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {item.status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">❌ Lỗi: {item.error}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={addItem}
        disabled={isGenerating}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Plus className="w-5 h-5" />
        Thêm bài viết
      </button>

      {/* Generate Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Tổng quan</h3>
            <p className="text-sm text-gray-500 mt-1">
              {items.filter(i => i.topic.trim()).length} bài viết sẽ được tạo
            </p>
          </div>
          {successCount > 0 && (
            <div className="text-right">
              <p className="text-sm text-green-600 font-semibold">✅ {successCount} thành công</p>
              {errorCount > 0 && (
                <p className="text-sm text-red-600">❌ {errorCount} lỗi</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleBatchGenerate}
          disabled={isGenerating || items.filter(i => i.topic.trim()).length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tạo {items.filter(i => i.status === 'generating').length}/{items.filter(i => i.topic.trim()).length}...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Tạo tất cả ({items.filter(i => i.topic.trim()).length} bài viết)
            </>
          )}
        </button>
      </div>
    </div>
  );
}

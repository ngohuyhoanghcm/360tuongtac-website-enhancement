'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, FileText, Lightbulb, Video, Sparkles, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface GeneratedContent {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  seoScore?: number;
  suggestions?: string[];
}

export default function AIContentHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'url' | 'topic' | 'text'>('url');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('General');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'educational' | 'conversational'>('professional');
  const [autoSave, setAutoSave] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);

  const tabs = [
    { id: 'url' as const, label: 'Từ URL', icon: Globe, description: 'Trích xuất và viết lại nội dung từ website' },
    { id: 'topic' as const, label: 'Từ Topic', icon: Lightbulb, description: 'Tạo bài viết từ chủ đề' },
    { id: 'text' as const, label: 'Từ Text', icon: FileText, description: 'Viết lại và tối ưu nội dung có sẵn' },
  ];

  const categories = [
    'TikTok',
    'Facebook',
    'Instagram',
    'YouTube',
    'Social Media',
    'Marketing',
    'Livestream',
    'General',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setGeneratedContent(null);

    // Validate input
    const input = activeTab === 'url' ? url : activeTab === 'topic' ? topic : text;
    if (!input.trim()) {
      setError('Vui lòng nhập nội dung');
      setIsGenerating(false);
      return;
    }

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
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
          inputType: activeTab,
          input,
          options: {
            category,
            targetKeywords: keywords.split(',').map(k => k.trim()).filter(k => k),
            tone,
            generateImage,
          },
          autoSave,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      if (data.success && data.blogPost) {
        setGeneratedContent({
          title: data.blogPost.title || '',
          excerpt: data.blogPost.excerpt || '',
          content: data.blogPost.content || '',
          tags: data.blogPost.tags || [],
          category: data.blogPost.category || category,
          seoScore: data.seoScore || 0,
          suggestions: data.suggestions || [],
        });

        // If auto-saved, redirect to edit page
        if (autoSave && data.slug) {
          setTimeout(() => {
            router.push(`/admin/blog/edit/${data.slug}`);
          }, 2000);
        }
      } else {
        setError(data.errors?.[0] || 'Failed to generate content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            AI Content Hub
          </h1>
          <p className="text-gray-600 mt-1">Tạo nội dung blog tự động với AI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'url' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">URL bài viết nguồn</span>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/blog-post"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          )}

          {activeTab === 'topic' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Chủ đề bài viết</span>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="VD: Cách tăng like trên TikTok 2024"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Nội dung nguồn</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Dán nội dung cần viết lại và tối ưu..."
                  rows={8}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Danh mục</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Target Keywords (cách nhau bởi dấu phẩy)</span>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Tone giọng</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="educational">Educational</option>
                <option value="conversational">Conversational</option>
              </select>
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Tự động lưu sau khi tạo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImage}
                  onChange={(e) => setGenerateImage(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  Tạo ảnh minh họa tự động
                </span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo nội dung... {progress}%
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tạo nội dung với AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="font-medium text-gray-900">AI đang tạo nội dung...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {progress < 30 && 'Đang phân tích yêu cầu...'}
            {progress >= 30 && progress < 60 && 'Đang tạo nội dung...'}
            {progress >= 60 && progress < 90 && 'Đang tối ưu SEO...'}
            {progress >= 90 && 'Hoàn tất...'}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Có lỗi xảy ra</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Content Preview */}
      {generatedContent && !autoSave && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Nội dung đã tạo xong
            </h2>
            <button
              onClick={() => {
                if (generatedContent.title) {
                  const slug = generatedContent.title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                  router.push(`/admin/blog/new?title=${encodeURIComponent(generatedContent.title)}&content=${encodeURIComponent(generatedContent.content)}`);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Chỉnh sửa & Xuất bản
            </button>
          </div>

          {/* SEO Score */}
          {generatedContent.seoScore && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">SEO Score</span>
                <span className={`text-2xl font-bold ${
                  generatedContent.seoScore >= 80 ? 'text-green-600' :
                  generatedContent.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {generatedContent.seoScore}/100
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    generatedContent.seoScore >= 80 ? 'bg-green-600' :
                    generatedContent.seoScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${generatedContent.seoScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div className="prose max-w-none" data-color-mode="light">
            <pre className="whitespace-pre-wrap font-sans text-sm">{generatedContent.content}</pre>
          </div>

          {/* Suggestions */}
          {generatedContent.suggestions && generatedContent.suggestions.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Gợi ý cải thiện:</h3>
              <ul className="list-disc list-inside space-y-1">
                {generatedContent.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-yellow-800">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

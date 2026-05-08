'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
}

export default function ImageUploader({ 
  value, 
  onChange,
  label = 'Ảnh minh họa',
  helpText = 'Kéo thả hoặc click để tải lên, hoặc tạo bằng AI'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước file tối đa 5MB');
      }

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'blog');

      const response = await fetch('/api/admin/image/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      
      if (data.success) {
        onChange(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Vui lòng nhập mô tả ảnh');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call AI image generation API
      const response = await fetch('/api/admin/image/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_SECRET || 'secret123'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          size: '1792x1024',
          style: 'photographic'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'AI generation failed');
      }

      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        onChange(data.imageUrl);
        setShowAIGenerator(false);
        setAiPrompt('');
      } else {
        throw new Error(data.error || 'AI generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          Tạo bằng AI
        </button>
      </div>

      {/* AI Generator */}
      {showAIGenerator && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-blue-900">Mô tả ảnh muốn tạo</span>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="VD: Professional social media marketing concept, modern design"
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tạo ảnh
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowAIGenerator(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && document.getElementById('image-upload')?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Đang tải lên...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview */
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Ảnh đã được chọn</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

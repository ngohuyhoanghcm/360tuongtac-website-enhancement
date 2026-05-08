'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion: string;
}

interface SEOOptimizationPanelProps {
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  category: string;
}

export default function SEOOptimizationPanel({
  title,
  excerpt,
  content,
  keywords,
  category
}: SEOOptimizationPanelProps) {
  const [score, setScore] = useState<number>(0);
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeSEO();
  }, [title, excerpt, content, keywords]);

  const analyzeSEO = async () => {
    setIsAnalyzing(true);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    const newIssues: SEOIssue[] = [];

    // Check title
    if (title.length < 50) {
      newIssues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title quá ngắn',
        suggestion: 'Title nên từ 50-70 ký tự để tối ưu SEO'
      });
    } else if (title.length > 70) {
      newIssues.push({
        type: 'warning',
        category: 'Title',
        message: 'Title quá dài',
        suggestion: 'Title nên dưới 70 ký tự để không bị cắt trên Google'
      });
    }

    // Check excerpt
    if (excerpt.length < 120) {
      newIssues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description quá ngắn',
        suggestion: 'Meta description nên từ 120-160 ký tự'
      });
    } else if (excerpt.length > 160) {
      newIssues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description quá dài',
        suggestion: 'Meta description nên dưới 160 ký tự'
      });
    }

    // Check content length
    if (content.length < 1500) {
      newIssues.push({
        type: 'critical',
        category: 'Content',
        message: 'Nội dung quá ngắn',
        suggestion: 'Nội dung nên tối thiểu 1500 ký tự, lý tưởng 2000-3000+ ký tự'
      });
    }

    // Check keyword usage
    if (keywords.length > 0) {
      const primaryKeyword = keywords[0].toLowerCase();
      const contentLower = content.toLowerCase();
      const keywordCount = (contentLower.match(new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
      
      if (keywordCount === 0) {
        newIssues.push({
          type: 'critical',
          category: 'Keywords',
          message: `Không tìm thấy keyword "${primaryKeyword}" trong nội dung`,
          suggestion: 'Sử dụng keyword chính ít nhất 2-3 lần trong nội dung'
        });
      } else if (keywordCount > 10) {
        newIssues.push({
          type: 'warning',
          category: 'Keywords',
          message: `Keyword "${primaryKeyword}" xuất hiện quá nhiều (${keywordCount} lần)`,
          suggestion: 'Giảm keyword density để tránh keyword stuffing'
        });
      }
    }

    // Check headings
    const headingCount = (content.match(/^#{1,6}\s+/gm) || []).length;
    if (headingCount < 3) {
      newIssues.push({
        type: 'warning',
        category: 'Structure',
        message: 'Thiếu headings',
        suggestion: 'Thêm ít nhất 3-5 headings (H2, H3) để cải thiện structure'
      });
    }

    // Check for FAQ
    const hasFAQ = content.toLowerCase().includes('câu hỏi thường gặp') || 
                   content.toLowerCase().includes('faq');
    if (!hasFAQ) {
      newIssues.push({
        type: 'info',
        category: 'GEO/AEO',
        message: 'Thiếu FAQ section',
        suggestion: 'Thêm FAQ section để tối ưu GEO và AEO'
      });
    }

    // Calculate score
    const criticalCount = newIssues.filter(i => i.type === 'critical').length;
    const warningCount = newIssues.filter(i => i.type === 'warning').length;
    const infoCount = newIssues.filter(i => i.type === 'info').length;

    let calculatedScore = 100 - (criticalCount * 20) - (warningCount * 10) - (infoCount * 5);
    calculatedScore = Math.max(0, Math.min(100, calculatedScore));

    setScore(calculatedScore);
    setIssues(newIssues);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getIssueBg = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        SEO Optimization
      </h3>

      {/* Score */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Score</span>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getScoreBg(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {score >= 80 && '✅ Tốt! Bài viết đã được tối ưu tốt cho SEO'}
          {score >= 60 && score < 80 && '⚠️ Khá! Cần cải thiện một số vấn đề'}
          {score < 60 && '❌ Cần cải thiện nhiều để đạt chuẩn SEO'}
        </p>
      </div>

      {/* Content Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-600 font-medium">Title Length</div>
          <div className="text-lg font-bold text-blue-900">{title.length}</div>
          <div className="text-xs text-blue-600">/ 50-70 chars</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-xs text-purple-600 font-medium">Meta Description</div>
          <div className="text-lg font-bold text-purple-900">{excerpt.length}</div>
          <div className="text-xs text-purple-600">/ 120-160 chars</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-green-600 font-medium">Content Length</div>
          <div className="text-lg font-bold text-green-900">{content.length}</div>
          <div className="text-xs text-green-600">/ 1500+ chars</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-xs text-orange-600 font-medium">Keywords</div>
          <div className="text-lg font-bold text-orange-900">{keywords.length}</div>
          <div className="text-xs text-orange-600">target keywords</div>
        </div>
      </div>

      {/* Issues */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Issues & Suggestions</h4>
        
        {isAnalyzing ? (
          <div className="text-center py-4 text-gray-500">
            Đang phân tích SEO...
          </div>
        ) : issues.length === 0 ? (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-900">Không có vấn đề! Bài viết đã tối ưu tốt.</span>
          </div>
        ) : (
          issues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-4 border rounded-lg ${getIssueBg(issue.type)}`}
            >
              <div className="flex items-start gap-3">
                {getIssueIcon(issue.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 uppercase">
                      {issue.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      issue.type === 'critical' ? 'bg-red-200 text-red-800' :
                      issue.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {issue.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {issue.message}
                  </p>
                  <p className="text-xs text-gray-600">
                    💡 {issue.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={analyzeSEO}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Phân tích lại SEO
        </button>
      </div>
    </div>
  );
}

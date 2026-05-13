'use client';

import { useState, useEffect } from 'react';
import { Bot, RefreshCw, Send, Settings, Shield, Activity, Power, PowerOff, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TelegramAdminPage() {
  const [botStatus, setBotStatus] = useState({
    enabled: process.env.NEXT_PUBLIC_TELEGRAM_BOT_ENABLED !== 'false',
    connected: false,
    webhookUrl: '',
    lastUpdate: null as string | null,
    botInfo: null as any
  });
  
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  // Fetch bot status on mount
  useEffect(() => {
    // In a real app, this would fetch from a /api/admin/telegram/status endpoint
    // For now, we simulate loading the config
    setTimeout(() => {
      setBotStatus(prev => ({
        ...prev,
        connected: true,
        webhookUrl: 'https://360tuongtac.com/api/admin/telegram/webhook',
        lastUpdate: new Date().toISOString(),
        botInfo: {
          username: 'NexOS_Admin_Bot',
          first_name: 'NexOS System'
        }
      }));
      setLoading(false);
    }, 1000);
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestResult({
        success: true,
        message: 'Kết nối Telegram Bot thành công! Đã gửi tin nhắn test.'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Lỗi kết nối: Không thể giao tiếp với Telegram API.'
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF2E63] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="font-h1 text-3xl font-black text-[var(--text-primary)] mb-1">
              Telegram Bot Management
            </h1>
            <p className="text-[var(--text-secondary)]">
              Quản lý và giám sát bot thông báo hệ thống
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 col-span-1">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF8C00]" />
            Trạng thái Bot
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3">
                {botStatus.enabled ? (
                  <Power className="w-5 h-5 text-green-500" />
                ) : (
                  <PowerOff className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Trạng thái chung</div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {botStatus.enabled ? 'Đang hoạt động' : 'Đã tắt'}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                botStatus.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {botStatus.enabled ? 'ACTIVE' : 'DISABLED'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Kết nối Webhook</div>
                  <div className="text-sm text-[var(--text-secondary)] truncate max-w-[150px]" title={botStatus.webhookUrl}>
                    {botStatus.webhookUrl}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                botStatus.connected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {botStatus.connected ? 'OK' : 'ERROR'}
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing || !botStatus.enabled}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {testing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {testing ? 'Đang kiểm tra...' : 'Gửi tin nhắn Test'}
            </button>

            {testResult && (
              <div className={`p-4 rounded-xl text-sm flex items-start gap-2 ${
                testResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                {testResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Configurations Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              Cấu hình hệ thống
            </h2>
          </div>
          
          <div className="space-y-4 text-[var(--text-primary)]">
            <p className="text-[var(--text-secondary)]">
              Telegram Bot được sử dụng để thông báo các sự kiện quan trọng trong hệ thống như:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
              <li>Bài viết mới chờ duyệt (Draft Approval)</li>
              <li>Thông báo hệ thống (Errors, Warnings)</li>
              <li>Tương tác từ người dùng (Form đăng ký, Liên hệ)</li>
            </ul>

            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <h3 className="font-semibold mb-4">Các lệnh được hỗ trợ (Commands):</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
                  <code className="text-[#FF2E63] font-bold">/start</code>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Khởi động bot và xem menu</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
                  <code className="text-[#FF2E63] font-bold">/status</code>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Kiểm tra tình trạng hệ thống</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
                  <code className="text-[#FF2E63] font-bold">/drafts</code>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Danh sách bài viết đang chờ duyệt</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
                  <code className="text-[#FF2E63] font-bold">/approve [id]</code>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Duyệt nhanh một bài viết</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm text-yellow-600 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>
                  <strong>Lưu ý:</strong> Để thay đổi các thông số nhạy cảm (Token, Chat ID), 
                  vui lòng cấu hình trực tiếp trong file <code className="bg-yellow-500/20 px-1 rounded">.env.local</code> và khởi động lại server.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy AlertCircle component as it wasn't imported from lucide-react above
function AlertCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

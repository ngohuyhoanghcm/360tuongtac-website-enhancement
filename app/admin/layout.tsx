'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Shield, Key, Sparkles, FileCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // Login step 1: Password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login step 2: 2FA
  const [show2FA, setShow2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState('');
  
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{remaining: number, retryAfter?: number} | null>(null);

  // Check existing session on mount
  useEffect(() => {
    // DEV AUTH BYPASS: Skip authentication in development
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      console.log('[DEV AUTH] Admin UI bypass enabled - skipping login');
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    const sessionId = sessionStorage.getItem('admin_session_id');
    const csrfToken = sessionStorage.getItem('admin_csrf_token');
    
    if (sessionId && csrfToken) {
      // Verify session is still valid by checking a protected resource
      verifySession(sessionId).then(valid => {
        if (valid) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear storage
          sessionStorage.removeItem('admin_session_id');
          sessionStorage.removeItem('admin_csrf_token');
        }
        setIsChecking(false);
      });
    } else {
      setIsChecking(false);
    }
  }, []);

  const verifySession = async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/blog', {
        headers: {
          'Cookie': `admin_session=${sessionId}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Step 1: Submit password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.status === 429) {
        // Rate limited
        setRateLimitInfo({
          remaining: 0,
          retryAfter: data.retryAfter
        });
        setPasswordError(`Quá nhiều lần thử. Vui lòng đợi ${Math.ceil(data.retryAfter / 1000)} giây.`);
      } else if (data.requires2FA) {
        // Password correct, need 2FA
        setShow2FA(true);
        setPasswordError('');
      } else if (data.success) {
        // Login successful (2FA disabled)
        sessionStorage.setItem('admin_session_id', data.sessionId);
        sessionStorage.setItem('admin_csrf_token', data.csrfToken);
        setIsAuthenticated(true);
      } else {
        // Password incorrect
        setPasswordError(data.error || 'Sai mật khẩu!');
        if (data.remainingAttempts !== undefined) {
          setRateLimitInfo({ remaining: data.remainingAttempts });
        }
      }
    } catch (error) {
      setPasswordError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit 2FA code
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTotpError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          totpCode
        })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('admin_session_id', data.sessionId);
        sessionStorage.setItem('admin_csrf_token', data.csrfToken);
        setIsAuthenticated(true);
      } else {
        setTotpError(data.error || 'Mã 2FA không đúng!');
      }
    } catch (error) {
      setTotpError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('admin_session_id');
      sessionStorage.removeItem('admin_csrf_token');
      setIsAuthenticated(false);
      setShow2FA(false);
      setPassword('');
      setTotpCode('');
      router.push('/admin');
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated && !isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-h1 text-3xl font-black bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
                360 Tương Tác
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">Admin Panel</p>
              {show2FA && (
                <div className="mt-2 flex items-center justify-center gap-2 text-[#FF2E63]">
                  <Shield size={16} />
                  <span className="text-xs font-semibold">2FA Enabled</span>
                </div>
              )}
            </div>

            {!show2FA ? (
              // Step 1: Password form
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Mật khẩu admin
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF2E63] transition-colors"
                    placeholder="Nhập mật khẩu..."
                    autoFocus
                    disabled={isLoading}
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-500">{passwordError}</p>
                  )}
                  {rateLimitInfo && rateLimitInfo.remaining < 3 && (
                    <p className="mt-1 text-xs text-orange-500">
                      Còn {rateLimitInfo.remaining} lần thử
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <Key size={18} />
                      Đăng nhập
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Step 2: 2FA form
              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Mã xác thực 2FA
                  </label>
                  
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-center text-2xl tracking-widest focus:outline-none focus:border-[#FF2E63] transition-colors"
                    placeholder="000000"
                    maxLength={6}
                    autoFocus
                    disabled={isLoading}
                  />
                  <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
                    Nhập 6 số từ Google Authenticator
                  </p>
                  
                  {totpError && (
                    <p className="mt-2 text-sm text-red-500">{totpError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || totpCode.length !== 6}
                  className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      Xác thực 2FA
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShow2FA(false);
                    setPassword('');
                    setTotpCode('');
                    setTotpError('');
                  }}
                  className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
                >
                  ← Quay lại nhập mật khẩu
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF2E63] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--surface)] border-r border-[var(--border)] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h1 className="font-h1 text-xl font-black bg-gradient-to-r from-[#FF8C00] via-[#FF2E63] to-[#8B5CF6] bg-clip-text text-transparent">
              360 Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname === '/admin'
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/admin/blog"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/admin/blog')
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText size={18} />
            Blog Posts
          </Link>

          <Link
            href="/admin/services"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/admin/services')
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Settings size={18} />
            Services
          </Link>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--border)]"></div>

          {/* AI Features */}
          <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase">
            AI Tools
          </div>

          <Link
            href="/admin/ai-content"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/admin/ai-content')
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles size={18} />
            AI Content Hub
          </Link>

          <Link
            href="/admin/drafts"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/admin/drafts')
                ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileCheck size={18} />
            Draft Approval
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[var(--text-primary)] hover:text-[#FF2E63] transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-muted)]">
                Xin chào, Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

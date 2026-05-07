'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

// Simple admin authentication (Phase 1)
// In production, use proper auth system (NextAuth, etc.)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Sai mật khẩu!');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push('/admin');
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
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FF2E63] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Đăng nhập
              </button>
            </form>

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

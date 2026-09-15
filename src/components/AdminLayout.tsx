'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Store,
  Users,
  Ticket,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const session = DataStore.getSessionUser();
    if (!session || session.role !== 'admin') {
      // Allow viewing or redirect if not admin
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } else {
      setAdminUser(session);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    DataStore.setSessionUser(null);
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrap">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="brand-title font-display">Daebak.Tix</h1>
            <span className="brand-subtitle">PORTAL ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          <Link
            href="/admin/dashboard"
            className={`nav-item ${pathname === '/admin/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            href="/admin/sellers"
            className={`nav-item ${pathname === '/admin/sellers' ? 'active' : ''}`}
          >
            <Store size={18} /> Manajemen Penjual
          </Link>

          <Link
            href="/admin/buyers"
            className={`nav-item ${pathname === '/admin/buyers' ? 'active' : ''}`}
          >
            <Users size={18} /> Manajemen Pembeli
          </Link>

          <Link
            href="/admin/tickets"
            className={`nav-item ${pathname === '/admin/tickets' ? 'active' : ''}`}
          >
            <Ticket size={18} /> Manajemen Tiket
          </Link>

          <Link
            href="/admin/transactions"
            className={`nav-item ${pathname === '/admin/transactions' ? 'active' : ''}`}
          >
            <CreditCard size={18} /> Transaksi
          </Link>

          <Link
            href="/admin/logs"
            className={`nav-item ${pathname === '/admin/logs' ? 'active' : ''}`}
          >
            <FileText size={18} /> Activity Log
          </Link>

          <Link
            href="/admin/reports"
            className={`nav-item ${pathname === '/admin/reports' ? 'active' : ''}`}
          >
            <BarChart3 size={18} /> Sales Report
          </Link>

          <Link
            href="/admin/settings"
            className={`nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            <Settings size={18} /> Settings Paket
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="btn btn-sm btn-outline text-white mb-2" style={{ width: '100%', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            🌐 Lihat Web Publik
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Keluar Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <span className="sticker-badge badge-mustard">
              <Sparkles size={14} /> SUPER ADMIN CONTROL PANEL
            </span>
          </div>
          <div className="topbar-right">
            <div className="admin-user-info">
              <ShieldCheck size={20} color="var(--color-maroon)" />
              <div>
                <strong>{adminUser?.full_name || 'Super Admin'}</strong>
                <span className="admin-email">{adminUser?.email || 'admin@daebaktix.co.id'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-cream-light);
        }
        .admin-sidebar {
          width: 260px;
          background-color: var(--color-maroon-dark);
          color: var(--color-cream-light);
          display: flex;
          flex-direction: column;
          border-right: 3px solid var(--color-maroon);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
        }
        .sidebar-brand {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
        }
        .brand-icon-wrap {
          width: 40px;
          height: 40px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-title {
          font-size: 1.4rem;
          line-height: 1;
          color: var(--color-white);
        }
        .brand-subtitle {
          font-size: 0.7rem;
          color: var(--color-mustard);
          font-weight: 700;
          letter-spacing: 1px;
        }
        .admin-nav {
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: var(--color-pink-soft);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
          background-color: var(--color-maroon);
          color: var(--color-white);
          transform: translateX(4px);
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--color-pink-soft);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 600;
        }
        .logout-btn:hover {
          background-color: var(--color-maroon);
          color: var(--color-white);
        }
        .admin-main {
          margin-left: 260px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .admin-topbar {
          height: 64px;
          background-color: var(--color-white);
          border-bottom: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--color-pink-soft);
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-maroon-light);
        }
        .admin-email {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .admin-content {
          padding: 30px;
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

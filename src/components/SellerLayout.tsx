'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  ShoppingBag,
  UserCheck,
  Users,
  Award,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Seller } from '@/lib/types';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    const session = DataStore.getSessionSeller();
    if (!session) {
      if (pathname !== '/seller/login' && pathname !== '/seller/packages') {
        router.push('/seller/login');
      }
    } else {
      setSeller(session);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    DataStore.setSessionSeller(null);
    router.push('/seller/login');
  };

  if (pathname === '/seller/login' || pathname === '/seller/packages') {
    return <>{children}</>;
  }

  return (
    <div className="seller-container">
      {/* Sidebar */}
      <aside className="seller-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrap">
            <Store size={22} />
          </div>
          <div>
            <h1 className="brand-title font-display">{seller?.store_name || 'Toko Penjual'}</h1>
            <span className="brand-code">KODE: {seller?.account_code || 'SM-0000'}</span>
          </div>
        </div>

        {/* Tier badge in sidebar */}
        <div className="tier-badge-container">
          <span className="sticker-badge badge-mustard" style={{ fontSize: '0.78rem' }}>
            <Award size={12} /> {seller?.package_type === 'paid_3m' ? 'PAKET PAID 3 BLN' : seller?.package_type === 'paid_1m' ? 'PAKET PAID 1 BLN' : 'PAKET FREE (PER-EVENT)'}
          </span>
        </div>

        <nav className="seller-nav">
          <Link
            href="/seller/dashboard"
            className={`nav-item ${pathname === '/seller/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            href="/seller/events"
            className={`nav-item ${pathname === '/seller/events' ? 'active' : ''}`}
          >
            <Calendar size={18} /> My Event
          </Link>

          <Link
            href="/seller/events/new"
            className={`nav-item ${pathname === '/seller/events/new' ? 'active' : ''}`}
          >
            <PlusCircle size={18} /> New Event
          </Link>

          <Link
            href="/seller/orders"
            className={`nav-item ${pathname === '/seller/orders' ? 'active' : ''}`}
          >
            <ShoppingBag size={18} /> Orders
          </Link>

          <Link
            href="/seller/staff"
            className={`nav-item ${pathname === '/seller/staff' ? 'active' : ''}`}
          >
            <Users size={18} /> Buat Akun Staf
          </Link>

          <Link
            href="/seller/profile"
            className={`nav-item ${pathname === '/seller/profile' ? 'active' : ''}`}
          >
            <UserCheck size={18} /> Profil Toko
          </Link>

          <Link
            href="/seller/packages"
            className={`nav-item ${pathname === '/seller/packages' ? 'active' : ''}`}
          >
            <Award size={18} /> Upgrade Paket
          </Link>

          <Link
            href="/seller/settings"
            className={`nav-item ${pathname === '/seller/settings' ? 'active' : ''}`}
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link href="/" target="_blank" className="btn btn-sm btn-outline text-white mb-2" style={{ width: '100%', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            <ExternalLink size={14} /> View Site (Public)
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Logout Store
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="seller-main">
        <header className="seller-topbar">
          <div className="topbar-left">
            <span className="font-display text-maroon" style={{ fontSize: '1.1rem' }}>
              Portal Penjual Resmi — {seller?.store_name}
            </span>
          </div>
          <div className="topbar-right">
            <span className="store-email-badge">
              <code>{seller?.store_email}</code>
            </span>
          </div>
        </header>

        <main className="seller-content">{children}</main>
      </div>

      <style jsx>{`
        .seller-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-cream-light);
        }
        .seller-sidebar {
          width: 260px;
          background-color: var(--color-maroon);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
          border-right: 3px solid var(--color-maroon-dark);
          position: fixed;
          top: 0; bottom: 0; left: 0;
          z-index: 50;
        }
        .sidebar-brand {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
        }
        .brand-icon-wrap {
          width: 38px;
          height: 38px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-title {
          font-size: 1.15rem;
          line-height: 1.2;
          color: var(--color-white);
        }
        .brand-code {
          display: block;
          font-size: 0.72rem;
          color: var(--color-mustard);
          font-weight: 700;
        }
        .tier-badge-container {
          padding: 12px 16px 4px;
        }
        .seller-nav {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          color: var(--color-pink-soft);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
          background-color: var(--color-maroon-dark);
          color: var(--color-mustard);
          transform: translateX(4px);
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: rgba(0, 0, 0, 0.25);
          color: var(--color-pink-soft);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 600;
        }
        .seller-main {
          margin-left: 260px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .seller-topbar {
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
        .store-email-badge {
          background-color: var(--color-pink-soft);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-maroon-light);
          font-size: 0.85rem;
        }
        .seller-content {
          padding: 30px;
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

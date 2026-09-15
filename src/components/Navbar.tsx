'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Ticket, Sparkles, User, Store, LogOut, Menu, X, ShieldCheck, QrCode, ChevronDown, Eye } from 'lucide-react';
import { DataStore } from '@/lib/store';
import { User as UserType, Seller as SellerType, StaffAccount as StaffType } from '@/lib/types';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentSeller, setCurrentSeller] = useState<SellerType | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(DataStore.getSessionUser());
    setCurrentSeller(DataStore.getSessionSeller());
    setCurrentStaff(DataStore.getSessionStaff());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    DataStore.setSessionUser(null);
    DataStore.setSessionSeller(null);
    DataStore.setSessionStaff(null);
    // Clear all session keys from localStorage directly
    if (typeof window !== 'undefined') {
      localStorage.removeItem('daebaktix_session_user_v1');
      localStorage.removeItem('daebaktix_session_seller_v1');
      localStorage.removeItem('daebaktix_session_staff_v1');
    }
    setCurrentUser(null);
    setCurrentSeller(null);
    setCurrentStaff(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  /**
   * OWNER ROLE SWITCHER — Development only!
   * This feature allows the owner (isOwner flag) to preview different role UIs
   * without logging out and back in. Must be DISABLED before production go-live.
   */
  const isOwner = currentUser?.role === 'admin' && (currentUser as any)?.isOwner === true;

  const handleRoleSwitch = (targetRole: string) => {
    const users = DataStore.getUsers();
    const sellers = DataStore.getSellers();
    const staff = DataStore.getStaff();

    // Clear all sessions first
    DataStore.setSessionUser(null);
    DataStore.setSessionSeller(null);
    DataStore.setSessionStaff(null);

    if (targetRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin');
      if (adminUser) {
        // Preserve isOwner flag
        DataStore.setSessionUser({ ...adminUser, isOwner: true } as any);
      }
      window.location.href = '/admin/dashboard';
    } else if (targetRole === 'seller') {
      const sellerUser = users.find((u) => u.role === 'seller');
      const sellerRecord = sellers.find((s) => s.status === 'approved');
      if (sellerUser) DataStore.setSessionUser(sellerUser);
      if (sellerRecord) DataStore.setSessionSeller(sellerRecord);
      window.location.href = '/seller/dashboard';
    } else if (targetRole === 'staff') {
      const staffRecord = staff[0];
      if (staffRecord) DataStore.setSessionStaff(staffRecord);
      window.location.href = '/staff/dashboard';
    } else if (targetRole === 'buyer') {
      const buyerUser = users.find((u) => u.role === 'buyer');
      if (buyerUser) DataStore.setSessionUser(buyerUser);
      window.location.href = '/buyer/tickets';
    }

    setRoleSwitcherOpen(false);
  };

  const getDisplayName = () => {
    if (currentStaff) return currentStaff.staff_name.split('(')[0].trim();
    if (currentSeller) return currentSeller.store_name;
    if (currentUser) return currentUser.full_name.split(' ')[0];
    return '';
  };

  const getRoleBadge = () => {
    if (currentStaff) return { label: 'Staf Scanner', className: 'role-badge-mustard' };
    if (currentSeller) return { label: 'Penjual', className: 'role-badge-pink' };
    if (currentUser?.role === 'admin') return { label: 'Admin', className: 'role-badge-mustard' };
    if (currentUser?.role === 'buyer') return { label: 'Pembeli', className: 'role-badge-lavender' };
    return null;
  };

  const getDashboardLink = () => {
    if (currentStaff) return '/staff/dashboard';
    if (currentSeller) return '/seller/dashboard';
    if (currentUser?.role === 'admin') return '/admin/dashboard';
    if (currentUser?.role === 'buyer') return '/buyer/orders';
    return '/';
  };

  const isLoggedIn = !!(currentUser || currentSeller || currentStaff);
  const roleBadge = getRoleBadge();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <div className="brand-badge">
            <Ticket className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Daebak<span className="brand-dot">.</span>Tix</span>
            <span className="brand-tagline">K-Event Ticket Marketplace</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <Link href="/buyer/tickets?category=concert" className="nav-link">
            🎤 Konser K-Pop
          </Link>
          <Link href="/buyer/tickets?category=fanmeet" className="nav-link">
            🫰 Fanmeet Aktor
          </Link>
          <Link href="/buyer/tickets?category=fansign" className="nav-link">
            📸 Fansign
          </Link>
          <a href="#tentang-kami" className="nav-link">
            Tentang Kami
          </a>
        </nav>

        {/* Action Buttons & Session Control */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="session-group">
              {/* Owner Role Switcher — DEV ONLY */}
              {isOwner && (
                <div className="role-switcher-wrap" ref={roleSwitcherRef}>
                  <button
                    className="role-switcher-btn"
                    onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  >
                    <Eye size={14} />
                    <span>Lihat Sebagai</span>
                    <ChevronDown size={14} />
                  </button>
                  {roleSwitcherOpen && (
                    <div className="role-switcher-dropdown">
                      <div className="dropdown-header">Preview Role (Dev Only)</div>
                      <button onClick={() => handleRoleSwitch('admin')}>🛡️ Admin</button>
                      <button onClick={() => handleRoleSwitch('seller')}>🏪 Penjual</button>
                      <button onClick={() => handleRoleSwitch('staff')}>📱 Staf Scanner</button>
                      <button onClick={() => handleRoleSwitch('buyer')}>👤 Pembeli</button>
                    </div>
                  )}
                </div>
              )}

              {/* Dashboard Quick Link */}
              <Link href={getDashboardLink()} className="btn btn-sm btn-primary nav-dashboard-btn">
                {currentStaff ? 'Portal Staf' : currentSeller ? 'Dashboard' : currentUser?.role === 'admin' ? 'Dashboard' : 'Tiket Saya'}
              </Link>

              {/* User dropdown */}
              <div className="user-dropdown-wrap" ref={dropdownRef}>
                <button
                  className="user-pill-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar">
                    <User size={16} />
                  </div>
                  <span className="user-pill-name">{getDisplayName()}</span>
                  {roleBadge && (
                    <span className={`role-badge ${roleBadge.className}`}>
                      {roleBadge.label}
                    </span>
                  )}
                  <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{getDisplayName()}</div>
                      <div className="dropdown-user-email">
                        {currentUser?.email || currentSeller?.store_email || currentStaff?.store_email || ''}
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link href={getDashboardLink()} className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    {currentUser?.role === 'buyer' && (
                      <>
                        <Link href="/buyer/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                          Profil Saya
                        </Link>
                        <Link href="/buyer/orders" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                          Pesanan Saya
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="guest-actions">
              <a href="#section-penjual" className="btn btn-sm btn-outline nav-outline-btn">
                <Store size={16} /> Jual Tiket
              </a>
              <Link href="/buyer/login" className="btn btn-sm btn-primary">
                <User size={16} /> Masuk / Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link href="/buyer/tickets" onClick={() => setMobileMenuOpen(false)}>
            🎟️ Semua Tiket
          </Link>
          <Link href="/buyer/tickets?category=concert" onClick={() => setMobileMenuOpen(false)}>
            🎤 Konser K-Pop
          </Link>
          <Link href="/buyer/tickets?category=fanmeet" onClick={() => setMobileMenuOpen(false)}>
            🫰 Fanmeet Aktor
          </Link>
          <Link href="/buyer/tickets?category=fansign" onClick={() => setMobileMenuOpen(false)}>
            📸 Fansign Album
          </Link>
          <div className="mobile-divider" />
          {isLoggedIn ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                🚪 Keluar (Logout)
              </button>
            </>
          ) : (
            <>
              <Link href="/buyer/login" onClick={() => setMobileMenuOpen(false)}>
                👤 Portal Pembeli
              </Link>
              <Link href="/seller/login" onClick={() => setMobileMenuOpen(false)}>
                🏪 Portal Penjual / Staf
              </Link>
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                🛡️ Portal Admin
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: #FFF0F3;
          border-bottom: 2px solid #F5D5DC;
          box-shadow: 0 2px 12px rgba(122, 28, 44, 0.08);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--color-maroon-dark);
        }
        .brand-badge {
          width: 42px;
          height: 42px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-maroon-dark);
          box-shadow: 2px 2px 0px var(--color-maroon-dark);
        }
        .brand-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          line-height: 1;
          color: var(--color-maroon-dark);
        }
        .brand-dot {
          color: var(--color-mustard);
        }
        .brand-tagline {
          display: block;
          font-size: 0.72rem;
          color: var(--color-maroon);
          font-weight: 500;
          opacity: 0.8;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          color: var(--color-maroon-dark);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--color-maroon);
          background-color: rgba(122, 28, 44, 0.06);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guest-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-outline-btn {
          border-color: var(--color-maroon) !important;
          color: var(--color-maroon) !important;
        }
        .nav-outline-btn:hover {
          background-color: rgba(122, 28, 44, 0.06) !important;
        }
        .session-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-dashboard-btn {
          white-space: nowrap;
        }

        /* User Dropdown */
        .user-dropdown-wrap {
          position: relative;
        }
        .user-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 2px solid #F5D5DC;
          background-color: var(--color-white);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-maroon-dark);
        }
        .user-pill-btn:hover {
          border-color: var(--color-maroon);
          box-shadow: 0 2px 8px rgba(122, 28, 44, 0.12);
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          background-color: var(--color-pink-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-maroon);
        }
        .user-pill-name {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .role-badge {
          font-size: 0.68rem;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .role-badge-mustard {
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
        }
        .role-badge-pink {
          background-color: var(--color-pink-soft);
          color: var(--color-maroon-dark);
        }
        .role-badge-lavender {
          background-color: var(--color-lavender);
          color: var(--color-maroon-dark);
        }
        .dropdown-chevron {
          transition: transform 0.2s ease;
          color: var(--color-text-muted);
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 240px;
          background-color: var(--color-white);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          overflow: hidden;
          animation: dropdownSlide 0.15s ease;
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-user-info {
          padding: 14px 16px;
          background-color: #FFF8F9;
        }
        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-maroon-dark);
        }
        .dropdown-user-email {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
        .dropdown-divider {
          height: 1px;
          background-color: var(--color-border);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          font-size: 0.88rem;
          color: var(--color-text-dark);
          text-decoration: none;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: background-color 0.15s ease;
          text-align: left;
        }
        .dropdown-item:hover {
          background-color: #FFF0F3;
        }
        .logout-item {
          color: #C62828;
          font-weight: 600;
        }
        .logout-item:hover {
          background-color: #FFEBEE;
        }

        /* Role Switcher — DEV ONLY */
        .role-switcher-wrap {
          position: relative;
        }
        .role-switcher-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          border: 2px dashed var(--color-mustard);
          background-color: #FFFDE7;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-maroon-dark);
          transition: all 0.2s ease;
        }
        .role-switcher-btn:hover {
          background-color: var(--color-mustard);
        }
        .role-switcher-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 200px;
          background-color: var(--color-white);
          border: 2px solid var(--color-mustard);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          overflow: hidden;
          animation: dropdownSlide 0.15s ease;
        }
        .role-switcher-dropdown .dropdown-header {
          padding: 10px 14px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-text-muted);
          background-color: #FFFDE7;
          border-bottom: 1px solid var(--color-border);
          letter-spacing: 0.5px;
        }
        .role-switcher-dropdown button {
          display: block;
          width: 100%;
          padding: 10px 14px;
          text-align: left;
          border: none;
          background: none;
          font-family: var(--font-body);
          font-size: 0.88rem;
          cursor: pointer;
          font-weight: 600;
          color: var(--color-text-dark);
          transition: background-color 0.15s ease;
        }
        .role-switcher-dropdown button:hover {
          background-color: #FFF8E1;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-maroon-dark);
          cursor: pointer;
        }
        .mobile-drawer {
          display: flex;
          flex-direction: column;
          background-color: #FFF0F3;
          padding: 16px 20px;
          gap: 4px;
          border-top: 1px solid #F5D5DC;
        }
        .mobile-drawer a, .mobile-drawer button {
          color: var(--color-maroon-dark);
          text-decoration: none;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.92rem;
          text-align: left;
          transition: background-color 0.15s ease;
        }
        .mobile-drawer a:hover, .mobile-drawer button:hover {
          background-color: rgba(122, 28, 44, 0.06);
        }
        .mobile-divider {
          height: 1px;
          background-color: #F5D5DC;
          margin: 6px 0;
        }
        .mobile-logout-btn {
          color: #C62828 !important;
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: block; }
          .guest-actions { display: none; }
          .session-group { display: none; }
        }
      `}</style>
    </header>
  );
}

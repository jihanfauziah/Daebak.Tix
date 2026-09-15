'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, Sparkles, User, Store, LogOut, Menu, X, ShieldCheck, QrCode } from 'lucide-react';
import { DataStore } from '@/lib/store';
import { User as UserType, Seller as SellerType, StaffAccount as StaffType } from '@/lib/types';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentSeller, setCurrentSeller] = useState<SellerType | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(DataStore.getSessionUser());
    setCurrentSeller(DataStore.getSessionSeller());
    setCurrentStaff(DataStore.getSessionStaff());
  }, []);

  const handleLogout = () => {
    DataStore.setSessionUser(null);
    DataStore.setSessionSeller(null);
    DataStore.setSessionStaff(null);
    setCurrentUser(null);
    setCurrentSeller(null);
    setCurrentStaff(null);
    window.location.href = '/';
  };

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
          <Link href="/buyer/tickets" className="nav-link">
            <Ticket size={16} /> Tiket Event
          </Link>
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
          {currentStaff ? (
            <div className="session-pill">
              <span className="sticker-badge badge-mustard">
                <QrCode size={14} /> Staf Scanner
              </span>
              <Link href="/staff/dashboard" className="btn btn-sm btn-primary">
                Portal Staf
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          ) : currentSeller ? (
            <div className="session-pill">
              <span className="sticker-badge badge-pink">
                <Store size={14} /> {currentSeller.store_name}
              </span>
              <Link href="/seller/dashboard" className="btn btn-sm btn-primary">
                Dashboard Penjual
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          ) : currentUser?.role === 'admin' ? (
            <div className="session-pill">
              <span className="sticker-badge badge-mustard">
                <ShieldCheck size={14} /> Admin System
              </span>
              <Link href="/admin/dashboard" className="btn btn-sm btn-primary">
                Dashboard Admin
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          ) : currentUser?.role === 'buyer' ? (
            <div className="session-pill">
              <span className="sticker-badge badge-lavender">
                <User size={14} /> {currentUser.full_name.split(' ')[0]}
              </span>
              <Link href="/buyer/orders" className="btn btn-sm btn-primary">
                Tiket Saya
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <a href="#section-penjual" className="btn btn-sm btn-secondary">
                <Store size={16} /> Jual Tiket
              </a>
              <Link href="/buyer/login" className="btn btn-sm btn-primary">
                <User size={16} /> Masuk / Daftar Pembeli
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
          <Link href="/buyer/login" onClick={() => setMobileMenuOpen(false)}>
            👤 Portal Pembeli
          </Link>
          <Link href="/seller/login" onClick={() => setMobileMenuOpen(false)}>
            🏪 Portal Penjual / Staf
          </Link>
          <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
            🛡️ Portal Admin
          </Link>
        </div>
      )}

      <style jsx>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--color-maroon);
          color: var(--color-white);
          border-bottom: 3px solid var(--color-maroon-dark);
          box-shadow: 0 4px 12px rgba(122, 28, 44, 0.25);
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
          color: var(--color-white);
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
          color: var(--color-cream-light);
        }
        .brand-dot {
          color: var(--color-mustard);
        }
        .brand-tagline {
          display: block;
          font-size: 0.72rem;
          color: var(--color-pink-soft);
          font-weight: 500;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-link {
          color: var(--color-cream-light);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--color-mustard);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guest-actions, .session-pill {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-white);
          cursor: pointer;
        }
        .mobile-drawer {
          display: flex;
          flex-direction: column;
          background-color: var(--color-maroon-dark);
          padding: 16px 20px;
          gap: 12px;
          border-top: 1px solid var(--color-maroon-light);
        }
        .mobile-drawer a {
          color: var(--color-cream-light);
          text-decoration: none;
          font-weight: 600;
          padding: 8px 0;
          border-bottom: 1px dashed var(--color-maroon-light);
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: block; }
          .guest-actions { display: none; }
        }
      `}</style>
    </header>
  );
}

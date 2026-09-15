'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Ticket,
  ShoppingBag,
  Heart,
  QrCode,
  Award,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [buyer, setBuyer] = useState<User | null>(null);

  useEffect(() => {
    const session = DataStore.getSessionUser();
    if (!session || session.role !== 'buyer') {
      if (
        pathname !== '/buyer/login' &&
        pathname !== '/buyer/register' &&
        !pathname.startsWith('/buyer/tickets')
      ) {
        router.push('/buyer/login');
      }
    } else {
      setBuyer(session);
    }
  }, [pathname, router]);

  if (pathname === '/buyer/login' || pathname === '/buyer/register') {
    return <>{children}</>;
  }

  return (
    <div className="buyer-portal-wrapper">
      <Navbar />

      {/* Buyer Sub-Navigation Bar */}
      <div className="buyer-subnav">
        <div className="container buyer-subnav-container">
          <div className="buyer-greeting font-display">
            <span>Halo, <strong>{buyer?.full_name || 'Hallyu Fan'}</strong>!</span>
            <span className="nik-tag font-body">NIK: {buyer?.nik || 'Terverifikasi'}</span>
          </div>

          <nav className="buyer-nav-links font-display">
            <Link
              href="/buyer/tickets"
              className={`subnav-link ${pathname === '/buyer/tickets' ? 'active' : ''}`}
            >
              <Ticket size={16} /> Cari Tiket
            </Link>

            <Link
              href="/buyer/orders"
              className={`subnav-link ${pathname.includes('/buyer/orders') ? 'active' : ''}`}
            >
              <ShoppingBag size={16} /> Pesanan Saya
            </Link>

            <Link
              href="/buyer/wishlist"
              className={`subnav-link ${pathname === '/buyer/wishlist' ? 'active' : ''}`}
            >
              <Heart size={16} /> Wishlist
            </Link>

            <Link
              href="/buyer/loyalty"
              className={`subnav-link ${pathname === '/buyer/loyalty' ? 'active' : ''}`}
            >
              <Award size={16} /> Loyalty ({buyer?.loyalty_points || 0} Pts)
            </Link>

            <Link
              href="/buyer/notifications"
              className={`subnav-link ${pathname === '/buyer/notifications' ? 'active' : ''}`}
            >
              <Bell size={16} /> Notifikasi
            </Link>

            <Link
              href="/buyer/profile"
              className={`subnav-link ${pathname === '/buyer/profile' ? 'active' : ''}`}
            >
              <UserIcon size={16} /> Profil
            </Link>
          </nav>
        </div>
      </div>

      <main className="buyer-main-content">{children}</main>

      <Footer />

      <style jsx>{`
        .buyer-portal-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .buyer-subnav {
          background-color: var(--color-pink-soft);
          border-bottom: 2px solid var(--color-border);
          padding: 10px 0;
        }
        .buyer-subnav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .buyer-greeting {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-maroon-dark);
          font-size: 1rem;
        }
        .nik-tag {
          font-size: 0.78rem;
          background-color: var(--color-white);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-maroon-light);
          color: var(--color-text-muted);
        }
        .buyer-nav-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .subnav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-maroon-dark);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }
        .subnav-link:hover, .subnav-link.active {
          background-color: var(--color-maroon);
          color: var(--color-white);
        }
        .buyer-main-content {
          flex-grow: 1;
          padding: 30px 0;
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { Seller, EventItem, Order } from '@/lib/types';
import {
  CreditCard,
  ShoppingBag,
  Calendar,
  Clock,
  AlertTriangle,
  Award,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const session = DataStore.getSessionSeller();
    setSeller(session);

    if (session) {
      const allEvents = DataStore.getEvents();
      const storeEvents = allEvents.filter((e) => e.seller_id === session.id);
      setMyEvents(storeEvents);

      const storeEventIds = storeEvents.map((e) => e.id);
      const allOrders = DataStore.getOrders();
      const storeOrders = allOrders.filter((o) => storeEventIds.includes(o.event_id));
      setMyOrders(storeOrders);
    }
  }, []);

  const totalOmset = myOrders.reduce((sum, o) => sum + (o.status === 'paid' ? o.total_price : 0), 0);
  const activeEventsCount = myEvents.filter((e) => e.status === 'active').length;

  return (
    <SellerLayout>
      <div className="dashboard-header mb-4">
        <div>
          <h1 className="font-display page-title">Dashboard Penjualan — {seller?.store_name}</h1>
          <p className="page-subtitle">Pantau performa event & status masa aktif paket toko Anda.</p>
        </div>

        <Link href="/seller/events/new" className="btn btn-primary">
          <PlusCircle size={18} /> Buat Event Baru
        </Link>
      </div>

      {/* Package Tier Banner */}
      <div className="tier-banner card-playful mb-4">
        <div className="banner-left">
          <Award size={32} color="var(--color-maroon)" />
          <div>
            <h3 className="font-display text-maroon">
              Status Paket Toko: {seller?.package_type === 'paid_3m' ? 'Akun Paid 3 Bulan (Unlimited)' : seller?.package_type === 'paid_1m' ? 'Akun Paid 1 Bulan (Unlimited)' : 'Akun Free Starter'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              {seller?.package_type === 'free'
                ? 'Minimal masa jual tiket per event adalah 15 Hari. Pastikan selalu memperpanjang (+5d/+7d) agar tiket tidak dinonaktifkan.'
                : 'Bebas membuat event unlimited tanpa batasan durasi minimal.'}
            </p>
          </div>
        </div>

        {seller?.package_type === 'free' && (
          <Link href="/seller/packages" className="btn btn-secondary">
            Upgrade ke Paket Paid →
          </Link>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid mb-4">
        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-maroon">
            <CreditCard size={24} color="var(--color-white)" />
          </div>
          <div>
            <span className="stat-label">Total Omset Toko</span>
            <h3 className="stat-value font-display">
              Rp {totalOmset.toLocaleString('id-ID')}
            </h3>
            <span className="stat-sub">Dari {myOrders.length} transaksi</span>
          </div>
        </div>

        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-mustard">
            <Calendar size={24} color="var(--color-maroon-dark)" />
          </div>
          <div>
            <span className="stat-label">Event Aktif Dijual</span>
            <h3 className="stat-value font-display">{activeEventsCount} Event</h3>
            <span className="stat-sub">Dari total {myEvents.length} event</span>
          </div>
        </div>

        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-pink">
            <ShoppingBag size={24} color="var(--color-maroon-dark)" />
          </div>
          <div>
            <span className="stat-label">Tiket Terjual</span>
            <h3 className="stat-value font-display">
              {myOrders.reduce((sum, o) => sum + o.quantity, 0)} Tiket
            </h3>
            <span className="stat-sub">Total kuota dikurangi</span>
          </div>
        </div>
      </div>

      {/* My Events Preview */}
      <div className="card-playful">
        <div className="section-title-row mb-3">
          <h3 className="font-display text-maroon">Event Milik Toko Anda</h3>
          <Link href="/seller/events" className="btn btn-sm btn-outline">
            Lihat Semua Event ({myEvents.length}) →
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul Event</th>
                <th>Kategori</th>
                <th>Tanggal Event</th>
                <th>Durasi Aktif Jual</th>
                <th>Status Jual</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {myEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Belum ada event yang dibuat. Klik "Buat Event Baru" di atas!
                  </td>
                </tr>
              ) : (
                myEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <strong>{ev.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Artis: {ev.artist_name}
                      </div>
                    </td>
                    <td>
                      <span className="sticker-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {ev.category.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(ev.event_date).toLocaleDateString('id-ID')}</td>
                    <td>{ev.duration_days} Hari</td>
                    <td>
                      <span className={`status-pill status-${ev.status}`}>
                        {ev.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/buyer/tickets/${ev.id}`} target="_blank" className="btn btn-sm btn-secondary">
                        <ExternalLink size={12} /> Preview Public
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .tier-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-pink-soft);
          border: 2px solid var(--color-maroon-light);
        }
        .banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 20px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid var(--color-maroon-dark);
        }
        .bg-maroon { background-color: var(--color-maroon); }
        .bg-mustard { background-color: var(--color-mustard); }
        .bg-pink { background-color: var(--color-pink-soft); }
        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        .stat-value {
          font-size: 1.3rem;
          color: var(--color-maroon-dark);
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th, .admin-table td {
          padding: 12px 14px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-table th {
          background-color: var(--color-cream);
          font-family: var(--font-display);
          color: var(--color-maroon-dark);
        }
      `}</style>
    </SellerLayout>
  );
}

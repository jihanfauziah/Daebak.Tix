'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import {
  CreditCard,
  ShoppingBag,
  Users,
  Store,
  Ticket,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSalesRevenue: 0,
    totalOrdersCount: 0,
    buyersCount: 0,
    sellersCount: 0,
    pendingSellersCount: 0,
    activeTicketsCount: 0,
    scannedTicketsCount: 0,
    totalTicketsCount: 0,
  });

  const [categorySales, setCategorySales] = useState({
    concert: 0,
    fanmeet: 0,
    fansign: 0,
  });

  useEffect(() => {
    const orders = DataStore.getOrders();
    const users = DataStore.getUsers();
    const sellers = DataStore.getSellers();
    const tickets = DataStore.getTickets();
    const events = DataStore.getEvents();

    const revenue = orders.reduce((acc, o) => acc + (o.status === 'paid' ? o.total_price : 0), 0);
    const buyers = users.filter((u) => u.role === 'buyer').length;
    const pendingSellers = sellers.filter((s) => s.status === 'pending').length;
    const activeTickets = tickets.filter((t) => t.status === 'valid').length;
    const scannedTickets = tickets.filter((t) => t.status === 'scanned').length;

    // Calculate category breakdown
    let concertSales = 0;
    let fanmeetSales = 0;
    let fansignSales = 0;

    orders.forEach((o) => {
      const ev = events.find((e) => e.id === o.event_id);
      if (ev) {
        if (ev.category === 'concert') concertSales += o.total_price;
        else if (ev.category === 'fanmeet') fanmeetSales += o.total_price;
        else if (ev.category === 'fansign') fansignSales += o.total_price;
      }
    });

    setStats({
      totalSalesRevenue: revenue,
      totalOrdersCount: orders.length,
      buyersCount: buyers,
      sellersCount: sellers.length,
      pendingSellersCount: pendingSellers,
      activeTicketsCount: activeTickets,
      scannedTicketsCount: scannedTickets,
      totalTicketsCount: tickets.length,
    });

    setCategorySales({
      concert: concertSales,
      fanmeet: fanmeetSales,
      fansign: fansignSales,
    });
  }, []);

  const totalRev = stats.totalSalesRevenue || 1;

  return (
    <AdminLayout>
      <div className="dashboard-header mb-4">
        <h1 className="font-display page-title">Dashboard Ringkasan Platform</h1>
        <p className="page-subtitle">Pantau seluruh performa marketplace Daebak.Tix secara real-time.</p>
      </div>

      {/* Pending Sellers Alert Banner */}
      {stats.pendingSellersCount > 0 && (
        <div className="alert-banner mb-4">
          <AlertTriangle size={20} color="#F57F17" />
          <span>
            Ada <strong>{stats.pendingSellersCount} Pengajuan Penjual Baru</strong> menunggu verifikasi & persetujuan Anda.
          </span>
          <a href="/admin/sellers" className="btn btn-sm btn-secondary ml-auto">
            Verifikasi Sekarang
          </a>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-maroon">
            <CreditCard size={24} color="var(--color-white)" />
          </div>
          <div>
            <span className="stat-label">Total Omset Penjualan</span>
            <h3 className="stat-value font-display">
              Rp {stats.totalSalesRevenue.toLocaleString('id-ID')}
            </h3>
            <span className="stat-sub">Dari seluruh event terdaftar</span>
          </div>
        </div>

        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-mustard">
            <ShoppingBag size={24} color="var(--color-maroon-dark)" />
          </div>
          <div>
            <span className="stat-label">Total Transaksi Pembelian</span>
            <h3 className="stat-value font-display">{stats.totalOrdersCount} Pesanan</h3>
            <span className="stat-sub">Order tiket berhasil</span>
          </div>
        </div>

        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-pink">
            <Users size={24} color="var(--color-maroon-dark)" />
          </div>
          <div>
            <span className="stat-label">Jumlah Akun Pembeli</span>
            <h3 className="stat-value font-display">{stats.buyersCount} User</h3>
            <span className="stat-sub">Terverifikasi NIK</span>
          </div>
        </div>

        <div className="stat-card card-playful">
          <div className="stat-icon-wrap bg-lavender">
            <Store size={24} color="var(--color-maroon-dark)" />
          </div>
          <div>
            <span className="stat-label">Jumlah Toko Penjual</span>
            <h3 className="stat-value font-display">{stats.sellersCount} Toko</h3>
            <span className="stat-sub">
              {stats.pendingSellersCount} Menunggu ACC
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Status Breakdown & Graphic Chart */}
      <div className="charts-grid mt-4">
        {/* Ticket Stats */}
        <div className="card-playful">
          <h3 className="font-display mb-3">Histori & Status Tiket</h3>
          <div className="ticket-stats-row">
            <div className="ticket-stat-box">
              <Ticket size={28} color="var(--color-maroon)" />
              <div>
                <span className="stat-num font-display">{stats.totalTicketsCount}</span>
                <span className="stat-desc">Total Tiket Diterbitkan</span>
              </div>
            </div>

            <div className="ticket-stat-box">
              <Clock size={28} color="#2E7D32" />
              <div>
                <span className="stat-num font-display">{stats.activeTicketsCount}</span>
                <span className="stat-desc">Aktif (Siap Discan)</span>
              </div>
            </div>

            <div className="ticket-stat-box">
              <CheckCircle2 size={28} color="#F57F17" />
              <div>
                <span className="stat-num font-display">{stats.scannedTicketsCount}</span>
                <span className="stat-desc">Selesai Discan di Venue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Revenue Chart */}
        <div className="card-playful">
          <h3 className="font-display mb-3">Distribusi Penjualan per Kategori</h3>
          <div className="chart-bar-container">
            <div className="bar-item">
              <div className="bar-info">
                <span>🎤 Konser K-Pop</span>
                <strong>Rp {categorySales.concert.toLocaleString('id-ID')}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-maroon"
                  style={{ width: `${(categorySales.concert / totalRev) * 100}%` }}
                />
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-info">
                <span>🫰 Fanmeeting Aktor</span>
                <strong>Rp {categorySales.fanmeet.toLocaleString('id-ID')}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-pink-fill"
                  style={{ width: `${(categorySales.fanmeet / totalRev) * 100}%` }}
                />
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-info">
                <span>📸 Fansign Album</span>
                <strong>Rp {categorySales.fansign.toLocaleString('id-ID')}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-mustard-fill"
                  style={{ width: `${(categorySales.fansign / totalRev) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }
        .alert-banner {
          background-color: #FFF8E1;
          border: 2px solid #FFE082;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
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
          width: 52px;
          height: 52px;
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
        .bg-lavender { background-color: var(--color-lavender); }
        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        .stat-value {
          font-size: 1.4rem;
          color: var(--color-maroon-dark);
          line-height: 1.2;
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .ticket-stats-row {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ticket-stat-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background-color: var(--color-cream);
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        .stat-num {
          display: block;
          font-size: 1.3rem;
          color: var(--color-maroon-dark);
        }
        .stat-desc {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
        .chart-bar-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }
        .bar-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          margin-bottom: 4px;
        }
        .bar-track {
          width: 100%;
          height: 14px;
          background-color: var(--color-cream);
          border-radius: var(--radius-pill);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .bar-fill {
          height: 100%;
          border-radius: var(--radius-pill);
          transition: width 0.5s ease;
        }
        .bg-pink-fill { background-color: var(--color-maroon-light); }
        .bg-mustard-fill { background-color: var(--color-mustard-dark); }

        @media (max-width: 900px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
}

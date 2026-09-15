'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { Order, Seller, EventItem } from '@/lib/types';
import { BarChart3, Download, Printer, Filter } from 'lucide-react';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setOrders(DataStore.getOrders());
    setSellers(DataStore.getSellers());
    setEvents(DataStore.getEvents());
  }, []);

  const filteredOrders = orders.filter((o) => {
    const ev = events.find((e) => e.id === o.event_id);
    const matchesCategory = selectedCategory === 'all' || (ev && ev.category === selectedCategory);
    const matchesSeller = selectedSeller === 'all' || (ev && String(ev.seller_id) === selectedSeller);
    return matchesCategory && matchesSeller;
  });

  const totalOmset = filteredOrders.reduce((sum, o) => sum + o.total_price, 0);
  const totalTiket = filteredOrders.reduce((sum, o) => sum + o.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Laporan Penjualan Tiket (Report)</h1>
          <p className="page-subtitle">Filter dan cetak rekapitulasi laporan omset per periode, penjual, atau kategori event.</p>
        </div>

        <button onClick={handlePrint} className="btn btn-primary">
          <Printer size={16} /> Cetak / Export PDF Laporan
        </button>
      </div>

      {/* Filter Options */}
      <div className="card-playful mb-4">
        <div className="filter-row">
          <div className="form-group flex-1">
            <label className="form-label">Filter Penjual / Toko:</label>
            <select
              className="form-select"
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
            >
              <option value="all">-- Semua Toko Penjual --</option>
              {sellers.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.store_name} ({s.account_code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Filter Kategori Event:</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">-- Semua Kategori --</option>
              <option value="concert">Konser K-Pop</option>
              <option value="fanmeet">Fanmeeting Aktor</option>
              <option value="fansign">Fansign Album</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="report-summary-grid mb-4">
        <div className="card-playful bg-cream">
          <span className="label">Total Omset Penjualan (Terfilter):</span>
          <h2 className="font-display text-maroon" style={{ fontSize: '1.8rem' }}>
            Rp {totalOmset.toLocaleString('id-ID')}
          </h2>
        </div>

        <div className="card-playful bg-cream">
          <span className="label">Total Tiket Terjual:</span>
          <h2 className="font-display text-maroon" style={{ fontSize: '1.8rem' }}>
            {totalTiket} Tiket
          </h2>
        </div>

        <div className="card-playful bg-cream">
          <span className="label">Jumlah Transaksi Order:</span>
          <h2 className="font-display text-maroon" style={{ fontSize: '1.8rem' }}>
            {filteredOrders.length} Transaksi
          </h2>
        </div>
      </div>

      {/* Printable Report Table */}
      <div className="card-playful printable-area">
        <div className="report-title-print">
          <h2 className="font-display">Daebak.Tix — Laporan Rekapitulasi Penjualan Tiket</h2>
          <p style={{ fontSize: '0.85rem' }}>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>

        <table className="admin-table mt-3">
          <thead>
            <tr>
              <th>No</th>
              <th>No Order</th>
              <th>Judul Event</th>
              <th>Kategori Seat</th>
              <th>Pembeli (NIK)</th>
              <th>Qty</th>
              <th>Metode Bayar</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Tidak ada data laporan untuk filter ini.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o, idx) => (
                <tr key={o.id}>
                  <td>{idx + 1}</td>
                  <td><code>{o.order_number}</code></td>
                  <td>{o.event_title}</td>
                  <td>{o.category_name}</td>
                  <td>{o.buyer_name} ({o.buyer_nik})</td>
                  <td>{o.quantity}</td>
                  <td>{o.payment_method}</td>
                  <td><strong>Rp {o.total_price.toLocaleString('id-ID')}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .filter-row {
          display: flex;
          gap: 20px;
        }
        .flex-1 { flex: 1; }
        .report-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .bg-cream { background-color: var(--color-cream); }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th, .admin-table td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-table th {
          background-color: var(--color-cream);
          font-family: var(--font-display);
          color: var(--color-maroon-dark);
        }
        .report-title-print {
          display: none;
        }
        @media print {
          .admin-sidebar, .admin-topbar, .filter-row, .page-header {
            display: none !important;
          }
          .report-title-print {
            display: block;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

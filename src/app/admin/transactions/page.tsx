'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { Order } from '@/lib/types';
import { CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(DataStore.getOrders());
  }, []);

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Data Transaksi & Pembayaran</h1>
          <p className="page-subtitle">Histori lengkap transaksi pembelian tiket oleh pembeli.</p>
        </div>
      </div>

      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No. Order</th>
                <th>Nama Pembeli & NIK</th>
                <th>Event & Kategori Tiket</th>
                <th>Jumlah</th>
                <th>Total Harga (IDR)</th>
                <th>Metode Bayar</th>
                <th>Status Pembayaran</th>
                <th>Waktu Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Belum ada transaksi recorded.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <code>{o.order_number}</code>
                    </td>
                    <td>
                      <strong>{o.buyer_name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        NIK: {o.buyer_nik}
                      </div>
                    </td>
                    <td>
                      <div><strong>{o.event_title}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-maroon)' }}>
                        {o.category_name}
                      </div>
                    </td>
                    <td>{o.quantity} Tiket</td>
                    <td>
                      <strong className="font-display text-maroon">
                        Rp {o.total_price.toLocaleString('id-ID')}
                      </strong>
                    </td>
                    <td>
                      <span className="sticker-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {o.payment_method}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${o.status}`}>
                        {o.status === 'paid' ? 'Lunas (Success)' : o.status === 'pending' ? 'Menunggu Bayar' : 'Batal'}
                      </span>
                    </td>
                    <td>{new Date(o.created_at).toLocaleString('id-ID')}</td>
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
    </AdminLayout>
  );
}

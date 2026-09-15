'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { Order, Seller } from '@/lib/types';
import { ShoppingBag, Search } from 'lucide-react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const session = DataStore.getSessionSeller();
    if (session) {
      const myEvents = DataStore.getEvents().filter((e) => e.seller_id === session.id);
      const eventIds = myEvents.map((e) => e.id);
      const allOrders = DataStore.getOrders();
      setOrders(allOrders.filter((o) => eventIds.includes(o.event_id)));
    }
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.buyer_name && o.buyer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.event_title && o.event_title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Daftar Pesanan Masuk (Orders)</h1>
          <p className="page-subtitle">Daftar pesanan tiket yang dibeli oleh customer untuk event Anda.</p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Cari Order No, Nama Pembeli, atau Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '320px' }}
          />
        </div>
      </div>

      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No. Order</th>
                <th>Nama Pembeli & NIK</th>
                <th>Event</th>
                <th>Kategori Seat</th>
                <th>Qty</th>
                <th>Total Harga</th>
                <th>Metode Bayar</th>
                <th>Status</th>
                <th>Waktu Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    Belum ada order masuk untuk toko Anda.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
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
                    <td>{o.event_title}</td>
                    <td>
                      <span className="sticker-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {o.category_name}
                      </span>
                    </td>
                    <td>{o.quantity} Tiket</td>
                    <td>
                      <strong className="font-display text-maroon">
                        Rp {o.total_price.toLocaleString('id-ID')}
                      </strong>
                    </td>
                    <td>{o.payment_method}</td>
                    <td>
                      <span className={`status-pill status-${o.status}`}>
                        {o.status === 'paid' ? 'Lunas' : o.status === 'pending' ? 'Pending' : 'Batal'}
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

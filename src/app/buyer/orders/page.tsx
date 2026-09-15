'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { Order, Ticket } from '@/lib/types';
import { ShoppingBag, QrCode, Calendar, CheckCircle2 } from 'lucide-react';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const buyer = DataStore.getSessionUser();
    if (buyer) {
      const allOrders = DataStore.getOrders();
      setOrders(allOrders.filter((o) => o.buyer_id === buyer.id));

      const allTickets = DataStore.getTickets();
      setTickets(allTickets.filter((t) => t.buyer_id === buyer.id));
    }
  }, []);

  return (
    <BuyerLayout>
      <div className="container">
        <div className="page-header mb-4">
          <div>
            <h1 className="font-display page-title">Riwayat Pesanan & Tiket Saya</h1>
            <p className="page-subtitle">Daftar transaksi dan akses E-Ticket QR Code untuk gate venue.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card-playful text-center py-5">
            <ShoppingBag size={48} color="var(--color-maroon)" />
            <h3 className="font-display mt-2">Belum Ada Pesanan Tiket</h3>
            <p className="text-muted mb-3">Yuk cari event K-Pop atau Fanmeet favoritmu sekarang!</p>
            <Link href="/buyer/tickets" className="btn btn-primary">
              Jelajahi Katalog Tiket
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((o) => {
              const orderTickets = tickets.filter((t) => t.order_id === o.id);
              return (
                <div key={o.id} className="order-card card-playful mb-4">
                  <div className="order-header font-display">
                    <div>
                      <span className="order-num font-display">ORDER #{o.order_number}</span>
                      <span className="order-date font-body text-muted ml-2">
                        • {new Date(o.created_at).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <span className={`status-pill status-${o.status}`}>
                      {o.status === 'paid' ? 'LUNAS (PAID)' : o.status}
                    </span>
                  </div>

                  <div className="order-body py-3">
                    <h3 className="font-display text-maroon" style={{ fontSize: '1.3rem' }}>
                      {o.event_title}
                    </h3>
                    <div className="order-meta font-body mt-1">
                      <span>Artis: <strong>{o.artist_name}</strong></span> |{' '}
                      <span>Kategori Seat: <strong>{o.category_name}</strong> ({o.quantity} Tiket)</span> |{' '}
                      <span>Metode Bayar: <strong>{o.payment_method}</strong></span>
                    </div>

                    <div className="order-price font-display mt-2">
                      Total Pembayaran: Rp {o.total_price.toLocaleString('id-ID')}
                    </div>
                  </div>

                  {/* Issued Tickets for this order */}
                  <div className="issued-tickets-box card-playful">
                    <h4 className="font-display text-maroon mb-2" style={{ fontSize: '1rem' }}>
                      E-Ticket QR Code ({orderTickets.length} Tiket):
                    </h4>

                    <div className="tickets-grid">
                      {orderTickets.map((t) => (
                        <div key={t.id} className="ticket-item-chip card-playful">
                          <div>
                            <strong className="font-display">{t.category_name}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-maroon)' }}>
                              Seat: {t.seat_number}
                            </div>
                            <span className={`status-pill status-${t.status}`} style={{ fontSize: '0.68rem' }}>
                              {t.status === 'valid' ? 'Valid (Belum Discan)' : 'Sudah Discan di Venue'}
                            </span>
                          </div>

                          <Link
                            href={`/buyer/tickets/qr/${t.order_id}`}
                            className="btn btn-sm btn-primary ml-auto"
                          >
                            <QrCode size={14} /> Tampilkan QR
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .order-card {
          border-left: 6px solid var(--color-maroon);
        }
        .order-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 10px;
        }
        .order-num {
          font-size: 1.1rem;
          color: var(--color-maroon-dark);
        }
        .order-meta {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
        .order-price {
          font-size: 1.2rem;
          color: var(--color-maroon);
        }
        .issued-tickets-box {
          background-color: var(--color-cream);
          padding: 16px;
        }
        .tickets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .ticket-item-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-white);
          padding: 12px;
        }
      `}</style>
    </BuyerLayout>
  );
}

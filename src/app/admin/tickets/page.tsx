'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { EventItem, Ticket } from '@/lib/types';
import { Ticket as TicketIcon, Calendar, MapPin, Store, CheckCircle2, Clock, Ban } from 'lucide-react';

export default function AdminTicketsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'tickets'>('events');

  useEffect(() => {
    setEvents(DataStore.getEvents());
    setTickets(DataStore.getTickets());
  }, []);

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Manajemen Tiket & Event</h1>
          <p className="page-subtitle">Pantau seluruh event yang sedang dijual, selesai, dan riwayat penerbitan tiket.</p>
        </div>

        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Daftar Event ({events.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            Histori Tiket QR ({tickets.length})
          </button>
        </div>
      </div>

      {activeTab === 'events' ? (
        <div className="card-playful">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event & Artis</th>
                  <th>Kategori</th>
                  <th>Promoter / Penjual</th>
                  <th>Tanggal & Venue</th>
                  <th>Masa Jual</th>
                  <th>Status Event</th>
                  <th>Sisa Quota Tiket</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="event-cell">
                        <img src={ev.poster_url} alt="" className="event-thumb" />
                        <div>
                          <strong>{ev.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-maroon)' }}>
                            Artis: {ev.artist_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sticker-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {ev.category.toUpperCase()}
                      </span>
                    </td>
                    <td>{ev.seller_name || 'Star Media'}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{new Date(ev.event_date).toLocaleDateString('id-ID')}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {ev.city} ({ev.venue})
                      </div>
                    </td>
                    <td>{ev.duration_days} Hari</td>
                    <td>
                      <span className={`status-pill status-${ev.status}`}>
                        {ev.status === 'active' ? 'Aktif Dijual' : ev.status === 'inactive' ? 'Nonaktif' : 'Selesai'}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {ev.categories.reduce((sum, c) => sum + c.remaining_quota, 0)} /{' '}
                        {ev.categories.reduce((sum, c) => sum + c.quota, 0)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card-playful">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>QR Code Hash Unik</th>
                  <th>Nama Pembeli & NIK</th>
                  <th>Judul Event</th>
                  <th>Seat / Kategori</th>
                  <th>Status Ticket</th>
                  <th>Waktu Scan</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code>{t.qr_code_hash}</code>
                    </td>
                    <td>
                      <strong>{t.buyer_name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        NIK: {t.buyer_nik}
                      </div>
                    </td>
                    <td>{t.event_title}</td>
                    <td>
                      <span className="sticker-badge badge-mustard" style={{ fontSize: '0.75rem' }}>
                        {t.category_name} ({t.seat_number})
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${t.status}`}>
                        {t.status === 'valid' ? 'Valid (Belum Scan)' : t.status === 'scanned' ? 'Sudah Discan' : 'Expired'}
                      </span>
                    </td>
                    <td>
                      {t.scanned_at ? (
                        <div>
                          <div>{new Date(t.scanned_at).toLocaleString('id-ID')}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            Oleh: {t.scanned_by_staff_name || 'Staf Gate'}
                          </div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
        .tab-switcher {
          display: flex;
          gap: 8px;
        }
        .tab-btn {
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
          background-color: var(--color-white);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .tab-btn.active {
          background-color: var(--color-maroon);
          color: var(--color-white);
          border-color: var(--color-maroon-dark);
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
        .event-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .event-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid var(--color-maroon);
        }
      `}</style>
    </AdminLayout>
  );
}

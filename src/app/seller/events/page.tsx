'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { EventItem, Seller } from '@/lib/types';
import { Calendar, PlusCircle, Clock, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SellerEventsPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [extraDays, setExtraDays] = useState<5 | 7>(5);
  const [extendSuccessMsg, setExtendSuccessMsg] = useState('');

  useEffect(() => {
    const session = DataStore.getSessionSeller();
    setSeller(session);

    if (session) {
      const allEvents = DataStore.getEvents();
      setEvents(allEvents.filter((e) => e.seller_id === session.id));
    }
  }, []);

  const refreshEvents = () => {
    if (seller) {
      const allEvents = DataStore.getEvents();
      setEvents(allEvents.filter((e) => e.seller_id === seller.id));
    }
  };

  const handleOpenExtend = (ev: EventItem) => {
    setSelectedEvent(ev);
    setExtendModalOpen(true);
  };

  const confirmExtend = () => {
    if (!selectedEvent) return;
    const updated = DataStore.extendEventDuration(selectedEvent.id, extraDays);
    if (updated) {
      setExtendSuccessMsg(`Berhasil memperpanjang masa jual "${selectedEvent.title}" sebesar +${extraDays} Hari! Tiket kini kembali aktif.`);
      refreshEvents();
      setExtendModalOpen(false);
      setTimeout(() => setExtendSuccessMsg(''), 4000);
    }
  };

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">My Events (Daftar Event Toko)</h1>
          <p className="page-subtitle">Kelola event, sisa kuota seat, dan masa aktif durasi jual tiket.</p>
        </div>

        <Link href="/seller/events/new" className="btn btn-primary">
          <PlusCircle size={18} /> Buat Event Baru
        </Link>
      </div>

      {extendSuccessMsg && (
        <div className="alert-success card-playful mb-4">
          <CheckCircle2 size={20} color="#2E7D32" /> {extendSuccessMsg}
        </div>
      )}

      {/* Rules Banner for Free Sellers */}
      {seller?.package_type === 'free' && (
        <div className="alert-warning card-playful mb-4">
          <AlertTriangle size={24} color="#C62828" />
          <div>
            <strong>Ketentuan Paket Free:</strong> Minimal masa jual tiket 1 event adalah <strong>15 Hari</strong>.
            Jika durasi habis, status event otomatis berubah menjadi <strong>NONAKTIF</strong> (pembelian & scan pintu venue terkunci).
            Perpanjang masa jual event Anda dengan opsi <strong>+5 Hari</strong> atau <strong>+7 Hari</strong> di bawah ini.
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Poster & Event</th>
                <th>Kategori</th>
                <th>Tanggal Event</th>
                <th>Masa Aktif Jual</th>
                <th>Sisa Kuota Tiket</th>
                <th>Status Event</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Belum ada event yang dibuat. Klik "Buat Event Baru" di atas!
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
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
                    <td>
                      <div>{new Date(ev.event_date).toLocaleDateString('id-ID')}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {ev.city} ({ev.venue})
                      </div>
                    </td>
                    <td>
                      <div className="font-display" style={{ fontSize: '1rem' }}>
                        {ev.duration_days} Hari
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Sejak {ev.created_at}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {ev.categories.reduce((s, c) => s + c.remaining_quota, 0)} /{' '}
                        {ev.categories.reduce((s, c) => s + c.quota, 0)}
                      </strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${ev.status}`}>
                        {ev.status === 'active' ? 'Aktif Dijual' : 'Nonaktif (Expired)'}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button
                          onClick={() => handleOpenExtend(ev)}
                          className="btn btn-sm btn-secondary"
                          title="Perpanjang Durasi"
                        >
                          <Clock size={14} /> +Perpanjang
                        </button>
                        <Link
                          href={`/buyer/tickets/${ev.id}`}
                          target="_blank"
                          className="btn btn-sm btn-outline"
                          title="Lihat Public"
                        >
                          <ExternalLink size={14} /> View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTEND DURATION MODAL */}
      {extendModalOpen && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-card card-playful">
            <h3 className="font-display modal-title text-maroon">Perpanjang Masa Jual Event</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }} className="mb-3">
              Perpanjang masa aktif penjualan tiket untuk <strong>"{selectedEvent.title}"</strong>.
            </p>

            <div className="form-group mb-4">
              <label className="form-label">Pilih Tambahan Durasi Masa Jual:</label>
              <div className="option-boxes">
                <label className={`option-box ${extraDays === 5 ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="ext"
                    checked={extraDays === 5}
                    onChange={() => setExtraDays(5)}
                  />
                  <div>
                    <strong>+5 HARI KELUARGA</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Biaya: Rp 150.000</div>
                  </div>
                </label>

                <label className={`option-box ${extraDays === 7 ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="ext"
                    checked={extraDays === 7}
                    onChange={() => setExtraDays(7)}
                  />
                  <div>
                    <strong>+7 HARI MINGGUAN</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Biaya: Rp 200.000</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setExtendModalOpen(false)} className="btn btn-outline">
                Batal
              </button>
              <button onClick={confirmExtend} className="btn btn-primary">
                Bayar & Perpanjang +{extraDays} Hari
              </button>
            </div>
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
        .alert-warning {
          background-color: #FFF8E1;
          border: 2px solid #FFE082;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
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
        .action-row {
          display: flex;
          gap: 6px;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-card {
          width: 100%;
          max-width: 480px;
          background-color: var(--color-white);
        }
        .option-boxes {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }
        .option-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .option-box.selected {
          border-color: var(--color-maroon);
          background-color: var(--color-pink-soft);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
    </SellerLayout>
  );
}

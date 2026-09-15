'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { Ticket as TicketType } from '@/lib/types';
import { QrCode, Calendar, MapPin, ShieldCheck, Ticket, User, CheckCircle2 } from 'lucide-react';

export default function DigitalTicketQrPage() {
  const params = useParams();
  const orderId = Number(params.orderId);

  const [orderTickets, setOrderTickets] = useState<TicketType[]>([]);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);

  useEffect(() => {
    const buyer = DataStore.getSessionUser();
    if (buyer) {
      const tickets = DataStore.getTickets().filter((t) => t.order_id === orderId);
      setOrderTickets(tickets);
    }
  }, [orderId]);

  if (orderTickets.length === 0) {
    return (
      <BuyerLayout>
        <div className="container text-center py-5">
          <h2 className="font-display">E-Ticket Tidak Ditemukan</h2>
        </div>
      </BuyerLayout>
    );
  }

  const currentTicket = orderTickets[selectedTicketIndex];

  return (
    <BuyerLayout>
      <div className="container max-w-600">
        <div className="ticket-view-header text-center mb-4">
          <span className="sticker-badge badge-mustard mb-2">
            <QrCode size={14} /> E-TICKET RESMI GATE CHECK-IN
          </span>
          <h1 className="font-display page-title">Digital E-Ticket QR Code</h1>
          <p className="page-subtitle">Tunjukkan layar HP ini ke petugas staf scanner di pintu venue.</p>
        </div>

        {/* Ticket Selector if > 1 ticket */}
        {orderTickets.length > 1 && (
          <div className="ticket-tabs-row mb-3">
            {orderTickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketIndex(idx)}
                className={`tab-btn font-display ${selectedTicketIndex === idx ? 'active' : ''}`}
              >
                Tiket #{idx + 1} ({t.seat_number})
              </button>
            ))}
          </div>
        )}

        {/* E-TICKET PASS CARD */}
        <div className="eticket-pass-card ticket-cutout card-playful">
          <div className="eticket-top">
            <div className="event-brand font-display">DAEBAK.TIX OFFICIAL PASS</div>
            <span className={`status-pill status-${currentTicket.status}`}>
              {currentTicket.status === 'valid' ? 'VALID (READY TO SCAN)' : 'SUDAH DISCAN (USED)'}
            </span>
          </div>

          <div className="eticket-poster-banner">
            <img src={currentTicket.poster_url} alt="" className="eticket-poster" />
          </div>

          <div className="eticket-info py-3 text-center">
            <h2 className="eticket-title font-display text-maroon">{currentTicket.event_title}</h2>
            <h4 className="eticket-artist font-display">{currentTicket.artist_name}</h4>

            <div className="meta-row mt-2 font-body">
              <div>
                <Calendar size={14} color="var(--color-maroon)" inline />{' '}
                {new Date(currentTicket.event_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div>
                <MapPin size={14} color="var(--color-maroon)" inline /> {currentTicket.city} ({currentTicket.venue})
              </div>
            </div>
          </div>

          {/* Seat & Holder Details */}
          <div className="holder-box card-playful my-3 font-body">
            <div className="holder-line">
              <span>Pemegang Tiket:</span>
              <strong>{currentTicket.buyer_name}</strong>
            </div>
            <div className="holder-line">
              <span>NIK Pemegang:</span>
              <code>{currentTicket.buyer_nik}</code>
            </div>
            <div className="holder-line">
              <span>Kategori & Seat:</span>
              <strong className="text-maroon font-display" style={{ fontSize: '1.1rem' }}>
                {currentTicket.category_name} — {currentTicket.seat_number}
              </strong>
            </div>
          </div>

          {/* QR Code Container with Live Animated Watermark */}
          <div className="qr-container text-center py-3">
            <div className="qr-box-wrap">
              {/* Anti-screenshot Watermark overlay */}
              <div className="watermark-overlay font-display animate-pulse-glow">
                OFFICIAL DAEBAK.TIX PASS • {new Date().toLocaleTimeString('id-ID')}
              </div>

              {/* QR Code SVG / Render */}
              <div className="qr-img-mock">
                <QrCode size={180} color="var(--color-maroon-dark)" />
              </div>
            </div>

            <div className="qr-hash-text font-display text-maroon mt-2">
              <code>{currentTicket.qr_code_hash}</code>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }} className="mt-1">
              🔒 QR Code terenkripsi unik per transaksi & anti-duplikat.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .max-w-600 { max-width: 600px; }
        .page-title {
          font-size: 2.2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .ticket-tabs-row {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .tab-btn {
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-border);
          background-color: var(--color-white);
          cursor: pointer;
        }
        .tab-btn.active {
          background-color: var(--color-maroon);
          color: var(--color-white);
          border-color: var(--color-maroon-dark);
        }
        .eticket-pass-card {
          padding: 24px;
          background-color: var(--color-white);
        }
        .eticket-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px dashed var(--color-maroon);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .event-brand {
          font-size: 0.9rem;
          color: var(--color-maroon-dark);
          letter-spacing: 1px;
        }
        .eticket-poster-banner {
          height: 180px;
          width: 100%;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid var(--color-maroon);
        }
        .eticket-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .eticket-title {
          font-size: 1.6rem;
          line-height: 1.2;
        }
        .eticket-artist {
          font-size: 1.1rem;
          color: var(--color-text-dark);
        }
        .meta-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .holder-box {
          background-color: var(--color-pink-soft);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.88rem;
        }
        .holder-line {
          display: flex;
          justify-content: space-between;
        }
        .qr-box-wrap {
          position: relative;
          display: inline-block;
          background-color: var(--color-pink-soft);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 3px solid var(--color-maroon);
          box-shadow: var(--shadow-md);
        }
        .watermark-overlay {
          position: absolute;
          top: 8px; left: 0; right: 0;
          font-size: 0.65rem;
          color: var(--color-maroon);
          letter-spacing: 1px;
        }
        .qr-img-mock {
          margin-top: 8px;
        }
        .qr-hash-text {
          font-size: 0.95rem;
        }
      `}</style>
    </BuyerLayout>
  );
}

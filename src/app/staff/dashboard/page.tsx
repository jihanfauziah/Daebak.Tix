'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  LogOut,
  Camera,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
  ShieldCheck,
  User,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { StaffAccount, Seller, EventItem, Ticket } from '@/lib/types';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffAccount | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  const [scannedCountToday, setScannedCountToday] = useState(0);
  const [inputQrHash, setInputQrHash] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'failed' | 'scanned_already';
    message: string;
    ticket?: Ticket;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    const sessionStaff = DataStore.getSessionStaff();
    const sessionSeller = DataStore.getSessionSeller();

    if (!sessionStaff || !sessionSeller) {
      router.push('/staff/login');
      return;
    }

    setStaff(sessionStaff);
    setSeller(sessionSeller);

    // Fetch seller's events
    const storeEvents = DataStore.getEvents().filter((e) => e.seller_id === sessionSeller.id);
    setEvents(storeEvents);

    // Calculate scanned tickets count for this staff/seller
    const storeTickets = DataStore.getTickets().filter((t) =>
      storeEvents.some((e) => e.id === t.event_id)
    );
    const scanned = storeTickets.filter((t) => t.status === 'scanned').length;
    setScannedCountToday(scanned);
  }, [router]);

  const handleScanSubmit = (qrHashToTest?: string) => {
    const hash = qrHashToTest || inputQrHash;
    if (!hash.trim()) return;
    if (!staff) return;

    const res = DataStore.scanTicketByQr(hash, staff.staff_name);

    if (res.success) {
      setScanResult({
        status: 'success',
        message: res.message,
        ticket: res.ticket,
      });
      setScannedCountToday((prev) => prev + 1);
    } else {
      if (res.message.includes('SUDAH DIPAKAI')) {
        setScanResult({
          status: 'scanned_already',
          message: res.message,
          ticket: res.ticket,
        });
      } else {
        setScanResult({
          status: 'failed',
          message: res.message,
          ticket: res.ticket,
        });
      }
    }

    setInputQrHash('');
  };

  const handleLogout = () => {
    DataStore.setSessionStaff(null);
    router.push('/staff/login');
  };

  // Sample seller tickets for one-click quick test
  const sellerTickets = DataStore.getTickets().filter((t) =>
    events.some((e) => e.id === t.event_id)
  );

  return (
    <div className="staff-mobile-wrapper">
      {/* Mobile Topbar */}
      <header className="staff-topbar">
        <div className="topbar-brand">
          <QrCode size={22} color="var(--color-mustard)" />
          <div>
            <h1 className="font-display brand-title">{seller?.store_name}</h1>
            <span className="brand-subtitle">{staff?.staff_name}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Keluar">
          <LogOut size={18} />
        </button>
      </header>

      <main className="staff-main-content">
        {/* Scanned Counter Header */}
        <div className="counter-card card-playful text-center mb-3">
          <span className="counter-label font-display">JUMLAH TIKET TERDISCAN HARI INI</span>
          <div className="counter-number font-display">{scannedCountToday}</div>
          <span className="counter-sub">Real-Time Check-In Counter (Gate Venue)</span>
        </div>

        {/* Event Selector */}
        <div className="form-group mb-3">
          <label className="form-label text-white">Pilih Event yang Sedang Discan:</label>
          <select
            className="form-select font-display"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="all">-- Semua Event Aktif Toko ({events.length}) --</option>
            {events.map((ev) => (
              <option key={ev.id} value={String(ev.id)}>
                {ev.title} ({ev.city})
              </option>
            ))}
          </select>
        </div>

        {/* Camera View Finder Simulation */}
        <div className="camera-viewfinder-card card-playful text-center mb-3">
          <div className="camera-frame">
            <Camera size={48} className="camera-icon animate-pulse-glow" />
            <div className="scanner-line"></div>
            <span className="camera-hint font-display">KAMERA SCANNER QR ACTIVE</span>
          </div>

          <div className="manual-scan-box mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-input"
                placeholder="Atau Tempel / Ketik QR Code Hash..."
                value={inputQrHash}
                onChange={(e) => setInputQrHash(e.target.value)}
              />
              <button onClick={() => handleScanSubmit()} className="btn btn-primary">
                VALIDASI TIKET
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test QR Code Buttons */}
        <div className="quick-test-box card-playful mb-3">
          <span className="quick-title font-display">Simulasi Rapid Scan (Quick Test):</span>
          <div className="quick-buttons">
            {sellerTickets.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Belum ada tiket terjual untuk toko ini.
              </span>
            ) : (
              sellerTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleScanSubmit(t.qr_code_hash)}
                  className={`btn btn-sm ${t.status === 'valid' ? 'btn-secondary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {t.buyer_name.split(' ')[0]} ({t.category_name}) - [{t.status}]
                </button>
              ))
            )}
            <button
              onClick={() => handleScanSubmit('DBK-INVALID-HASH-999')}
              className="btn btn-sm btn-outline"
              style={{ color: '#C62828', borderColor: '#EF9A9A', fontSize: '0.75rem' }}
            >
              Test Scan Tiket Palsu
            </button>
          </div>
        </div>

        {/* Scan Result Overlay / Banner */}
        {scanResult.status !== 'idle' && (
          <div
            className={`scan-result-card card-playful ${
              scanResult.status === 'success' ? 'result-success' : 'result-failed'
            }`}
          >
            <div className="result-header">
              {scanResult.status === 'success' ? (
                <CheckCircle2 size={48} color="#FFFFFF" />
              ) : (
                <XCircle size={48} color="#FFFFFF" />
              )}
              <h2 className="result-title font-display">
                {scanResult.status === 'success'
                  ? '✅ TIKET VALID — SILAHKAN MASUK!'
                  : scanResult.status === 'scanned_already'
                  ? '⛔ TIKET SUDAH DIPAKAI (RE-SCAN)!'
                  : '❌ TIKET TIDAK VALID / PALSU!'}
              </h2>
            </div>

            <p className="result-message font-display">{scanResult.message}</p>

            {scanResult.ticket && (
              <div className="ticket-detail-box">
                <div><strong>Nama Pemegang:</strong> {scanResult.ticket.buyer_name}</div>
                <div><strong>NIK:</strong> {scanResult.ticket.buyer_nik}</div>
                <div><strong>Event:</strong> {scanResult.ticket.event_title}</div>
                <div><strong>Seat Kategori:</strong> {scanResult.ticket.category_name} ({scanResult.ticket.seat_number})</div>
                <div><strong>Hash:</strong> <code>{scanResult.ticket.qr_code_hash}</code></div>
              </div>
            )}

            <button
              onClick={() => setScanResult({ status: 'idle', message: '' })}
              className="btn btn-lg btn-secondary mt-3"
              style={{ width: '100%' }}
            >
              <RefreshCw size={18} /> Ready For Next Ticket
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .staff-mobile-wrapper {
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          background-color: var(--color-maroon-dark);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
        }
        .staff-topbar {
          height: 60px;
          background-color: var(--color-maroon);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 2px solid var(--color-maroon-light);
        }
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-title {
          font-size: 1rem;
          color: var(--color-cream-light);
          line-height: 1.1;
        }
        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--color-mustard);
          display: block;
        }
        .logout-btn {
          background: none;
          border: none;
          color: var(--color-white);
          cursor: pointer;
        }
        .staff-main-content {
          padding: 16px;
          flex-grow: 1;
        }
        .counter-card {
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          padding: 16px;
          border: 2px solid var(--color-maroon-dark);
          box-shadow: 3px 3px 0px var(--color-maroon-dark);
        }
        .counter-label {
          font-size: 0.75rem;
          letter-spacing: 1px;
        }
        .counter-number {
          font-size: 3rem;
          line-height: 1;
        }
        .counter-sub {
          font-size: 0.75rem;
        }
        .camera-viewfinder-card {
          background-color: var(--color-white);
          color: var(--color-text-dark);
          padding: 20px;
        }
        .camera-frame {
          height: 200px;
          background-color: #111;
          border-radius: var(--radius-sm);
          border: 3px dashed var(--color-maroon);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: var(--color-mustard);
        }
        .scanner-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background-color: red;
          box-shadow: 0 0 10px red;
          animation: scanAnim 2s infinite linear;
        }
        @keyframes scanAnim {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .camera-hint {
          font-size: 0.78rem;
          margin-top: 10px;
          letter-spacing: 1px;
        }
        .input-group {
          display: flex;
          gap: 6px;
        }
        .quick-test-box {
          background-color: var(--color-cream);
          color: var(--color-text-dark);
          padding: 12px;
        }
        .quick-title {
          font-size: 0.8rem;
          display: block;
          margin-bottom: 8px;
        }
        .quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .scan-result-card {
          padding: 24px;
          text-align: center;
          border-radius: var(--radius-md);
        }
        .result-success {
          background-color: #2E7D32;
          color: #FFFFFF;
          border: 3px solid #1B5E20;
        }
        .result-failed {
          background-color: #C62828;
          color: #FFFFFF;
          border: 3px solid #8E0000;
        }
        .result-title {
          font-size: 1.4rem;
          margin-top: 8px;
        }
        .result-message {
          font-size: 1.1rem;
          margin: 10px 0;
        }
        .ticket-detail-box {
          background-color: rgba(255, 255, 255, 0.15);
          padding: 12px;
          border-radius: var(--radius-sm);
          text-align: left;
          font-size: 0.88rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

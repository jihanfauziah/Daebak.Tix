'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Check, Sparkles, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function SellerPackagesPage() {
  const [selectedTier, setSelectedTier] = useState<string>('paid_1m');
  const [upgradedMsg, setUpgradedMsg] = useState('');

  const handleUpgrade = (tier: string) => {
    const currentSeller = DataStore.getSessionSeller();
    if (!currentSeller) {
      alert('Silahkan login sebagai Penjual terlebih dahulu!');
      window.location.href = '/seller/login';
      return;
    }

    DataStore.approveSeller(currentSeller.id, tier as any);
    setUpgradedMsg(`Berhasil beralih ke paket ${tier.toUpperCase()}! Status akun toko Anda aktif.`);
    setTimeout(() => setUpgradedMsg(''), 4000);
  };

  return (
    <div className="packages-wrapper">
      <Navbar />

      <section className="packages-hero text-center">
        <div className="container">
          <span className="sticker-badge badge-mustard mb-2">
            <Award size={14} /> PILIHAN TIER AKUN PENJUAL DAEBAK.TIX
          </span>
          <h1 className="font-display packages-title">Perbandingan Paket Akses Penjual</h1>
          <p className="packages-subtitle">
            Pilih paket yang paling sesuai dengan kebutuhan event Anda: **Akun Berbayar Unlimited** atau **Akun Free (Per-Event)**.
          </p>

          {upgradedMsg && (
            <div className="alert-success card-playful mt-3">
              <Check size={20} /> {upgradedMsg}
            </div>
          )}
        </div>
      </section>

      {/* Package Comparison Cards */}
      <section className="container py-5">
        <div className="tier-cards-grid">
          {/* Card 1: Paket Free */}
          <div className="tier-card card-playful">
            <div className="tier-header">
              <span className="sticker-badge badge-lavender">AKUN FREE</span>
              <h2 className="tier-name font-display mt-2">Free Starter</h2>
              <p className="tier-desc">Masuk gratis, bayar fitur "Buat Event" terpisah per-event.</p>
              <div className="tier-price font-display">
                Rp 0 <span className="price-unit">/ pendaftaran</span>
              </div>
            </div>

            <div className="tier-features font-body">
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Registrasi toko gratis via verifikasi Admin</span>
              </div>
              <div className="feature-line">
                <Clock size={18} color="#F57F17" />
                <span>Opsi Durasi Event: <strong>7 Hari</strong> atau <strong>12 Hari</strong></span>
              </div>
              <div className="feature-line warning-bg">
                <AlertTriangle size={18} color="#C62828" />
                <span>
                  <strong>Aturan Wajib:</strong> Karena min. masa jual 1 event = <strong>15 Hari</strong>, penjual wajib memperpanjang <strong>+5d atau +7d</strong>. Jika tidak, tiket otomatis <strong>DINONAKTIFKAN</strong>.
                </span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Akses 1 Akun Staf Scanner Venue</span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('free')}
              className="btn btn-outline mt-auto"
              style={{ width: '100%' }}
            >
              Pilih Paket Free
            </button>
          </div>

          {/* Card 2: Paid 1 Bulan (RECOMMENDED) */}
          <div className="tier-card card-playful tier-recommended">
            <div className="recommended-badge font-display">BEST VALUE</div>
            <div className="tier-header">
              <span className="sticker-badge badge-mustard">AKUN BERBAYAR 1 BULAN</span>
              <h2 className="tier-name font-display mt-2">Pro Seller (1 Month)</h2>
              <p className="tier-desc">Akses penuh 30 hari. Bebas buat event unlimited tanpa perlu perpanjang manual.</p>
              <div className="tier-price font-display">
                Rp 1.500.000 <span className="price-unit">/ 30 hari aktif</span>
              </div>
            </div>

            <div className="tier-features font-body">
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span><strong>Bebas Buat Event Unlimited</strong> selama 30 hari</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Tidak perlu bayar perpanjangan +5d/+7d</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Tiket <strong>selalu aktif & bisa discan</strong> kapan saja</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Akses Akun Staf Scanner Unrestricted</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Laporan Penjualan & Analytics Pro</span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('paid_1m')}
              className="btn btn-primary btn-lg mt-auto"
              style={{ width: '100%' }}
            >
              Beli Akses 1 Bulan
            </button>
          </div>

          {/* Card 3: Paid 3 Bulan */}
          <div className="tier-card card-playful">
            <div className="tier-header">
              <span className="sticker-badge badge-pink">AKUN BERBAYAR 3 BULAN</span>
              <h2 className="tier-name font-display mt-2">VIP Enterprise (3 Months)</h2>
              <p className="tier-desc">Hemat maksimal untuk promoter/agensi event skala besar.</p>
              <div className="tier-price font-display">
                Rp 3.800.000 <span className="price-unit">/ 90 hari aktif</span>
              </div>
            </div>

            <div className="tier-features font-body">
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span><strong>Bebas Buat Event Unlimited</strong> selama 90 hari</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Hemat hingga 20% dibanding bulanan</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Prioritas Verifikasi Admin Fast-Track</span>
              </div>
              <div className="feature-line">
                <Check size={18} color="var(--color-maroon)" />
                <span>Unlimited Multi-Staf Scanner Account</span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('paid_3m')}
              className="btn btn-secondary mt-auto"
              style={{ width: '100%' }}
            >
              Beli Akses 3 Bulan
            </button>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="comparison-table-wrap card-playful mt-5">
          <h3 className="font-display text-center text-maroon mb-4">Tabel Perbandingan Fitur Paket</h3>
          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Fitur / Akses Penjual</th>
                  <th>Akun Free (Per-Event)</th>
                  <th>Akun Paid 1 Bulan</th>
                  <th>Akun Paid 3 Bulan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Biaya Pendaftaran Akun Toko</td>
                  <td><strong className="text-success">GRATIS</strong></td>
                  <td>Rp 1.500.000</td>
                  <td>Rp 3.800.000</td>
                </tr>
                <tr>
                  <td>Jumlah Event Bisa Dibuat</td>
                  <td>1 Event (Berbayar Per-Event)</td>
                  <td><strong>UNLIMITED</strong></td>
                  <td><strong>UNLIMITED</strong></td>
                </tr>
                <tr>
                  <td>Opsi Durasi Jual Tiket Event</td>
                  <td>7 Hari atau 12 Hari</td>
                  <td>Bebas Sesuai Tanggal Event</td>
                  <td>Bebas Sesuai Tanggal Event</td>
                </tr>
                <tr>
                  <td>Kewajiban Perpanjang (+5d / +7d)</td>
                  <td><span className="status-pill status-cancelled">WAJIB (Min 15 Hari)</span></td>
                  <td><span className="status-pill status-active">TIDAK PERLU</span></td>
                  <td><span className="status-pill status-active">TIDAK PERLU</span></td>
                </tr>
                <tr>
                  <td>Konsekuensi Jika Masa Jual Habis</td>
                  <td>Tiket otomatis <strong>NONAKTIF & BANNED SCAN</strong></td>
                  <td>Tiket tetap <strong>AKTIF</strong> selama masa 30d</td>
                  <td>Tiket tetap <strong>AKTIF</strong> selama masa 90d</td>
                </tr>
                <tr>
                  <td>Jumlah Akun Staf Gate Scanner</td>
                  <td>1 Akun Staf</td>
                  <td>3 Akun Staf Gate</td>
                  <td>Unlimited Akun Staf</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .packages-hero {
          background-color: var(--color-pink-soft);
          padding: 60px 0 40px;
          border-bottom: 3px solid var(--color-border);
        }
        .packages-title {
          font-size: 2.5rem;
          color: var(--color-maroon-dark);
          margin-top: 8px;
        }
        .packages-subtitle {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          max-width: 680px;
          margin: 8px auto 0;
        }
        .tier-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .tier-card {
          display: flex;
          flex-direction: column;
          padding: 30px;
          position: relative;
        }
        .tier-recommended {
          border: 3px solid var(--color-maroon);
          box-shadow: 0 10px 30px rgba(122, 28, 44, 0.2);
          background-color: var(--color-cream-light);
        }
        .recommended-badge {
          position: absolute;
          top: -14px;
          right: 20px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-maroon-dark);
        }
        .tier-name {
          font-size: 1.6rem;
          color: var(--color-maroon-dark);
        }
        .tier-desc {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .tier-price {
          font-size: 2rem;
          color: var(--color-maroon);
          margin-bottom: 24px;
        }
        .price-unit {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          font-family: var(--font-body);
        }
        .tier-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
          font-size: 0.9rem;
        }
        .feature-line {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .warning-bg {
          background-color: #FFF8E1;
          padding: 10px;
          border-radius: var(--radius-sm);
          border: 1px dashed #FFE082;
          font-size: 0.82rem;
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.92rem;
        }
        .comparison-table th, .comparison-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .comparison-table th {
          background-color: var(--color-cream);
          font-family: var(--font-display);
          color: var(--color-maroon-dark);
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          padding: 12px 20px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Settings, Save, ShieldCheck, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pricing, setPricing] = useState({
    freePackageDurationDays: 15,
    freePackageOptions: '7 Hari / 12 Hari',
    extensionFee5Days: 150000,
    extensionFee7Days: 200000,
    paid1MonthPrice: 1500000,
    paid3MonthPrice: 3800000,
    adminFeePerTicket: 10000,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Pengaturan Sistem & Harga Paket</h1>
          <p className="page-subtitle">Konfigurasi batasan durasi penjualan, biaya perpanjangan event, dan paket akun penjual.</p>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} /> Simpan Pengaturan
        </button>
      </div>

      {savedSuccess && (
        <div className="alert-success mb-4 card-playful">
          <Check size={18} color="#2E7D32" /> Pengaturan sistem berhasil diperbarui!
        </div>
      )}

      <form onSubmit={handleSave} className="settings-grid">
        {/* Paket Akun Penjual */}
        <div className="card-playful">
          <h3 className="font-display mb-3 text-maroon">1. Paket Akun Penjual (Tier Pricing)</h3>
          
          <div className="form-group">
            <label className="form-label">Harga Paket Berbayar 1 Bulan (IDR)</label>
            <input
              type="number"
              className="form-input"
              value={pricing.paid1MonthPrice}
              onChange={(e) => setPricing({ ...pricing, paid1MonthPrice: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Penjual bebas membuat event unlimited selama 30 hari aktif.
            </span>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Harga Paket Berbayar 3 Bulan (IDR)</label>
            <input
              type="number"
              className="form-input"
              value={pricing.paid3MonthPrice}
              onChange={(e) => setPricing({ ...pricing, paid3MonthPrice: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Diskon spesial paket 90 hari aktif unlimited event.
            </span>
          </div>
        </div>

        {/* Paket Free & Perpanjangan Event */}
        <div className="card-playful">
          <h3 className="font-display mb-3 text-maroon">2. Aturan Paket Free & Perpanjangan Event</h3>

          <div className="form-group">
            <label className="form-label">Minimal Masa Jual 1 Event (Hari)</label>
            <input
              type="number"
              className="form-input"
              value={pricing.freePackageDurationDays}
              onChange={(e) => setPricing({ ...pricing, freePackageDurationDays: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Ketentuan: Minimal masa jual 1 event adalah 15 hari.
            </span>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Biaya Perpanjang Durasi Event +5 Hari (IDR)</label>
            <input
              type="number"
              className="form-input"
              value={pricing.extensionFee5Days}
              onChange={(e) => setPricing({ ...pricing, extensionFee5Days: Number(e.target.value) })}
            />
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Biaya Perpanjang Durasi Event +7 Hari (IDR)</label>
            <input
              type="number"
              className="form-input"
              value={pricing.extensionFee7Days}
              onChange={(e) => setPricing({ ...pricing, extensionFee7Days: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* General Admin Fee */}
        <div className="card-playful" style={{ gridColumn: 'span 2' }}>
          <h3 className="font-display mb-3 text-maroon">3. Admin Fee Marketplace</h3>
          <div className="form-group">
            <label className="form-label">Biaya Admin Marketplace per Tiket (IDR)</label>
            <input
              type="number"
              className="form-input"
              style={{ maxWidth: '300px' }}
              value={pricing.adminFeePerTicket}
              onChange={(e) => setPricing({ ...pricing, adminFeePerTicket: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Biaya penanganan tiket otomatis yang ditambahkan saat pembeli checkout.
            </span>
          </div>
        </div>
      </form>

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
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          border: 1px solid #A5D6A7;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </AdminLayout>
  );
}

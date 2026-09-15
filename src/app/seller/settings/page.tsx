'use client';

import React, { useState } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { Settings, Save, Check } from 'lucide-react';

export default function SellerSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyScan, setNotifyScan] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Settings & Preferensi Toko</h1>
          <p className="page-subtitle">Atur notifikasi penjualan dan preferensi akun penjual.</p>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} /> Simpan
        </button>
      </div>

      {saved && (
        <div className="alert-success card-playful mb-4">
          <Check size={18} color="#2E7D32" /> Preferensi toko berhasil disimpan!
        </div>
      )}

      <div className="card-playful max-w-600">
        <h3 className="font-display text-maroon mb-3">Pengaturan Notifikasi</h3>

        <div className="form-group mb-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={notifyOrder}
              onChange={(e) => setNotifyOrder(e.target.checked)}
            />
            <span>Kirim notifikasi email setiap ada transaksi tiket masuk baru</span>
          </label>
        </div>

        <div className="form-group mb-4">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={notifyScan}
              onChange={(e) => setNotifyScan(e.target.checked)}
            />
            <span>Kirim notifikasi real-time saat staf gate memvalidasi tiket di venue</span>
          </label>
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
        .max-w-600 { max-width: 600px; }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.92rem;
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </SellerLayout>
  );
}

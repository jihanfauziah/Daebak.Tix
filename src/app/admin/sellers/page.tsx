'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { Seller } from '@/lib/types';
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  User,
  MapPin,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'free' | 'paid_1m' | 'paid_3m'>('free');
  const [simulatedEmailSent, setSimulatedEmailSent] = useState<Seller | null>(null);

  useEffect(() => {
    setSellers(DataStore.getSellers());
  }, []);

  const refreshSellers = () => {
    setSellers(DataStore.getSellers());
  };

  const handleApprove = (seller: Seller) => {
    setSelectedSeller(seller);
    setSelectedPackage(seller.package_type || 'free');
    setApprovalModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedSeller) return;
    const updated = DataStore.approveSeller(selectedSeller.id, selectedPackage);
    if (updated) {
      setSimulatedEmailSent(updated);
      refreshSellers();
      setApprovalModalOpen(false);
    }
  };

  const handleReject = (sellerId: number) => {
    if (confirm('Apakah Anda yakin ingin MENOLAK pengajuan penjual ini?')) {
      DataStore.rejectSeller(sellerId);
      refreshSellers();
    }
  };

  const filtered = sellers.filter((s) => (filter === 'all' ? true : s.status === filter));

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Manajemen Penjual Tiket</h1>
          <p className="page-subtitle">Verifikasi & setujui pengajuan toko penjual baru.</p>
        </div>

        <div className="filter-pills">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Semua ({sellers.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Menunggu ACC ({sellers.filter((s) => s.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Disetujui ({sellers.filter((s) => s.status === 'approved').length})
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Ditolak ({sellers.filter((s) => s.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Sellers List Table */}
      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Toko & Kode Akun</th>
                <th>Pemilik (Data Diri)</th>
                <th>Email Toko</th>
                <th>Tipe Paket</th>
                <th>Status ACC</th>
                <th>Tanggal Pengajuan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Tidak ada data penjual untuk filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div>
                        <strong>{s.store_name}</strong>
                        <div className="font-display text-maroon" style={{ fontSize: '0.85rem' }}>
                          Kode: <code>{s.account_code}</code>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{s.owner_name || 'N/A'}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          NIK: {s.nik || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>{s.store_email}</td>
                    <td>
                      <span className="sticker-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {s.package_type === 'paid_3m'
                          ? 'Paid 3 Bulan'
                          : s.package_type === 'paid_1m'
                          ? 'Paid 1 Bulan'
                          : 'Paket Free (7d/12d)'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${s.status}`}>
                        {s.status === 'approved'
                          ? 'Disetujui'
                          : s.status === 'rejected'
                          ? 'Ditolak'
                          : 'Menunggu ACC'}
                      </span>
                    </td>
                    <td>{s.created_at}</td>
                    <td>
                      <div className="action-row">
                        {s.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(s)}
                              className="btn btn-sm btn-primary"
                              title="Setujui Pengajuan"
                            >
                              <CheckCircle2 size={14} /> Setujui
                            </button>
                            <button
                              onClick={() => handleReject(s.id)}
                              className="btn btn-sm btn-outline"
                              style={{ color: '#C62828', borderColor: '#EF9A9A' }}
                              title="Tolak Pengajuan"
                            >
                              <XCircle size={14} /> Tolak
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedSeller(s)}
                          className="btn btn-sm btn-secondary"
                          title="Lihat Detail"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      {approvalModalOpen && selectedSeller && (
        <div className="modal-overlay">
          <div className="modal-card card-playful">
            <h3 className="font-display modal-title">Setujui Toko Penjual</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }} className="mb-3">
              Tentukan paket akses untuk toko <strong>{selectedSeller.store_name}</strong>. Setelah disetujui, sistem akan otomatis menerbitkan email login & Kode Akun Unik <code>{selectedSeller.account_code}</code>.
            </p>

            <div className="form-group mb-4">
              <label className="form-label">Pilih Paket Akses Penjual:</label>
              <select
                className="form-select"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value as any)}
              >
                <option value="free">Paket Free (Per-event 7 hari / 12 hari + Opsi Perpanjang)</option>
                <option value="paid_1m">Paket Berbayar 1 Bulan (Bebas Buat Event Unlimited)</option>
                <option value="paid_3m">Paket Berbayar 3 Bulan (Bebas Buat Event Unlimited)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setApprovalModalOpen(false)} className="btn btn-outline">
                Batal
              </button>
              <button onClick={confirmApprove} className="btn btn-primary">
                <Send size={16} /> Setujui & Kirim Email Kredensial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED EMAIL MODAL */}
      {simulatedEmailSent && (
        <div className="modal-overlay">
          <div className="modal-card card-playful email-sim-card">
            <div className="email-header font-display">
              <Mail size={24} color="var(--color-maroon)" /> EMAIL REGISTRASI TERKIRIM
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }} className="mb-3">
              Simulasi email yang otomatis terkirim ke penjual (<code>{simulatedEmailSent.store_email}</code>):
            </p>

            <div className="email-body">
              <h4 className="font-display text-maroon">Selamat! Toko Anda Telah Disetujui di Daebak.Tix</h4>
              <p>Halo <strong>{simulatedEmailSent.owner_name || simulatedEmailSent.store_name}</strong>,</p>
              <p>Pengajuan akun toko <strong>"{simulatedEmailSent.store_name}"</strong> telah disetujui oleh Super Admin. Berikut kredensial portal khusus toko Anda:</p>
              
              <div className="cred-box">
                <div><strong>Link Portal Penjual:</strong> <code>https://daebaktix.co.id/seller/login</code></div>
                <div><strong>Kode Akun Unik:</strong> <code>{simulatedEmailSent.account_code}</code></div>
                <div><strong>Email Toko:</strong> <code>{simulatedEmailSent.store_email}</code></div>
                <div><strong>Password Default:</strong> <code>seller123</code></div>
                <div><strong>Tipe Paket:</strong> {simulatedEmailSent.package_type.toUpperCase()}</div>
              </div>

              <p style={{ fontSize: '0.82rem', fontStyle: 'italic', marginTop: '10px' }}>
                *Gunakan Kode Akun & Email Toko di atas untuk login ke Dashboard Penjual maupun Portal Scanner Staf.
              </p>
            </div>

            <button
              onClick={() => setSimulatedEmailSent(null)}
              className="btn btn-primary mt-3"
              style={{ width: '100%' }}
            >
              Tutup Preview Email
            </button>
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
        .filter-pills {
          display: flex;
          gap: 8px;
        }
        .filter-btn {
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
          background-color: var(--color-white);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .filter-btn.active {
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
          max-width: 500px;
          background-color: var(--color-white);
        }
        .email-sim-card {
          max-width: 580px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .email-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          color: var(--color-maroon-dark);
          border-bottom: 2px dashed var(--color-maroon);
          padding-bottom: 10px;
          margin-bottom: 14px;
        }
        .email-body {
          background-color: var(--color-pink-soft);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-maroon-light);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .cred-box {
          background-color: var(--color-white);
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--color-maroon);
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}</style>
    </AdminLayout>
  );
}

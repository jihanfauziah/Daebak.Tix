'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { Seller, StaffAccount } from '@/lib/types';
import { Users, PlusCircle, QrCode, ShieldCheck, Key, CheckCircle2 } from 'lucide-react';

export default function SellerStaffPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);

  // Form State
  const [staffName, setStaffName] = useState('');
  const [username, setUsername] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const session = DataStore.getSessionSeller();
    setSeller(session);

    if (session) {
      const allStaff = DataStore.getStaff();
      setStaffList(allStaff.filter((s) => s.seller_id === session.id));
    }
  }, []);

  const refreshStaff = () => {
    if (seller) {
      const allStaff = DataStore.getStaff();
      setStaffList(allStaff.filter((s) => s.seller_id === seller.id));
    }
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;

    DataStore.createStaff(
      seller.id,
      staffName,
      username,
      seller.account_code,
      seller.store_email
    );

    setSuccessMsg(`Berhasil menerbitkan akun staf baru "${staffName}"!`);
    setStaffName('');
    setUsername('');
    refreshStaff();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Buat & Kelola Akun Staf Scanner</h1>
          <p className="page-subtitle">Terbitkan akun petugas gate venue yang terhubung dengan Kode Akun Toko Anda.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert-success card-playful mb-4">
          <CheckCircle2 size={20} color="#2E7D32" /> {successMsg}
        </div>
      )}

      <div className="staff-grid">
        {/* Create Staff Form */}
        <div className="card-playful">
          <h3 className="font-display text-maroon mb-3">Generate Akun Staf Lapangan</h3>
          
          <form onSubmit={handleCreateStaff}>
            <div className="form-group">
              <label className="form-label">Kode Akun Toko (Otomatis Linked)</label>
              <input
                type="text"
                disabled
                className="form-input bg-disabled font-display text-maroon"
                value={seller?.account_code || 'SM-8891'}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Staf hanya dapat memvalidasi tiket milik toko <strong>{seller?.store_name}</strong>.
              </span>
            </div>

            <div className="form-group mt-3">
              <label className="form-label">Email Toko (Untuk Login Staf)</label>
              <input
                type="text"
                disabled
                className="form-input bg-disabled"
                value={seller?.store_email || 'contact@starmedia.co.id'}
              />
            </div>

            <div className="form-group mt-3">
              <label className="form-label">Nama Petugas / Pos Staf Gate</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="mis. Siti Rahma (Staf Gate 1)"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label className="form-label">Username Staf</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="mis. staf_gate1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3" style={{ width: '100%' }}>
              <PlusCircle size={16} /> Terbitkan Akun Staf
            </button>
          </form>
        </div>

        {/* Existing Staff List */}
        <div className="card-playful">
          <h3 className="font-display text-maroon mb-3">Daftar Akun Staf Aktif ({staffList.length})</h3>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Petugas / Gate</th>
                  <th>Username</th>
                  <th>Kode Akun Linked</th>
                  <th>Portal Scan</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Belum ada staf yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  staffList.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <strong>{st.staff_name}</strong>
                      </td>
                      <td>@{st.username}</td>
                      <td>
                        <code>{st.account_code}</code>
                      </td>
                      <td>
                        <span className="sticker-badge badge-mustard" style={{ fontSize: '0.72rem' }}>
                          <QrCode size={12} /> MOBILE SCANNER READY
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="login-instructions card-playful mt-4">
            <h4 className="font-display text-maroon">Petunjuk Login Staf Gate:</h4>
            <ol style={{ fontSize: '0.85rem', marginLeft: '18px', lineHeight: '1.6' }}>
              <li>Staf membuka portal mobile di: <code>https://daebaktix.co.id/staff/login</code></li>
              <li>Staf memasukkan <strong>Email Toko</strong> (<code>{seller?.store_email}</code>), <strong>Password Toko</strong>, dan <strong>Kode Akun</strong> (<code>{seller?.account_code}</code>).</li>
              <li>Staf langsung terhubung ke kamera scanner QR Code tiket event toko Anda!</li>
            </ol>
          </div>
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
        .staff-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 20px;
        }
        .bg-disabled {
          background-color: var(--color-pink-soft);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th, .admin-table td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-table th {
          background-color: var(--color-cream);
          font-family: var(--font-display);
          color: var(--color-maroon-dark);
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-instructions {
          background-color: var(--color-cream);
          padding: 16px;
        }
        @media (max-width: 900px) {
          .staff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </SellerLayout>
  );
}

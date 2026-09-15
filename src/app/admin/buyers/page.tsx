'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { User } from '@/lib/types';
import { Users, Search, ShieldCheck, Award } from 'lucide-react';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const users = DataStore.getUsers();
    setBuyers(users.filter((u) => u.role === 'buyer'));
  }, []);

  const filtered = buyers.filter(
    (b) =>
      b.full_name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      (b.nik && b.nik.includes(search))
  );

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Manajemen Akun Pembeli</h1>
          <p className="page-subtitle">Daftar pengguna terdaftar dengan sistem verifikasi 1 NIK = 1 Akun.</p>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari NIK, nama, atau email pembeli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', width: '300px' }}
          />
        </div>
      </div>

      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NIK (Identitas Unik)</th>
                <th>Nama Lengkap</th>
                <th>Email & Telepon</th>
                <th>Umur / Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Poin Loyalty</th>
                <th>Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Tidak ada data akun pembeli.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="font-display text-maroon">
                        <code>{b.nik || 'N/A'}</code>
                      </span>
                    </td>
                    <td>
                      <strong>{b.full_name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        @{b.username}
                      </div>
                    </td>
                    <td>
                      <div>{b.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {b.phone || '-'}
                      </div>
                    </td>
                    <td>
                      {b.age ? `${b.age} thn` : '-'}
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {b.dob || '-'}
                      </div>
                    </td>
                    <td>{b.gender || '-'}</td>
                    <td>
                      <span className="sticker-badge badge-mustard" style={{ fontSize: '0.75rem' }}>
                        <Award size={12} /> {b.loyalty_points || 0} Pts
                      </span>
                    </td>
                    <td>{b.created_at || '2026-03-01'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
        .search-box {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
      `}</style>
    </AdminLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { Seller } from '@/lib/types';
import { Store, User, MapPin, Mail, ShieldCheck, Key } from 'lucide-react';

export default function SellerProfilePage() {
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    setSeller(DataStore.getSessionSeller());
  }, []);

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Profil Toko Penjual</h1>
          <p className="page-subtitle">Informasi identitas toko & pemilik terverifikasi admin.</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card-playful">
          <h3 className="font-display text-maroon mb-3">Informasi Toko / Agensi</h3>

          <div className="info-item">
            <span className="info-label">Nama Toko:</span>
            <strong>{seller?.store_name}</strong>
          </div>

          <div className="info-item">
            <span className="info-label">Kode Akun Unik:</span>
            <span className="font-display text-maroon" style={{ fontSize: '1.2rem' }}>
              <code>{seller?.account_code}</code>
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Email Toko:</span>
            <span>{seller?.store_email}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Alamat Toko:</span>
            <span>{seller?.store_address}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Deskripsi Toko:</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {seller?.store_desc}
            </p>
          </div>
        </div>

        <div className="card-playful">
          <h3 className="font-display text-maroon mb-3">Data Pemilik (KTP / Identitas)</h3>

          <div className="info-item">
            <span className="info-label">Nama Pemilik:</span>
            <strong>{seller?.owner_name || 'Choi Jin Woo'}</strong>
          </div>

          <div className="info-item">
            <span className="info-label">NIK Pemilik:</span>
            <code>{seller?.nik || '3171098765430002'}</code>
          </div>

          <div className="info-item">
            <span className="info-label">Status Verifikasi Admin:</span>
            <span className="status-pill status-approved">VERIFIED SELLER</span>
          </div>

          <div className="info-item">
            <span className="info-label">Paket Aktif:</span>
            <span className="sticker-badge badge-mustard">
              {seller?.package_type?.toUpperCase()}
            </span>
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
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 0;
          border-bottom: 1px dashed var(--color-border);
        }
        .info-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }
      `}</style>
    </SellerLayout>
  );
}

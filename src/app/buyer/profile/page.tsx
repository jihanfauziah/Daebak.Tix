'use client';

import React, { useState, useEffect } from 'react';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { User } from '@/lib/types';
import { User as UserIcon, ShieldCheck, Mail, Phone, Calendar, Award } from 'lucide-react';

export default function BuyerProfilePage() {
  const [buyer, setBuyer] = useState<User | null>(null);

  useEffect(() => {
    setBuyer(DataStore.getSessionUser());
  }, []);

  return (
    <BuyerLayout>
      <div className="container max-w-600">
        <div className="page-header mb-4">
          <div>
            <h1 className="font-display page-title">Profil Akun Saya</h1>
            <p className="page-subtitle">Informasi identitas pembeli terverifikasi NIK.</p>
          </div>
        </div>

        <div className="card-playful">
          <div className="text-center pb-3 mb-3 border-bottom">
            <div className="avatar-circle font-display mx-auto mb-2">
              {buyer?.full_name.charAt(0) || 'J'}
            </div>
            <h2 className="font-display text-maroon">{buyer?.full_name}</h2>
            <span className="sticker-badge badge-mustard" style={{ fontSize: '0.78rem' }}>
              <ShieldCheck size={12} /> VERIFIED BUYER (NIK AUTHENTICATED)
            </span>
          </div>

          <div className="info-list">
            <div className="info-row">
              <span className="label">NIK (1 orang = 1 akun):</span>
              <span className="font-display text-maroon font-bold">
                <code>{buyer?.nik || '3201041998051201'}</code>
              </span>
            </div>

            <div className="info-row">
              <span className="label">Username:</span>
              <span>@{buyer?.username}</span>
            </div>

            <div className="info-row">
              <span className="label">Email:</span>
              <span>{buyer?.email}</span>
            </div>

            <div className="info-row">
              <span className="label">No. Telepon / WA:</span>
              <span>{buyer?.phone || '085711223344'}</span>
            </div>

            <div className="info-row">
              <span className="label">Umur & Tgl Lahir:</span>
              <span>{buyer?.age || 26} Tahun ({buyer?.dob || '1998-05-12'})</span>
            </div>

            <div className="info-row">
              <span className="label">Jenis Kelamin:</span>
              <span>{buyer?.gender || 'Perempuan'}</span>
            </div>

            <div className="info-row">
              <span className="label">Point Loyalty:</span>
              <span className="font-display text-maroon">
                {buyer?.loyalty_points || 350} Pts
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .max-w-600 { max-width: 600px; }
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: var(--color-pink-soft);
          color: var(--color-maroon);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 3px solid var(--color-maroon);
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.92rem;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--color-border);
        }
        .label {
          color: var(--color-text-muted);
        }
      `}</style>
    </BuyerLayout>
  );
}

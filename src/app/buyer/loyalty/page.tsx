'use client';

import React, { useState, useEffect } from 'react';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { User } from '@/lib/types';
import { Award, Sparkles, Gift, Check, ShieldCheck } from 'lucide-react';

export default function BuyerLoyaltyPage() {
  const [buyer, setBuyer] = useState<User | null>(null);
  const [redeemMsg, setRedeemMsg] = useState('');

  useEffect(() => {
    setBuyer(DataStore.getSessionUser());
  }, []);

  const handleRedeem = (cost: number, voucherName: string) => {
    if (!buyer) return;
    const currentPts = buyer.loyalty_points || 0;

    if (currentPts < cost) {
      alert(`Point Anda (${currentPts} Pts) tidak mencukupi untuk klaim ${voucherName} (butuh ${cost} Pts)!`);
      return;
    }

    const updatedUsers = DataStore.getUsers().map((u) => {
      if (u.id === buyer.id) {
        return { ...u, loyalty_points: currentPts - cost };
      }
      return u;
    });

    DataStore.saveUsers(updatedUsers);
    const updated = { ...buyer, loyalty_points: currentPts - cost };
    DataStore.setSessionUser(updated);
    setBuyer(updated);

    setRedeemMsg(`Berhasil mengklaim "${voucherName}"! Kode promo voucher dikirim ke email Anda.`);
    setTimeout(() => setRedeemMsg(''), 4000);
  };

  const pts = buyer?.loyalty_points || 0;
  let tierBadge = 'DAEBAK BRONZE';
  if (pts >= 1000) tierBadge = 'DAEBAK VIP GOLD';
  else if (pts >= 300) tierBadge = 'DAEBAK SILVER';

  return (
    <BuyerLayout>
      <div className="container max-w-800">
        <div className="page-header mb-4 text-center">
          <span className="sticker-badge badge-mustard mb-2">
            <Award size={14} /> LOYALTY REWARD SYSTEM
          </span>
          <h1 className="font-display page-title">Daebak Fan Loyalty Club</h1>
          <p className="page-subtitle">Kumpulkan point setiap pembelian tiket & tukarkan dengan voucher diskon eksklusif!</p>
        </div>

        {redeemMsg && (
          <div className="alert-success card-playful mb-4 text-center">
            <Check size={20} color="#2E7D32" /> {redeemMsg}
          </div>
        )}

        <div className="loyalty-card card-playful text-center mb-4">
          <span className="sticker-badge badge-lavender mb-2">{tierBadge}</span>
          <span className="balance-label font-display">TOTAL POINT SAYA:</span>
          <div className="balance-pts font-display">{pts} PTS</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Dapatkan +100 Point tambahan untuk setiap 1x tiket konser/fanmeet yang Anda beli!
          </p>
        </div>

        {/* Redeemable Vouchers */}
        <div className="card-playful">
          <h3 className="font-display text-maroon mb-3">Tukarkan Point Dengan Voucher Diskon</h3>

          <div className="vouchers-grid">
            <div className="voucher-card card-playful">
              <Gift size={32} color="var(--color-maroon)" />
              <div>
                <h4 className="font-display text-maroon">Voucher Diskon Rp 50.000</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Untuk semua pembelian tiket Konser K-Pop.
                </p>
              </div>
              <button
                onClick={() => handleRedeem(150, 'Voucher Diskon Rp 50.000')}
                className="btn btn-sm btn-primary ml-auto"
              >
                Tukar 150 Pts
              </button>
            </div>

            <div className="voucher-card card-playful">
              <Gift size={32} color="var(--color-maroon)" />
              <div>
                <h4 className="font-display text-maroon">Voucher Diskon Rp 100.000</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Spesial tiket Fanmeeting Aktor Korea & VIP Hi-Touch.
                </p>
              </div>
              <button
                onClick={() => handleRedeem(300, 'Voucher Diskon Rp 100.000')}
                className="btn btn-sm btn-primary ml-auto"
              >
                Tukar 300 Pts
              </button>
            </div>

            <div className="voucher-card card-playful">
              <Gift size={32} color="var(--color-maroon)" />
              <div>
                <h4 className="font-display text-maroon">Free Express Queue Pass</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Akses jalur cepat antrean scanner gate di venue.
                </p>
              </div>
              <button
                onClick={() => handleRedeem(500, 'Free Express Queue Pass')}
                className="btn btn-sm btn-secondary ml-auto"
              >
                Tukar 500 Pts
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .max-w-800 { max-width: 800px; }
        .page-title {
          font-size: 2.4rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .loyalty-card {
          background-color: var(--color-pink-soft);
          border: 3px solid var(--color-maroon);
          padding: 30px;
        }
        .balance-label {
          display: block;
          font-size: 0.85rem;
          color: var(--color-maroon-dark);
        }
        .balance-pts {
          font-size: 3.5rem;
          color: var(--color-maroon);
          line-height: 1;
          margin: 6px 0 10px;
        }
        .vouchers-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .voucher-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }
        .alert-success {
          background-color: #E8F5E9;
          color: #2E7D32;
          padding: 12px 18px;
        }
      `}</style>
    </BuyerLayout>
  );
}

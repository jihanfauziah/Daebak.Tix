'use client';

import React from 'react';
import BuyerLayout from '@/components/BuyerLayout';
import { Bell, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

export default function BuyerNotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Pembayaran Lunas — E-Ticket Diterbitkan!',
      desc: 'Transaksi order #DBK-20260915-881 VIP Soundcheck SEVENTEEN berhasil! QR Code siap discan.',
      time: '10 Menit yang lalu',
      type: 'success',
    },
    {
      id: 2,
      title: 'Reminder: H-14 SEVENTEEN World Tour',
      desc: 'Konser SEVENTEEN akan dilaksanakan pada 28 Sep 2026 di GBK Stadium Jakarta.',
      time: '1 Hari yang lalu',
      type: 'info',
    },
    {
      id: 3,
      title: 'Promo Loyalty Points +100 Pts!',
      desc: 'Selamat! Akun pembeli Anda terverifikasi NIK & mendapatkan bonus 100 Pts.',
      time: '3 Hari yang lalu',
      type: 'promo',
    },
  ];

  return (
    <BuyerLayout>
      <div className="container max-w-700">
        <div className="page-header mb-4">
          <div>
            <h1 className="font-display page-title">Notifikasi & Informasi Pesanan</h1>
            <p className="page-subtitle">Pesan masuk mengenai status tiket, pengingat event, dan voucher promo.</p>
          </div>
        </div>

        <div className="notifications-list">
          {notifications.map((n) => (
            <div key={n.id} className="notification-card card-playful mb-3">
              <div className="notif-icon-wrap">
                <Bell size={20} color="var(--color-maroon)" />
              </div>
              <div className="notif-content">
                <h4 className="font-display text-maroon">{n.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>{n.desc}</p>
                <span className="notif-time">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .max-w-700 { max-width: 700px; }
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .notification-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
        }
        .notif-icon-wrap {
          width: 40px;
          height: 40px;
          background-color: var(--color-pink-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-maroon);
          flex-shrink: 0;
        }
        .notif-time {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 6px;
        }
      `}</style>
    </BuyerLayout>
  );
}

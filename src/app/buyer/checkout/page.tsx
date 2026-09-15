'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { EventItem, TicketCategory, User, Ticket as TicketType } from '@/lib/types';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Copy,
} from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = Number(searchParams.get('eventId'));
  const catId = Number(searchParams.get('catId'));
  const qty = Number(searchParams.get('qty') || 1);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [category, setCategory] = useState<TicketCategory | null>(null);
  const [buyer, setBuyer] = useState<User | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderId: number;
    orderNum: string;
    tickets: TicketType[];
  } | null>(null);

  useEffect(() => {
    const session = DataStore.getSessionUser();
    if (!session || session.role !== 'buyer') {
      router.push('/buyer/login');
      return;
    }
    setBuyer(session);

    const allEvents = DataStore.getEvents();
    const foundEv = allEvents.find((e) => e.id === eventId);
    if (foundEv) {
      setEvent(foundEv);
      const foundCat = foundEv.categories.find((c) => c.id === catId);
      if (foundCat) setCategory(foundCat);
    }
  }, [eventId, catId, router]);

  const handlePayNow = () => {
    if (!buyer || !event || !category) return;
    setIsProcessing(true);

    setTimeout(() => {
      const result = DataStore.createOrder(buyer, event, category, qty, paymentMethod);
      setIsProcessing(false);
      setOrderComplete({
        orderId: result.order.id,
        orderNum: result.order.order_number,
        tickets: result.tickets,
      });
    }, 1500);
  };

  if (!event || !category) {
    return (
      <BuyerLayout>
        <div className="container text-center py-5">
          <h2 className="font-display">Loading Payment Gateway...</h2>
        </div>
      </BuyerLayout>
    );
  }

  const subtotal = category.price * qty;
  const adminFee = 10000 * qty;
  const totalAmount = subtotal + adminFee;

  return (
    <BuyerLayout>
      <div className="container max-w-900">
        {orderComplete ? (
          <div className="card-playful text-center py-5">
            <CheckCircle2 size={64} color="#2E7D32" className="mx-auto mb-3" />
            <span className="sticker-badge badge-mustard mb-2">PEMBAYARAN BERHASIL!</span>
            <h1 className="font-display text-maroon mb-2" style={{ fontSize: '2.2rem' }}>
              Transaksi Selesai & E-Ticket Diterbitkan!
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }} className="mb-4">
              Nomor Pesanan: <code>{orderComplete.orderNum}</code>. E-Ticket dengan QR Code unik sudah dapat diakses di HP Anda.
            </p>

            <div className="tickets-issued-preview card-playful mb-4 text-left">
              <h4 className="font-display text-maroon mb-2">Tiket QR Code Diterbitkan ({orderComplete.tickets.length} Tiket):</h4>
              {orderComplete.tickets.map((t) => (
                <div key={t.id} className="ticket-row font-body">
                  <div>
                    <strong>{t.event_title}</strong> — {t.category_name} ({t.seat_number})
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      NIK Pemegang: {t.buyer_nik} ({t.buyer_name})
                    </div>
                  </div>
                  <Link href={`/buyer/tickets/qr/${t.order_id}`} className="btn btn-sm btn-primary">
                    <QrCode size={14} /> Lihat QR Code
                  </Link>
                </div>
              ))}
            </div>

            <div className="btn-group-center">
              <Link href="/buyer/orders" className="btn btn-primary btn-lg">
                Lihat Semua Pesanan Saya
              </Link>
              <Link href="/buyer/tickets" className="btn btn-outline btn-lg">
                Kembali ke Katalog Tiket
              </Link>
            </div>
          </div>
        ) : (
          <div className="checkout-grid">
            {/* Left: Payment Method Selection */}
            <div className="left-side">
              <div className="card-playful mb-4">
                <h3 className="font-display text-maroon mb-3">Pilih Metode Pembayaran Indonesia</h3>

                <div className="payment-options-list">
                  {/* Option 1: QRIS */}
                  <label className={`pay-option-card ${paymentMethod === 'QRIS' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      value="QRIS"
                      checked={paymentMethod === 'QRIS'}
                      onChange={() => setPaymentMethod('QRIS')}
                    />
                    <QrCode size={24} color="var(--color-maroon)" />
                    <div>
                      <strong>QRIS Instan (GoPay, OVO, Dana, ShopeePay, LinkAja)</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Scan otomatis QR Code dengan seluruh aplikasi e-wallet & m-banking.
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Bank Transfer */}
                  <label className={`pay-option-card ${paymentMethod.includes('Transfer Bank') ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      value="Transfer Bank BCA"
                      checked={paymentMethod.includes('Transfer Bank')}
                      onChange={() => setPaymentMethod('Transfer Bank BCA')}
                    />
                    <Building size={24} color="var(--color-maroon)" />
                    <div>
                      <strong>Transfer Bank Virtual Account (BCA / Mandiri / BRI / BNI)</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Nomor Virtual Account terverifikasi otomatis 24 Jam.
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Credit Card */}
                  <label className={`pay-option-card ${paymentMethod === 'Kartu Kredit' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      value="Kartu Kredit"
                      checked={paymentMethod === 'Kartu Kredit'}
                      onChange={() => setPaymentMethod('Kartu Kredit')}
                    />
                    <CreditCard size={24} color="var(--color-maroon)" />
                    <div>
                      <strong>Kartu Kredit / Debit Visa & Mastercard</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Keamanan terenkripsi 3D Secure OTP.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dynamic Payment Details Display */}
              {paymentMethod === 'QRIS' && (
                <div className="card-playful text-center mb-4">
                  <h4 className="font-display text-maroon mb-2">Scan QRIS Untuk Membayar</h4>
                  <div className="qris-mock-img mx-auto mb-2">
                    <QrCode size={160} color="var(--color-maroon-dark)" />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Mendukung GoPay, OVO, ShopeePay, Dana, BCA Mobile, Livin Mandiri, dll.
                  </p>
                </div>
              )}

              {paymentMethod.includes('Transfer Bank') && (
                <div className="card-playful mb-4">
                  <h4 className="font-display text-maroon mb-2">Nomor Virtual Account Transfer:</h4>
                  <div className="va-box card-playful mb-2">
                    <span className="font-display text-maroon" style={{ fontSize: '1.4rem' }}>
                      <code>8801 9928 3019 4481</code>
                    </span>
                    <button onClick={() => alert('Nomor Virtual Account berhasil disalin!')} className="btn btn-sm btn-outline ml-auto">
                      <Copy size={12} /> Salin VA
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Batas Waktu Pembayaran: <strong>24 Jam</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="right-side">
              <div className="card-playful sticky-summary">
                <h3 className="font-display text-maroon mb-3">Detail Rincian Order</h3>

                <div className="event-summary-box mb-3">
                  <h4 className="font-display text-maroon" style={{ fontSize: '1.1rem' }}>
                    {event.title}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Seat: {category.name} ({qty}x Tiket)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Tanggal: {new Date(event.event_date).toLocaleDateString('id-ID')}
                  </div>
                </div>

                <div className="price-breakdown mb-3">
                  <div className="price-row">
                    <span>Subtotal ({qty}x Tiket):</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="price-row">
                    <span>Biaya Admin Ticket:</span>
                    <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="price-row total-row font-display">
                    <span>TOTAL BAYAR:</span>
                    <span className="text-maroon">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  {isProcessing ? 'Memproses Pembayaran...' : 'Konfirmasi & Bayar Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .max-w-900 { max-width: 900px; }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        .pay-option-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .pay-option-card.selected {
          border-color: var(--color-maroon);
          background-color: var(--color-pink-soft);
        }
        .qris-mock-img {
          background-color: var(--color-pink-soft);
          padding: 16px;
          display: inline-block;
          border-radius: var(--radius-sm);
          border: 2px solid var(--color-maroon);
        }
        .va-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-cream);
          padding: 12px 16px;
        }
        .price-breakdown {
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.9rem;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
        }
        .total-row {
          font-size: 1.2rem;
          margin-top: 4px;
        }
        .tickets-issued-preview {
          background-color: var(--color-pink-soft);
          padding: 20px;
        }
        .ticket-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-white);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
          border: 1px solid var(--color-border);
        }
        .btn-group-center {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </BuyerLayout>
  );
}

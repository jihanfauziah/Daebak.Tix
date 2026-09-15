'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { EventItem, TicketCategory, User } from '@/lib/types';
import {
  Calendar,
  MapPin,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = DataStore.getSessionUser();
    setCurrentUser(user);

    const allEvents = DataStore.getEvents();
    const found = allEvents.find((e) => e.id === eventId);
    if (found) {
      setEvent(found);
      if (found.categories && found.categories.length > 0) {
        setSelectedCategory(found.categories[0]);
      }
    }
  }, [eventId]);

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Silahkan login akun pembeli terlebih dahulu!');
      router.push('/buyer/login');
      return;
    }

    if (!selectedCategory) {
      alert('Pilih kategori seat tiket terlebih dahulu!');
      return;
    }

    if (selectedCategory.remaining_quota < quantity) {
      alert('Maaf, kuota seat kategori ini tidak mencukupi!');
      return;
    }

    router.push(
      `/buyer/checkout?eventId=${event?.id}&catId=${selectedCategory.id}&qty=${quantity}`
    );
  };

  if (!event) {
    return (
      <BuyerLayout>
        <div className="container text-center py-5">
          <h2 className="font-display">Loading Event Detail...</h2>
        </div>
      </BuyerLayout>
    );
  }

  const totalPrice = selectedCategory ? selectedCategory.price * quantity : 0;

  return (
    <BuyerLayout>
      <div className="container">
        {/* Banner Grid */}
        <div className="event-detail-banner card-playful mb-4">
          <div className="banner-poster-wrap scallop-border">
            <img src={event.poster_url} alt={event.title} className="banner-poster-img" />
          </div>

          <div className="banner-info">
            <span className="sticker-badge badge-mustard mb-2">
              {event.category === 'concert'
                ? '🎤 KONSER K-POP'
                : event.category === 'fanmeet'
                ? '🫰 FANMEETING AKTOR'
                : '📸 FANSIGN ALBUM'}
            </span>

            <h1 className="event-title-main font-display">{event.title}</h1>
            <h3 className="artist-subtitle font-display text-maroon">Artis: {event.artist_name}</h3>

            <div className="meta-pills mt-3">
              <div className="meta-pill">
                <Calendar size={16} color="var(--color-maroon)" />
                <span>{new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="meta-pill">
                <MapPin size={16} color="var(--color-maroon)" />
                <span>{event.city} ({event.venue})</span>
              </div>
              <div className="meta-pill">
                <ShieldCheck size={16} color="#2E7D32" />
                <span>Promoter: {event.seller_name} (Terverifikasi Admin)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="detail-layout-grid">
          {/* Left Side: Seat Categories */}
          <div className="left-side">
            <div className="card-playful mb-4">
              <h3 className="font-display text-maroon mb-3">Pilih Kategori Seat Tiket</h3>

              <div className="categories-selection-list">
                {event.categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-item-card card-playful ${
                      selectedCategory?.id === cat.id ? 'active-cat' : ''
                    }`}
                  >
                    <div className="cat-top">
                      <span className="cat-name font-display">{cat.name}</span>
                      <span className="cat-price font-display text-maroon">
                        Rp {cat.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="cat-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {cat.description || 'Seat bernomor dengan garansi E-Ticket QR Code.'}
                    </p>

                    <div className="cat-quota-row mt-2">
                      <span className="quota-tag">
                        Sisa Kuota: <strong>{cat.remaining_quota} Tiket</strong>
                      </span>
                      {cat.remaining_quota < 20 && (
                        <span className="sticker-badge badge-pink" style={{ fontSize: '0.7rem' }}>
                          HAMPIR HABIS!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Layout Map Mock */}
            <div className="card-playful">
              <h3 className="font-display text-maroon mb-3">Denah Panggung & Seating Plan Venue</h3>
              <div className="venue-map-mock card-playful text-center">
                <div className="stage-box font-display mb-3">STAGE / PANGGUNG UTAMA</div>
                <div className="seating-blocks font-display">
                  <div className="block vip-block">VIP / VVIP (Near Stage)</div>
                  <div className="block cat1-block">CAT 1 Tribune Tengah</div>
                  <div className="block cat2-block">CAT 2 Tribune Atas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary & Checkout Box */}
          <div className="right-side">
            <div className="summary-card card-playful sticky-summary">
              <h3 className="font-display text-maroon mb-3">Ringkasan Pembelian</h3>

              {/* NIK Verification Badge */}
              <div className="nik-check-box card-playful mb-3">
                <ShieldCheck size={20} color="var(--color-maroon)" />
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Identitas Pembeli (NIK)</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {currentUser ? `NIK: ${currentUser.nik || '3201041998051201'} (${currentUser.full_name})` : 'Silahkan Login'}
                  </div>
                </div>
              </div>

              {selectedCategory ? (
                <>
                  <div className="summary-line">
                    <span>Kategori Terpilih:</span>
                    <strong>{selectedCategory.name}</strong>
                  </div>

                  <div className="summary-line">
                    <span>Harga per Tiket:</span>
                    <span>Rp {selectedCategory.price.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="form-group my-3">
                    <label className="form-label">Jumlah Tiket (Maks. 4 Tiket per NIK):</label>
                    <select
                      className="form-select font-display"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      <option value={1}>1 Tiket</option>
                      <option value={2}>2 Tiket</option>
                      <option value={3}>3 Tiket</option>
                      <option value={4}>4 Tiket</option>
                    </select>
                  </div>

                  <div className="total-box card-playful mb-4">
                    <span className="total-label">Total Pembayaran:</span>
                    <div className="total-price font-display text-maroon">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    Lanjut ke Payment Gateway <ArrowRight size={18} />
                  </button>
                </>
              ) : (
                <p className="text-muted">Silahkan pilih kategori seat di samping.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .event-detail-banner {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 30px;
          align-items: center;
          background-color: var(--color-pink-soft);
        }
        .banner-poster-wrap {
          height: 320px;
        }
        .banner-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .event-title-main {
          font-size: 2.2rem;
          color: var(--color-maroon-dark);
          line-height: 1.2;
          margin: 8px 0 4px;
        }
        .artist-subtitle {
          font-size: 1.4rem;
        }
        .meta-pills {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          color: var(--color-text-dark);
        }
        .detail-layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        .category-item-card {
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-item-card:hover, .category-item-card.active-cat {
          border-color: var(--color-maroon);
          background-color: var(--color-pink-soft);
          box-shadow: var(--shadow-sm);
        }
        .cat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .cat-quota-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .venue-map-mock {
          background-color: var(--color-cream);
          padding: 24px;
        }
        .stage-box {
          background-color: var(--color-maroon-dark);
          color: var(--color-white);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 1rem;
        }
        .seating-blocks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .block {
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 2px dashed var(--color-maroon);
          font-size: 0.9rem;
        }
        .vip-block { background-color: var(--color-mustard); color: var(--color-maroon-dark); }
        .cat1-block { background-color: var(--color-pink-soft); }
        .cat2-block { background-color: var(--color-lavender); }
        .sticky-summary {
          position: sticky;
          top: 90px;
        }
        .nik-check-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--color-cream);
          padding: 10px 14px;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }
        .total-box {
          background-color: var(--color-cream-light);
          padding: 14px;
          border: 2px solid var(--color-maroon);
        }
        .total-price {
          font-size: 1.8rem;
        }

        @media (max-width: 900px) {
          .event-detail-banner { grid-template-columns: 1fr; }
          .detail-layout-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </BuyerLayout>
  );
}

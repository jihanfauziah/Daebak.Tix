'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { EventItem } from '@/lib/types';
import { Heart, Calendar, MapPin, Ticket } from 'lucide-react';

export default function BuyerWishlistPage() {
  const [wishlistEvents, setWishlistEvents] = useState<EventItem[]>([]);
  const [buyerId, setBuyerId] = useState<number>(3);

  useEffect(() => {
    const buyer = DataStore.getSessionUser();
    if (buyer) {
      setBuyerId(buyer.id);
      const wIds = DataStore.getWishlist(buyer.id);
      const allEvents = DataStore.getEvents();
      setWishlistEvents(allEvents.filter((e) => wIds.includes(e.id)));
    }
  }, []);

  const handleRemove = (eventId: number) => {
    DataStore.toggleWishlist(buyerId, eventId);
    const updatedIds = DataStore.getWishlist(buyerId);
    setWishlistEvents(DataStore.getEvents().filter((e) => updatedIds.includes(e.id)));
  };

  return (
    <BuyerLayout>
      <div className="container">
        <div className="page-header mb-4">
          <div>
            <h1 className="font-display page-title">Wishlist Event Favorit Saya</h1>
            <p className="page-subtitle">Daftar konser, fanmeeting, dan fansign yang disimpan untuk dibeli nanti.</p>
          </div>
        </div>

        {wishlistEvents.length === 0 ? (
          <div className="card-playful text-center py-5">
            <Heart size={48} color="var(--color-maroon)" />
            <h3 className="font-display mt-2">Wishlist Masih Kosong</h3>
            <p className="text-muted mb-3">Klik ikon hati pada katalog event untuk menyimpannya di sini!</p>
            <Link href="/buyer/tickets" className="btn btn-primary">
              Cari Event Sekarang
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {wishlistEvents.map((ev) => (
              <div key={ev.id} className="event-card card-playful">
                <div className="poster-container">
                  <img src={ev.poster_url} alt="" className="event-poster" />
                  <button
                    onClick={() => handleRemove(ev.id)}
                    className="remove-btn"
                    title="Hapus dari Wishlist"
                  >
                    <Heart size={18} fill="#990022" color="#990022" />
                  </button>
                </div>

                <div className="event-body">
                  <h3 className="event-title font-display">{ev.title}</h3>
                  <div className="meta-list">
                    <div className="meta-item">
                      <Calendar size={14} color="var(--color-maroon)" />
                      <span>{new Date(ev.event_date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={14} color="var(--color-maroon)" />
                      <span>{ev.city} ({ev.venue})</span>
                    </div>
                  </div>

                  <div className="card-footer mt-auto">
                    <div className="price-value font-display text-maroon">
                      Rp {Math.min(...ev.categories.map((c) => c.price)).toLocaleString('id-ID')}
                    </div>
                    <Link href={`/buyer/tickets/${ev.id}`} className="btn btn-primary">
                      Beli Tiket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .event-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .poster-container {
          position: relative;
          height: 200px;
        }
        .event-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 10px; right: 10px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: white;
          border: 1px solid var(--color-maroon);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .event-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .event-title {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding-top: 10px;
        }
        .price-value {
          font-size: 1.1rem;
        }
      `}</style>
    </BuyerLayout>
  );
}

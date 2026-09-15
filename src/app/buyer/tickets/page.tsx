'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BuyerLayout from '@/components/BuyerLayout';
import { DataStore } from '@/lib/store';
import { EventItem } from '@/lib/types';
import { Search, MapPin, Calendar, Heart, Ticket, Star, Filter } from 'lucide-react';

export default function BuyerTicketsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [buyerId, setBuyerId] = useState<number>(3);

  useEffect(() => {
    const allEvents = DataStore.getEvents();
    setEvents(allEvents);

    const buyer = DataStore.getSessionUser();
    if (buyer) {
      setBuyerId(buyer.id);
      setWishlistIds(DataStore.getWishlist(buyer.id));
    }
  }, []);

  const handleToggleWishlist = (eventId: number) => {
    const isAdded = DataStore.toggleWishlist(buyerId, eventId);
    setWishlistIds(DataStore.getWishlist(buyerId));
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || ev.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.artist_name.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <BuyerLayout>
      <div className="container">
        <div className="catalog-header text-center mb-4">
          <span className="sticker-badge badge-mustard mb-2">
            <Ticket size={14} /> KATALOG TIKET RESMI INDONESIA
          </span>
          <h1 className="font-display catalog-title">Cari Tiket Konser, Fanmeet & Fansign</h1>
          <p className="catalog-subtitle">Dapatkan seat impianmu dengan jaminan tiket asli terverifikasi admin.</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-card card-playful mb-4">
          <div className="filter-controls-row">
            <div className="search-box flex-2">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari nama idol/aktor, venue, atau judul event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div className="form-group flex-1">
              <select
                className="form-select font-display"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">🌟 Semua Kategori Event</option>
                <option value="concert">🎤 Konser K-Pop</option>
                <option value="fanmeet">🫰 Fanmeet Aktor</option>
                <option value="fansign">📸 Fansign Album</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <select
                className="form-select font-display"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="all">📍 Semua Kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Tangerang">Tangerang (ICE BSD)</option>
                <option value="Bogor">Bogor (SICC)</option>
                <option value="Bali">Bali</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="empty-state card-playful text-center py-5">
            <Ticket size={48} color="var(--color-maroon)" />
            <h3 className="font-display mt-2">Tidak Ada Event Ditemukan</h3>
            <p className="text-muted">Coba ubah kata kunci pencarian atau filter lokasi Anda.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((ev) => {
              const isWishlisted = wishlistIds.includes(ev.id);
              const minPrice = Math.min(...ev.categories.map((c) => c.price));
              return (
                <div key={ev.id} className="event-card card-playful">
                  <div className="poster-container">
                    <img src={ev.poster_url} alt="" className="event-poster" />
                    <span className="seller-tag font-display">
                      <Star size={12} fill="#FFD56B" color="#FFD56B" /> {ev.seller_name}
                    </span>
                    <button
                      onClick={() => handleToggleWishlist(ev.id)}
                      className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      title="Simpan ke Wishlist"
                    >
                      <Heart size={18} fill={isWishlisted ? '#990022' : 'none'} color={isWishlisted ? '#990022' : '#22181C'} />
                    </button>
                  </div>

                  <div className="event-body">
                    <div className="event-cat-badge font-display">
                      {ev.category === 'concert'
                        ? '🎤 Konser K-Pop'
                        : ev.category === 'fanmeet'
                        ? '🫰 Fanmeeting Aktor'
                        : '📸 Fansign Album'}
                    </div>

                    <h3 className="event-title font-display">{ev.title}</h3>

                    <div className="meta-list">
                      <div className="meta-item">
                        <Calendar size={14} color="var(--color-maroon)" />
                        <span>{new Date(ev.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={14} color="var(--color-maroon)" />
                        <span>{ev.city} ({ev.venue})</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div>
                        <span className="price-label">Mulai dari</span>
                        <div className="price-value font-display">
                          Rp {minPrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <Link href={`/buyer/tickets/${ev.id}`} className="btn btn-primary">
                        Beli Seat
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .catalog-title {
          font-size: 2.4rem;
          color: var(--color-maroon-dark);
        }
        .catalog-subtitle {
          color: var(--color-text-muted);
        }
        .filter-controls-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .flex-2 { flex: 2; }
        .flex-1 { flex: 1; }
        .search-box {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .event-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .poster-container {
          position: relative;
          height: 230px;
        }
        .event-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .seller-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(0, 0, 0, 0.75);
          color: var(--color-white);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--color-white);
          border: 2px solid var(--color-maroon-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .wishlist-btn:hover {
          transform: scale(1.1);
        }
        .event-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .event-cat-badge {
          font-size: 0.82rem;
          color: var(--color-maroon);
          margin-bottom: 6px;
        }
        .event-title {
          font-size: 1.25rem;
          color: var(--color-text-dark);
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding-top: 14px;
        }
        .price-label {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .price-value {
          font-size: 1.2rem;
          color: var(--color-maroon);
        }
      `}</style>
    </BuyerLayout>
  );
}

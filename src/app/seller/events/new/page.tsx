'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SellerLayout from '@/components/SellerLayout';
import { DataStore } from '@/lib/store';
import { Seller, EventCategory } from '@/lib/types';
import { PlusCircle, Trash2, Calendar, MapPin, Image as ImageIcon, Send, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);

  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('concert');
  const [artistName, setArtistName] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [eventDate, setEventDate] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [durationDays, setDurationDays] = useState(15);

  // Categories State
  const [ticketCategories, setTicketCategories] = useState<
    { name: string; price: number; quota: number; description: string }[]
  >([
    { name: 'VIP Soundcheck Pass', price: 3500000, quota: 300, description: 'Lanyard & Soundcheck Pass' },
    { name: 'CAT 1 Seated', price: 2200000, quota: 800, description: 'Numbered tribune seat' },
  ]);

  useEffect(() => {
    setSeller(DataStore.getSessionSeller());
  }, []);

  const handleAddCategory = () => {
    setTicketCategories([
      ...ticketCategories,
      { name: 'CAT 2 Seated', price: 1500000, quota: 1000, description: 'Seated section' },
    ]);
  };

  const handleRemoveCategory = (index: number) => {
    if (ticketCategories.length === 1) {
      alert('Minimal harus ada 1 kategori tiket!');
      return;
    }
    const updated = [...ticketCategories];
    updated.splice(index, 1);
    setTicketCategories(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) {
      alert('Sesi toko tidak ditemukan. Silahkan login ulang.');
      return;
    }

    const categoriesWithId = ticketCategories.map((c, idx) => ({
      id: Date.now() + idx,
      event_id: Date.now(),
      name: c.name,
      price: Number(c.price),
      quota: Number(c.quota),
      remaining_quota: Number(c.quota),
      description: c.description,
    }));

    DataStore.addEvent({
      seller_id: seller.id,
      seller_name: seller.store_name,
      title,
      category,
      artist_name: artistName,
      venue,
      city,
      event_date: eventDate || new Date().toISOString(),
      poster_url: posterUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80',
      duration_days: Number(durationDays),
      is_active: true,
      status: 'active',
      categories: categoriesWithId,
    });

    alert('Event baru berhasil diterbitkan!');
    router.push('/seller/events');
  };

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Buat Event Korea Baru</h1>
          <p className="page-subtitle">Isi formulir pembuatan event konser, fanmeeting, atau fansign.</p>
        </div>
      </div>

      <div className="card-playful max-w-800">
        {/* Step Indicator */}
        <div className="step-bar mb-4">
          <div className={`step-item ${step === 1 ? 'active' : ''}`}>
            <span>1</span> Information Event & Poster
          </div>
          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <span>2</span> Kategori Seat & Pricing
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="step-section">
              <h3 className="font-display text-maroon mb-3">Langkah 1: Informasi Event & Lokasi</h3>

              <div className="form-group">
                <label className="form-label">Jenis / Kategori Event</label>
                <div className="radio-group">
                  <label className={`radio-card ${category === 'concert' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="cat"
                      value="concert"
                      checked={category === 'concert'}
                      onChange={() => setCategory('concert')}
                    />
                    <span>🎤 Konser K-Pop</span>
                  </label>

                  <label className={`radio-card ${category === 'fanmeet' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="cat"
                      value="fanmeet"
                      checked={category === 'fanmeet'}
                      onChange={() => setCategory('fanmeet')}
                    />
                    <span>🫰 Fanmeet Aktor</span>
                  </label>

                  <label className={`radio-card ${category === 'fansign' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="cat"
                      value="fansign"
                      checked={category === 'fansign'}
                      onChange={() => setCategory('fansign')}
                    />
                    <span>📸 Fansign Album</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Judul Resmi Event</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="mis. SEVENTEEN [RIGHT HERE] WORLD TOUR IN JAKARTA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Artis / Idol / Aktor Korea</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="mis. SEVENTEEN / Byeon Woo-seok / TWICE"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Kota Venue</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="mis. Jakarta / Tangerang / Bali"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Nama Tempat / Venue</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="mis. GBK Stadium / ICE BSD Hall 5"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Tanggal & Jam Pelaksanaan Event</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Opsi Durasi Masa Jual (Hari)</label>
                  <select
                    className="form-select"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                  >
                    <option value={7}>7 Hari (Per-Event Free Option)</option>
                    <option value={12}>12 Hari (Per-Event Free Option)</option>
                    <option value={15}>15 Hari (Standar Min Masa Jual)</option>
                    <option value={30}>30 Hari (Paket Paid 1 Bulan)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL Gambar Poster Event (Public Image Link)</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                />
                {posterUrl && (
                  <div className="poster-preview mt-2">
                    <img src={posterUrl} alt="Preview" className="preview-img" />
                  </div>
                )}
              </div>

              <button type="button" onClick={() => setStep(2)} className="btn btn-primary mt-3">
                Lanjut ke Langkah 2: Kategori Ticket & Pricing →
              </button>
            </div>
          ) : (
            <div className="step-section">
              <h3 className="font-display text-maroon mb-3">Langkah 2: Pengaturan Kategori Seat & Harga</h3>

              <div className="categories-form-list mb-4">
                {ticketCategories.map((cat, idx) => (
                  <div key={idx} className="category-form-card card-playful mb-3">
                    <div className="cat-card-header font-display">
                      <span>Kategori #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(idx)}
                        className="btn-icon-danger"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nama Kategori Seat</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="mis. VIP Soundcheck / CAT 1 Seated"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = [...ticketCategories];
                          updated[idx].name = e.target.value;
                          setTicketCategories(updated);
                        }}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Harga per Tiket (Rp)</label>
                        <input
                          type="number"
                          required
                          className="form-input"
                          value={cat.price}
                          onChange={(e) => {
                            const updated = [...ticketCategories];
                            updated[idx].price = Number(e.target.value);
                            setTicketCategories(updated);
                          }}
                        />
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">Kuota Tiket</label>
                        <input
                          type="number"
                          required
                          className="form-input"
                          value={cat.quota}
                          onChange={(e) => {
                            const updated = [...ticketCategories];
                            updated[idx].quota = Number(e.target.value);
                            setTicketCategories(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fasilitas / Deskripsi Seat</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="mis. Lanyard, Photocard Set, Soundcheck Pass"
                        value={cat.description}
                        onChange={(e) => {
                          const updated = [...ticketCategories];
                          updated[idx].description = e.target.value;
                          setTicketCategories(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={handleAddCategory} className="btn btn-outline" style={{ width: '100%' }}>
                  <PlusCircle size={16} /> + Tambah Kategori Seat
                </button>
              </div>

              <div className="btn-row">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  ← Kembali ke Langkah 1
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={18} /> Terbitkan Event Sekarang
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .max-w-800 {
          max-width: 800px;
        }
        .step-bar {
          display: flex;
          gap: 16px;
          border-bottom: 2px dashed var(--color-border);
          padding-bottom: 14px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .step-item.active {
          color: var(--color-maroon);
        }
        .step-item span {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--color-cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .step-item.active span {
          background-color: var(--color-maroon);
          color: var(--color-white);
        }
        .radio-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .radio-card {
          padding: 10px 16px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-pill);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .radio-card.selected {
          border-color: var(--color-maroon);
          background-color: var(--color-pink-soft);
          color: var(--color-maroon-dark);
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .flex-1 { flex: 1; }
        .preview-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 2px solid var(--color-maroon);
        }
        .cat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 8px;
          margin-bottom: 12px;
          color: var(--color-maroon-dark);
        }
        .btn-icon-danger {
          background: none;
          border: none;
          color: #C62828;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .btn-row {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </SellerLayout>
  );
}

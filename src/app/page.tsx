'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DataStore } from '@/lib/store';
import { EventItem, EventCategory } from '@/lib/types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Ticket,
  Search,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Zap,
  ArrowRight,
  MessageSquare,
  Mail,
  Store,
  UserCheck,
  CreditCard,
  Flame,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setEvents(DataStore.getEvents());
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Weekly events (upcoming dates)
  const weeklyEvents = events.slice(0, 4);

  return (
    <div className="landing-wrapper">
      <Navbar />

      {/* 1. HERO SECTION — 2-column layout with illustration */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text-col">
            <div className="hero-badge-row">
              <span className="hero-pill hero-pill-mustard">
                <Sparkles size={14} /> MARKETPLACE TIKET EVENT KOREA #1 INDONESIA
              </span>
              <span className="hero-pill hero-pill-outline">
                <Flame size={14} /> K-POP & FANMEET AKTOR
              </span>
            </div>

            <h1 className="hero-title">
              Nonton Konser Idol & <br />
              <span className="title-highlight">Fanmeeting Aktor Korea</span> <br />
              Tanpa Khawatir Tiket Palsu!
            </h1>

            <p className="hero-subtitle">
              Platform ticketing khusus event Korea terpercaya di Indonesia. Dilengkapi sistem QR Code anti-duplikat, verifikasi admin 100% aman, dan scanner staf venue real-time.
            </p>

            <div className="hero-cta-group">
              <a href="#kategori-event" className="btn btn-lg btn-primary hero-btn">
                <Ticket size={20} /> Cari Tiket Event Now
              </a>
              <a href="#section-penjual" className="btn btn-lg hero-btn hero-btn-outline">
                <Store size={20} /> Jual Tiket Event Kamu
              </a>
            </div>

            {/* Trust Badges */}
            <div className="hero-feature-row">
              <div className="feature-chip">
                <ShieldCheck size={18} color="var(--color-maroon)" />
                <span>100% Terverifikasi Admin</span>
              </div>
              <div className="feature-chip">
                <QrCode size={18} color="var(--color-maroon)" />
                <span>QR Code Anti-Duplikat</span>
              </div>
              <div className="feature-chip">
                <CreditCard size={18} color="var(--color-maroon)" />
                <span>Pembayaran Lengkap</span>
              </div>
            </div>
          </div>

          <div className="hero-image-col">
            <div className="hero-image-wrapper">
              <img
                src="/images/hero-concert.jpg"
                alt="Ilustrasi konser K-Pop dengan fans Indonesia memegang lightstick"
                className="hero-illustration"
              />
              <div className="hero-image-badge font-display">
                <Ticket size={16} /> 10,000+ Tiket Terjual
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JADWAL EVENT MINGGU INI */}
      <section className="weekly-section">
        <div className="container">
          <div className="section-header">
            <div className="header-tag font-display">
              <Calendar size={18} color="var(--color-maroon)" /> JADWAL MINGGU INI
            </div>
            <h2 className="section-title">Jadwal Event Terdekat Minggu Ini</h2>
            <p className="section-desc">Jangan sampai kehabisan seat! Cek tanggal dan lokasi event favoritmu di bawah ini.</p>
          </div>

          <div className="weekly-grid">
            {weeklyEvents.map((ev) => (
              <div key={ev.id} className="weekly-card">
                <div className="card-image-wrap scallop-border">
                  <img src={ev.poster_url} alt={ev.title} className="card-img" />
                  <span className={`category-tag badge-${ev.category === 'concert' ? 'maroon' : ev.category === 'fanmeet' ? 'pink' : 'mustard'}`}>
                    {ev.category === 'concert' ? '🎤 Konser' : ev.category === 'fanmeet' ? '🫰 Fanmeet' : '📸 Fansign'}
                  </span>
                </div>
                <div className="weekly-card-body">
                  <div className="event-date-chip font-display">
                    <Calendar size={14} /> {new Date(ev.event_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <h3 className="event-title font-display">{ev.title}</h3>
                  <div className="event-info-line">
                    <MapPin size={14} /> <span>{ev.city} — {ev.venue}</span>
                  </div>
                  <div className="weekly-card-footer">
                    <div className="price-tag">
                      <span className="price-label">Mulai dari</span>
                      <span className="price-amount font-display">
                        Rp {Math.min(...ev.categories.map(c => c.price)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Link href={`/buyer/tickets/${ev.id}`} className="btn btn-sm btn-primary">
                      Detail <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. KATEGORI & SEMUA TIKET EVENT */}
      <section className="catalog-section" id="kategori-event">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Jelajahi Tiket Event Korea</h2>
            <p className="section-desc">Filter event berdasarkan jenis acara K-Pop concert, Fanmeeting drama actor, atau Fansign album.</p>
          </div>

          {/* Filter Bar & Search */}
          <div className="filter-bar-wrap">
            <div className="category-tabs">
              <button
                className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 Semua Event
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'concert' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('concert')}
              >
                🎤 Konser K-Pop
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'fanmeet' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('fanmeet')}
              >
                🫰 Fanmeet Aktor
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'fansign' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('fansign')}
              >
                📸 Fansign Album
              </button>
            </div>

            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari nama artis, kota, atau judul event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="empty-state card-playful">
              <Ticket size={48} color="var(--color-maroon)" />
              <h3 className="font-display">Tidak Ada Event Ditemukan</h3>
              <p>Coba kata kunci lain atau pilih kategori event berbeda.</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className="event-card card-playful">
                  <div className="event-poster-container">
                    <img src={ev.poster_url} alt={ev.title} className="event-poster" />
                    <span className="seller-badge font-display">
                      <Star size={12} fill="#FFD56B" color="#FFD56B" /> {ev.seller_name}
                    </span>
                  </div>

                  <div className="event-details">
                    <div className="event-category-badge font-display">
                      {ev.category === 'concert' ? '🎤 Konser K-Pop' : ev.category === 'fanmeet' ? '🫰 Fanmeeting Aktor' : '📸 Fansign Album'}
                    </div>

                    <h3 className="event-card-title">{ev.title}</h3>

                    <div className="event-meta font-body">
                      <div className="meta-item">
                        <Calendar size={15} color="var(--color-maroon)" />
                        <span>{new Date(ev.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={15} color="var(--color-maroon)" />
                        <span>{ev.city} ({ev.venue})</span>
                      </div>
                    </div>

                    <div className="event-card-bottom">
                      <div>
                        <div className="ticket-quota-info">
                          Sisa Quota: <strong>{ev.categories.reduce((acc, c) => acc + c.remaining_quota, 0)} tiket</strong>
                        </div>
                        <div className="event-price font-display">
                          Rp {Math.min(...ev.categories.map((c) => c.price)).toLocaleString('id-ID')}
                        </div>
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
      </section>

      {/* 4. SECTION KENAPA DAEBAK.TIX */}
      <section className="why-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sticker-badge badge-lavender">
              <Zap size={14} /> KEUNGGULAN UTAMA
            </span>
            <h2 className="section-title">Kenapa Pilih Daebak.Tix?</h2>
            <p className="section-desc">Platform ticketing yang dirancang khusus untuk kenyamanan & keamanan penggemar Korea di Indonesia.</p>
          </div>

          <div className="why-grid">
            <div className="why-card card-playful">
              <div className="why-icon-badge">
                <UserCheck size={32} color="var(--color-maroon)" />
              </div>
              <h3 className="why-title font-display">Penjual Terverifikasi Admin</h3>
              <p className="why-text">
                Semua penjual/promotor harus melalui verifikasi NIK, legalitas toko, dan persetujuan admin manual sebelum bisa menjual tiket.
              </p>
            </div>

            <div className="why-card card-playful">
              <div className="why-icon-badge">
                <QrCode size={32} color="var(--color-maroon)" />
              </div>
              <h3 className="why-title font-display">Sistem QR Code Anti-Duplikat</h3>
              <p className="why-text">
                Tiap tiket menghasilkan QR Code unik terenkripsi yang langsung terkunci permanen setelah discan di pintu venue.
              </p>
            </div>

            <div className="why-card card-playful">
              <div className="why-icon-badge">
                <CreditCard size={32} color="var(--color-maroon)" />
              </div>
              <h3 className="why-title font-display">Pembayaran Instan Lokal</h3>
              <p className="why-text">
                Transaksi cepat tanpa ribet dengan QRIS (GoPay/OVO/Dana/ShopeePay) dan Transfer Bank BCA, Mandiri, BRI, BNI.
              </p>
            </div>

            <div className="why-card card-playful">
              <div className="why-icon-badge">
                <ShieldCheck size={32} color="var(--color-maroon)" />
              </div>
              <h3 className="why-title font-display">Mobile Scanner Khusus Staf</h3>
              <p className="why-text">
                Penjual mendapatkan portal staf scanner khusus untuk tim gate venue demi kelancaran antrean check-in penggemar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION UNTUK PEMBELI */}
      <section className="buyer-section">
        <div className="container buyer-container card-playful">
          <div className="buyer-text-side">
            <span className="sticker-badge badge-mustard">
              <Ticket size={14} /> UNTUK PEMBELI TIKET
            </span>
            <h2 className="buyer-title font-display">Cara Mudah Nonton Event Favoritmu</h2>
            <p className="buyer-desc">
              Daftar akun pakai NIK (1 NIK = 1 Akun untuk cegah calo), pilih event impianmu, bayar instan, dan dapatkan E-Ticket QR Code langsung di HP-mu.
            </p>

            <div className="step-list">
              <div className="step-item">
                <div className="step-num font-display">1</div>
                <div>
                  <strong>Registrasi NIK</strong>
                  <p>Buat akun gratis dengan NIK & identitas lengkap.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num font-display">2</div>
                <div>
                  <strong>Pilih Seat & Pembayaran</strong>
                  <p>Pilih kategori seat favorit dan lakukan checkout instan.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num font-display">3</div>
                <div>
                  <strong>Tunjukkan QR Code di Venue</strong>
                  <p>Buka E-Ticket di HP dan scan di pintu masuk venue.</p>
                </div>
              </div>
            </div>

            <Link href="/buyer/login" className="btn btn-lg btn-primary mt-4">
              Daftar / Masuk Portal Pembeli <ArrowRight size={18} />
            </Link>
          </div>

          <div className="buyer-visual-side">
            <div className="ticket-preview-card ticket-cutout">
              <div className="ticket-header font-display">
                <span>DAEBAK.TIX E-TICKET</span>
                <span className="status-pill status-valid">VALID</span>
              </div>
              <div className="ticket-body">
                <h4 className="ticket-title font-display">SEVENTEEN [RIGHT HERE] TOUR</h4>
                <p className="ticket-subtitle">VIP Soundcheck Pass — Seat VIP-A-042</p>
                <div className="ticket-qr-mock">
                  <QrCode size={110} color="var(--color-maroon)" />
                </div>
                <p className="qr-hint font-display">SCAN QR DI GATE VENUE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION UNTUK CALON PENJUAL (VERIFIKASI MANUAL VIA ADMIN WA/EMAIL) */}
      <section className="seller-onboarding-section" id="section-penjual">
        <div className="container">
          <div className="seller-box">
            <div className="seller-header text-center">
              <span className="sticker-badge badge-pink">
                <Store size={14} /> PORTAL PENJUAL & PROMOTOR
              </span>
              <h2 className="seller-title font-display">Ingin Menjual Tiket Event Korea di Daebak.Tix?</h2>
              <p className="seller-subtitle">
                Bergabunglah sebagai penjual resmi! Kami menerapkan sistem verifikasi manual admin untuk menjaga kualitas & reputasi event.
              </p>
            </div>

            {/* Seller Feature Highlights */}
            <div className="seller-features-grid">
              <div className="seller-feature-card">
                <CheckCircle2 size={24} color="var(--color-mustard)" />
                <div>
                  <h4>Management Multi-Kategori</h4>
                  <p>Buat event konser, fanmeet, atau fansign dengan banyak kategori seat & kuota.</p>
                </div>
              </div>

              <div className="seller-feature-card">
                <CheckCircle2 size={24} color="var(--color-mustard)" />
                <div>
                  <h4>Dashboard Penjualan Real-Time</h4>
                  <p>Pantau jumlah tiket terjual, omset, dan laporan transaksi kapan saja.</p>
                </div>
              </div>

              <div className="seller-feature-card">
                <CheckCircle2 size={24} color="var(--color-mustard)" />
                <div>
                  <h4>Akun Staf Gate Scanner</h4>
                  <p>Generate akun staf khusus untuk tim lapangan melakukan scan tiket di pintu venue.</p>
                </div>
              </div>

              <div className="seller-feature-card">
                <CheckCircle2 size={24} color="var(--color-mustard)" />
                <div>
                  <h4>Opsi Paket Fleksibel</h4>
                  <p>Pilih Paket Berbayar (Bebas Buat Event 1/3 Bulan) atau Paket Free per-event (7d/12d + Opsi Perpanjang).</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Admin Action Area */}
            <div className="admin-contact-card">
              <h3 className="font-display contact-card-title">Langkah Pendaftaran Penjual:</h3>
              <ol className="contact-steps">
                <li>Hubungi Admin Daebak.Tix melalui <strong>WhatsApp</strong> atau <strong>Email</strong> di bawah.</li>
                <li>Admin akan mengirimkan formulir verifikasi (Data Diri & Data Toko).</li>
                <li>Setelah disetujui, Admin mengirimkan <strong>Link Login, Kode Akun Unik, dan Kredensial Toko</strong> via email.</li>
              </ol>

              <div className="contact-buttons-group">
                <a
                  href="https://wa.me/6281299887766?text=Halo%20Admin%20Daebak.Tix,%20saya%20ingin%20mendaftar%20sebagai%20Penjual%20Tiket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg btn-secondary"
                >
                  <MessageSquare size={20} /> Chat WhatsApp Admin (Fast Response)
                </a>

                <a
                  href="mailto:admin@daebaktix.co.id?subject=Pengajuan%20Akun%20Penjual%20Daebak.Tix"
                  className="btn btn-lg btn-outline"
                  style={{ color: 'var(--color-white)', borderColor: 'var(--color-cream-light)' }}
                >
                  <Mail size={20} /> Kirim Email Pengajuan Ke Admin
                </a>

                <Link href="/seller/login" className="btn btn-lg btn-primary">
                  Sudah Punya Kode Akun? Login Penjual / Staf
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* Hero Styling — 2-column layout */
        .hero-section {
          background-color: #FAF6F0;
          background-image:
            linear-gradient(rgba(122, 28, 44, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122, 28, 44, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          padding: 60px 0 50px;
          border-bottom: 2px solid var(--color-border);
          position: relative;
          overflow: hidden;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero-text-col {
          display: flex;
          flex-direction: column;
        }
        .hero-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: var(--radius-pill);
          letter-spacing: 0.2px;
        }
        .hero-pill-mustard {
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border: 2px solid var(--color-maroon-dark);
          box-shadow: 2px 2px 0px var(--color-maroon-dark);
        }
        .hero-pill-outline {
          background-color: var(--color-white);
          color: var(--color-maroon-dark);
          border: 2px solid var(--color-maroon);
          box-shadow: 2px 2px 0px var(--color-maroon);
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: 3rem;
          line-height: 1.25;
          color: var(--color-maroon-dark);
          margin-bottom: 20px;
        }
        .title-highlight {
          color: var(--color-maroon);
          background-color: var(--color-mustard);
          padding: 4px 16px;
          border-radius: var(--radius-sm);
          display: inline-block;
          transform: rotate(-1deg);
          margin: 4px 0;
        }
        .hero-subtitle {
          font-size: 1.08rem;
          color: var(--color-text-muted);
          max-width: 560px;
          margin-bottom: 32px;
          line-height: 1.7;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .hero-btn {
          padding: 14px 28px;
          font-size: 1.05rem;
        }
        .hero-btn-outline {
          background-color: var(--color-cream-light);
          color: var(--color-maroon-dark);
          border: 2px solid var(--color-maroon);
          box-shadow: 3px 3px 0px var(--color-maroon);
        }
        .hero-btn-outline:hover {
          background-color: var(--color-pink-soft);
          transform: translateY(-2px);
          box-shadow: 5px 5px 0px var(--color-maroon);
        }
        .hero-feature-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .feature-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-white);
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-maroon);
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 2px 2px 0px var(--color-maroon);
        }

        /* Hero Image Column */
        .hero-image-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 520px;
        }
        .hero-illustration {
          width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          border: 3px solid var(--color-maroon);
          box-shadow: 8px 8px 0px var(--color-maroon-dark);
          object-fit: cover;
        }
        .hero-image-badge {
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          padding: 8px 20px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-maroon-dark);
          box-shadow: 3px 3px 0px var(--color-maroon-dark);
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        /* Weekly Section */
        .weekly-section {
          padding: 70px 0;
          background-color: var(--color-cream-light);
        }
        .section-header {
          margin-bottom: 40px;
        }
        .header-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--color-maroon);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 2.4rem;
          color: var(--color-text-dark);
          margin-bottom: 8px;
        }
        .section-desc {
          color: var(--color-text-muted);
          font-size: 1rem;
        }
        .weekly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 24px;
        }
        .weekly-card {
          background-color: var(--color-white);
          border-radius: var(--radius-md);
          border: 2px solid var(--color-border);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .weekly-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-maroon);
        }
        .card-image-wrap {
          height: 220px;
          width: 100%;
          position: relative;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-tag {
          position: absolute;
          top: 12px;
          left: 12px;
        }
        .weekly-card-body {
          padding: 16px;
        }
        .event-date-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--color-maroon);
          background-color: var(--color-pink-soft);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          margin-bottom: 10px;
        }
        .event-title {
          font-size: 1.15rem;
          margin-bottom: 8px;
          color: var(--color-text-dark);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-info-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .weekly-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed var(--color-border);
          padding-top: 12px;
        }
        .price-label {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .price-amount {
          font-size: 1.1rem;
          color: var(--color-maroon);
        }

        /* Catalog Section */
        .catalog-section {
          padding: 70px 0;
          background-color: var(--color-cream);
        }
        .filter-bar-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .category-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-border);
          background-color: var(--color-white);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn.active, .tab-btn:hover {
          background-color: var(--color-maroon);
          color: var(--color-white);
          border-color: var(--color-maroon-dark);
        }
        .search-box {
          position: relative;
          min-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .search-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--color-border);
          outline: none;
          font-size: 0.9rem;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
        }
        .event-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .event-poster-container {
          position: relative;
          height: 240px;
        }
        .event-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .seller-badge {
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
        .event-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .event-category-badge {
          color: var(--color-maroon);
          font-size: 0.85rem;
          margin-bottom: 6px;
        }
        .event-card-title {
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--color-text-dark);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .event-card-bottom {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding-top: 14px;
        }
        .ticket-quota-info {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .event-price {
          font-size: 1.25rem;
          color: var(--color-maroon);
        }

        /* Why Section */
        .why-section {
          padding: 80px 0;
          background-color: var(--color-white);
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .why-card {
          text-align: center;
          padding: 30px 20px;
        }
        .why-icon-badge {
          width: 64px;
          height: 64px;
          background-color: var(--color-pink-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          border: 2px solid var(--color-maroon);
        }
        .why-title {
          font-size: 1.25rem;
          color: var(--color-text-dark);
          margin-bottom: 10px;
        }
        .why-text {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* Buyer Section */
        .buyer-section {
          padding: 70px 0;
          background-color: var(--color-pink-soft);
        }
        .buyer-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
          background-color: var(--color-white);
          padding: 40px;
        }
        .buyer-title {
          font-size: 2.2rem;
          color: var(--color-maroon-dark);
          margin: 16px 0 12px;
        }
        .buyer-desc {
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }
        .step-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .step-num {
          width: 36px;
          height: 36px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          border: 2px solid var(--color-maroon-dark);
          flex-shrink: 0;
        }
        .ticket-preview-card {
          padding: 24px;
          text-align: center;
        }
        .ticket-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px dashed var(--color-maroon);
          padding-bottom: 12px;
          margin-bottom: 16px;
          font-size: 0.85rem;
        }
        .ticket-title {
          font-size: 1.2rem;
          color: var(--color-maroon-dark);
        }
        .ticket-subtitle {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        .ticket-qr-mock {
          background-color: var(--color-pink-soft);
          padding: 16px;
          display: inline-block;
          border-radius: var(--radius-sm);
          margin-bottom: 10px;
          border: 2px solid var(--color-maroon);
        }
        .qr-hint {
          font-size: 0.8rem;
          color: var(--color-maroon);
        }

        /* Seller Onboarding Section */
        .seller-onboarding-section {
          padding: 80px 0;
          background-color: var(--color-maroon);
          color: var(--color-white);
        }
        .seller-box {
          max-width: 960px;
          margin: 0 auto;
        }
        .seller-title {
          font-size: 2.5rem;
          color: var(--color-cream-light);
          margin: 16px 0 12px;
        }
        .seller-subtitle {
          font-size: 1.1rem;
          color: var(--color-pink-soft);
          margin-bottom: 40px;
        }
        .seller-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }
        .seller-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background-color: rgba(255, 255, 255, 0.08);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-maroon-light);
        }
        .seller-feature-card h4 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--color-mustard);
          margin-bottom: 4px;
        }
        .seller-feature-card p {
          font-size: 0.88rem;
          color: var(--color-pink-soft);
          line-height: 1.4;
        }
        .admin-contact-card {
          background-color: var(--color-maroon-dark);
          padding: 32px;
          border-radius: var(--radius-lg);
          border: 3px solid var(--color-mustard);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .contact-card-title {
          font-size: 1.4rem;
          color: var(--color-mustard);
          margin-bottom: 16px;
        }
        .contact-steps {
          margin-left: 20px;
          margin-bottom: 28px;
          line-height: 1.8;
          font-size: 0.95rem;
          color: var(--color-cream-light);
        }
        .contact-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        .empty-state h3 {
          margin: 16px 0 8px;
        }

        .text-center { text-align: center; }
        .mt-4 { margin-top: 24px; }

        @media (max-width: 900px) {
          .hero-container { grid-template-columns: 1fr; }
          .hero-image-col { order: -1; }
          .hero-title { font-size: 2.2rem; }
          .buyer-container { grid-template-columns: 1fr; }
          .seller-features-grid { grid-template-columns: 1fr; }
          .hero-cta-group { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}

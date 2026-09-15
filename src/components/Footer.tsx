'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, Heart, ShieldCheck, Mail, Phone, MapPin, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer" id="tentang-kami">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="brand-header">
              <div className="brand-badge-footer">
                <Ticket size={24} />
              </div>
              <span className="brand-name">Daebak.Tix</span>
            </div>
            <p className="footer-desc">
              Platform & marketplace tiket resmi terpercaya khusus event Korea di Indonesia: Konser K-Pop, Fanmeeting Aktor/Aktris, dan Fansign Album.
            </p>
            <div className="security-tag">
              <ShieldCheck size={18} color="var(--color-mustard)" />
              <span>Verifikasi Promotor 100% Anti-Duplikat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Kategori Event</h4>
            <ul className="footer-links">
              <li><Link href="/buyer/tickets?category=concert">Konser K-Pop</Link></li>
              <li><Link href="/buyer/tickets?category=fanmeet">Fanmeeting Aktor/Aktris</Link></li>
              <li><Link href="/buyer/tickets?category=fansign">Album Fansign & Meetup</Link></li>
              <li><Link href="/buyer/tickets">Semua Event Aktif</Link></li>
            </ul>
          </div>

          {/* User & Seller Links */}
          <div className="footer-col">
            <h4 className="footer-title">Akses Portal</h4>
            <ul className="footer-links">
              <li><Link href="/buyer/login">Portal Pembeli (Beli Tiket)</Link></li>
              <li><a href="#section-penjual">Daftar Jadi Penjual Tiket</a></li>
              <li><Link href="/seller/login">Portal Penjual & Staf Scanner</Link></li>
              <li><Link href="/admin/login">Portal Admin Sistem</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="footer-col">
            <h4 className="footer-title">Hubungi Kami</h4>
            <div className="contact-item">
              <Mail size={16} /> admin@daebaktix.co.id
            </div>
            <div className="contact-item">
              <Phone size={16} /> +62 812-9988-7766 (WhatsApp Admin)
            </div>
            <div className="contact-item">
              <MapPin size={16} /> Sudirman Central Business District (SCBD), Jakarta
            </div>
            <div className="social-row">
              <span className="social-icon"><Instagram size={18} /></span>
              <span className="social-icon"><Youtube size={18} /></span>
              <span className="social-icon"><Twitter size={18} /></span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="footer-bottom">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> Daebak.Tix adalah platform marketplace perantara tiket resmi. Kami bekerjasama langsung dengan promotor resmi terverifikasi admin untuk menjamin keaslian 100% tiket bertanda QR unik.
          </p>
          <div className="copy-text">
            © 2026 <strong>Daebak.Tix Indonesia</strong>. Dibuat dengan <Heart size={14} color="#FFD56B" fill="#FFD56B" inline /> untuk Hallyu Fans Indonesia.
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background-color: var(--color-maroon-dark);
          color: var(--color-cream-light);
          padding: 60px 0 30px;
          border-top: 4px solid var(--color-maroon);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .brand-badge-footer {
          width: 40px;
          height: 40px;
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .brand-name {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--color-cream-light);
        }
        .footer-desc {
          font-size: 0.9rem;
          color: var(--color-pink-soft);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .security-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(255, 255, 255, 0.08);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-mustard);
          border: 1px dashed var(--color-maroon-light);
        }
        .footer-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--color-mustard);
          margin-bottom: 18px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          color: var(--color-cream-light);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        .footer-links a:hover {
          color: var(--color-mustard);
          text-decoration: underline;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--color-pink-soft);
          margin-bottom: 10px;
        }
        .social-row {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          background-color: var(--color-maroon);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .social-icon:hover {
          transform: scale(1.1);
          background-color: var(--color-mustard);
          color: var(--color-maroon-dark);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          text-align: center;
        }
        .disclaimer-text {
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.65);
          max-width: 800px;
        }
        .copy-text {
          font-size: 0.88rem;
          color: var(--color-cream-light);
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

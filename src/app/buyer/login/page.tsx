'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function BuyerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('jihan@gmail.com');
  const [password, setPassword] = useState('buyer123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = DataStore.getUsers();
    const buyer = users.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password &&
        u.role === 'buyer'
    );

    if (buyer) {
      DataStore.setSessionUser(buyer);
      router.push('/buyer/tickets');
    } else {
      setError('Email atau Password salah! Belum punya akun? Daftar gratis pakai NIK.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social auth for demo
    const users = DataStore.getUsers();
    const defaultBuyer = users.find((u) => u.role === 'buyer') || users[2];
    DataStore.setSessionUser(defaultBuyer);
    alert(`Berhasil login menggunakan akun ${provider}!`);
    router.push('/buyer/tickets');
  };

  return (
    <div className="buyer-auth-page">
      <Navbar />

      <div className="auth-body-container">
        <div className="auth-card card-playful">
          <div className="text-center mb-4">
            <div className="logo-icon-badge">
              <User size={36} color="var(--color-maroon)" />
            </div>
            <h1 className="font-display auth-title">Masuk Portal Pembeli</h1>
            <p className="auth-subtitle">Masuk untuk memesan tiket & melihat E-Ticket QR Code</p>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Pembeli</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  className="form-input with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jihan@gmail.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  className="form-input with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password akun"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-3" style={{ width: '100%' }}>
              Masuk Akun Pembeli <ArrowRight size={18} />
            </button>
          </form>

          {/* Social Login Options */}
          <div className="social-divider my-4">
            <span>atau masuk dengan akun sosial media</span>
          </div>

          <div className="social-buttons-grid">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="social-btn google-btn"
            >
              🌐 Google
            </button>
            <button
              onClick={() => handleSocialLogin('TikTok')}
              className="social-btn tiktok-btn"
            >
              🎵 TikTok
            </button>
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="social-btn fb-btn"
            >
              📘 Facebook
            </button>
          </div>

          <div className="auth-footer text-center mt-4">
            <span>Belum memiliki akun pembeli? </span>
            <Link href="/buyer/register" className="auth-link font-display">
              Daftar Sekarang (1 NIK = 1 Akun)
            </Link>
          </div>

          <div className="demo-credentials card-playful mt-3">
            <strong className="font-display">Demo Credentials Buyer:</strong>
            <div>Email: <code>jihan@gmail.com</code></div>
            <div>Password: <code>buyer123</code></div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .buyer-auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--color-cream);
        }
        .auth-body-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--color-white);
          padding: 36px;
        }
        .logo-icon-badge {
          width: 64px;
          height: 64px;
          background-color: var(--color-pink-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border: 2px solid var(--color-maroon);
        }
        .auth-title {
          font-size: 1.8rem;
          color: var(--color-maroon-dark);
        }
        .auth-subtitle {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .with-icon {
          padding-left: 40px;
        }
        .error-alert {
          background-color: #FFEBEE;
          color: #C62828;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .social-divider {
          text-align: center;
          position: relative;
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin: 20px 0;
        }
        .social-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .social-btn {
          padding: 8px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
          background-color: var(--color-cream-light);
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .social-btn:hover {
          background-color: var(--color-pink-soft);
          border-color: var(--color-maroon);
        }
        .auth-link {
          color: var(--color-maroon);
          text-decoration: underline;
        }
        .demo-credentials {
          background-color: var(--color-cream);
          font-size: 0.82rem;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}

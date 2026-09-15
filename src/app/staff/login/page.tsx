'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Mail, Lock, Key, AlertCircle, ShieldCheck } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function StaffLoginPage() {
  const router = useRouter();
  const [storeEmail, setStoreEmail] = useState('contact@starmedia.co.id');
  const [password, setPassword] = useState('seller123');
  const [accountCode, setAccountCode] = useState('SM-8891');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sellers = DataStore.getSellers();
    const matchedSeller = sellers.find(
      (s) =>
        s.store_email.trim().toLowerCase() === storeEmail.trim().toLowerCase() &&
        s.account_code.trim().toUpperCase() === accountCode.trim().toUpperCase() &&
        s.status === 'approved'
    );

    if (matchedSeller) {
      // Find staff profile or create session staff
      const staffList = DataStore.getStaff();
      const staff = staffList.find((st) => st.seller_id === matchedSeller.id) || {
        id: Date.now(),
        seller_id: matchedSeller.id,
        username: 'staf_gate',
        staff_name: `Staf Scanner (${matchedSeller.store_name})`,
        account_code: matchedSeller.account_code,
        store_email: matchedSeller.store_email,
        created_at: new Date().toISOString(),
      };

      DataStore.setSessionStaff(staff);
      DataStore.setSessionSeller(matchedSeller);
      router.push('/staff/dashboard');
    } else {
      setError('Kredensial Email Toko atau Kode Akun tidak valid!');
    }
  };

  return (
    <div className="staff-login-wrapper">
      <div className="mobile-app-card card-playful">
        <div className="text-center mb-4">
          <div className="scanner-icon-badge">
            <QrCode size={40} color="var(--color-maroon)" />
          </div>
          <h1 className="font-display login-title">Staff Ticket Scanner</h1>
          <p className="login-subtitle">Aplikasi Mobile Check-In Gate Venue</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Toko / Promoter</label>
            <div className="input-icon-wrap">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-input with-icon"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                placeholder="contact@starmedia.co.id"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password Staf / Toko</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-input with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kode Akun Unik Penjual</label>
            <div className="input-icon-wrap">
              <Key size={18} className="input-icon" />
              <input
                type="text"
                required
                className="form-input with-icon uppercase"
                value={accountCode}
                onChange={(e) => setAccountCode(e.target.value)}
                placeholder="mis. SM-8891"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-3" style={{ width: '100%' }}>
            Masuk Portal Scanner Staf
          </button>
        </form>

        <div className="demo-credentials card-playful mt-4">
          <strong className="font-display">Demo Credentials Staf:</strong>
          <div>Email: <code>contact@starmedia.co.id</code></div>
          <div>Password: <code>seller123</code></div>
          <div>Kode Akun: <code>SM-8891</code></div>
        </div>
      </div>

      <style jsx>{`
        .staff-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-maroon-dark);
          padding: 16px;
        }
        .mobile-app-card {
          width: 100%;
          max-width: 400px;
          background-color: var(--color-white);
          padding: 30px;
        }
        .scanner-icon-badge {
          width: 72px;
          height: 72px;
          background-color: var(--color-mustard);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border: 3px solid var(--color-maroon-dark);
          box-shadow: 2px 2px 0px var(--color-maroon-dark);
        }
        .login-title {
          font-size: 1.8rem;
          color: var(--color-maroon-dark);
        }
        .login-subtitle {
          font-size: 0.85rem;
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
        .uppercase { text-transform: uppercase; }
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
        .demo-credentials {
          background-color: var(--color-cream);
          font-size: 0.82rem;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Key, Mail, Lock, AlertCircle, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function SellerLoginPage() {
  const router = useRouter();
  const [storeEmail, setStoreEmail] = useState('contact@starmedia.co.id');
  const [password, setPassword] = useState('seller123');
  const [accountCode, setAccountCode] = useState('SM-8891');
  const [error, setError] = useState('');

  // 3-Step Modal Registration State
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [regSuccess, setRegSuccess] = useState(false);

  // Form State
  const [regData, setRegData] = useState({
    nik: '',
    ownerName: '',
    age: 25,
    dob: '',
    gender: 'Perempuan' as 'Laki-laki' | 'Perempuan',
    storeName: '',
    storeDesc: '',
    storeAddress: '',
    storeEmail: '',
    termsAgreed: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sellers = DataStore.getSellers();
    const seller = sellers.find(
      (s) =>
        s.store_email.trim().toLowerCase() === storeEmail.trim().toLowerCase() &&
        s.account_code.trim().toUpperCase() === accountCode.trim().toUpperCase() &&
        s.status === 'approved'
    );

    if (seller) {
      DataStore.setSessionSeller(seller);
      router.push('/seller/dashboard');
    } else {
      const pendingSeller = sellers.find(
        (s) => s.store_email.trim().toLowerCase() === storeEmail.trim().toLowerCase()
      );
      if (pendingSeller && pendingSeller.status === 'pending') {
        setError('Pengajuan Toko Anda masih dalam proses verifikasi Admin. Silahkan tunggu persetujuan!');
      } else {
        setError('Kredensial atau Kode Akun Toko salah/belum disetujui admin!');
      }
    }
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.termsAgreed) {
      alert('Anda wajib menyetujui syarat & ketentuan!');
      return;
    }

    DataStore.addSellerRequest({
      nik: regData.nik,
      owner_name: regData.ownerName,
      age: Number(regData.age),
      dob: regData.dob,
      gender: regData.gender,
      store_name: regData.storeName,
      store_desc: regData.storeDesc,
      store_address: regData.storeAddress,
      store_email: regData.storeEmail,
    });

    setRegSuccess(true);
  };

  return (
    <div className="seller-login-wrapper">
      <div className="login-card card-playful">
        <div className="text-center mb-4">
          <div className="logo-badge">
            <Store size={36} color="var(--color-maroon)" />
          </div>
          <h1 className="font-display login-title">Portal Toko Penjual</h1>
          <p className="login-subtitle">Masuk dengan Kredensial & Kode Akun Unik dari Admin</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Toko</label>
            <div className="input-icon-wrap">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-input with-icon"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                placeholder="mis. contact@starmedia.co.id"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password Toko</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-input with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password dari Admin"
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
            Masuk Dashboard Penjual
          </button>
        </form>

        <div className="login-footer-links mt-4">
          <button onClick={() => setRegModalOpen(true)} className="reg-link-btn">
            Belum Punya Akun? Ajukan Pendaftaran Toko (3 Step)
          </button>
        </div>

        <div className="demo-credentials card-playful mt-3">
          <strong className="font-display">Demo Credentials Seller (Approved):</strong>
          <div>Email: <code>contact@starmedia.co.id</code></div>
          <div>Password: <code>seller123</code></div>
          <div>Kode Akun: <code>SM-8891</code></div>
        </div>
      </div>

      {/* 3-STEP REGISTRATION MODAL */}
      {regModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card card-playful">
            {regSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 size={54} color="#2E7D32" className="mb-2" />
                <h3 className="font-display text-maroon">Pengajuan Berhasil Dikirim!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }} className="mt-2 mb-4">
                  Data diri & toko Anda telah masuk ke antrean Admin. Setelah disetujui, Admin akan mengirimkan <strong>Kode Akun Unik & Kredensial Login</strong> ke email <code>{regData.storeEmail}</code>.
                </p>
                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setRegModalOpen(false);
                  }}
                  className="btn btn-primary"
                >
                  Tutup & Kembali ke Login
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header mb-3">
                  <h3 className="font-display modal-title">Formulir Pengajuan Penjual (3 Tahap)</h3>
                  <div className="step-indicator">
                    <span className={`step-dot ${step === 1 ? 'active' : ''}`}>1. Data Diri</span>
                    <span className={`step-dot ${step === 2 ? 'active' : ''}`}>2. Data Toko</span>
                    <span className={`step-dot ${step === 3 ? 'active' : ''}`}>3. Verifikasi</span>
                  </div>
                </div>

                <form onSubmit={handleRegSubmit}>
                  {step === 1 && (
                    <div className="step-content">
                      <h4 className="font-display text-maroon mb-2">Tahap 1: Data Diri Pemilik Toko</h4>
                      <div className="form-group">
                        <label className="form-label">NIK (Nomor Induk Kependudukan - 16 Digit)</label>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          className="form-input"
                          placeholder="mis. 3171012345670001"
                          value={regData.nik}
                          onChange={(e) => setRegData({ ...regData, nik: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nama Lengkap Pemilik</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Nama lengkap sesuai KTP"
                          value={regData.ownerName}
                          onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label className="form-label">Umur</label>
                          <input
                            type="number"
                            required
                            className="form-input"
                            value={regData.age}
                            onChange={(e) => setRegData({ ...regData, age: Number(e.target.value) })}
                          />
                        </div>
                        <div className="form-group flex-1">
                          <label className="form-label">Tanggal Lahir</label>
                          <input
                            type="date"
                            required
                            className="form-input"
                            value={regData.dob}
                            onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jenis Kelamin</label>
                        <select
                          className="form-select"
                          value={regData.gender}
                          onChange={(e) => setRegData({ ...regData, gender: e.target.value as any })}
                        >
                          <option value="Perempuan">Perempuan</option>
                          <option value="Laki-laki">Laki-laki</option>
                        </select>
                      </div>
                      <button type="button" onClick={() => setStep(2)} className="btn btn-primary mt-2">
                        Lanjut ke Tahap 2: Data Toko →
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="step-content">
                      <h4 className="font-display text-maroon mb-2">Tahap 2: Data Toko / Promotor</h4>
                      <div className="form-group">
                        <label className="form-label">Nama Toko / Agensi Event</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="mis. Star Media Live"
                          value={regData.storeName}
                          onChange={(e) => setRegData({ ...regData, storeName: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Deskripsi Singkat Toko</label>
                        <textarea
                          required
                          rows={2}
                          className="form-textarea"
                          placeholder="Promoter resmi konser & fanmeet Korea..."
                          value={regData.storeDesc}
                          onChange={(e) => setRegData({ ...regData, storeDesc: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Alamat Lengkap Toko</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Jl. Sudirman No. 45, Jakarta"
                          value={regData.storeAddress}
                          onChange={(e) => setRegData({ ...regData, storeAddress: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Toko (Untuk Terima Kode Akun Admin)</label>
                        <input
                          type="email"
                          required
                          className="form-input"
                          placeholder="info@namatoko.id"
                          value={regData.storeEmail}
                          onChange={(e) => setRegData({ ...regData, storeEmail: e.target.value })}
                        />
                      </div>
                      <div className="btn-row mt-2">
                        <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                          ← Kembali
                        </button>
                        <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                          Lanjut ke Tahap 3: Verifikasi →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="step-content">
                      <h4 className="font-display text-maroon mb-2">Tahap 3: Verifikasi & Syarat Ketentuan</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }} className="mb-3">
                        Setelah menekan tombol Kirim, pengajuan Anda akan ditinjau Admin. Kode Akun Unik dan password login akan dikirimkan langsung ke email toko Anda.
                      </p>

                      <div className="terms-checkbox-card card-playful mb-4">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={regData.termsAgreed}
                            onChange={(e) => setRegData({ ...regData, termsAgreed: e.target.checked })}
                          />
                          <span>
                            Saya menyetujui seluruh Syarat & Ketentuan Penjual Tiket Daebak.Tix, termasuk bersedia menjual tiket 100% asli bertanda QR Code resmi.
                          </span>
                        </label>
                      </div>

                      <div className="btn-row">
                        <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                          ← Kembali
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <Send size={16} /> Kirim Pengajuan Ke Admin
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .seller-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-maroon);
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--color-white);
          padding: 36px;
        }
        .logo-badge {
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
        .login-title {
          font-size: 1.8rem;
          color: var(--color-maroon-dark);
        }
        .login-subtitle {
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
        .uppercase {
          text-transform: uppercase;
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
        .reg-link-btn {
          background: none;
          border: none;
          color: var(--color-maroon);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
        }
        .demo-credentials {
          background-color: var(--color-cream);
          font-size: 0.82rem;
          padding: 12px;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-card {
          width: 100%;
          max-width: 540px;
          background-color: var(--color-white);
        }
        .step-indicator {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }
        .step-dot {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-muted);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background-color: var(--color-cream);
        }
        .step-dot.active {
          background-color: var(--color-maroon);
          color: var(--color-white);
        }
        .form-row {
          display: flex;
          gap: 14px;
        }
        .flex-1 { flex: 1; }
        .btn-row {
          display: flex;
          justify-content: space-between;
        }
        .terms-checkbox-card {
          background-color: var(--color-pink-soft);
          padding: 14px;
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

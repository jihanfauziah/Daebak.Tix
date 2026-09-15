'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, ShieldCheck, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function BuyerRegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(24);
  const [dob, setDob] = useState('2000-01-01');
  const [gender, setGender] = useState<'Perempuan' | 'Laki-laki'>('Perempuan');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nik.length !== 16) {
      setError('NIK wajib 16 digit angka sesuai KTP!');
      return;
    }

    const existingUsers = DataStore.getUsers();
    if (existingUsers.some((u) => u.nik === nik)) {
      setError('NIK ini sudah terdaftar! Aturan Daebak.Tix: 1 NIK = 1 Akun.');
      return;
    }

    if (existingUsers.some((u) => u.email === email)) {
      setError('Email ini sudah terdaftar!');
      return;
    }

    const newUser = DataStore.addUser({
      nik,
      username,
      full_name: fullName,
      email,
      phone,
      age: Number(age),
      dob,
      gender,
      password,
      role: 'buyer',
      loyalty_points: 100, // Welcome bonus points!
    });

    DataStore.setSessionUser(newUser);
    alert('Registrasi akun pembeli berhasil! Anda mendapatkan 100 Point Loyalty bonus.');
    router.push('/buyer/tickets');
  };

  return (
    <div className="buyer-auth-page">
      <Navbar />

      <div className="auth-body-container">
        <div className="auth-card card-playful">
          <div className="text-center mb-4">
            <div className="logo-icon-badge">
              <ShieldCheck size={36} color="var(--color-maroon)" />
            </div>
            <h1 className="font-display auth-title">Daftar Akun Pembeli Baru</h1>
            <p className="auth-subtitle">Verifikasi NIK (1 NIK = 1 Akun untuk cegah calo tiket)</p>
          </div>

          {error && (
            <div className="error-alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">NIK (Nomor Induk Kependudukan - 16 Digit)</label>
              <input
                type="text"
                required
                maxLength={16}
                className="form-input font-display"
                placeholder="mis. 3201041998051201"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Lengkap Sesuai KTP</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="mis. Jihan Fauziah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="jihan_fauziah"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="085711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Aktif</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="jihan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Umur</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Jenis Kelamin</label>
              <select
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-3" style={{ width: '100%' }}>
              Buat Akun Pembeli & Klaim 100 Pts
            </button>
          </form>

          <div className="auth-footer text-center mt-4">
            <span>Sudah punya akun? </span>
            <Link href="/buyer/login" className="auth-link font-display">
              Masuk Pembeli
            </Link>
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
          max-width: 520px;
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
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .error-alert {
          background-color: #FFEBEE;
          color: #C62828;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 16px;
        }
        .form-row {
          display: flex;
          gap: 14px;
        }
        .flex-1 { flex: 1; }
        .auth-link {
          color: var(--color-maroon);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

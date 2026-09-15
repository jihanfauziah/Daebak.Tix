'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Ticket, AlertCircle } from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@daebaktix.co.id');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = DataStore.getUsers();
    const admin = users.find(
      (u) => u.email === email.trim() && u.password === password && u.role === 'admin'
    );

    if (admin) {
      DataStore.setSessionUser(admin);
      router.push('/admin/dashboard');
    } else {
      setError('Kredensial Admin salah! Silahkan periksa email & password.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card card-playful">
        <div className="text-center mb-4">
          <div className="logo-badge">
            <ShieldCheck size={36} color="var(--color-maroon)" />
          </div>
          <h1 className="font-display login-title">Portal Super Admin</h1>
          <p className="login-subtitle">Daebak.Tix System Control Panel</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Admin</label>
            <div className="input-icon-wrap">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-input with-icon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password Admin</label>
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

          <button type="submit" className="btn btn-primary btn-lg mt-3" style={{ width: '100%' }}>
            Masuk Dashboard Admin
          </button>
        </form>

        <div className="demo-credentials card-playful mt-4">
          <strong className="font-display">Default Credential Demo:</strong>
          <div>Email: <code>admin@daebaktix.co.id</code></div>
          <div>Password: <code>admin</code></div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-maroon-dark);
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
          font-size: 0.9rem;
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
        .demo-credentials {
          background-color: var(--color-cream);
          font-size: 0.82rem;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}

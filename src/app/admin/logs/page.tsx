'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DataStore } from '@/lib/store';
import { ActivityLog } from '@/lib/types';
import { FileText, Shield, User, Store, QrCode } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setLogs(DataStore.getLogs());
  }, []);

  return (
    <AdminLayout>
      <div className="page-header mb-4">
        <div>
          <h1 className="font-display page-title">Activity Log & Audit Trail</h1>
          <p className="page-subtitle">Catatan lengkap aktivitas semua role (Admin, Penjual, Pembeli, dan Staf Scanner).</p>
        </div>
      </div>

      <div className="card-playful">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Role</th>
                <th>Nama Pengguna</th>
                <th>Aksi</th>
                <th>Rincian Detail Activity</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Belum ada catatan aktivitas.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td>
                      <span
                        className={`sticker-badge ${
                          log.user_role === 'admin'
                            ? 'badge-maroon'
                            : log.user_role === 'seller'
                            ? 'badge-pink'
                            : log.user_role === 'staff'
                            ? 'badge-mustard'
                            : 'badge-lavender'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {log.user_role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{log.user_name}</strong>
                    </td>
                    <td>
                      <code>{log.action}</code>
                    </td>
                    <td style={{ fontSize: '0.88rem', color: 'var(--color-text-dark)' }}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-size: 2rem;
          color: var(--color-maroon-dark);
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th, .admin-table td {
          padding: 12px 14px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-table th {
          background-color: var(--color-cream);
          font-family: var(--font-display);
          color: var(--color-maroon-dark);
        }
      `}</style>
    </AdminLayout>
  );
}

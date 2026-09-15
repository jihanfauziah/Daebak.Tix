# 🔑 Daebak.Tix — Seed Accounts & Credentials

Dokumentasi akun seed resmi untuk keperluan testing dan demo sistem **Daebak.Tix** (Platform Tiket Event Korea di Indonesia).

---

## 📋 Daftar Akun Seed Berdasarkan Role

| Role | Email / Identitas | Password / PIN | Informasi Tambahan | Akses Dashboard |
|---|---|---|---|---|
| **Admin (Owner)** | `admin@daebaktix.com` | `admin123` | Active Flag `isOwner: true`<br>*(Akses Role Switcher)* | `/admin/dashboard` |
| **Penjual (Seller)** | `penjual@daebaktix.com` | `penjual123` | Toko: **Star Media Event**<br>Kode Toko: `SM-2026`<br>Paket: Paid 3 Bulan | `/seller/dashboard` |
| **Staf Scanner** | `penjual@daebaktix.com` | `penjual123` | Kode Toko: `SM-2026`<br>PIN/Pass Staf: `123456` | `/staff/dashboard` |
| **Pembeli (Buyer)** | `pembeli@daebaktix.com` | `pembeli123` | Nama: **Jihan Fauziah**<br>NIK: `3171012345670001`<br>Loyalty: 350 Pts | `/buyer/tickets` |

---

## ⚡ Role Switcher Khusus Owner (Dev-Only Feature)

Saat Anda login menggunakan akun **Admin** (`admin@daebaktix.com` / `admin123`), sistem akan mendeteksi flag `isOwner: true`. 

Menu **"Lihat Sebagai:"** akan muncul secara otomatis pada Navbar atas dengan pilihan:
- 🛡️ **Admin** → Beralih ke Portal Admin (`/admin/dashboard`)
- 🏪 **Penjual** → Beralih ke Portal Toko (`/seller/dashboard`)
- 📱 **Staf** → Beralih ke Portal Scanner Gate (`/staff/dashboard`)
- 🎟️ **Pembeli** → Beralih ke Katalog Tiket Pembeli (`/buyer/tickets`)

> ⚠️ **Catatan Penting Security:**  
> Fitur Role Switcher ini **HANYA untuk keperluan development/demo owner** dan dikontrol oleh conditional check `(currentUser as any)?.isOwner`. Fitur ini wajib di-disable sebelum melakukan deploy ke lingkungan produksi.

---

## 🛠️ Cara Menguji Alur 4 Role

1. **Sebagai Admin:**
   - Login via `/admin/login` dengan `admin@daebaktix.com` / `admin123`.
   - Gunakan menu **Lihat Sebagai** di Navbar untuk mencoba 3 role lainnya secara instan.

2. **Sebagai Penjual:**
   - Login via `/seller/login` dengan `penjual@daebaktix.com` / `penjual123`.
   - Kelola event, kelola pesanan pembeli, dan buat akun staf scanner.

3. **Sebagai Staf:**
   - Login via `/staff/login` dengan:
     - Email Toko: `penjual@daebaktix.com`
     - Password: `penjual123`
     - Kode Akun: `SM-2026`
   - Lakukan simulasi scan QR tiket pengunjung gate.

4. **Sebagai Pembeli:**
   - Login via `/buyer/login` dengan `pembeli@daebaktix.com` / `pembeli123`.
   - Lakukan pembelian tiket, cek pesanan, kumpulkan poin loyalty, dan buka tiket QR Code.

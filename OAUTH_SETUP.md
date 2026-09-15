# 🌐 Panduan Setup Provider OAuth Social Login (Google, Facebook, TikTok)

Dokumentasi ini menjelaskan langkah-langkah mendapatkan `Client ID` (atau `Client Key`) dan `Client Secret` untuk menghubungkan fitur login sosial media di **Daebak.Tix** menggunakan NextAuth.js.

---

## 1. 🌐 Google OAuth 2.0 (Google Cloud Console)

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada (misal: `Daebak-Tix-App`).
3. Buka menu **APIs & Services** > **OAuth consent screen**:
   - Pilih User Type: **External**.
   - Isi Nama Aplikasi: `Daebak.Tix` dan Email Support.
   - Tambahkan scope dasar: `userinfo.email` dan `userinfo.profile`.
4. Buka menu **APIs & Services** > **Credentials**:
   - Klik **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Daebak.Tix Local Dev`.
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Salin **Client ID** dan **Client Secret**, lalu masukkan ke file `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

---

## 2. 📘 Facebook / Meta OAuth (Meta for Developers)

1. Buka [Meta for Developers](https://developers.facebook.com/).
2. Login dan klik **My Apps** > **Create App**.
3. Pilih Use Case: **Authenticate and request data from users with Facebook Login** (atau **Consumer**).
4. Isi Nama Aplikasi: `Daebak.Tix`.
5. Masuk ke dashboard app, di bagian **Facebook Login** klik **Settings**:
   - Client OAuth Settings -> **Valid OAuth Redirect URIs**: `http://localhost:3000/api/auth/callback/facebook`
   - Simpan perubahan.
6. Buka **App Settings** > **Basic**:
   - Salin **App ID** (Client ID) dan **App Secret** (Client Secret).
7. Masukkan ke file `.env.local`:
   ```env
   FACEBOOK_CLIENT_ID=your_facebook_app_id_here
   FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here
   ```

---

## 3. 🎵 TikTok OAuth 2.0 (TikTok for Developers)

1. Buka [TikTok for Developers](https://developers.tiktok.com/).
2. Login dan klik **Manage Apps** > **Create an App**.
3. Isi detail aplikasi: `Daebak.Tix` (Platform: Web).
4. Pada bagian **Login Kit**:
   - Aktifkan produk **Login Kit**.
   - Tambahkan Redirect URL: `http://localhost:3000/api/auth/callback/tiktok`
   - Pilih Permission: `user.info.basic`.
5. Salin **Client Key** (Client ID) dan **Client Secret**.
6. Masukkan ke file `.env.local`:
   ```env
   TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
   TIKTOK_CLIENT_SECRET=your_tiktok_client_secret_here
   ```

---

## 🔑 Mengaktifkan di Lingkungan Lokal (.env.local)

Pastikan file `.env.local` di root proyek memiliki struktur berikut:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=daebaktix_super_secret_nextauth_jwt_key_2026_dev

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

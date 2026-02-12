# Iuran RT Apps

Aplikasi frontend untuk pencatatan iuran warga RT.

## Tech Stack

- **Framework:** React 18 (Create React App)
- **UI:** Bootstrap 5
- **State Management:** Redux Toolkit + redux-persist
- **HTTP Client:** Axios
- **Routing:** React Router DOM v6
- **Icons:** Font Awesome
- **Notifications:** SweetAlert2

## Fitur

- 🔐 **Login/Logout** — Autentikasi dengan JWT (persisted di localStorage)
- 👥 **Data Warga** — Kelola data warga RT (CRUD + detail + riwayat iuran)
- 💰 **Data Iuran** — Catat dan kelola pembayaran iuran warga
- 📋 **Rincian Iuran** — Lihat breakdown iuran per periode (RT/PKK/Sosial/Kematian)
- 📤 **Data Pengeluaran** — Catat pengeluaran kas RT
- 📊 **Laporan Bu Agus** — Laporan pemasukan cash + pengeluaran
- 📊 **Laporan Bu Harris** — Laporan pemasukan transfer
- 👤 **Data User** — Kelola pengguna aplikasi

## Struktur Folder

```
src/
├── components/      # Komponen reusable (Navbar, Footer)
├── helpers/         # Utility functions (FormatDate, FormatCurrency)
├── hooks/           # Custom hooks (usePayments, useCreatePayments, dll.)
├── pages/           # Halaman aplikasi
│   ├── iuran/       # Halaman iuran (index, create, edit, rincian, total)
│   ├── warga/       # Halaman warga (index, create, edit, detail)
│   ├── expense/     # Halaman pengeluaran
│   ├── user/        # Halaman user management
│   └── report/      # Halaman laporan (cash, transfer)
├── services/        # API service layer (Axios)
└── store/           # Redux store & reducers
```

## Setup

```bash
# Install dependencies
npm install

# Konfigurasi environment
cp .env.example .env
# Edit .env — set REACT_APP_BASE_URL_LOCAL sesuai alamat backend

# Jalankan development server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Environment Variables

| Variable                   | Keterangan                                           |
| -------------------------- | ---------------------------------------------------- |
| `REACT_APP_ENV`            | Environment (`local` / `development` / `production`) |
| `REACT_APP_BASE_URL_LOCAL` | URL backend API (local)                              |
| `REACT_APP_BASE_URL_DEV`   | URL backend API (development)                        |
| `REACT_APP_BASE_URL_PROD`  | URL backend API (production)                         |

## Dokumentasi

- 📗 [User Guide](docs/USER_GUIDE.md) — Panduan penggunaan aplikasi (non-teknis)
- 📘 [Technical Review](../api-iuran-rt/docs/TECHNICAL_REVIEW.md) — Arsitektur, bisnis proses, dan API reference

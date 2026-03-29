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
- **Data Export:** xlsx (SheetJS)

## Fitur

- 🔐 **Login/Logout** — Autentikasi dengan JWT (persisted di localStorage)
- 👥 **Data Warga** — Kelola data warga RT (CRUD + detail + riwayat iuran)
- 💰 **Catat Pemasukan** — Form satu pintu untuk mencatat iuran warga (termasuk form dinamis custom nominal) atau pemasukan lainnya (sumbangan/donasi)
- 📋 **Data Iuran & Rincian** — Kelola data iuran warga serta breakdown per periode (RT/PKK/Sosial/Kematian)
- 💸 **Pemasukan Lainnya** — Catat sumbangan, donasi, atau pendapatan lain di luar iuran
- 📤 **Data Pengeluaran** — Catat pengeluaran kas RT
- 🏦 **Saldo Awal** — Atur saldo awal tahun untuk Petty Cash (Bu Agus) dan Rekening BCA (Bu Harris)
- 📊 **Laporan Petty Cash** — Laporan rekapitulasi akuntansi untuk pemasukan cash + pengeluaran
- 📊 **Laporan Kas Rekening** — Laporan rekapitulasi akuntansi untuk pemasukan transfer
- ⚖️ **Neraca Kas RT** — Laporan side-by-side untuk melihat net balance per bulan secara komprehensif
- 📈 **Laporan Pricing Tier** — Analisis kategori pembayaran warga (75k, 110k, atau custom)
- 📥 **Ekspor Excel** — Download otomatis laporan dan tabel secara langsung di rincian laporan kas RT
- 👤 **Data User** — Kelola pengguna aplikasi
- 🚀 **UI UX Enhancements** — Menyediakan Select Limit tabel fleksibel, dan persistensi pagination via `sessionStorage`.

## Struktur Folder

```
src/
├── components/      # Komponen reusable (Navbar, Footer, TableFooter)
├── helpers/         # Utility functions (FormatDate, FormatCurrency, urlBuilder)
├── hooks/           # Custom hooks (usePayments, useCreatePayments, dll.)
├── pages/           # Halaman aplikasi
│   ├── income/      # Halaman Catat Pemasukan
│   ├── iuran/       # Halaman iuran (index, rincian, total)
│   ├── otherIncome/ # Halaman pemasukan lainnya
│   ├── warga/       # Halaman warga (index, create, edit, detail)
│   ├── expense/     # Halaman pengeluaran
│   ├── opening-balance/ # Halaman saldo awal tahun
│   ├── user/        # Halaman user management
│   └── report/      # Halaman laporan (cash, transfer, neraca, pricing-tier)
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

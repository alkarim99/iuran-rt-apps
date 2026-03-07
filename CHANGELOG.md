# Frontend Release Notes & Changelog

## [v2.0.0] - Iuran RT Apps V2

Versi 2 berfokus pada perombakan _User Experience_ (UX), memperkaya _User Interface_ (UI) dengan metrik laporan komprehensif, format mata uang dinamis, dan navigasi cerdas.

### Fitur Baru (New Features)

- **Dashboard Laporan & Analitik Finansial**:
  - Laporan **Neraca Kas RT** dengan struktur kronologis dan kalkulasi _Net Balance_ (Saldo).
  - Laporan **Pricing Tier** interaktif dengan filter _Preset_ Kalender (Bulan Ini, 1 Bulan Sebelumnya, dll) lengkap dengan Pop-up penampil data identitas warga.
  - Laporan **Penerimaan Cash (Bu Agus)** & **Transfer (Bu Harris)** secara terpisah.
- **Modul Pengeluaran & Pemasukan Lainnya**:
  - Halaman form baru lengkap untuk mencatat Pengeluaran dan Pemasukan Lain di luar iuran warga.
- **Smart UX Redirect**:
  - Form pendataan kini mengenali _History Referer_ menggunakan `location.state.from`. Setelah sukses submit, halaman _back_ otomatis ke tempat user berasal tanpa memaksa kembali ke rute root.
- **Live Currency Formatter**:
  - _Preview Rupiah_ (Rp) muncul otomatis dan interaktif _real-time_ di bawah _input field_ nominal pada pengisian form (Pengeluaran, Pemasukan, dsb) untuk mencegah _typo_ angka nol.
- **Excel Export**: Semua tabel laporan kini dilengkapi tombol unduh (Export) laporan ke ekstensi `.xlsx` siap cetak.

### Perbaikan & UX Polish (Fixes)

- Filter _Ghost Request_ pada hooks `useCreatePayments.js`, mengunci panggilan asinkron ke `/api/payments/latest/` ketika payload ID sedang di fase rendisi.
- Penyesuaian skema UI tema _Navbar_ transparan dan warna lencana (_badge_) label klasifikasi pada laporan Tier.
- Bounding nilai uang desimal dengan batas sen (.00) di tabel Neraca menghindari _visual overflow_.

---

## [v1.0.0] - Legacy Initial Release

### Fitur Utama

- **Authentication Gateway**: Halaman Login awal.
- **Manajemen Warga & Iuran**:
  - Daftar Warga dengan antarmuka pencarian dan pendaftaran (_Create, Edit, Delete_).
  - Daftar historis pembayaran tagihan per warga.
- **Komponen Inti**:
  - Routing menggunakan React Router DOM statis.
  - Pengelolaan state global sesi Auth menggunakan _Redux_.
  - Desain antarmuka dasar berbasis _Bootstrap_.

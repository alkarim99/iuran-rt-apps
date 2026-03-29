# Dokumentasi Aplikasi Iuran RT

## Tentang Aplikasi

Aplikasi **Iuran RT** adalah sistem pencatatan keuangan digital untuk lingkungan RT. Aplikasi ini menggantikan pencatatan manual di buku kas dengan sistem berbasis web yang bisa diakses dari komputer maupun handphone.

**Fungsi utama:**

- 📋 **Mencatat data warga** — nama dan alamat rumah
- 💰 **Mencatat pembayaran iuran** — iuran rutin bulanan
- 🎁 **Mencatat pemasukan lainnya** — sumbangan, donasi, atau pendapatan lain di luar iuran
- 📤 **Mencatat pengeluaran** — pengeluaran kas RT
- 📊 **Melihat laporan keuangan** — laporan petty cash, kas rekening, neraca, hingga analisis pricing tier
- 📥 **Ekspor Data** — Mendownload laporan dan data warga/iuran langsung ke format Excel (.xlsx)

---

## Siapa yang Menggunakan?

Aplikasi ini digunakan oleh **pengurus RT (Admin/Bendahara)**. Hanya pengguna yang sudah terdaftar dan login yang bisa mengakses semua fitur. Pendaftaran pengguna baru hanya bisa dilakukan oleh Admin yang sudah ada melalui menu **User**.

---

## Cara Masuk (Login)

1. Buka aplikasi di browser
2. Klik tombol **Sign In** di halaman utama atau pojok kanan atas
3. Masukkan **Email** dan **Password**
4. Klik **Submit**
5. Jika berhasil, Anda akan diarahkan ke halaman utama dan menu navigasi akan muncul

**Untuk keluar (Logout):** Klik tombol **Sign Out** di pojok kanan atas menu navigasi.

---

## Menu Navigasi

Setelah login, tersedia menu berikut:

| Menu                                   | Fungsi                                                               |
| -------------------------------------- | -------------------------------------------------------------------- |
| **User**                               | Mengelola pengguna aplikasi (Admin/Bendahara)                        |
| **Warga**                              | Mengelola data warga RT                                              |
| **Pengeluaran**                        | Mencatat pengeluaran kas RT                                          |
| **Saldo Awal**                         | Mengatur saldo awal Petty Cash dan Rekening di setiap awal tahun     |
| **Pemasukan → Catat Pemasukan**        | Form satu pintu untuk mencatat Iuran Warga atau Pemasukan Lainnya    |
| **Pemasukan → Data Iuran Warga**       | Melihat semua catatan pembayaran iuran                               |
| **Pemasukan → Rincian Iuran Warga**    | Melihat rincian iuran per periode (RT/PKK/Sosial/Kematian)           |
| **Pemasukan → Kalkulasi Iuran Total**  | Ringkasan total pendapatan iuran per bulan                           |
| **Pemasukan → Data Pemasukan Lainnya** | Melihat catatan sumbangan, donasi, dll                               |
| **Laporan → Laporan Petty Cash**       | Laporan pemasukan cash + pengeluaran (dikelola Bu Agus)              |
| **Laporan → Laporan Kas Rekening**     | Laporan pemasukan transfer (dikelola Bu Harris)                      |
| **Laporan → Neraca Kas RT**            | Laporan komprehensif pemasukan vs pengeluaran per bulan              |
| **Laporan → Laporan Pricing Tier**     | Analisis kategori pembayaran (75k, 110k, atau custom)                |

---

## Mengelola Data Warga

### Melihat Daftar Warga

- Buka menu **Warga**
- Daftar warga ditampilkan dalam tabel, diurutkan berdasarkan alamat secara default
- Gunakan kolom **Cari** untuk mencari berdasarkan nama atau alamat
- Klik pada judul kolom ( Nama / Alamat ) untuk mengurutkan data (_Ascending / Descending_)
- Anda dapat memilih jumlah baris yang ditampilkan per halaman (10, 20, 25, 50, 100). Sistem akan secara otomatis mengingat preferensi Anda.

### Menambah Warga Baru

1. Klik tombol **+** di halaman Warga
2. Isi **Nama** dan **Alamat** (contoh alamat: `K3-5`, `K1-12A`, `K2-10`)
3. Klik **Submit**

> ⚠️ Alamat harus unik — tidak boleh sama dengan warga yang sudah terdaftar.

### Mengubah Data Warga

1. Klik ikon **✏️ (edit)** pada baris warga yang ingin diubah
2. Ubah nama atau alamat sesuai kebutuhan
3. Klik **Submit**

> Jika alamat atau nama warga berubah, data yang sudah tercatat di pembayaran sebelumnya akan otomatis diperbarui.

### Melihat Detail Warga

1. Klik ikon **👁️ (detail)** pada baris warga
2. Halaman detail menampilkan:
   - **Info warga** — nama dan alamat
   - **Riwayat pembayaran iuran** — semua catatan pembayaran warga tersebut
   - **Rincian per bulan** — breakdown pembayaran ke dalam periode bulanan
3. Dari halaman ini, Anda bisa langsung **menambah pembayaran baru** untuk warga tersebut

### Menghapus Warga

- Klik ikon **🗑️ (hapus)** pada baris warga
- Konfirmasi penghapusan melalui dialog yang muncul

---

## Mencatat Pemasukan (Iuran & Lainnya)

Gunakan menu **Pemasukan → Catat Pemasukan** sebagai cara tercepat mencatat uang masuk.

### 1. Mencatat Iuran Warga

1. Pilih **Jenis Pemasukan: Pemasukan Iuran Warga**
2. Pilih **Warga** dari dropdown (bisa dicari dengan mengetik)
3. **Tanggal Bayar**: Tanggal uang diterima
4. **Periode Mulai & Akhir**: Rentang bulan yang dibayar
5. **Nominal**: Total uang yang dibayarkan
6. **Metode Pembayaran**: Pilih **Cash / Petty Cash** atau **Transfer / Kas Rekening**
7. Klik **Simpan Iuran**

**Cara Kerja Perhitungan Otomatis:**
Sistem secara otomatis membagi nominal ke dalam komponen RT, PKK, Sosial, dan Kematian berdasarkan tier:
- **Rp 75.000 / bulan**: Hanya untuk komponen RT.
- **Rp 110.000 / bulan**: RT (94.500) + PKK (8.000) + Sosial (2.500) + Kematian (5.000).
- **Custom**: Jika nominal tidak sesuai tier di atas, form isian manual akan muncul.

### 2. Mencatat Pemasukan Lainnya (Sumbangan/Donasi)

1. Pilih **Jenis Pemasukan: Pemasukan Lainnya (Sumbangan dll)**
2. Isi **Tanggal Masuk**, **Nominal**, dan **Deskripsi** (misal: "Sumbangan 17 Agustus")
3. Pilih **Metode Pembayaran**
4. Klik **Simpan Pemasukan Lainnya**

---

## Saldo Awal Tahun

Menu **Saldo Awal** digunakan untuk menentukan saldo pembuka di awal tahun untuk Petty Cash (Bu Agus) dan Rekening BCA (Bu Harris). Saldo ini akan menjadi dasar perhitungan carry-over pada laporan bulanan.

1. Pilih **Tahun** yang diinginkan
2. Klik **Tambah Saldo Awal**
3. Masukkan **Tipe Rekening**, **Nominal**, dan **Keterangan**
4. Klik **Simpan**

---

## Melihat Data & Kalkulasi Iuran

### Rincian Iuran (`Pemasukan → Rincian Iuran Warga`)

Menampilkan breakdown setiap pembayaran iuran ke dalam kolom RT, PKK, Sosial, dan Kematian. Berguna untuk melihat detail pembagian uang kas per warga.

### Kalkulasi Iuran Total (`Pemasukan → Kalkulasi Iuran Total`)

Memberikan ringkasan cepat berapa total pendapatan iuran yang diterima pada bulan tertentu, lengkap dengan daftar warganya.

---

## Mencatat Pengeluaran

### Menambah Pengeluaran

1. Buka menu **Pengeluaran**, klik tombol **+**
2. Isi **Tanggal Transaksi**, **Nominal**, dan **Deskripsi**
3. Klik **Submit**

> Pengeluaran secara otomatis akan mengurangi saldo pada **Laporan Petty Cash** dan **Neraca Kas RT**.

---

## Laporan Keuangan

### Laporan Petty Cash (Bu Agus)

Laporan untuk uang cash. Menampilkan Pemasukan (Debit), Pengeluaran (Kredit), dan Saldo berjalan. Termasuk Saldo Awal Bulan sebagai carry-over dari bulan sebelumnya.

### Laporan Kas Rekening (Bu Harris)

Laporan khusus untuk uang yang masuk melalui transfer bank. Hanya menampilkan pemasukan karena pengeluaran biasanya dilakukan melalui kas tunai.

### Neraca Kas RT

Laporan bergaya neraca side-by-side:
- Sisi Kiri: Daftar Pemasukan (Iuran & Lainnya) + Saldo Awal.
- Sisi Kanan: Daftar Pengeluaran.
- Bawah: Total Pemasukan, Total Pengeluaran, dan Sisa Saldo (Net Balance).

### Laporan Pricing Tier

Analisis statistik untuk melihat berapa banyak warga yang membayar di tier 75rb, 110rb, atau di luar tier. Berguna untuk memonitor kepatuhan dan tren pembayaran warga.

---

## Ekspor Excel

Hampir di semua halaman tabel (Warga, Iuran, Pengeluaran, dan semua Laporan), tersedia tombol **Export Excel**. Gunakan ini untuk:
- Membackup data secara offline
- Membagikan laporan ke grup WhatsApp warga
- Mencetak laporan secara manual

---

## Istilah dalam Aplikasi

| Istilah         | Arti                                              |
| --------------- | ------------------------------------------------- |
| **Iuran**       | Pembayaran rutin warga ke RT                      |
| **Pemasukan**   | Semua uang masuk (Iuran + Lainnya)                |
| **Petty Cash**  | Kas tunai yang dipegang Bendahara (Bu Agus)       |
| **Kas Rekening**| Kas di bank (BCA) yang diterima via transfer      |
| **Tier**        | Kategori nominal pembayaran (75rb / 110rb)        |
| **Nominal**     | Jumlah uang dalam angka                           |
| **Periode**     | Rentang bulan yang dicakup oleh pembayaran        |
| **Debit**       | Uang Masuk                                        |
| **Kredit**      | Uang Keluar (Pengeluaran)                         |
| **Net Balance** | Sisa saldo bersih setelah dikurangi pengeluaran   |


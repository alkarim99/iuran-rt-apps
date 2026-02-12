# Dokumentasi Aplikasi Iuran RT

## Tentang Aplikasi

Aplikasi **Iuran RT** adalah sistem pencatatan keuangan digital untuk lingkungan RT. Aplikasi ini menggantikan pencatatan manual di buku kas dengan sistem berbasis web yang bisa diakses dari komputer maupun handphone.

**Fungsi utama:**

- 📋 **Mencatat data warga** — nama dan alamat rumah
- 💰 **Mencatat pembayaran iuran** — siapa yang bayar, kapan, berapa, dan metode pembayaran
- 📤 **Mencatat pengeluaran** — pengeluaran kas RT
- 📊 **Melihat laporan keuangan** — laporan pemasukan dan pengeluaran per bulan

---

## Siapa yang Menggunakan?

Aplikasi ini digunakan oleh **pengurus RT (Admin/Bendahara)**. Hanya pengguna yang sudah terdaftar dan login yang bisa mengakses semua fitur. Pendaftaran pengguna baru hanya bisa dilakukan oleh Admin yang sudah ada.

---

## Cara Masuk (Login)

1. Buka aplikasi di browser
2. Klik tombol **Sign In** di halaman utama
3. Masukkan **Email** dan **Password**
4. Klik **Submit**
5. Jika berhasil, Anda akan diarahkan ke halaman utama dan menu navigasi akan muncul

**Untuk keluar (Logout):** Klik tombol **Logout** di pojok kanan atas menu navigasi.

---

## Menu Navigasi

Setelah login, tersedia menu berikut:

| Menu                            | Fungsi                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| **Data User**                   | Mengelola pengguna aplikasi                                          |
| **Data Warga**                  | Mengelola data warga RT                                              |
| **Data Pengeluaran**            | Mencatat pengeluaran kas RT                                          |
| **Iuran → Data Iuran**          | Melihat semua catatan pembayaran                                     |
| **Iuran → Rincian Iuran**       | Melihat rincian iuran per periode (breakdown RT/PKK/Sosial/Kematian) |
| **Laporan → Laporan Bu Agus**   | Laporan pemasukan cash + pengeluaran                                 |
| **Laporan → Laporan Bu Harris** | Laporan pemasukan transfer                                           |

---

## Mengelola Data Warga

### Melihat Daftar Warga

- Buka menu **Data Warga**
- Daftar warga ditampilkan dalam tabel, diurutkan berdasarkan alamat
- Gunakan kolom **Cari** untuk mencari berdasarkan nama atau alamat

### Menambah Warga Baru

1. Klik tombol **+** di halaman Data Warga
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

> ⚠️ Data yang dihapus **tidak bisa dikembalikan**.

---

## Mencatat Pembayaran Iuran

### Menambah Pembayaran Baru

1. Buka **Iuran → Data Iuran** atau halaman **Detail Warga**, lalu klik tombol **+**
2. Isi formulir:

| Field                      | Keterangan                                                         |
| -------------------------- | ------------------------------------------------------------------ |
| **Warga**                  | Pilih warga dari dropdown. Bisa dicari dengan mengetik nama/alamat |
| **Periode Bayar Terakhir** | Otomatis tampil setelah memilih warga — sebagai referensi          |
| **Tanggal Bayar**          | Tanggal warga melakukan pembayaran                                 |
| **Periode Mulai**          | Awal bulan yang dibayar                                            |
| **Periode Akhir**          | Akhir bulan yang dibayar                                           |
| **Nominal**                | Total uang yang dibayarkan                                         |
| **Metode Pembayaran**      | Pilih **Cash** atau **Transfer**                                   |

3. Klik **Submit**

### Cara Kerja Perhitungan Otomatis

Setelah Anda memasukkan data, sistem secara otomatis menghitung:

- **Jumlah bulan** — dihitung dari Periode Mulai hingga Periode Akhir
- **Rincian pembayaran** — dibagi berdasarkan nominal:

| Jika Nominal                                          | Rincian per Bulan                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| **Kelipatan Rp 75.000** (75rb, 150rb, 225rb, dst.)    | RT: Rp 75.000 — untuk warga yang hanya bayar iuran RT                 |
| **Selain kelipatan 75rb** (110rb, 220rb, 330rb, dst.) | RT: Rp 94.500 + PKK: Rp 8.000 + Sosial: Rp 2.500 + Kematian: Rp 5.000 |

**Contoh:**

- Warga A bayar **Rp 330.000** untuk periode **Januari–Maret** (3 bulan)  
  → Bukan kelipatan 75K → Rincian: RT (Rp 283.500) + PKK (Rp 24.000) + Sosial (Rp 7.500) + Kematian (Rp 15.000)
- Warga B bayar **Rp 150.000** untuk periode **Januari–Februari** (2 bulan)  
  → Kelipatan 75K → Rincian: RT (Rp 150.000), tanpa PKK/Sosial/Kematian

### Mengubah Pembayaran

1. Klik ikon **✏️ (edit)** pada baris pembayaran
2. Ubah data yang diperlukan
3. Klik **Submit**

### Menghapus Pembayaran

- Klik ikon **🗑️ (hapus)** pada baris pembayaran
- Konfirmasi melalui dialog

---

## Melihat Data Iuran

### Rincian Iuran (`Iuran → Rincian Iuran`)

Halaman ini menampilkan **semua pembayaran iuran** dalam satu periode (bulan) beserta rincian breakdown:

| Kolom                        | Isi                           |
| ---------------------------- | ----------------------------- |
| Tanggal Input                | Kapan data dicatat di sistem  |
| Tanggal Bayar                | Kapan warga membayar          |
| Warga                        | Alamat dan nama warga         |
| Periode                      | Jumlah bulan yang dibayar     |
| Nominal                      | Total pembayaran              |
| RT / PKK / Sosial / Kematian | Rincian pembagian nominal     |
| Keterangan                   | Rentang periode (dari–sampai) |

**Filter yang tersedia:**

- **Cari** — berdasarkan nama atau alamat
- **Urutkan** — berdasarkan tanggal bayar, tanggal input, nama warga, atau alamat
- **Periode** — pilih bulan yang ingin dilihat

Dari halaman ini Anda juga bisa langsung **membuat pembayaran baru**, **edit**, atau **hapus** pembayaran melalui tombol **Menu** di setiap baris.

### Total Pendapatan (`dari halaman Rincian → tombol Total`)

Menampilkan total pemasukan dalam rentang tanggal tertentu:

- Pilih **Periode Mulai** dan **Periode Akhir**
- Klik **Search**
- Sistem menampilkan **total pendapatan** dan daftar pembayaran dalam periode tersebut

---

## Mencatat Pengeluaran

### Melihat Daftar Pengeluaran

- Buka menu **Data Pengeluaran**
- Filter berdasarkan periode (bulan) menggunakan dropdown

### Menambah Pengeluaran

1. Klik tombol **+**
2. Isi formulir:
   - **Tanggal Transaksi** — kapan pengeluaran terjadi
   - **Nominal** — jumlah pengeluaran
   - **Deskripsi** — keterangan pengeluaran (contoh: "Beli tinta printer", "Bayar listrik mushola")
3. Klik **Submit**

### Mengubah / Menghapus Pengeluaran

- Gunakan ikon **✏️** atau **🗑️** pada baris pengeluaran

---

## Laporan Keuangan

### Laporan Bu Agus — Pemasukan Cash + Pengeluaran

**Fungsi:** Laporan untuk bendahara penerima uang cash (Bu Agus), yang juga mengelola pengeluaran RT.

1. Buka **Laporan → Laporan Bu Agus**
2. Pilih **Periode** (bulan)
3. Klik **Search**
4. Sistem menampilkan **2 tabel berdampingan**:

| Kolom Kiri — Pemasukan Cash | Kolom Kanan — Pengeluaran |
| --------------------------- | ------------------------- |
| Daftar pembayaran via cash  | Daftar pengeluaran RT     |
| **Total Pemasukan**         | **Total Pengeluaran**     |

### Laporan Bu Harris — Pemasukan Transfer

**Fungsi:** Laporan untuk bendahara penerima transfer (Bu Harris).

1. Buka **Laporan → Laporan Bu Harris**
2. Pilih **Periode** (bulan)
3. Klik **Search**
4. Sistem menampilkan daftar pembayaran via transfer beserta **totalnya**

> Laporan Bu Harris **tidak memuat data pengeluaran** karena pengeluaran hanya dikelola oleh Bu Agus (kas tunai).

---

## Mengelola Pengguna (User)

> Hanya Admin yang bisa mengelola pengguna.

### Menambah Pengguna Baru

1. Buka **Data User**, klik **+**
2. Isi **Nama**, **Email**, **Password**, dan **Role**
3. Klik **Submit**

### Mengubah / Menghapus Pengguna

- Gunakan ikon **✏️** atau **🗑️** pada baris pengguna

---

## Istilah dalam Aplikasi

| Istilah         | Arti                                              |
| --------------- | ------------------------------------------------- |
| **Warga**       | Penduduk/penghuni rumah yang terdaftar di RT      |
| **Iuran**       | Pembayaran rutin warga ke RT                      |
| **Nominal**     | Jumlah uang yang dibayarkan                       |
| **Periode**     | Rentang bulan yang dicakup oleh pembayaran        |
| **RT**          | Komponen iuran untuk kas RT                       |
| **PKK**         | Komponen iuran untuk kegiatan PKK                 |
| **Sosial**      | Komponen iuran untuk dana sosial                  |
| **Kematian**    | Komponen iuran untuk dana kematian                |
| **Cash**        | Pembayaran tunai (diterima Bu Agus)               |
| **Transfer**    | Pembayaran via transfer bank (diterima Bu Harris) |
| **Pengeluaran** | Biaya yang dikeluarkan dari kas RT                |

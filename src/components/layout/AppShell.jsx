import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppShell.css';

const AppShell = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Route to Page Info Mapping
  const getPageInfo = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return { title: 'Dashboard', subtitle: 'Ringkasan Statistik RT' };
    if (pathname === '/warga') return { title: 'Data Warga', subtitle: 'Daftar penduduk & status iuran' };
    if (pathname === '/warga/create') return { title: 'Tambah Warga', subtitle: 'Pendaftaran warga baru' };
    if (pathname.startsWith('/warga/edit/')) return { title: 'Edit Data Warga', subtitle: 'Perbarui informasi penduduk' };
    if (pathname.startsWith('/warga/')) return { title: 'Detail Warga', subtitle: 'Informasi lengkap & riwayat bayar' };
    if (pathname === '/iuran') return { title: 'Data Iuran', subtitle: 'Log pembayaran iuran rutin' };
    if (pathname === '/iuran/rincian') return { title: 'Rincian Iuran', subtitle: 'Detail per bulan per warga' };
    if (pathname === '/iuran/total') return { title: 'Kalkulasi Total', subtitle: 'Total perolehan iuran' };
    if (pathname.startsWith('/iuran/edit/')) return { title: 'Edit Pembayaran', subtitle: 'Perbarui data transaksi iuran' };
    if (pathname === '/income/create') return { title: 'Catat Pemasukan', subtitle: 'Input transaksi pemasukan baru' };
    if (pathname.startsWith('/income/create/')) return { title: 'Catat Pemasukan', subtitle: 'Input transaksi pemasukan warga' };
    if (pathname === '/other-income') return { title: 'Pemasukan Lainnya', subtitle: 'Donasi, sumbangan, & dana mandiri' };
    if (pathname.startsWith('/other-income/')) return { title: 'Pemasukan Lainnya', subtitle: 'Detail atau input transaksi' };
    if (pathname === '/expense') return { title: 'Pengeluaran Kas', subtitle: 'Log biaya operasional & belanja RT' };
    if (pathname === '/opening-balance') return { title: 'Saldo Awal', subtitle: 'Inisialisasi kas awal periode' };
    if (pathname === '/report/cash') return { title: 'Laporan Petty Cash', subtitle: 'Buku kas tunai (Bu Agus)' };
    if (pathname === '/report/transfer') return { title: 'Laporan Kas Rekening', subtitle: 'Buku kas bank (Bu Harris)' };
    if (pathname === '/report/neraca') return { title: 'Neraca Kas RT', subtitle: 'Perbandingan aset & saldo akhir' };
    if (pathname === '/report/pricing-tier') return { title: 'Pricing Tier', subtitle: 'Distribusi kategori iuran warga' };
    if (pathname === '/user') return { title: 'Manajemen User', subtitle: 'Pengaturan hak akses pengurus' };
    if (pathname.startsWith('/user/')) return { title: 'Data User', subtitle: 'Kelola akun & hak akses' };
    return { title: 'Iuran RT App', subtitle: 'Sistem Informasi Keuangan RT' };
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={setSidebarOpen} />
      
      <div className="main-content">
        <Topbar 
          toggleSidebar={setSidebarOpen} 
          title={title}
          subtitle={subtitle}
        />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AppShell;

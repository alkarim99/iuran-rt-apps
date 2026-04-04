import { useState, useEffect } from 'react';
import axios from 'axios';

const USE_MOCK = true;

const useDashboard = (year, month) => {
  const [data, setData] = useState({
    summary: { total_income: 0, total_expense: 0, net_balance: 0 },
    tunggakan: { total_warga: 0, total_tunggakan: 0, potensi_nominal: 0, data: [] },
    monthlySummary: [],
    kasSummary: { total_saldo: 0, petty_cash: { saldo: 0 }, kas_rekening: { saldo: 0 }, komposisi: { petty_cash_pct: 0, rekening_pct: 0 } },
    paymentHeatmap: [],
    tierBreakdown: { tier_breakdown: {}, compliance_trend: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setData({
            summary: {
              total_income: 1420000,
              total_expense: 820000,
              net_balance: 600000
            },
            tunggakan: {
              status: "success",
              month: month,
              total_warga: 42,
              total_tunggakan: 7,
              potensi_nominal: 770000,
              data: [
                { warga_id: "1", name: "Ahmad Fauzi", address: "K2-7", bulan_nunggak: 1, potensi_nominal: 110000, last_payment_period: "2025-05" },
                { warga_id: "2", name: "Budi Santoso", address: "L1-12", bulan_nunggak: 2, potensi_nominal: 220000, last_payment_period: "2025-04" },
                { warga_id: "3", name: "Citra Lestari", address: "M5-3", bulan_nunggak: 1, potensi_nominal: 75000, last_payment_period: "2025-05" },
                { warga_id: "4", name: "Dedi Kurniawan", address: "P2-9", bulan_nunggak: 3, potensi_nominal: 330000, last_payment_period: "2025-03" },
                { warga_id: "5", name: "Eka Putri", address: "K4-1", bulan_nunggak: 1, potensi_nominal: 110000, last_payment_period: "2025-05" },
              ]
            },
            monthlySummary: [
              { month: "2025-01", month_label: "Jan", pemasukan_total: 1420000, pengeluaran: 820000, net: 600000 },
              { month: "2025-02", month_label: "Feb", pemasukan_total: 1550000, pengeluaran: 950000, net: 600000 },
              { month: "2025-03", month_label: "Mar", pemasukan_total: 1200000, pengeluaran: 1100000, net: 100000 },
              { month: "2025-04", month_label: "Apr", pemasukan_total: 1800000, pengeluaran: 700000, net: 1100000 },
              { month: "2025-05", month_label: "May", pemasukan_total: 1650000, pengeluaran: 1200000, net: 450000 },
              { month: "2025-06", month_label: "Jun", pemasukan_total: 1420000, pengeluaran: 820000, net: 600000 },
              { month: "2025-07", month_label: "Jul", pemasukan_total: 0, pengeluaran: 0, net: 0 },
              { month: "2025-08", month_label: "Aug", pemasukan_total: 0, pengeluaran: 0, net: 0 },
              { month: "2025-09", month_label: "Sep", pemasukan_total: 0, pengeluaran: 0, net: 0 },
              { month: "2025-10", month_label: "Oct", pemasukan_total: 0, pengeluaran: 0, net: 0 },
              { month: "2025-11", month_label: "Nov", pemasukan_total: 0, pengeluaran: 0, net: 0 },
              { month: "2025-12", month_label: "Dec", pemasukan_total: 0, pengeluaran: 0, net: 0 }
            ],
            kasSummary: {
              status: "success",
              period: month,
              petty_cash: { opening_balance: 500000, total_pemasukan_cash: 3200000, total_pengeluaran: 1360000, saldo: 2340000 },
              kas_rekening: { opening_balance: 300000, total_pemasukan_transfer: 1820000, saldo: 2120000 },
              total_saldo: 4460000,
              komposisi: { petty_cash_pct: 52.5, rekening_pct: 47.5 }
            },
            paymentHeatmap: [
              { month: "2025-01", month_label: "Jan", jumlah_bayar: 38, persentase: 90.5 },
              { month: "2025-02", month_label: "Feb", jumlah_bayar: 35, persentase: 83.3 },
              { month: "2025-03", month_label: "Mar", jumlah_bayar: 40, persentase: 95.2 },
              { month: "2025-04", month_label: "Apr", jumlah_bayar: 32, persentase: 76.2 },
              { month: "2025-05", month_label: "May", jumlah_bayar: 39, persentase: 92.8 },
              { month: "2025-06", month_label: "Jun", jumlah_bayar: 35, persentase: 83.3 },
              { month: "2025-07", month_label: "Jul", jumlah_bayar: 0, persentase: 0 },
              { month: "2025-08", month_label: "Aug", jumlah_bayar: 0, persentase: 0 },
              { month: "2025-09", month_label: "Sep", jumlah_bayar: 0, persentase: 0 },
              { month: "2025-10", month_label: "Oct", jumlah_bayar: 0, persentase: 0 },
              { month: "2025-11", month_label: "Nov", jumlah_bayar: 0, persentase: 0 },
              { month: "2025-12", month_label: "Dec", jumlah_bayar: 0, persentase: 0 }
            ],
            tierBreakdown: {
              tier_breakdown: {
                tier1: { label: "Rp 75.000", jumlah: 11, persentase: 26.2 },
                tier2: { label: "Rp 110.000", jumlah: 28, persentase: 66.7 },
                custom: { label: "Custom", jumlah: 3, persentase: 7.1 }
              },
              compliance_trend: [
                { month: "2025-01", month_label: "Jan", persentase: 78.6 },
                { month: "2025-02", month_label: "Feb", persentase: 81.0 },
                { month: "2025-03", month_label: "Mar", persentase: 85.5 },
                { month: "2025-04", month_label: "Apr", persentase: 72.1 },
                { month: "2025-05", month_label: "May", persentase: 88.0 },
                { month: "2025-06", month_label: "Jun", persentase: 83.3 },
                { month: "2025-07", month_label: "Jul", persentase: 0 },
                { month: "2025-08", month_label: "Aug", persentase: 0 },
                { month: "2025-09", month_label: "Sep", persentase: 0 },
                { month: "2025-10", month_label: "Oct", persentase: 0 },
                { month: "2025-11", month_label: "Nov", persentase: 0 },
                { month: "2025-12", month_label: "Dec", persentase: 0 }
              ]
            }
          });
        } else {
          // Real API calls would go here
          const [summary, tunggakan, monthly, kas, heatmap, tier] = await Promise.all([
            axios.get('/api/reports/dashboard-summary', { params: { start_date: `${year}-01-01`, end_date: `${year}-12-31` } }), // Simplified
            axios.get('/api/dashboard/tunggakan', { params: { month } }),
            axios.get('/api/dashboard/monthly-summary', { params: { year } }),
            axios.get('/api/dashboard/kas-summary', { params: { year, month } }),
            axios.get('/api/dashboard/payment-heatmap', { params: { year } }),
            axios.get('/api/dashboard/tier-breakdown', { params: { year, month } })
          ]);

          setData({
            summary: summary.data.data,
            tunggakan: tunggakan.data,
            monthlySummary: monthly.data.data,
            kasSummary: kas.data,
            paymentHeatmap: heatmap.data.data,
            tierBreakdown: tier.data
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  return { data, isLoading, error };
};

export default useDashboard;

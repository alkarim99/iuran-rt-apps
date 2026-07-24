import { useState, useEffect } from 'react';
import axios from 'axios';

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
        const [tunggakan, monthly, kas, heatmap, tier] = await Promise.all([
          axios.get('/api/dashboard/tunggakan', { params: { month } }),
          axios.get('/api/dashboard/monthly-summary', { params: { year } }),
          axios.get('/api/dashboard/kas-summary', { params: { month } }),
          axios.get('/api/dashboard/payment-heatmap', { params: { year } }),
          axios.get('/api/dashboard/tier-breakdown', { params: { month } })
        ]);

        const monthlyData = monthly.data.data || [];

        // Derive summary dari monthlySummary bulan berjalan (satu sumber kebenaran)
        const currentMonthData = monthlyData.find(m => m.month === month);
        const summary = currentMonthData
          ? {
              total_income: currentMonthData.pemasukan_total,
              total_expense: currentMonthData.pengeluaran,
              net_balance: currentMonthData.net
            }
          : { total_income: 0, total_expense: 0, net_balance: 0 };

        setData({
          summary,
          tunggakan: tunggakan.data,
          monthlySummary: monthlyData,
          kasSummary: kas.data,
          paymentHeatmap: heatmap.data.data || [],
          tierBreakdown: tier.data
        });
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

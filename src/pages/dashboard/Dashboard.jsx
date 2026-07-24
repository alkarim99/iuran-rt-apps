import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faWallet, 
  faBuildingColumns, 
  faTriangleExclamation,
  faCircleArrowRight,
  faUsers,
  faMoneyBillTrendUp
} from '@fortawesome/free-solid-svg-icons';
import useDashboard from './useDashboard';
import FormatCurrency from '../../helpers/FormatCurrency';
import PageHeader from '../../components/ui/PageHeader';
import SummaryStrip from '../../components/ui/SummaryStrip';
import TableCard from '../../components/ui/TableCard';
import Btn from '../../components/ui/Btn';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const KAS_COLORS = ['#3b82f6', '#8b5cf6'];

const Dashboard = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const { data, isLoading } = useDashboard(selectedYear, selectedMonth);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const { summary, tunggakan, monthlySummary, kasSummary, paymentHeatmap, tierBreakdown } = data;

  return (
    <div className="dashboard-page animate-fade-in">
      <PageHeader 
        title="Ringkasan Eksekutif" 
        breadcrumb={["Dashboard"]}
        actions={
          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthLabels.map((label, i) => {
                const val = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
                return <option key={val} value={val}>{label}</option>;
              })}
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <Btn variant="outline" size="sm" onClick={() => navigate('/report/neraca')}>Lihat Laporan Lengkap</Btn>
            <Btn variant="primary" size="sm" onClick={() => navigate('/income/create')}>Catat Iuran</Btn>
          </div>
        }
      />

      {/* Alert Tunggakan */}
      {tunggakan.total_tunggakan > 0 && (
        <div className="alert-tunggakan mb-4 d-flex align-items-center gap-3 p-3 text-red-700 bg-red-50 border-red-100 rounded-xl">
          <div className="alert-icon bg-red-100 flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="fs-4" />
          </div>
          <div className="flex-1">
            <h6 className="mb-1 font-bold">Perhatian: Tunggakan Warga</h6>
            <p className="mb-0 small">Terdapat <b>{tunggakan.total_tunggakan} warga</b> yang belum melunasi iuran bulan ini. Potensi dana tertunda: <b>{FormatCurrency(tunggakan.potensi_nominal)}</b>.</p>
          </div>
          <Btn variant="ghost" className="text-red-700 font-bold small" onClick={() => navigate('/iuran')}>
            Lihat Daftar <FontAwesomeIcon icon={faCircleArrowRight} className="ms-1" />
          </Btn>
        </div>
      )}

      {/* Stats Summary */}
      <SummaryStrip items={[
        { 
          label: "Pemasukan Bulan Ini", 
          value: FormatCurrency(summary.total_income), 
          icon: <FontAwesomeIcon icon={faArrowTrendUp} />, 
          iconBg: "#ecfdf5", iconColor: "#10b981", valueColor: "#10b981"
        },
        { 
          label: "Pengeluaran Bulan Ini", 
          value: FormatCurrency(summary.total_expense), 
          icon: <FontAwesomeIcon icon={faArrowTrendDown} />, 
          iconBg: "#fef2f2", iconColor: "#ef4444", valueColor: "#ef4444" 
        },
        { 
          label: "Total Saldo Kas", 
          value: FormatCurrency(kasSummary.total_saldo), 
          icon: <FontAwesomeIcon icon={faWallet} />, 
          iconBg: "#eff6ff", iconColor: "#3b82f6", valueColor: "#3b82f6"
        },
        { 
          label: "Partisipasi Warga", 
          value: `${paymentHeatmap.find(h => h.month === selectedMonth)?.persentase || 0}%`, 
          icon: <FontAwesomeIcon icon={faUsers} />, 
          iconBg: "#f5f3ff", iconColor: "#8b5cf6"
        }
      ]} />

      <div className="row g-4 mb-4">
        {/* Main Chart: Pemasukan vs Pengeluaran */}
        <div className="col-lg-8">
          <TableCard title="Performa Keuangan" subtitle={`Histori arus kas tahun ${selectedYear}`}>
            <div className="chart-container" style={{ height: '320px', width: '100%', marginTop: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month_label" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => FormatCurrency(value)}
                  />
                  <Bar dataKey="pemasukan_total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pemasukan" barSize={32} />
                  <Bar dataKey="pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pengeluaran" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-2">
               <div className="small d-flex align-items-center gap-2 text-muted"><div style={{width: 12, height: 12, borderRadius: 3, background: '#3b82f6'}} /> Pemasukan</div>
               <div className="small d-flex align-items-center gap-2 text-muted"><div style={{width: 12, height: 12, borderRadius: 3, background: '#ef4444'}} /> Pengeluaran</div>
            </div>
          </TableCard>
        </div>

        {/* Donut Chart: Komposisi Kas */}
        <div className="col-lg-4">
          <TableCard title="Komposisi Kas" subtitle="Distribusi penyimpanan dana">
            <div className="chart-container" style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Petty Cash', value: kasSummary.petty_cash.saldo },
                      { name: 'Kas Rekening', value: kasSummary.kas_rekening.saldo }
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip formatter={(value) => FormatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center-label">
                <div className="total-label">Total Cair</div>
                <div className="total-value">{FormatCurrency(kasSummary.total_saldo).split(',')[0]}</div>
              </div>
            </div>
            <div className="kas-legend mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2 small">
                  <div className="p-1 rounded bg-blue-50 text-blue-600"><FontAwesomeIcon icon={faWallet} size="xs" /></div>
                  Petty Cash
                </div>
                <div className="font-bold small">{kasSummary.komposisi.petty_cash_pct}%</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-0">
                <div className="d-flex align-items-center gap-2 small">
                  <div className="p-1 rounded bg-purple-50 text-purple-600"><FontAwesomeIcon icon={faBuildingColumns} size="xs" /></div>
                  Kas Rekening
                </div>
                <div className="font-bold small">{kasSummary.komposisi.rekening_pct}%</div>
              </div>
            </div>
          </TableCard>
        </div>
      </div>

      <div className="row g-4">
        {/* Heatmap/Grid Component (Visual) */}
        <div className="col-lg-6">
          <TableCard title="Peta Pembayaran Warga" subtitle="Distribusi partisipasi iuran bulanan">
            <div className="payment-grid mt-3">
              {paymentHeatmap.map((item, index) => (
                <div key={index} className="grid-cell" title={`${item.month_label}: ${item.persentase}%`}>
                  <div className="grid-label">{item.month_label}</div>
                  <div className="grid-box-container">
                    <div 
                      className="grid-box" 
                      style={{ 
                        background: item.persentase === 0 ? 'var(--gray-100)' : `rgba(59, 130, 246, ${item.persentase / 100})`,
                        border: item.persentase === 0 ? '1px dashed var(--gray-200)' : 'none'
                      }} 
                    />
                    <div className="grid-percent">{item.persentase > 0 ? `${Math.round(item.persentase)}%` : '-'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-top">
              <div className="d-flex justify-content-between align-items-center">
                 <div className="small text-muted">Bulan berjalan: <b>{paymentHeatmap.find(h => h.month === selectedMonth)?.jumlah_bayar} Warga Bayar</b></div>
                 <Btn variant="ghost" size="sm" className="text-blue-600 font-bold" onClick={() => navigate('/iuran/rincian')}>Rincian <FontAwesomeIcon icon={faCircleArrowRight} className="ms-1" /></Btn>
              </div>
            </div>
          </TableCard>
        </div>

        {/* Additional Widget: Tier Breakdown & Trend */}
        <div className="col-lg-6">
          <TableCard title="Breakdown Kategori Iuran" subtitle="Sebaran nominal iuran warga">
             <div className="row mt-3 align-items-center">
                <div className="col-md-5">
                   <div style={{ height: '140px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={[
                                  { name: 'Tier 1', value: tierBreakdown.tier_breakdown.tier1?.jumlah || 0 },
                                  { name: 'Tier 2', value: tierBreakdown.tier_breakdown.tier2?.jumlah || 0 },
                                  { name: 'Custom', value: tierBreakdown.tier_breakdown.custom?.jumlah || 0 }
                               ]}
                               cx="50%" cy="50%"
                               outerRadius={55}
                               dataKey="value"
                            >
                               {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="col-md-7">
                   <div className="tier-list">
                      {Object.entries(tierBreakdown.tier_breakdown).map(([key, info], idx) => (
                         <div key={key} className="mb-2">
                            <div className="d-flex justify-content-between small mb-1">
                               <span className="text-muted font-bold">{info.label}</span>
                               <span className="font-bold">{info.jumlah} Warga</span>
                            </div>
                            <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                               <div className="progress-bar" style={{ width: `${info.persentase}%`, backgroundColor: COLORS[idx] }}></div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
                       </TableCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

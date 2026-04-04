import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faUsers,
  faMoneyBillWave,
  faCreditCard,
  faHandHoldingDollar,
  faFileExcel,
  faMagnifyingGlass,
  faCalendarDays,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { exportToExcel } from "../../helpers/exportToExcel";
import { getPricingTierReport } from "../../services/IuranService";
import "../../styles/ReportPricingTier.css";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import SummaryStrip from "../../components/ui/SummaryStrip";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";

// ─── Helpers ────────────────────────────────────────────────────
const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleString("id-ID", { month: "long", year: "numeric" });
};

const tierBadgeClass = (category) => {
  if (category.startsWith("tier_75")) return "tier-75";
  if (category.startsWith("tier_110")) return "tier-110";
  return "tier-out";
};

const categoryLabel = (category) => {
  const labels = {
    tier_75_single: "1× Rp 75.000",
    tier_75_multiple: "≥2× Rp 75.000",
    tier_110_single: "1× Rp 110.000",
    tier_110_multiple: "≥2× Rp 110.000",
    out_of_tier: "Di Luar Tier",
  };
  return labels[category] || category;
};

const getPresets = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return [
    { label: "Bulan Ini", start: toYMD(new Date(y, m, 1)), end: toYMD(new Date(y, m + 1, 0)) },
    { label: "1 Bln Sblm", start: toYMD(new Date(y, m - 1, 1)), end: toYMD(new Date(y, m, 0)) },
    { label: "3 Bln Terakhir", start: toYMD(new Date(y, m - 2, 1)), end: toYMD(new Date(y, m + 1, 0)) },
    { label: "6 Bln Terakhir", start: toYMD(new Date(y, m - 5, 1)), end: toYMD(new Date(y, m + 1, 0)) },
    { label: "Tahun Ini", start: toYMD(new Date(y, 0, 1)), end: toYMD(new Date(y, m + 1, 0)) },
  ];
};

function ReportPricingTier() {
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Laporan Pricing Tier - Iuran RT";
  }, []);

  const now = new Date();
  const [startDate, setStartDate] = useState(
    toYMD(new Date(now.getFullYear(), now.getMonth(), 1)),
  );
  const [endDate, setEndDate] = useState(
    toYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  );

  const [report, setReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchReport = () => {
    setIsLoading(true);
    setHasSearched(true);
    getPricingTierReport({ start_date: startDate, end_date: endDate })
      .then((res) => setReport(res?.data?.report || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const applyPreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
    // Auto fetch when preset used
    setTimeout(() => fetchReport(), 50);
  };

  // ── Stats ──
  const stats = useMemo(() => {
    const grandTotalIncome = report.reduce((s, m) => s + (m.grand_total_income || 0), 0);
    const grandTotalWarga = report.reduce((s, m) => s + (m.grand_total_warga || 0), 0);
    let totalCash = 0;
    let totalTransfer = 0;
    report.forEach((m) => {
      (m.payment_methods || []).forEach((pm) => {
        if (pm.payment_method === "cash") totalCash += pm.total_income || 0;
        else totalTransfer += pm.total_income || 0;
      });
    });
    return { grandTotalIncome, grandTotalWarga, totalCash, totalTransfer };
  }, [report]);

  const cashPct = stats.grandTotalIncome > 0 ? ((stats.totalCash / stats.grandTotalIncome) * 100).toFixed(1) : 0;
  const transferPct = stats.grandTotalIncome > 0 ? ((stats.totalTransfer / stats.grandTotalIncome) * 100).toFixed(1) : 0;

  const openModal = (category, wargaList, monthStr, method) => setModalData({ category, wargaList, monthStr, method });
  const closeModal = () => setModalData(null);

  const handleExportExcel = () => {
    const dataToExport = [];
    report.forEach((month) => {
      (month.payment_methods || []).forEach((pm) => {
        (pm.breakdown || []).forEach((bk) => {
          dataToExport.push({
            Bulan: monthLabel(month.month),
            "Metode Pembayaran": pm.payment_method?.toUpperCase(),
            Kategori: bk.label,
            Jumlah: bk.count,
            "Total Nominal": bk.total_nominal,
          });
        });
      });
    });
    exportToExcel(dataToExport, `Laporan_Pricing_Tier_${startDate}_${endDate}`);
  };

  return (
    <div className="report-pricing-tier-page">
      <PageHeader 
        title="Laporan Pricing Tier"
        breadcrumb={["Laporan", "Pricing Tier Distribution"]}
        actions={
          <Btn variant="outline" icon={<FontAwesomeIcon icon={faFileExcel} />} onClick={handleExportExcel}>
            Export Excel
          </Btn>
        }
      />

      <FilterBar>
        <span className="filter-label">Dari</span>
        <input type="date" className="filter-select" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <span className="filter-label ms-2">Sampai</span>
        <input type="date" className="filter-select" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <div className="filter-sep" />
        <Btn variant="primary" size="sm" icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} onClick={fetchReport} loading={isLoading}>
          Tampilkan
        </Btn>
      </FilterBar>

      <div className="preset-buttons no-print">
        {getPresets().map((p) => (
          <button 
            key={p.label} 
            className={`preset-btn ${startDate === p.start && endDate === p.end ? 'active' : ''}`}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!isLoading && (
        <SummaryStrip items={[
          { 
            label: "Total Income", 
            value: FormatCurrency(stats.grandTotalIncome), 
            icon: <FontAwesomeIcon icon={faMoneyBillWave} />, 
            iconBg: "var(--green-50)", iconColor: "var(--green-600)", valueColor: "var(--green-600)"
          },
          { 
            label: "Total Warga", 
            value: stats.grandTotalWarga, 
            icon: <FontAwesomeIcon icon={faUsers} />, 
            iconBg: "var(--blue-50)", iconColor: "var(--blue-600)"
          },
          { 
            label: `Cash (${cashPct}%)`, 
            value: FormatCurrency(stats.totalCash), 
            icon: <FontAwesomeIcon icon={faHandHoldingDollar} />, 
            iconBg: "var(--gray-100)", iconColor: "var(--gray-600)"
          },
          { 
            label: `Transfer (${transferPct}%)`, 
            value: FormatCurrency(stats.totalTransfer), 
            icon: <FontAwesomeIcon icon={faCreditCard} />, 
            iconBg: "var(--gray-100)", iconColor: "var(--gray-600)"
          }
        ]} />
      )}

      {isLoading ? (
        <div className="py-5 text-center text-muted">
          <div className="spinner-border spinner-border-sm me-2" /> Memuat data...
        </div>
      ) : report.length === 0 ? (
        <div className="py-5 text-center text-muted">Tidak ada data ditemukan.</div>
      ) : (
        report.map((month) => (
          <TableCard 
            key={month.month}
            title={monthLabel(month.month)}
            subtitle={`${FormatCurrency(month.grand_total_income)} · ${month.grand_total_warga} warga berkontribusi`}
            className="mb-4"
          >
            {(month.payment_methods || []).map((pm) => (
              <div className="method-section" key={pm.payment_method}>
                <div className="method-header">
                  <span className={`method-badge ${pm.payment_method}`}>
                    {pm.payment_method === 'cash' ? <FontAwesomeIcon icon={faHandHoldingDollar} /> : <FontAwesomeIcon icon={faCreditCard} />}
                    {pm.payment_method}
                  </span>
                  <span className="method-stats">
                    {FormatCurrency(pm.total_income)} · {pm.total_warga} Warga
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover breakdown-table mt-0">
                    <thead>
                      <tr>
                        <th>Tier / Kategori</th>
                        <th>Label Detail</th>
                        <th className="text-center" style={{ width: '100px' }}>Warga</th>
                        <th className="text-end" style={{ width: '180px' }}>Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pm.breakdown || []).map((bk) => (
                        <tr key={bk.category} onClick={() => openModal(bk.category, bk.warga || [], month.month, pm.payment_method)}>
                          <td>
                            <span className={`tier-badge ${tierBadgeClass(bk.category)}`}>
                              {categoryLabel(bk.category)}
                            </span>
                          </td>
                          <td className="small text-muted">{bk.label}</td>
                          <td className="text-center font-bold">{bk.count}</td>
                          <td className="text-end font-bold amount">{FormatCurrency(bk.total_nominal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </TableCard>
        ))
      )}

      {/* Detail Modal */}
      {modalData && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content pt-modal-content">
              <div className="modal-header pt-modal-header">
                <h5 className="pt-modal-title">
                  <span className={`tier-badge ${tierBadgeClass(modalData.category)} me-2`}>
                    {categoryLabel(modalData.category)}
                  </span>
                  Detail — {monthLabel(modalData.monthStr)}
                </h5>
                <Btn variant="ghost" icon={<FontAwesomeIcon icon={faXmark} />} onClick={closeModal} />
              </div>
              <div className="modal-body p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <table className="table table-hover mb-0">
                  <thead className="sticky-top bg-white shadow-sm" style={{ top: -1 }}>
                    <tr>
                      <th className="px-4">Nama Warga</th>
                      <th>Alamat</th>
                      <th className="text-end">Nominal</th>
                      <th className="text-center">Per.</th>
                      <th className="px-4">Tgl Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.wargaList.map((w, i) => (
                      <tr key={i}>
                        <td className="px-4 font-bold">{w.name}</td>
                        <td className="small text-muted">{w.address}</td>
                        <td className="text-end font-bold text-income">{FormatCurrency(w.nominal)}</td>
                        <td className="text-center">{w.number_of_period}x</td>
                        <td className="px-4 small text-muted">{FormatDate(w.pay_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer border-0 p-3">
                <Btn variant="outline" onClick={closeModal}>Tutup</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPricingTier;

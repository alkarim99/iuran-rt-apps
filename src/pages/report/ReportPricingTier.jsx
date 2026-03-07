import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChartBar,
  faUsers,
  faMoneyBillWave,
  faCreditCard,
  faHandHoldingDollar,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { exportToExcel } from "../../helpers/exportToExcel";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPricingTierReport } from "../../services/IuranService";
import "../../styles/ReportPricingTier.css";

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

// Preset date ranges
const getPresets = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return [
    {
      label: "Bulan Ini",
      start: toYMD(new Date(y, m, 1)),
      end: toYMD(new Date(y, m + 1, 0)),
    },
    {
      label: "1 Bulan Sebelumnya",
      start: toYMD(new Date(y, m - 1, 1)),
      end: toYMD(new Date(y, m, 0)),
    },
    {
      label: "3 Bulan Terakhir",
      start: toYMD(new Date(y, m - 2, 1)),
      end: toYMD(new Date(y, m + 1, 0)),
    },
    {
      label: "6 Bulan Terakhir",
      start: toYMD(new Date(y, m - 5, 1)),
      end: toYMD(new Date(y, m + 1, 0)),
    },
    {
      label: "Tahun Ini",
      start: toYMD(new Date(y, 0, 1)),
      end: toYMD(new Date(y, m + 1, 0)),
    },
  ];
};

// ─── Component ──────────────────────────────────────────────────
function ReportPricingTier() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  // Date range — default to current month
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

  // Modal state
  const [modalData, setModalData] = useState(null);

  // ── Fetch report ──
  const fetchReport = () => {
    setIsLoading(true);
    setHasSearched(true);
    getPricingTierReport({ start_date: startDate, end_date: endDate })
      .then((res) => setReport(res?.data?.report || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    } else {
      fetchReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, navigate]);

  // ── Preset click ──
  const applyPreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
  };

  // ── Aggregated summary ──
  const grandTotalIncome = report.reduce(
    (s, m) => s + (m.grand_total_income || 0),
    0,
  );
  const grandTotalWarga = report.reduce(
    (s, m) => s + (m.grand_total_warga || 0),
    0,
  );

  let totalCash = 0;
  let totalTransfer = 0;
  report.forEach((m) => {
    (m.payment_methods || []).forEach((pm) => {
      if (pm.payment_method === "cash") totalCash += pm.total_income || 0;
      else totalTransfer += pm.total_income || 0;
    });
  });

  const cashPct =
    grandTotalIncome > 0
      ? ((totalCash / grandTotalIncome) * 100).toFixed(1)
      : 0;
  const transferPct =
    grandTotalIncome > 0
      ? ((totalTransfer / grandTotalIncome) * 100).toFixed(1)
      : 0;

  // ── Open detail modal ──
  const openModal = (category, wargaList, monthStr, method) => {
    setModalData({ category, wargaList, monthStr, method });
  };

  const closeModal = () => setModalData(null);

  const handleExportExcel = () => {
    const dataToExport = [];
    report.forEach((month) => {
      (month.payment_methods || []).forEach((pm) => {
        (pm.breakdown || []).forEach((bk) => {
          dataToExport.push({
            Bulan: monthLabel(month.month),
            "Metode Pembayaran": pm.payment_method,
            Kategori: bk.label,
            Jumlah: bk.count,
            "Total Nominal": bk.total_nominal,
          });
        });
      });
    });
    exportToExcel(dataToExport, `Laporan_Pricing_Tier_${startDate}_${endDate}`);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ minHeight: "100vh" }}
      >
        <Navbar />

        {/* ── Top bar ── */}
        <div className="mb-3 no-print">
          <Link className="btn btn-primary me-1" to="/iuran">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <button
            className="btn btn-success ms-1"
            onClick={handleExportExcel}
            title="Export Excel"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>
        </div>

        {/* ── Print header ── */}
        <div className="print-header">
          <h2>Laporan Pricing Tier</h2>
          <p>
            Periode: {FormatDate(startDate)} — {FormatDate(endDate)}
          </p>
        </div>

        {/* ── Filter form ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchReport();
          }}
          className="no-print"
        >
          <div className="row g-2 align-items-end mb-2">
            <div className="col-auto">
              <label htmlFor="start_date" className="form-label mb-1">
                Dari
              </label>
              <input
                type="date"
                className="form-control"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              <label htmlFor="end_date" className="form-label mb-1">
                Sampai
              </label>
              <input
                type="date"
                className="form-control"
                id="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary py-2" type="submit">
                {isLoading ? "Loading..." : "Tampilkan"}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="preset-buttons mb-3">
            {getPresets().map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </form>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* ── Content (only after search) ── */}
        {!isLoading && hasSearched && (
          <>
            {report.length === 0 ? (
              <div className="empty-state">
                <div className="icon">
                  <FontAwesomeIcon icon={faChartBar} />
                </div>
                <h5>Tidak ada data</h5>
                <p>
                  Tidak ditemukan data pembayaran pada periode yang dipilih.
                </p>
              </div>
            ) : (
              <>
                {/* ── Summary Cards ── */}
                <div className="summary-cards">
                  <div className="summary-card income">
                    <div className="label">
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="me-1"
                      />
                      Total Pemasukan
                    </div>
                    <div className="value">
                      {FormatCurrency(grandTotalIncome)}
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="label">
                      <FontAwesomeIcon icon={faUsers} className="me-1" />
                      Total Warga Bayar
                    </div>
                    <div className="value">{grandTotalWarga}</div>
                  </div>
                  <div className="summary-card cash-card">
                    <div className="label">
                      <FontAwesomeIcon
                        icon={faHandHoldingDollar}
                        className="me-1"
                      />
                      Cash ({cashPct}%)
                    </div>
                    <div className="value">{FormatCurrency(totalCash)}</div>
                  </div>
                  <div className="summary-card transfer-card">
                    <div className="label">
                      <FontAwesomeIcon icon={faCreditCard} className="me-1" />
                      Transfer ({transferPct}%)
                    </div>
                    <div className="value">{FormatCurrency(totalTransfer)}</div>
                  </div>
                </div>

                {/* ── Monthly breakdown ── */}
                {report.map((month) => (
                  <div className="month-card" key={month.month}>
                    <div className="month-card-header">
                      <h5>{monthLabel(month.month)}</h5>
                      <span>
                        {FormatCurrency(month.grand_total_income)} &middot;{" "}
                        {month.grand_total_warga} warga
                      </span>
                    </div>

                    {(month.payment_methods || []).map((pm) => (
                      <div className="method-section" key={pm.payment_method}>
                        <span className={`method-label ${pm.payment_method}`}>
                          {pm.payment_method} — {pm.total_warga} warga —{" "}
                          {FormatCurrency(pm.total_income)}
                        </span>

                        <table className="table table-sm breakdown-table">
                          <thead>
                            <tr>
                              <th>Kategori</th>
                              <th>Label</th>
                              <th className="text-center">Jumlah</th>
                              <th className="text-end">Total Nominal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(pm.breakdown || []).map((bk) => (
                              <tr
                                key={bk.category}
                                onClick={() =>
                                  openModal(
                                    bk.category,
                                    bk.warga || [],
                                    month.month,
                                    pm.payment_method,
                                  )
                                }
                                title="Klik untuk lihat detail warga"
                              >
                                <td>
                                  <span
                                    className={`tier-badge ${tierBadgeClass(
                                      bk.category,
                                    )}`}
                                  >
                                    {categoryLabel(bk.category)}
                                  </span>
                                </td>
                                <td>{bk.label}</td>
                                <td className="count-cell">{bk.count}</td>
                                <td className="nominal-cell">
                                  {FormatCurrency(bk.total_nominal)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ── Detail Modal ── */}
        {modalData && (
          <>
            <div
              className="modal-backdrop fade show"
              onClick={closeModal}
            ></div>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              onClick={closeModal}
            >
              <div
                className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Detail {modalData.category}{" "}
                      <span className="text-muted">
                        — {monthLabel(modalData.monthStr)} (
                        {modalData.method.toUpperCase()})
                      </span>
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {modalData.wargaList.length === 0 ? (
                      <p className="text-muted text-center py-3">
                        Tidak ada data warga.
                      </p>
                    ) : (
                      <table className="table table-striped warga-detail-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nama</th>
                            <th>Alamat</th>
                            <th className="text-end">Nominal</th>
                            <th className="text-center">Periode</th>
                            <th>Tanggal Bayar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.wargaList.map((w, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{w.name}</td>
                              <td>{w.address}</td>
                              <td className="text-end">
                                {FormatCurrency(w.nominal)}
                              </td>
                              <td className="text-center">
                                {w.number_of_period}x
                              </td>
                              <td>{FormatDate(w.pay_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </>
  );
}

export default ReportPricingTier;

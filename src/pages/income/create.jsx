import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faCalendarCheck, 
  faHandHoldingDollar, 
  faReceipt, 
  faCircleCheck,
  faCircleExclamation,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { useCreatePayments } from "../../hooks/useCreatePayments";
import { createOtherIncome } from "../../services/OtherIncomeService";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";
import SearchableSelect from "../../components/ui/SearchableSelect";

function CreateIncome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Tambah Data Pemasukan - Iuran RT";
  }, []);

  const [incomeType, setIncomeType] = useState("iuran"); // "iuran" | "other"

  // States specific to Other Income
  const [oiTransactionAt, setOiTransactionAt] = useState("");
  const [oiNominal, setOiNominal] = useState("");
  const [oiDescription, setOiDescription] = useState("");
  const [oiPaymentMethod, setOiPaymentMethod] = useState("cash");
  const [oiIsLoading, setOiIsLoading] = useState(false);

  // States specific to Iuran (from existing hook)
  const {
    wargaID,
    setWargaID,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    nominal,
    setNominal,
    rt,
    setRt,
    pkk,
    setPkk,
    sosial,
    setSosial,
    kematian,
    setKematian,
    isCustomNominal,
    paymentMethod,
    setPaymentMethod,
    payAt,
    setPayAt,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    latestPeriod,
    isLoading: iuranIsLoading,
    handleCreate: handleCreateIuran,
    handleGetLatestPeriod,
  } = useCreatePayments();

  const handleCreateOtherIncome = (e) => {
    e.preventDefault();
    setOiIsLoading(true);
    const payload = {
      transaction_at: oiTransactionAt,
      nominal: oiNominal,
      description: oiDescription,
      payment_method: oiPaymentMethod,
    };

    createOtherIncome(payload)
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          html: `Pemasukan Lainnya <b>${FormatCurrency(oiNominal)}</b> berhasil dicatat.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lihat Neraca",
          cancelButtonText: "Tutup",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/report/neraca");
          } else {
            navigate(location.state?.from || "/other-income");
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Terjadi kesalahan sistem.",
          icon: "error",
        });
      })
      .finally(() => {
        setOiIsLoading(false);
      });
  };

  const isLoading = iuranIsLoading || oiIsLoading;

  return (
    <div className="income-create-page">
      <PageHeader 
        title="Catat Pemasukan"
        breadcrumb={["Transaksi", "Tambah Pemasukan"]}
      />

      <div className="row">
        <div className="col-md-7 col-lg-6">
          <div className="rt-card p-4" style={{ background: 'var(--surface)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)' }}>
            
            <div className="mb-4">
              <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                Jenis Pemasukan
              </label>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className={`flex-1 py-3 px-2 border rounded-lg font-bold small d-flex align-items-center justify-content-center gap-2 transition-all ${incomeType === 'iuran' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover-bg-gray-100'}`}
                  onClick={() => setIncomeType('iuran')}
                  style={{ borderRadius: 'var(--radius-md)', border: '1px solid' }}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} /> Iuran Warga
                </button>
                <button 
                  type="button" 
                  className={`flex-1 py-3 px-2 border rounded-lg font-bold small d-flex align-items-center justify-content-center gap-2 transition-all ${incomeType === 'other' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover-bg-gray-100'}`}
                  onClick={() => setIncomeType('other')}
                  style={{ borderRadius: 'var(--radius-md)', border: '1px solid' }}
                >
                  <FontAwesomeIcon icon={faHandHoldingDollar} /> Pemasukan Lainnya
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--gray-100)', width: '100%', marginBottom: '24px' }} />

            {incomeType === "iuran" && (
              <form onSubmit={handleCreateIuran}>
                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Pilih Warga
                  </label>
                  <SearchableSelect
                    options={filteredOptions.map((w) => ({
                      value: w._id,
                      label: `${w.address} | ${w.name}`,
                    }))}
                    value={wargaID}
                    onChange={(selectedId) => {
                      setWargaID(selectedId);
                      if (selectedId) handleGetLatestPeriod(selectedId);
                    }}
                    placeholder="-- Pilih Warga --"
                    searchPlaceholder="Cari nama atau alamat..."
                  />
                  {wargaID && (
                    <div className="mt-2 py-2 px-3 bg-gray-50 border border-gray-100 rounded-md small text-gray-600">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 me-2" />
                      Catatan Terakhir: <b>{latestPeriod && latestPeriod !== "Tidak ada" ? FormatDate(latestPeriod).split(' ')[0] : 'Belum pernah bayar'}</b>
                    </div>
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                      Tanggal Bayar
                    </label>
                    <input
                      type="date"
                      className="form-control-rt w-100"
                      value={payAt}
                      onChange={(e) => setPayAt(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                      Periode Mulai
                    </label>
                    <input
                      type="date"
                      className="form-control-rt w-100"
                      value={periodStart}
                      onChange={(e) => setPeriodStart(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                      Periode Akhir
                    </label>
                    <input
                      type="date"
                      className="form-control-rt w-100"
                      value={periodEnd}
                      onChange={(e) => setPeriodEnd(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="my-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Nominal Iuran
                  </label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 font-bold text-muted">Rp</span>
                    <input
                      type="number"
                      className="form-control-rt w-100 ps-5 font-bold"
                      style={{ fontSize: '18px' }}
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      required
                    />
                  </div>
                  {nominal && (
                    <div className="mt-1 text-blue-600 font-bold small">{FormatCurrency(nominal)}</div>
                  )}
                </div>

                {isCustomNominal && (
                  <div className="mb-4 border border-warning-subtle bg-warning-subtle rounded-lg overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-warning text-dark font-bold small d-flex align-items-center gap-2">
                       <FontAwesomeIcon icon={faTriangleExclamation} /> Input Rincian Manual
                    </div>
                    <div className="p-3 row g-2">
                      <div className="col-6">
                        <label className="small font-bold text-muted">RT</label>
                        <input type="number" className="form-control-rt w-100" value={rt} onChange={(e) => setRt(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="small font-bold text-muted">PKK</label>
                        <input type="number" className="form-control-rt w-100" value={pkk} onChange={(e) => setPkk(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="small font-bold text-muted">Sosial</label>
                        <input type="number" className="form-control-rt w-100" value={sosial} onChange={(e) => setSosial(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="small font-bold text-muted">Kematian</label>
                        <input type="number" className="form-control-rt w-100" value={kematian} onChange={(e) => setKematian(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Metode Pembayaran
                  </label>
                  <select
                    className="form-control-rt w-100"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    style={{ appearance: 'auto' }}
                  >
                    <option value="">Pilih Metode</option>
                    <option value="cash">Cash / Petty Cash</option>
                    <option value="transfer">Transfer / Kas Rekening</option>
                  </select>
                </div>

                <div className="pt-3">
                  <Btn variant="primary" type="submit" loading={isLoading} className="w-100 py-3" icon={<FontAwesomeIcon icon={faReceipt} />}>
                    Simpan Iuran
                  </Btn>
                </div>
              </form>
            )}

            {incomeType === "other" && (
              <form onSubmit={handleCreateOtherIncome}>
                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Tanggal Penerimaan
                  </label>
                  <input
                    type="date"
                    className="form-control-rt w-100"
                    value={oiTransactionAt}
                    onChange={(e) => setOiTransactionAt(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Nominal Dana
                  </label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 font-bold text-muted">Rp</span>
                    <input
                      type="number"
                      className="form-control-rt w-100 ps-5 font-bold"
                      style={{ fontSize: '18px' }}
                      value={oiNominal}
                      onChange={(e) => setOiNominal(e.target.value)}
                      required
                    />
                  </div>
                  {oiNominal && (
                    <div className="mt-1 text-blue-600 font-bold small">{FormatCurrency(oiNominal)}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Deskripsi / Sumber Dana
                  </label>
                  <textarea
                    className="form-control-rt w-100"
                    rows="3"
                    placeholder="Contoh: Sumbangan Acara 17an, dll"
                    value={oiDescription}
                    onChange={(e) => setOiDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                    Metode Penyimpanan
                  </label>
                  <select
                    className="form-control-rt w-100"
                    value={oiPaymentMethod}
                    onChange={(e) => setOiPaymentMethod(e.target.value)}
                    required
                    style={{ appearance: 'auto' }}
                  >
                    <option value="cash">Cash / Petty Cash</option>
                    <option value="transfer">Transfer / Kas Rekening</option>
                  </select>
                </div>

                <div className="pt-3">
                  <Btn variant="primary" type="submit" loading={isLoading} className="w-100 py-3" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}>
                    Simpan Pemasukan
                  </Btn>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="col-md-5 offset-md-0 d-none d-md-block">
           <div className="alert bg-blue-50 border-blue-100 p-4 sticky-top" style={{ borderRadius: 'var(--radius-xl)', top: '24px' }}>
              <h5 className="font-bold text-blue-600 mb-3 d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faCircleExclamation} />
                Instruksi Pencatatan
              </h5>
              <div className="small text-blue-600">
                <p className="mb-3"><b>Pemasukan Iuran:</b> Digunakan untuk mencatat pembayaran rutin dari warga. Sistem akan otomatis membagi nominal ke rincian RT, PKK, Sosial, dan Kematian jika nominal sesuai paket (75rb / 110rb).</p>
                <p className="mb-0"><b>Pemasukan Lainnya:</b> Digunakan untuk mencatat dana di luar iuran warga, seperti sumbangan, bunga bank, atau donasi pihak ketiga.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default CreateIncome;

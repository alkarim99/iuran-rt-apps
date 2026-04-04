import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faInfoCircle, faReceipt } from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { useEditPayments } from "../../hooks/useEditPayments";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function EditIuran() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Ubah Data Pembayaran - Iuran RT";
  }, []);

  const {
    wargaID,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    handleGetLatestPeriod,
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
    latestPeriod,
    isLoading,
    handleEdit,
  } = useEditPayments();

  const formatDateForInput = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="iuran-edit-page">
      <PageHeader
        title="Ubah Data Pembayaran"
        breadcrumb={["Keuangan", "Iuran Warga", "Edit Transaksi"]}
        actions={
          <Btn variant="outline" icon={<FontAwesomeIcon icon={faArrowLeft} />} onClick={() => navigate("/iuran")}>
            Kembali
          </Btn>
        }
      />

      <div className="row">
        <div className="col-lg-7">
          <div className="rt-card p-4 mb-4">
            <form onSubmit={handleEdit}>
              <h3 className="section-title mb-4">Identitas & Waktu</h3>
              
              <div className="mb-4">
                <label htmlFor="searchTerm" className="form-label-rt-label">Warga</label>
                <div className="search-input-group mb-2">
                  <input
                    type="text"
                    id="searchTerm"
                    className="form-control-rt w-100"
                    placeholder="Ketik nama atau alamat rumah untuk mencari..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  id="warga_id"
                  className="filter-select w-100"
                  style={{ height: '42px' }}
                  value={wargaID || ""}
                  onChange={(e) => {
                    setWargaID(e.target.value);
                    handleGetLatestPeriod(e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>-- Pilih Hasil Pencarian --</option>
                  {filteredOptions.map((warga) => (
                    <option value={warga?._id} key={warga?._id}>
                      {warga?.address} | {warga?.name}
                    </option>
                  ))}
                </select>
                
                {latestPeriod != null && (
                  <div className="mt-3 p-2 bg-blue-50 border-blue-100 text-blue-600 small font-bold d-flex align-items-center gap-2" style={{ borderRadius: 'var(--radius-md)' }}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>Periode bayar terakhir: {FormatDate(latestPeriod)}</span>
                  </div>
                )}
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="pay_at" className="form-label-rt-label">Tanggal Bayar</label>
                  <input
                    type="date"
                    className="form-control-rt w-100"
                    id="pay_at"
                    value={formatDateForInput(payAt)}
                    onChange={(e) => setPayAt(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="payment_method" className="form-label-rt-label">Metode</label>
                  <select
                    id="payment_method"
                    className="filter-select w-100"
                    style={{ height: '42px' }}
                    value={paymentMethod || ""}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="" disabled>Pilih Metode</option>
                    <option value="cash">Tunai / Cash</option>
                    <option value="transfer">Transfer Bank</option>
                  </select>
                </div>
              </div>

              <h3 className="section-title mb-4">Periode & Nominal</h3>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="period_start" className="form-label-rt-label">Mulai Bulan</label>
                  <input
                    type="date"
                    className="form-control-rt w-100"
                    id="period_start"
                    value={formatDateForInput(periodStart)}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="period_end" className="form-label-rt-label">Sampai Bulan</label>
                  <input
                    type="date"
                    className="form-control-rt w-100"
                    id="period_end"
                    value={formatDateForInput(periodEnd)}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="nominal" className="form-label-rt-label">Total Terima (Rp)</label>
                <div className="position-relative">
                  <input
                    type="number"
                    step="any"
                    className="form-control-rt w-100 font-bold amount text-income"
                    style={{ fontSize: '18px' }}
                    id="nominal"
                    placeholder="0"
                    value={nominal || ""}
                    onChange={(e) => setNominal(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                  />
                </div>
                {nominal > 0 && (
                  <div className="mt-1 small text-muted font-bold text-end">
                    {FormatCurrency(nominal)}
                  </div>
                )}
              </div>

              {isCustomNominal && (
                <div className="alert bg-yellow-50 border-yellow-100 p-4 mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                  <div className="d-flex gap-3 mb-3">
                    <div className="text-yellow-600"><FontAwesomeIcon icon={faInfoCircle} size="lg" /></div>
                    <div>
                      <h4 className="font-bold text-yellow-700 mb-1" style={{ fontSize: '14px' }}>Rincian Manual Diperlukan</h4>
                      <p className="small text-yellow-700 mb-0">Nominal tidak standar. Masukkan rincian alokasi:</p>
                    </div>
                  </div>
                  
                  <div className="row g-2">
                    {[
                      { label: 'RT', val: rt, set: setRt },
                      { label: 'PKK', val: pkk, set: setPkk },
                      { label: 'Sosial', val: sosial, set: setSosial },
                      { label: 'Kematian', val: kematian, set: setKematian }
                    ].map(item => (
                      <div className="col-6 col-sm-3" key={item.label}>
                        <label className="small font-bold text-yellow-800 d-block mb-1 ms-1">{item.label}</label>
                        <input
                          type="number"
                          step="any"
                          className="form-control-rt w-100 py-2 px-2"
                          style={{ fontSize: '13px', background: 'white' }}
                          value={item.val || ""}
                          onChange={(e) => item.set(e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Btn
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mt-2"
                icon={<FontAwesomeIcon icon={faCheck} />}
                loading={isLoading}
              >
                Simpan Perubahan
              </Btn>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="rt-card p-4 mb-4 bg-blue-50 border-blue-100">
            <div className="d-flex gap-3 mb-4">
              <div className="text-blue-600" style={{ fontSize: '24px' }}><FontAwesomeIcon icon={faReceipt} /></div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1" style={{ fontSize: '16px' }}>Edit Transaksi</h3>
                <p className="small text-blue-700 mb-0">Hati-hati saat merubah nominal atau periode iuran yang sudah tercatat.</p>
              </div>
            </div>

            <p className="small text-blue-800 mb-3">Semua perubahan pada transaksi ini akan langsung mempengaruhi:</p>
            <ul className="small text-blue-800 ps-3 mb-0">
              <li className="mb-2">Laporan Kas Bulanan</li>
              <li className="mb-2">Neraca Kas RT Keseluruhan</li>
              <li>Riwayat Pembayaran Warga</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditIuran;

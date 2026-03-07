import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCreatePayments } from "../../hooks/useCreatePayments";
import { createOtherIncome } from "../../services/OtherIncomeService";

function CreateIncome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

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
          title: "Create Success!",
          html: `Pemasukan Lainnya <b>${FormatCurrency(oiNominal)}</b> berhasil dicatat.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lihat Neraca Kas",
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
          text: error?.response?.data?.message ?? "Something went wrong!",
          icon: "error",
        });
      })
      .finally(() => {
        setOiIsLoading(false);
      });
  };

  const isLoading = iuranIsLoading || oiIsLoading;

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container d-flex p-3 mx-auto flex-column"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />

      <div className="mb-3">
        <Link
          className="btn btn-primary me-1"
          to={location.state?.from || "/iuran"}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali
        </Link>
      </div>

      <h1>Catat Pemasukan</h1>

      <div className="row">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="mb-4">
            <label className="form-label fs-5 fw-bold">Jenis Pemasukan</label>
            <select
              className="form-select"
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
            >
              <option value="iuran">Pemasukan Iuran Warga</option>
              <option value="other">Pemasukan Lainnya (Sumbangan dll)</option>
            </select>
          </div>

          <hr className="mb-4" />

          {incomeType === "iuran" && (
            <form onSubmit={handleCreateIuran}>
              {/* Iuran specific fields */}
              <div className="mb-3">
                <label className="form-label">Warga</label>
                <div>
                  <select
                    className="form-select"
                    value={wargaID}
                    onChange={(e) => {
                      setWargaID(e.target.value);
                      handleGetLatestPeriod(e.target.value);
                    }}
                    required
                  >
                    <option value="">Pilih Warga</option>
                    {filteredOptions.map((warga) => (
                      <option value={warga?._id} key={warga?._id}>
                        {warga?.address} | {warga?.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Cari dengan nama / alamat"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mt-2"
                  />
                </div>
              </div>
              <p>
                Periode bayar terakhir :{" "}
                {latestPeriod != null
                  ? latestPeriod !== "Tidak ada"
                    ? FormatDate(latestPeriod)
                    : latestPeriod
                  : "Pilih warga dahulu"}
              </p>
              <div className="mb-3">
                <label className="form-label">Tanggal Bayar</label>
                <input
                  type="date"
                  className="form-control"
                  value={payAt}
                  onChange={(e) => setPayAt(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Periode Mulai</label>
                <input
                  type="date"
                  className="form-control"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Periode Akhir</label>
                <input
                  type="date"
                  className="form-control"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nominal</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  required
                />
                {nominal && (
                  <small className="text-muted">
                    {FormatCurrency(nominal)}
                  </small>
                )}
              </div>

              {isCustomNominal && (
                <div className="card mb-3 border-warning">
                  <div className="card-header bg-warning text-dark">
                    <strong>Input Manual Rincian Iuran</strong>
                    <br />
                    <small>
                      Nominal di luar pricing tier 75k/110k, harap masukkan
                      rincian secara manual.
                    </small>
                  </div>
                  <div className="card-body">
                    {/* Simplified for brevity, same inputs mapped via state */}
                    <div className="mb-2">
                      <label className="form-label">RT</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={rt}
                        onChange={(e) => setRt(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">PKK</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={pkk}
                        onChange={(e) => setPkk(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Sosial</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={sosial}
                        onChange={(e) => setSosial(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Kematian</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        value={kematian}
                        onChange={(e) => setKematian(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Metode Pembayaran</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="cash">Cash / Petty Cash</option>
                  <option value="transfer">Transfer / Kas Rekening</option>
                </select>
              </div>
              <button className="btn btn-primary py-2" type="submit">
                Simpan Iuran
              </button>
            </form>
          )}

          {incomeType === "other" && (
            <form onSubmit={handleCreateOtherIncome}>
              {/* Other Income specific fields */}
              <div className="mb-3">
                <label className="form-label">Tanggal Masuk</label>
                <input
                  type="date"
                  className="form-control"
                  value={oiTransactionAt}
                  onChange={(e) => setOiTransactionAt(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nominal</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={oiNominal}
                  onChange={(e) => setOiNominal(e.target.value)}
                  required
                />
                {oiNominal && (
                  <small className="text-muted">
                    {FormatCurrency(oiNominal)}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <input
                  type="text"
                  className="form-control"
                  value={oiDescription}
                  onChange={(e) => setOiDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Metode Pembayaran</label>
                <select
                  className="form-select"
                  value={oiPaymentMethod}
                  onChange={(e) => setOiPaymentMethod(e.target.value)}
                  required
                >
                  <option value="cash">Cash / Petty Cash</option>
                  <option value="transfer">Transfer / Kas Rekening</option>
                </select>
              </div>
              <button className="btn btn-primary py-2" type="submit">
                Simpan Pemasukan Lainnya
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CreateIncome;

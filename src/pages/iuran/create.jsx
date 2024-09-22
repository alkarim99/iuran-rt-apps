import React from "react"
import { Link, useParams } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import FormatDate from "../../helpers/FormatDate"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useCreatePayments } from "../../hooks/useCreatePayments"

function CreateIuran() {
  const params = useParams() // Add this to get route params
  const {
    wargaID,
    setWargaID,
    setPeriodStart,
    setPeriodEnd,
    setNominal,
    setPaymentMethod,
    setPayAt,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    latestPeriod,
    isLoading,
    handleCreate,
    handleGetLatestPeriod,
  } = useCreatePayments()

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
    )
  } else {
    return (
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />

        {params?.id != null ? (
          <div className="mb-3">
            <Link className="btn btn-primary me-1" to={`/warga/${params?.id}`}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>
        ) : (
          <div className="mb-3">
            <Link className="btn btn-primary me-1" to="/iuran">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>
        )}

        <h1>Add Data Iuran</h1>

        <div className="row">
          <div className="col-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label for="warga_id" className="form-label">
                  Warga
                </label>
                <div>
                  <select
                    id="warga_id"
                    className="form-select"
                    onChange={(e) => {
                      setWargaID(e.target.value)
                      handleGetLatestPeriod(e.target.value)
                    }}
                    required
                  >
                    <option selected>Pilih Warga</option>
                    {filteredOptions.map((warga) => (
                      <option
                        selected={wargaID == warga?._id ? "selected" : ""}
                        value={warga?._id}
                        key={warga?._id}
                      >
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
                <label for="pay_at" className="form-label">
                  Tanggal Bayar
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="pay_at"
                  onChange={(e) => setPayAt(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="period_start" className="form-label">
                  Periode Mulai
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="period_start"
                  onChange={(e) => setPeriodStart(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="period_end" className="form-label">
                  Periode Akhir
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="period_end"
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="nominal" className="form-label">
                  Nominal
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="nominal"
                  onChange={(e) => setNominal(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="payment_method" className="form-label">
                  Metode Pembayaran
                </label>
                <select
                  id="payment_method"
                  className="form-select"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option selected>Pilih Metode Pembayaran</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <button
                className="btn btn-primary py-2"
                type="submit"
                onClick={handleCreate}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default CreateIuran

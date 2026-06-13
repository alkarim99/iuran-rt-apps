import React from "react"
import { Link } from "react-router-dom"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import { useEditPayments } from "../../hooks/useEditPayments"

function EditIuran() {
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
    paymentMethod,
    setPaymentMethod,
    payAt,
    setPayAt,
    latestPeriod,
    isLoading,
    handleEdit,
  } = useEditPayments()

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
      <>
        <div
          className="container d-flex p-3 mx-auto flex-column"
          style={{ height: "100vh" }}
        >
          <Navbar />

          <div className="mb-3">
            <Link className="btn btn-primary" to="/iuran">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          <h1>Edit Data Iuran</h1>

          <div className="row">
            <div className="col-6">
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label for="warga_id" className="form-label">
                    Warga
                  </label>
                  <div>
                    <select
                      id="warga_id"
                      className="form-select"
                      value={wargaID || ""}
                      onChange={(e) => {
                        setWargaID(e.target.value)
                        handleGetLatestPeriod(e.target.value)
                      }}
                      required
                    >
                      <option value="" disabled>
                        Pilih Warga
                      </option>
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
                    ? `${FormatDate(latestPeriod)}`
                    : "Pilih warga dahulu"}
                </p>
                {payAt != "" ? (
                  <div className="mb-3">
                    <label for="pay_at" className="form-label">
                      Tanggal Bayar
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="pay_at"
                      value={new Date(payAt).toISOString().split("T")[0]}
                      onChange={(e) => setPayAt(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <></>
                )}
                {periodStart != "" ? (
                  <div className="mb-3">
                    <label for="period_start" className="form-label">
                      Period Mulai
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="period_start"
                      value={
                        new Date(periodStart).toISOString().split("T")[0]
                      }
                      onChange={(e) => setPeriodStart(e.target.value)}
                    />
                  </div>
                ) : (
                  <></>
                )}
                {periodEnd != "" ? (
                  <div className="mb-3">
                    <label for="period_end" className="form-label">
                      Period Akhir
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="period_end"
                      value={
                        new Date(periodEnd).toISOString().split("T")[0]
                      }
                      onChange={(e) => setPeriodEnd(e.target.value)}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="mb-3">
                  <label for="nominal" className="form-label">
                    Nominal
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nominal"
                    value={nominal || ""}
                    onChange={(e) => setNominal(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
                <div className="mb-3">
                  <label for="payment_method" className="form-label">
                    Metode Pembayaran
                  </label>
                  <select
                    id="payment_method"
                    class="form-select"
                    value={paymentMethod || ""}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="" disabled>
                      Pilih Metode Pembayaran
                    </option>
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <button className="btn btn-primary py-2" type="submit">
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </form>
            </div>
          </div>

          <Footer />
        </div>
      </>
    )
  }
}

export default EditIuran

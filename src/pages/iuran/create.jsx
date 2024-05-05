import React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function CreateIuran() {
  const navigate = useNavigate()
  const params = useParams()
  const state = useSelector((reducer) => reducer.auth)

  const [wargaID, setWargaID] = React.useState(params?.id ?? "")
  const [periodStart, setPeriodStart] = React.useState("")
  const [periodEnd, setPeriodEnd] = React.useState("")
  const [nominal, setNominal] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("")
  const [payAt, setPayAt] = React.useState("")
  const [dataWarga, setDataWarga] = React.useState([])
  const [latestPeriod, setLatestPeriod] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingLatestPeriod, setIsLoadingLatestPeriod] =
    React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredOptions, setFilteredOptions] = React.useState([])

  React.useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGetWarga()
    if (wargaID != "") {
      handleGetLatestPeriod(wargaID)
    }
  }, [state])

  const handleGetWarga = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/wargas/option`)
      .then((response) => {
        setDataWarga(response?.data?.data)
        setFilteredOptions(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleGetLatestPeriod = (id) => {
    setIsLoadingLatestPeriod(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments/latest/${id}`)
      .then((response) => {
        if (response?.data?.latest_period != undefined) {
          setLatestPeriod(response?.data?.latest_period)
        } else {
          setLatestPeriod("Tidak ada")
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoadingLatestPeriod(false)
      })
  }

  const handleCreate = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/payments`, {
        warga_id: wargaID,
        period_start: periodStart,
        period_end: periodEnd,
        nominal: nominal,
        payment_method: paymentMethod,
        pay_at: payAt,
      })
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/iuran")
        })
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  React.useEffect(() => {
    // Filter options based on search term
    setFilteredOptions(
      dataWarga.filter(
        (warga) =>
          warga?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          warga?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    )
  }, [searchTerm, dataWarga])

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

          {params?.id != null ? (
            <div className="mb-3">
              <Link
                className="btn btn-primary me-1"
                to={`/warga/${params?.id}`}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <Link className="btn btn-primary me-1" to="/iuran">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
              </div>
            </>
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
                      {params?.id != null ? (
                        <>
                          <option selected>Pilih Warga</option>
                          {filteredOptions.map((warga) => {
                            return (
                              <>
                                <option
                                  value={warga?._id}
                                  selected={
                                    params?.id == warga?._id ? "selected" : ""
                                  }
                                >
                                  {warga?.address} | {warga?.name}
                                </option>
                              </>
                            )
                          })}
                        </>
                      ) : (
                        <>
                          <option selected>Pilih Warga</option>
                          {filteredOptions.map((warga) => {
                            return (
                              <option value={warga?._id}>
                                {warga?.address} | {warga?.name}
                              </option>
                            )
                          })}
                        </>
                      )}
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
                    ? latestPeriod != "Tidak ada"
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
      </>
    )
  }
}

export default CreateIuran

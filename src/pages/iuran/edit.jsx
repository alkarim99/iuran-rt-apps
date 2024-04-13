import React from "react"
import { useLocation } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

function EditIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [wargaID, setWargaID] = React.useState("")
  const [periodStart, setPeriodStart] = React.useState("")
  const [periodEnd, setPeriodEnd] = React.useState("")
  const [nominal, setNominal] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("")
  const [payAt, setPayAt] = React.useState("")
  const [dataWarga, setDataWarga] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    handleGetWarga()
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments/${id}`)
      .then((response) => {
        setWargaID(response?.data?.data?.warga?._id)
        setPeriodStart(response?.data?.data?.period_start)
        setPeriodEnd(response?.data?.data?.period_end)
        setNominal(response?.data?.data?.nominal)
        setPaymentMethod(response?.data?.data?.payment_method)
        setPayAt(response?.data?.data?.pay_at)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [state])

  const handleGetWarga = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/wargas`)
      .then((response) => {
        setDataWarga(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleEdit = () => {
    setIsLoading(true)
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/payments`, {
        id: id,
        warga_id: wargaID,
        period_start: periodStart,
        period_end: periodEnd,
        nominal: nominal,
        payment_method: paymentMethod,
        pay_at: payAt,
      })
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/iuran")
        })
      })
      .catch((error) => {
        console.log(error)
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
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label for="warga_id" className="form-label">
                    Warga
                  </label>
                  <select
                    id="warga_id"
                    class="form-select"
                    onChange={(e) => setWargaID(e.target.value)}
                  >
                    <option selected>Pilih Warga</option>
                    {dataWarga.map((warga) => {
                      return (
                        <option
                          value={warga?._id}
                          selected={wargaID == warga?._id ? "selected" : ""}
                        >
                          {warga?.address} | {warga?.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
                {periodStart != "" ? (
                  <div className="mb-3">
                    <label for="period_start" className="form-label">
                      Period Mulai
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="period_start"
                      defaultValue={
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
                      defaultValue={
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
                    defaultValue={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="payment_method" className="form-label">
                    Metode Pembayaran
                  </label>
                  <select
                    id="payment_method"
                    class="form-select"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option selected>Pilih Metode Pembayaran</option>
                    <option
                      value="cash"
                      selected={paymentMethod == "cash" ? "selected" : ""}
                    >
                      Cash
                    </option>
                    <option
                      value="transfer"
                      selected={paymentMethod == "transfer" ? "selected" : ""}
                    >
                      Transfer
                    </option>
                  </select>
                </div>
                <button
                  className="btn btn-primary py-2"
                  type="submit"
                  onClick={handleEdit}
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

export default EditIuran

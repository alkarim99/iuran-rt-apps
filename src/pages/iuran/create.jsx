import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function CreateIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [wargaID, setWargaID] = React.useState("")
  const [periodStart, setPeriodStart] = React.useState("")
  const [periodEnd, setPeriodEnd] = React.useState("")
  const [nominal, setNominal] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("")
  const [dataWarga, setDataWarga] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGetWarga()
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

  const handleCreate = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/payments`, {
        warga_id: wargaID,
        period_start: periodStart,
        period_end: periodEnd,
        nominal: nominal,
        payment_method: paymentMethod,
        pay_at: new Date(),
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
          className="d-flex p-3 mx-auto flex-column"
          style={{ maxWidth: "42em", height: "100vh" }}
        >
          <Navbar />

          <h1>Add Data Iuran</h1>
          <div>
            <Link className="btn btn-primary" to="/iuran">
              Back
            </Link>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label for="warga_id" className="form-label">
                Warga
              </label>
              <select
                id="warga_id"
                className="form-select"
                onChange={(e) => setWargaID(e.target.value)}
              >
                <option selected>Pilih Warga</option>
                {dataWarga.map((warga) => {
                  return (
                    <option value={warga?._id}>
                      {warga?.address} | {warga?.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label for="period_start" className="form-label">
                Period Mulai
              </label>
              <input
                type="date"
                className="form-control"
                id="period_start"
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label for="period_end" className="form-label">
                Period Akhir
              </label>
              <input
                type="date"
                className="form-control"
                id="period_end"
                onChange={(e) => setPeriodEnd(e.target.value)}
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

          <Footer />
        </div>
      </>
    )
  }
}

export default CreateIuran

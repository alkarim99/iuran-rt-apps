import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import Swal from "sweetalert2"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

import { getExpenseByID, editExpense } from "../../services/ExpenseService"

function EditExpense() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [transactionAt, setTransactionAt] = useState(0)
  const [nominal, setNominal] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
  }, [state])

  const handleGet = async () => {
    getExpenseByID(id)
      .then((response) => {
        console.log(response?.data?.data)
        setTransactionAt(response?.data?.data?.transaction_at)
        setNominal(response?.data?.data?.nominal)
        setDescription(response?.data?.data?.description)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleEdit = async () => {
    setIsLoading(true)
    const payload = {
      id: id,
      transaction_at: transactionAt,
      nominal: nominal,
      description: description,
    }
    editExpense(payload)
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/expense")
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
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />

        <div className="mb-3">
          <Link className="btn btn-primary me-1" to="/expense">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>

        <h1>Update Data Pengeluaran</h1>

        <div className="row">
          <div className="col-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label for="transaction_at" className="form-label">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="transaction_at"
                  defaultValue={
                    new Date(transactionAt).toISOString().split("T")[0]
                  }
                  onChange={(e) => setTransactionAt(e.target.value)}
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
                  defaultValue={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="description" className="form-label">
                  Deskripsi
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={description}
                  required
                />
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
    )
  }
}

export default EditExpense

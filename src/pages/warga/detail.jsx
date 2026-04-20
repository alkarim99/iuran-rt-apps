import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPen,
  faTrash,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useLocation } from "react-router"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { getWargaByID } from "../../services/WargaService"
import {
  getPaymentByWargaId,
  getPaymentReport,
  deletePayment,
} from "../../services/IuranService"

function DetailWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[2]

  const [dataWarga, setDataWarga] = useState({})
  const [dataIuran, setDataIuran] = useState([])
  const [dataReport, setDataReport] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [sortBy, setSortBy] = useState("")

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
    handleGetPayment()
    handleGetReport()
  }, [state])

  const handleGet = () => {
    setIsLoading(true)
    getWargaByID(id)
      .then((response) => {
        setDataWarga(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleGetPayment = () => {
    getPaymentByWargaId({ id })
      .then((response) => {
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleGetReport = () => {
    getPaymentReport({ id })
      .then((response) => {
        setDataReport(response?.data?.reports)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setIsLoading(true)
        deletePayment(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              handleGet()
              handleGetPayment()
              handleGetReport()
            })
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ?? "Something wrong in our App!",
              icon: "error",
            })
          })
          .finally(() => {
            setIsLoading(false)
          })
      } else if (result.isDenied) {
        Swal.fire("Payment are not deleted", "", "info")
      }
    })
  }

  const handleSearch = () => {
    setIsLoading(true)
    getPaymentByWargaId({ id, sortBy })
      .then((response) => {
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
    getPaymentReport({ id, sortBy })
      .then((response) => {
        setDataReport(response?.data?.reports)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleReset = () => {
    setIsLoading(true)
    setSortBy("")
    handleGet()
    handleGetPayment()
    handleGetReport()
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
            <Link className="btn btn-primary" to="/warga">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          <div className="mb-3">
            <h3>
              Detail Warga
              <Link className="btn btn-warning mx-1" to={`/warga/edit/${id}`}>
                <FontAwesomeIcon icon={faPen} />
              </Link>
            </h3>
            <div className="row">
              <div className="col-2">Name</div>
              <div className="col">: {dataWarga?.name}</div>
            </div>
            <div className="row">
              <div className="col-2">Address</div>
              <div className="col">: {dataWarga?.address}</div>
            </div>
          </div>

          <h3>
            Data Iuran
            <Link
              className="btn btn-primary ms-1"
              to={`/iuran/create/warga/${dataWarga?._id}`}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </h3>

          <div className="my-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row d-flex align-items-end">
                <div className="col-3">
                  <label for="sort_by" className="form-label">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort_by"
                    className="form-select"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option selected>Urutkan</option>
                    <option value="pay_at">Pembayaran Terbaru</option>
                    <option value="created_at">Pencatatan Terbaru</option>
                  </select>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-primary py-2 me-2"
                    type="submit"
                    onClick={handleSearch}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                  <button
                    className="btn btn-primary py-2"
                    type="button"
                    onClick={handleReset}
                  >
                    {isLoading ? "Loading..." : "Reset"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tanggal Input</th>
                <th scope="col">Tanggal Bayar</th>
                <th scope="col">Periode</th>
                <th scope="col">Nominal</th>
                <th scope="col">Metode Pembayaran</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataIuran.map((iuran, index) => {
                return (
                  <>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{FormatDate(iuran?.created_at)}</td>
                      <td>{FormatDate(iuran?.pay_at)}</td>
                      <td>
                        {FormatDate(iuran?.period_start)} -{" "}
                        {FormatDate(iuran?.period_end)}
                      </td>
                      <td>{FormatCurrency(iuran?.nominal)}</td>
                      <td>{iuran?.payment_method?.toUpperCase()}</td>
                      <td>
                        <Link
                          className="btn btn-warning me-1"
                          to={`/iuran/edit/${iuran?._id}`}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Link>
                        <Link
                          className="btn btn-danger mx-1"
                          onClick={() => {
                            handleDelete(iuran?._id)
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Link>
                      </td>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>

          <h3>Data Rincian</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tanggal Input</th>
                <th scope="col">Tanggal Bayar</th>
                <th scope="col">Periode</th>
                <th scope="col">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {dataReport.map((report, index) => {
                return (
                  <>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{FormatDate(report?.created_at)}</td>
                      <td>{FormatDate(report?.pay_at)}</td>
                      <td>{FormatDate(report?.period)}</td>
                      <td>{FormatCurrency(report?.nominal)}</td>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>

          <Footer />
        </div>
      </>
    )
  }
}

export default DetailWarga

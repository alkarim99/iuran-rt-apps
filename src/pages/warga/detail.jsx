import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
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

function DetailWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[2]

  const [dataWarga, setDataWarga] = React.useState({})
  const [dataIuran, setDataIuran] = React.useState([])
  const [dataReport, setDataReport] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
    handleGetPayment()
    handleGetReport()
  }, [state])

  const handleGet = () => {
    setIsLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/wargas/${id}`)
      .then((response) => {
        setDataWarga(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleGetPayment = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments/warga/${id}`)
      .then((response) => {
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleGetReport = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments/report/${id}`)
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
        axios
          .delete(`${process.env.REACT_APP_BASE_URL}/payments/${id}`)
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
            <Link className="btn btn-primary ms-1" to="/iuran/create">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tanggal</th>
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
                <th scope="col">Tanggal</th>
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

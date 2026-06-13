import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import {
  deletePayment,
  searchPaymentsRincian,
} from "../../services/IuranService"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Pagination from "../../components/Pagination"

function RincianIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataIuran, setDataIuran] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("")

  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [refetch, setRefetch] = useState(0)

  const todayDate = new Date()
  const firstDate = new Date(
    todayDate.getFullYear(),
    todayDate.getUTCMonth(),
    15
  )
  const payAtDate = firstDate.toISOString().split("T")[0]
  const [payAt, setPayAt] = useState(payAtDate)

  // Single fetch path: pagination and filters always go through the same query,
  // so moving pages keeps the active keyword/sort/period. `refetch` is bumped to
  // force a reload when only the filters change (page stays the same).
  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    fetchPayments()
  }, [state, currentPage, refetch])

  const fetchPayments = () => {
    setIsLoading(true)
    // "Terbaru" (pay_at/created_at) = desc (-1); nama/alamat = asc (1); kosong = tak dikirim.
    const order =
      sortBy === "pay_at" || sortBy === "created_at" ? -1 : sortBy ? 1 : ""
    const payload = {
      keyword,
      sortBy,
      order,
      payAt,
      page: currentPage,
      limit: itemsPerPage,
    }
    searchPaymentsRincian(payload)
      .then((response) => {
        setDataIuran(response?.data?.data)
        setTotalPages(response?.data?.totalPages)
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
              fetchPayments()
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
    setCurrentPage(1)
    setRefetch((n) => n + 1)
  }

  const handleReset = () => {
    setKeyword("")
    setSortBy("")
    setCurrentPage(1)
    setRefetch((n) => n + 1)
  }

  const getStartingIndex = () => {
    return (currentPage - 1) * itemsPerPage + 1
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
          // style={{ height: "100vh" }}
        >
          <Navbar />

          <h1>
            Rincian Iuran
            <Link className="btn btn-primary ms-1" to="/iuran/create">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
            <Link className="btn btn-primary ms-1" to="/iuran/total">
              Total
            </Link>
          </h1>

          <div className="my-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row d-flex align-items-end">
                <div className="col-3">
                  <label for="keyword" className="form-label">
                    Cari
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="keyword"
                    placeholder="Nama atau Alamat"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <label for="sort_by" className="form-label">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort_by"
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="">Urutkan</option>
                    <option value="pay_at">Pembayaran Terbaru</option>
                    <option value="created_at">Pencatatan Terbaru</option>
                    <option value="warga.name">Nama Warga</option>
                    <option value="warga.address">Alamat Warga</option>
                  </select>
                </div>
                <div className="col-3">
                  <label for="payAtDate" className="form-label">
                    Periode
                  </label>
                  <input
                    type="date"
                    id="payAtDate"
                    className="form-control"
                    value={payAt}
                    onChange={(e) => setPayAt(e.target.value)}
                  />
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
        </div>

        <div className="container">
          <h5>
            {FormatDate(payAt).split(" ")[1] +
              " " +
              FormatDate(payAt).split(" ")[2]}
          </h5>
        </div>

        <div className="container d-flex justify-content-center align-items-center flex-column">
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tanggal Input</th>
                  <th scope="col">Tanggal Bayar</th>
                  <th scope="col">Warga</th>
                  <th scope="col">Periode</th>
                  <th scope="col">Nominal</th>
                  <th scope="col">RT</th>
                  <th scope="col">PKK</th>
                  <th scope="col">Sosial</th>
                  <th scope="col">Kematian</th>
                  <th scope="col">Keterangan</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataIuran.map((iuran, index) => {
                  const currentIndex = getStartingIndex() + index
                  return (
                    <>
                      <tr>
                        <th scope="row">{currentIndex}</th>
                        <td>{FormatDate(iuran?.created_at)}</td>
                        <td>{FormatDate(iuran?.pay_at)}</td>
                        <td>
                          {iuran?.warga?.address} | {iuran?.warga?.name}
                        </td>
                        <td>{iuran?.number_of_period}</td>
                        <td>{FormatCurrency(iuran?.nominal)}</td>
                        <td>{FormatCurrency(iuran?.details_payment?.rt)}</td>
                        <td>{FormatCurrency(iuran?.details_payment?.pkk)}</td>
                        <td>
                          {FormatCurrency(iuran?.details_payment?.sosial)}
                        </td>
                        <td>
                          {FormatCurrency(iuran?.details_payment?.kematian)}
                        </td>
                        <td>
                          {FormatDate(iuran?.period_start)} -{" "}
                          {FormatDate(iuran?.period_end)}
                        </td>
                        <td>
                          <div class="btn-group">
                            <button
                              class="btn btn-primary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Menu
                            </button>
                            <ul
                              class="dropdown-menu dropdown-menu-end"
                              style={{ minWidth: 200 }}
                            >
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  to={`/iuran/create/warga/${iuran?.warga?._id}`}
                                >
                                  <FontAwesomeIcon icon={faPlus} /> Buat
                                  Pembayaran
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  to={`/iuran/edit/${iuran?._id}`}
                                >
                                  <FontAwesomeIcon icon={faPen} /> Edit
                                  Pembayaran
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  onClick={() => {
                                    handleDelete(iuran?._id)
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Hapus
                                  Pembayaran
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div
          className="container d-flex p-3 mx-auto flex-column"
          // style={{ height: "100vh" }}
        >
          <Footer />
        </div>
      </>
    )
  }
}

export default RincianIuran

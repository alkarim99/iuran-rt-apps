import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function IndexIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataIuran, setDataIuran] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const [keyword, setKeyword] = React.useState("")
  const [sortBy, setSortBy] = React.useState("")

  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(itemsPerPage)

  React.useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
  }, [state, currentPage])

  const handleGet = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments?page=${currentPage}`)
      .then((response) => {
        setTotalPages(response?.data?.totalPages)
        setDataIuran(response?.data?.data)
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
    let url = `${process.env.REACT_APP_BASE_URL}/payments`
    if (keyword != "") {
      if (url.includes("?")) {
        url = url + `&keyword=${keyword}`
      } else {
        url = url + `?keyword=${keyword}`
      }
    }
    if (sortBy != "") {
      if (url.includes("?")) {
        url = url + `&sort_by=${sortBy}`
      } else {
        url = url + `?sort_by=${sortBy}`
      }
    }
    axios
      .get(url)
      .then((response) => {
        setDataIuran(response?.data?.data)
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
    setKeyword("")
    setSortBy("")
    handleGet()
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
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
            Data Iuran
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
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option selected>Urutkan</option>
                    <option value="pay_at">Pembayaran Terbaru</option>
                    <option value="created_at">Pencatatan Terbaru</option>
                    <option value="warga.name">Nama Warga</option>
                    <option value="warga.address">Alamat Warga</option>
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
                  <th scope="col">Metode Pembayaran</th>
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
                        <td>
                          {FormatDate(iuran?.period_start)} -{" "}
                          {FormatDate(iuran?.period_end)}
                        </td>
                        <td>{FormatCurrency(iuran?.nominal)}</td>
                        <td>{iuran?.payment_method?.toUpperCase()}</td>
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

            {/* Pagination */}
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
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

export default IndexIuran

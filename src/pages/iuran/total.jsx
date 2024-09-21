import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import getFirstAndLastDateOfMonth from "../../helpers/FirstAndLastDate"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function TotalIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const firstAndLastDate = getFirstAndLastDateOfMonth(currentYear, currentMonth)

  const [start, setStart] = React.useState(firstAndLastDate.firstDate)
  const [end, setEnd] = React.useState(firstAndLastDate.lastDate)
  const [sortBy, setSortBy] = React.useState("")
  const [total, setTotal] = React.useState(0)
  const [dataIuran, setDataIuran] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(itemsPerPage)
  const pagesPerGroup = 5

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const firstAndLastDate = getFirstAndLastDateOfMonth(
      currentYear,
      currentMonth
    )
    setStart(firstAndLastDate.firstDate)
    setEnd(firstAndLastDate.lastDate)
    handleSearch()
  }, [state])

  const handleSearch = () => {
    setIsLoading(true)
    let url = `${process.env.REACT_APP_BASE_URL}/payments/total?start=${start}&end=${end}&page=${currentPage}`
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
        setTotal(response?.data?.totalIncome)
        setTotalPages(response?.data?.totalPages)
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  }

  const handlePreviousPage = () => {
    const newGroupStartPage = Math.max(1, currentPage - pagesPerGroup)
    setCurrentPage(newGroupStartPage)
    handleSearch()
  }

  const handleNextPage = () => {
    const newGroupStartPage = Math.min(
      currentPage + pagesPerGroup,
      totalPages - pagesPerGroup + 1
    )
    setCurrentPage(newGroupStartPage)
    handleSearch()
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
    handleSearch()
  }

  const getStartingIndex = () => {
    return (currentPage - 1) * itemsPerPage + 1
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const totalPagesDisplayed = Math.min(
      totalPages,
      currentPage + pagesPerGroup - 1
    )

    for (let i = currentPage; i <= totalPagesDisplayed; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <div className="mb-3">
          <Link className="btn btn-primary me-1" to="/iuran">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row d-flex align-items-end">
            <div className="col-3">
              <label for="start" className="form-label">
                Periode Mulai
              </label>
              <input
                type="date"
                className="form-control"
                id="start"
                onChange={(e) => {
                  setStart(e.target.value)
                }}
                required
              />
            </div>
            <div className="col-3">
              <label for="end" className="form-label">
                Periode Akhir
              </label>
              <input
                type="date"
                className="form-control"
                id="end"
                onChange={(e) => {
                  setEnd(e.target.value)
                }}
                required
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
            </div>
          </div>
        </form>
        {total != 0 ? (
          <>
            <p className="my-3">
              Periode {FormatDate(start)} s.d. {FormatDate(end)} <br /> Total
              Pendapatan = {FormatCurrency(total)}
            </p>
          </>
        ) : (
          <></>
        )}

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
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>

            {/* Compact pagination */}
            <nav aria-label="Compact Page Navigation" className="mt-3">
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
                {getPageNumbers().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
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

        <Footer />
      </div>
    </>
  )
}

export default TotalIuran

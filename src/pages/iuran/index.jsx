import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"

import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import { usePayments } from "../../hooks/usePayments"

function IndexIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("")

  const { dataIuran, totalPages, isLoading, handleDelete } = usePayments(
    currentPage,
    itemsPerPage,
    keyword,
    sortBy
  )

  if (!state.auth) {
    navigate("/sign-in")
    return null
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setKeyword("")
    setSortBy("")
    setCurrentPage(1)
  }

  // Helper for pagination range centered on current page
  const getPaginationRange = (current, total, siblingCount = 2) => {
    const totalPageNumbers = siblingCount * 2 + 1 // 5 pages total
    if (total <= totalPageNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const left = Math.max(current - siblingCount, 1)
    const right = Math.min(left + totalPageNumbers - 1, total)
    const rangeStart = Math.max(Math.min(left, total - totalPageNumbers + 1), 1)
    return Array.from(
      { length: Math.min(totalPageNumbers, total) },
      (_, i) => rangeStart + i
    )
  }

  const paginationRange = getPaginationRange(currentPage, totalPages)

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <h1>
          Data Iuran
          <Link className="btn btn-primary ms-1" to="/iuran/create">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </h1>

        {/* Search & Sort Form */}
        <div className="my-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row d-flex align-items-end">
              <div className="col-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama atau Alamat"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="col-3">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Urutkan</option>
                  <option value="pay_at">Pembayaran Terbaru</option>
                  <option value="created_at">Pencatatan Terbaru</option>
                </select>
              </div>
              <div className="col-3">
                <button className="btn btn-primary" onClick={handleSearch}>
                  {isLoading ? "Loading..." : "Search"}
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="container">
        {isLoading ? (
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tanggal Input</th>
                  <th>Tanggal Bayar</th>
                  <th>Warga</th>
                  <th>Periode</th>
                  <th>Nominal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataIuran.map((iuran, index) => (
                  <tr key={iuran._id}>
                    <th scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
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
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-sm dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Menu
                        </button>
                        <ul
                          className="dropdown-menu dropdown-menu-end"
                          style={{ minWidth: 200 }}
                        >
                          <li>
                            <Link
                              className="text-decoration-none text-black p-2"
                              to={`/iuran/create/warga/${iuran?.warga?._id}`}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Buat Pembayaran
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="text-decoration-none text-black p-2"
                              to={`/iuran/edit/${iuran?._id}`}
                            >
                              <FontAwesomeIcon icon={faPen} /> Edit Pembayaran
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="text-decoration-none text-black p-2"
                              onClick={() => {
                                handleDelete(iuran?._id)
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Hapus Pembayaran
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination">
                {/* Previous group arrow */}
                <li
                  className={`page-item ${
                    currentPage <= 3 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      currentPage > 3 &&
                      setCurrentPage(paginationRange[0] - 1)
                    }
                    aria-label="Previous group"
                  >
                    Previous
                  </button>
                </li>

                {/* Page numbers */}
                {paginationRange.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* Next group arrow */}
                <li
                  className={`page-item ${
                    paginationRange[paginationRange.length - 1] >= totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      paginationRange[paginationRange.length - 1] < totalPages &&
                      setCurrentPage(paginationRange[paginationRange.length - 1] + 1)
                    }
                    aria-label="Next group"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default IndexIuran
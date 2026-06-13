import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Pagination from "../../components/Pagination"

import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"

import { getAllExpense, deleteExpense } from "../../services/ExpenseService"

function IndexExpense() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [dataExpense, setDataExpense] = useState([])

  useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
      return
    }
    handleGet()
  }, [keyword, sortBy, currentPage, itemsPerPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGet = () => {
    const payload = { keyword, sortBy, page: currentPage, limit: itemsPerPage }
    getAllExpense(payload)
      .then((response) => {
        setDataExpense(response?.data?.data || [])
        setTotalPages(response?.data?.totalPages || 1)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleReset = () => {
    setIsLoading(true)
    setKeyword("")
    setSortBy("transaction_at")
    setCurrentPage(1)
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        deleteExpense(id)
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
            console.error(error)
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
        Swal.fire("Data was not deleted", "", "info")
      }
    })
  }

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <h1>
          Data Pengeluaran
          <Link className="btn btn-primary ms-1" to="/expense/create">
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
                  placeholder="Deskripsi"
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
                  <option value="transaction_at">Transaksi Terbaru</option>
                  <option value="created_at">Pencatatan Terbaru</option>
                </select>
              </div>
              <div className="col-3">
                <button className="btn btn-primary" onClick={handleGet}>
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
                  <th>Tanggal Transaksi</th>
                  <th>Deskripsi</th>
                  <th>Nominal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataExpense.map((expense, index) => (
                  <tr key={expense._id}>
                    <th scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td>{FormatDate(expense?.created_at)}</td>
                    <td>{FormatDate(expense?.transaction_at)}</td>
                    <td>{expense?.description}</td>
                    <td>{FormatCurrency(expense?.nominal)}</td>
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
                              to={`/expense/edit/${expense?._id}`}
                            >
                              <FontAwesomeIcon icon={faPen} /> Edit Pengeluaran
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="text-decoration-none text-black p-2"
                              onClick={() => {
                                handleDelete(expense?._id)
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Hapus Pengeluaran
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default IndexExpense

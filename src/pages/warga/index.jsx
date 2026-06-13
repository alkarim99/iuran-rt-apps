import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlus,
  faPen,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Pagination from "../../components/Pagination"
import { searchWarga, deleteWarga } from "../../services/WargaService"
import { usePersistedState } from "../../hooks/usePersistedState"

function IndexWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataWarga, setDataWarga] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [keyword, setKeyword] = usePersistedState("wargaIndex_keyword", "")
  const [sortBy, setSortBy] = usePersistedState("wargaIndex_sortBy", "")
  const [order, setOrder] = useState(1)

  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = usePersistedState("wargaIndex_page", 1)
  const [totalPages, setTotalPages] = useState(1)
  const [refetch, setRefetch] = useState(0)

  // Single fetch path so pagination keeps the active filter; persisted page/
  // keyword/sortBy (sessionStorage) also restore the view when returning from a
  // detail page. `refetch` forces a reload when only the filter changes.
  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    fetchWarga()
  }, [state, currentPage, refetch])

  const fetchWarga = () => {
    setIsLoading(true)
    const payload = {
      keyword,
      sortBy,
      order: sortBy ? order : "",
      page: currentPage,
      limit: itemsPerPage,
    }
    searchWarga(payload)
      .then((response) => {
        setDataWarga(response?.data?.data)
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
        deleteWarga(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              fetchWarga()
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
        Swal.fire("Warga are not deleted", "", "info")
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
    setOrder(1)
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
          style={{ height: "100vh" }}
        >
          <Navbar />

          <h1>
            Data Warga
            <Link className="btn btn-primary ms-1" to="/warga/create">
              <FontAwesomeIcon icon={faPlus} />
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
                    <option value="name">Nama Warga</option>
                    <option value="address">Alamat Warga</option>
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

          <div className="row">
            <div className="col-8">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataWarga.map((warga, index) => {
                    const currentIndex = getStartingIndex() + index
                    return (
                      <>
                        <tr>
                          <th scope="row">{currentIndex}</th>
                          <td>{warga?.name}</td>
                          <td>{warga?.address}</td>
                          <td>
                            <Link
                              className="btn btn-success me-1"
                              to={`/warga/${warga?._id}`}
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </Link>
                            <Link
                              className="btn btn-warning mx-1"
                              to={`/warga/edit/${warga?._id}`}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </Link>
                            <Link
                              className="btn btn-danger mx-1"
                              onClick={() => {
                                handleDelete(warga?._id)
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          <Footer />
        </div>
      </>
    )
  }
}

export default IndexWarga

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TableFooter from "../../components/TableFooter";
import { useTableState } from "../../hooks/useTableState";
import { searchWarga, deleteWarga } from "../../services/WargaService";

function IndexWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [dataWarga, setDataWarga] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    page,
    setPage,
    limit,
    setLimit,
    keyword,
    setKeyword,
    sortBy,
    setSortBy,
    order,
    setOrder,
    handleSort,
    resetTable,
  } = useTableState("warga", 20);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = "Data Warga - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    } else {
      fetchWargaData();
    }
  }, [state, page, limit, sortBy, order]);

  const fetchWargaData = () => {
    setIsLoading(true);
    const payload = { keyword, sortBy, order, page, limit };
    searchWarga(payload)
      .then((response) => {
        setTotalPages(response?.data?.totalPages || 1);
        setTotalCount(response?.data?.totalCount || 0);
        setDataWarga(response?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
        setIsLoading(true);
        deleteWarga(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              fetchWargaData();
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ?? "Something wrong in our App!",
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (result.isDenied) {
        Swal.fire("Warga are not deleted", "", "info");
      }
    });
  };

  const handleSearchSubmit = () => {
    if (page === 1) {
      fetchWargaData();
    } else {
      setPage(1);
    }
  };

  const handleReset = () => {
    resetTable("address", 1);
    setTimeout(() => {
      fetchWargaData(); // Ensure it pulls generic data after clearing if batch states hadn't fully synchronously caught
    }, 0);
  };

  const getStartingIndex = () => {
    return (page - 1) * limit + 1;
  };

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
    );
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
            >
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
                  <button
                    className="btn btn-primary py-2 me-2"
                    type="submit"
                    onClick={handleSearchSubmit}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                  <button
                    className="btn btn-primary py-2"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th
                      scope="col"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("name")}
                    >
                      Name {sortBy === "name" && (order === 1 ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("address")}
                    >
                      Address{" "}
                      {sortBy === "address" && (order === 1 ? "▲" : "▼")}
                    </th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataWarga.map((warga, index) => {
                    const currentIndex = getStartingIndex() + index;
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
                                handleDelete(warga?._id);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Link>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                  {dataWarga.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <TableFooter
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                itemsPerPage={limit}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <Footer />
        </div>
      </>
    );
  }
}

export default IndexWarga;

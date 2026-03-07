import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";

import {
  getAllOtherIncomes,
  deleteOtherIncome,
} from "../../services/OtherIncomeService";

function IndexOtherIncome() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [dataOtherIncome, setDataOtherIncome] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    handleGet();
  }, [keyword, sortBy, order, currentPage, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGet = () => {
    getAllOtherIncomes(currentPage, itemsPerPage, keyword, sortBy, order)
      .then((response) => {
        setDataOtherIncome(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    setIsLoading(true);
    setKeyword("");
    setSortBy("transaction_at");
    setOrder("");
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteOtherIncome(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              handleGet();
            });
          })
          .catch((error) => {
            console.error(error);
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
        Swal.fire("Data was not deleted", "", "info");
      }
    });
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Helper to get pagination page numbers centered on currentPage
  const getPaginationRange = (current, total, siblingCount = 2) => {
    const totalPageNumbers = siblingCount * 2 + 1; // 5 pages total
    if (total <= totalPageNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const left = Math.max(current - siblingCount, 1);
    const right = Math.min(left + totalPageNumbers - 1, total);
    const rangeStart = Math.max(
      Math.min(left, total - totalPageNumbers + 1),
      1,
    );
    return Array.from(
      { length: Math.min(totalPageNumbers, total) },
      (_, i) => rangeStart + i,
    );
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <h1>
          Data Pemasukan Lainnya
          <Link className="btn btn-primary ms-1" to="/income/create">
            <FontAwesomeIcon icon={faPlus} /> Catat Pemasukan
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
                  <th>Metode</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataOtherIncome.map((income, index) => (
                  <tr key={income._id}>
                    <th scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td>{FormatDate(income?.created_at)}</td>
                    <td>{FormatDate(income?.transaction_at)}</td>
                    <td>{income?.description}</td>
                    <td>{FormatCurrency(income?.nominal)}</td>
                    <td>{income?.payment_method || "Cash"}</td>
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
                              to={`/other-income/edit/${income?._id}`}
                            >
                              <FontAwesomeIcon icon={faPen} /> Edit Pemasukan
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="text-decoration-none text-black p-2"
                              onClick={() => {
                                handleDelete(income?._id);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Hapus Pemasukan
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
                <li
                  className={`page-item ${currentPage <= 3 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      currentPage > 3 && setCurrentPage(paginationRange[0] - 1)
                    }
                    aria-label="Previous group"
                  >
                    Previous
                  </button>
                </li>

                {paginationRange.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
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
                    paginationRange[paginationRange.length - 1] >= totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      paginationRange[paginationRange.length - 1] <
                        totalPages &&
                      setCurrentPage(
                        paginationRange[paginationRange.length - 1] + 1,
                      )
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
  );
}

export default IndexOtherIncome;

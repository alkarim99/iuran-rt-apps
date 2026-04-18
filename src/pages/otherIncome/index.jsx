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

import TableFooter from "../../components/TableFooter";
import { useTableState } from "../../hooks/useTableState";

function IndexOtherIncome() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Data Pemasukan Lainnya - Iuran RT";
  }, []);

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
  } = useTableState("otherIncome", 20, "transaction_at", -1);

  const [payAt, setPayAt] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [dataOtherIncome, setDataOtherIncome] = useState([]);
  const [totalNominal, setTotalNominal] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    handleGet();
  }, [keyword, sortBy, order, page, limit, payAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGet = () => {
    const payload = {
      keyword,
      sort_by: sortBy,
      order,
      page,
      limit,
      payAt,
    };
    getAllOtherIncomes(payload)
      .then((response) => {
        setDataOtherIncome(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);
        setTotalNominal(response?.data?.totalNominal || 0);
        setTotalCount(response?.data?.totalCount || 0);
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
    setPayAt("");
    resetTable("transaction_at", -1);
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

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <h1>
          Data Pemasukan Lainnya
          <Link
            className="btn btn-primary ms-1"
            to="/income/create"
            state={{ from: "/other-income" }}
          >
            <FontAwesomeIcon icon={faPlus} /> Catat Pemasukan
          </Link>
        </h1>

        {/* Search & Sort Form */}
        <div className="my-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="row d-flex align-items-end">
              <div className="col-3">
                <input
                  type="month"
                  className="form-control"
                  value={payAt}
                  onChange={(e) => setPayAt(e.target.value)}
                />
              </div>
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
                <button className="btn btn-primary" type="submit">
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
        <div className="alert alert-info py-2 mb-3">
          <strong>Ringkasan:</strong> Terdapat <strong>{totalCount}</strong>{" "}
          catatan dengan total nominal{" "}
          <strong>{FormatCurrency(totalNominal)}</strong>
        </div>
        {isLoading ? (
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div>
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("created_at")}
                  >
                    Tanggal Input{" "}
                    {sortBy === "created_at" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("transaction_at")}
                  >
                    Tanggal Transaksi{" "}
                    {sortBy === "transaction_at" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th>Deskripsi</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("nominal")}
                  >
                    Nominal {sortBy === "nominal" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th>Metode</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataOtherIncome.map((income, index) => (
                  <tr key={income._id}>
                    <th scope="row">{(page - 1) * limit + index + 1}</th>
                    <td>{FormatDate(income?.created_at)}</td>
                    <td>{FormatDate(income?.transaction_at)}</td>
                    <td>{income?.description}</td>
                    <td>{FormatCurrency(income?.nominal)}</td>
                    <td className="text-capitalize">
                      {income?.payment_method || "cash"}
                    </td>
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
                {dataOtherIncome.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
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
        )}
        <Footer />
      </div>
    </>
  );
}

export default IndexOtherIncome;

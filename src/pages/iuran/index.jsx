import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";
import { exportToExcel } from "../../helpers/exportToExcel";
import { usePayments } from "../../hooks/usePayments";
import { useTableState } from "../../hooks/useTableState";
import TableFooter from "../../components/TableFooter";

function IndexIuran() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);
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
  } = useTableState("iuran", 20, "created_at", -1);

  const { dataIuran, totalPages, totalCount, isLoading, handleDelete } =
    usePayments(page, limit, keyword, sortBy, order);

  if (!state.auth) {
    navigate("/sign-in");
    return null;
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    resetTable("created_at", -1);
  };

  const handleExportExcel = () => {
    const dataToExport = dataIuran.map((iuran, index) => ({
      No: (page - 1) * limit + index + 1,
      "Tanggal Input": FormatDate(iuran?.created_at),
      "Tanggal Bayar": FormatDate(iuran?.pay_at),
      Warga: `${iuran?.warga?.address} | ${iuran?.warga?.name}`,
      Periode: FormatPeriod(iuran?.period_start, iuran?.period_end),
      Nominal: iuran?.nominal,
    }));
    exportToExcel(dataToExport, "Data_Iuran");
  };

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <h1>
          Data Iuran
          <Link
            className="btn btn-primary ms-1"
            to="/income/create"
            state={{ from: location.pathname + location.search }}
          >
            <FontAwesomeIcon icon={faPlus} /> Catat Pemasukan
          </Link>
          <button
            className="btn btn-success ms-1"
            onClick={handleExportExcel}
            title="Export Excel"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>
        </h1>

        {/* Search & Sort Form */}
        <div className="my-4">
          <form onSubmit={handleSearchSubmit}>
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
                    onClick={() => handleSort("pay_at")}
                  >
                    Tanggal Bayar{" "}
                    {sortBy === "pay_at" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th>Warga</th>
                  <th>Periode</th>
                  <th>Nominal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataIuran.map((iuran, index) => (
                  <tr key={iuran._id}>
                    <th scope="row">{(page - 1) * limit + index + 1}</th>
                    <td>{FormatDate(iuran?.created_at)}</td>
                    <td>{FormatDate(iuran?.pay_at)}</td>
                    <td>
                      {iuran?.warga?.address} | {iuran?.warga?.name}
                    </td>
                    <td>
                      {FormatPeriod(iuran?.period_start, iuran?.period_end)}
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
                              to={`/income/create/warga/${iuran?.warga?._id}`}
                              state={{
                                from: location.pathname + location.search,
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Catat Pemasukan
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
                                handleDelete(iuran?._id);
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
                ))}
                {dataIuran.length === 0 && (
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
      </div>

      <div
        className="container d-flex p-3 mx-auto flex-column"
        // style={{ height: "100vh" }}
      >
        <Footer />
      </div>
    </>
  );
}

export default IndexIuran;

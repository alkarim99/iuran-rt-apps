import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TableFooter from "../../components/TableFooter";
import { useTableState } from "../../hooks/useTableState";
import { totalPayment } from "../../services/IuranService";

function TotalIuran() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  const { page, setPage, limit, setLimit, sortBy, order, handleSort } =
    useTableState("iuran_total", 20, "pay_at", -1);

  useEffect(() => {
    document.title = "Total Iuran - Iuran RT";
  }, []);

  const currentDate = new Date();
  const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const [payAt, setPayAt] = useState(defaultMonth);
  const [total, setTotal] = useState(0);
  const [dataIuran, setDataIuran] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    handleSearch();
  }, [state, page, limit, sortBy, order, payAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setIsLoading(true);
    const payload = { payAt, sortBy, order, page, limit };
    totalPayment(payload)
      .then((response) => {
        setTotal(response?.data?.totalIncome || 0);
        setTotalPages(response?.data?.totalPages || 1);
        setTotalCount(response?.data?.totalCount || 0);
        setDataIuran(response?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <h1>
          Kalkulasi Iuran Total
          <Link
            className="btn btn-primary ms-2 fs-6 position-relative"
            to={location.state?.from || "/iuran"}
            style={{ bottom: "5px" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali
          </Link>
        </h1>
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
              <button className="btn btn-primary" type="submit">
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </form>
        {total != 0 && (
          <div className="alert alert-info py-2 my-3">
            <strong>Ringkasan:</strong> Terdapat <strong>{totalCount}</strong>{" "}
            catatan dengan total pendapatan{" "}
            <strong>{FormatCurrency(total)}</strong>
          </div>
        )}

        <div className="container d-flex justify-content-center align-items-center flex-column">
          <div>
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("created_at")}
                  >
                    Tanggal Input{" "}
                    {sortBy === "created_at" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("pay_at")}
                  >
                    Tanggal Bayar{" "}
                    {sortBy === "pay_at" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("warga.address")}
                  >
                    Warga{" "}
                    {["warga.address", "address"].includes(sortBy) &&
                      (order === 1 ? "▲" : "▼")}
                  </th>
                  <th scope="col">Periode</th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("nominal")}
                  >
                    Nominal {sortBy === "nominal" && (order === 1 ? "▲" : "▼")}
                  </th>
                  <th scope="col">Metode Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {dataIuran.map((iuran, index) => {
                  const currentIndex = (page - 1) * limit + index + 1;
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
                        <td className="text-capitalize">
                          {iuran?.payment_method}
                        </td>
                      </tr>
                    </>
                  );
                })}
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
        </div>

        <Footer />
      </div>
    </>
  );
}

export default TotalIuran;

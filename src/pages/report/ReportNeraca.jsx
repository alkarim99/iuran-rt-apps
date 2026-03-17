import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { exportToExcel } from "../../helpers/exportToExcel";
import { exportNeracaKas } from "../../helpers/exportExcel/exportNeracaKas";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getNeracaKasReport } from "../../services/ReportService";

import FormatPeriod from "../../helpers/FormatPeriod";

function ReportNeraca() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const todayDate = new Date();
  const getLocalMonthYear = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  const payAtMonth = getLocalMonthYear(todayDate);
  const [payAt, setPayAt] = useState(() => {
    const saved = sessionStorage.getItem("rx_reportNeraca_payAt");
    return saved !== null ? saved : payAtMonth;
  });

  useEffect(() => {
    sessionStorage.setItem("rx_reportNeraca_payAt", payAt);
  }, [payAt]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }

    handleSearch();
  }, [state]);

  const handleSearch = () => {
    setIsLoading(true);
    const [year, month] = payAt.split("-");
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = `${payAt}-01`;
    const endDate = `${payAt}-${String(lastDay).padStart(2, "0")}`;

    const payload = { start_date: startDate, end_date: endDate };
    getNeracaKasReport(payload)
      .then((response) => {
        setTotalIncome(response?.data?.data?.total_income || 0);
        setTotalExpense(response?.data?.data?.total_expense || 0);
        setReportData(response?.data?.data?.transactions || []);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let currentSaldo = 0;
  const combinedData = reportData.map((item) => {
    currentSaldo += (item.debit || 0) - (item.credit || 0);
    return { ...item, saldo: currentSaldo };
  });

  const handleExportExcel = async () => {
    const [year, month] = payAt.split("-");
    const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };

    const neracaData = {
      total_income: totalIncome,
      total_expense: totalExpense,
      transactions: reportData,
    };

    await exportNeracaKas(neracaData, periode);
  };

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <h1>
          Neraca Kas RT
          <Link className="btn btn-primary ms-1 me-1" to="/">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <button
            className="btn btn-success ms-1"
            onClick={handleExportExcel}
            title="Export Excel"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>
        </h1>

        <div className="print-header">
          <h2>Laporan Neraca Kas RT</h2>
          <p>
            Periode:{" "}
            {FormatPeriod(
              `${payAt}-01`,
              `${payAt}-${new Date(payAt.split("-")[0], payAt.split("-")[1], 0).getDate()}`,
            )}
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row d-flex align-items-end">
            <div className="col-3">
              <label htmlFor="start" className="form-label">
                Periode Bulan
              </label>
              <input
                type="month"
                className="form-control"
                id="start"
                value={payAt}
                onChange={(e) => {
                  setPayAt(e.target.value);
                }}
                required
              />
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

        <div className="row">
          <div className="col-12">
            {(totalIncome != 0 || totalExpense != 0) && (
              <div className="d-flex justify-content-between my-3">
                <p>
                  Periode{" "}
                  {FormatPeriod(
                    `${payAt}-01`,
                    `${payAt}-${new Date(payAt.split("-")[0], payAt.split("-")[1], 0).getDate()}`,
                  )}
                </p>
                <div className="text-end">
                  <p className="mb-0">
                    Total Pemasukan:{" "}
                    <span className="text-success fw-bold">
                      {FormatCurrency(totalIncome)}
                    </span>
                  </p>
                  <p className="mb-0">
                    Total Pengeluaran:{" "}
                    <span className="text-danger fw-bold">
                      {FormatCurrency(totalExpense)}
                    </span>
                  </p>
                  <p className="mb-0 mt-1 border-top pt-1 border-2">
                    Net Balance:{" "}
                    <span
                      className={
                        totalIncome - totalExpense >= 0
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {FormatCurrency(totalIncome - totalExpense)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="container d-flex justify-content-center align-items-center flex-column px-0">
              <div className="w-100 table-responsive">
                <table className="table table-bordered table-striped mt-3">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Deskripsi</th>
                      <th scope="col" className="text-end">
                        Pemasukan (Debit)
                      </th>
                      <th scope="col" className="text-end">
                        Pengeluaran (Kredit)
                      </th>
                      <th scope="col" className="text-end">
                        Net Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          Tidak ada data transaksi.
                        </td>
                      </tr>
                    ) : (
                      combinedData.map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row" className="text-center">
                            {index + 1}
                          </th>
                          <td>{FormatDate(item.tanggal)}</td>
                          <td>{item.description || item.deskripsi}</td>
                          <td className="text-end text-success">
                            {item.debit > 0 ? FormatCurrency(item.debit) : "-"}
                          </td>
                          <td className="text-end text-danger">
                            {item.credit > 0
                              ? FormatCurrency(item.credit)
                              : "-"}
                          </td>
                          <td className="text-end fw-bold">
                            {FormatCurrency(item.saldo)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default ReportNeraca;

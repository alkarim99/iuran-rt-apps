import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { clearTableState } from "../hooks/useTableState";
import { getDashboardSummary } from "../services/ReportService";
import FormatCurrency from "../helpers/FormatCurrency";
import FormatPeriod from "../helpers/FormatPeriod";

function Home() {
  const state = useSelector((reducer) => reducer.auth);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state?.auth) {
      setIsLoading(true);
      const todayDate = new Date();
      const year = todayDate.getFullYear();
      const month = String(todayDate.getMonth() + 1).padStart(2, "0");
      const lastDay = new Date(year, month, 0).getDate();
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

      getDashboardSummary({ start_date: startDate, end_date: endDate })
        .then((response) => {
          if (response?.data?.data) {
            setSummary(response.data.data);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
  }, [state]);

  const todayDate = new Date();
  const formatMonthTitle = FormatPeriod(todayDate, todayDate);

  return (
    <div
      className="container d-flex p-3 mx-auto flex-column"
      style={{ height: "100vh" }}
    >
      <Navbar />

      <main
        className="px-3 text-center d-flex flex-column m-auto"
        style={{ maxWidth: "55em" }}
      >
        <h1>Catatan Iuran & Kas RT.</h1>
        <p className="lead">
          Selamat datang di Pusat Kendali Keuangan RT. Aplikasi terpadu ini
          memudahkan Anda dalam mengelola Pemasukan Iuran Warga, mencatat
          Pemasukan Lainnya (sumbangan/donasi), serta melacak setiap
          Pengeluaran Operasional. Pantau Neraca Kas secara real-time
          dengan transparan dan akurat.
        </p>
      </main>

      {state?.auth ? (
        <div className="container mt-4">
          <h3 className="mb-4 text-center">
            Ringkasan Keuangan {formatMonthTitle}
          </h3>
          {isLoading ? (
            <div className="text-center w-100 py-5">
              <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4 mb-5 justify-content-center">
              <div className="col-12 col-md-4">
                <div className="card text-bg-success shadow text-center h-100">
                  <div className="card-body">
                    <h5 className="card-title">Pemasukan</h5>
                    <p className="card-text fs-4 fw-bold mb-0">
                      {FormatCurrency(summary.total_income)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card shadow border-danger text-center h-100">
                  <div className="card-body text-danger">
                    <h5 className="card-title">Pengeluaran</h5>
                    <p className="card-text fs-4 fw-bold mb-0">
                      {FormatCurrency(summary.total_expense)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card text-bg-primary shadow text-center h-100">
                  <div className="card-body">
                    <h5 className="card-title">Saldo Aktif</h5>
                    <p className="card-text fs-4 fw-bold mb-0">
                      {FormatCurrency(summary.net_balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center d-flex justify-content-center flex-wrap gap-3">
            <Link
              className="btn btn-outline-success btn-lg"
              to="/iuran"
              onClick={clearTableState}
            >
              Catat Pemasukan
            </Link>
            <Link
              className="btn btn-outline-danger btn-lg"
              to="/expense"
              onClick={clearTableState}
            >
              Catat Pengeluaran
            </Link>
            <Link
              className="btn btn-primary btn-lg"
              to="/report/neraca"
              onClick={clearTableState}
            >
              Cek Laporan Neraca
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}

      <Footer />
    </div>
  );
}

export default Home;

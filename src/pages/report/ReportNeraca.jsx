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
import { getOpeningBalances } from "../../services/OpeningBalanceService";

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
  const [saldoPettyCash, setSaldoPettyCash] = useState(0);
  const [saldoRekening, setSaldoRekening] = useState(0);
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
    
    Promise.all([
      getNeracaKasReport(payload),
      getOpeningBalances(year, "petty_cash"),
      getOpeningBalances(year, "rekening")
    ])
      .then(([reportRes, pettyRes, rekRes]) => {
        const transactions = reportRes?.data?.data?.transactions || [];
        const openingPetty = pettyRes?.data?.data?.nominal || 0;
        const openingRekening = rekRes?.data?.data?.nominal || 0;
        
        // Use the native backend combined carry_over for accuracy across months
        const trueOpeningBal = reportRes?.data?.data?.saldo_awal || 0;

        setSaldoPettyCash(openingPetty);
        setSaldoRekening(openingRekening);
        setTotalIncome(reportRes?.data?.data?.total_income || 0);
        setTotalExpense(reportRes?.data?.data?.total_expense || 0);

        // Inject true monthly carry-over combined as the first row for UI table
        const combined = [
          {
            id: `saldo-awal-neraca-${year}-${month}`,
            tanggal: startDate, // backend property for ReportNeraca uses 'tanggal'
            description: "Saldo Awal Bulan",
            debit: trueOpeningBal,
            credit: 0
          },
          ...transactions
        ];

        setReportData(combined);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getSideBySideData = () => {
    if (!reportData || reportData.length === 0) return [];

    const pemasukanList = [];
    const pengeluaranList = [];
    
    reportData.forEach((tx) => {
      if (tx.id && tx.id.startsWith("saldo-awal")) {
        pemasukanList.push({ ...tx, jumlah: tx.debit });
      } else if (tx.debit > 0) {
        pemasukanList.push({ ...tx, jumlah: tx.debit });
      } else if (tx.credit > 0 || tx.kredit > 0) {
        pengeluaranList.push({ ...tx, jumlah: tx.credit || tx.kredit });
      } else {
        pemasukanList.push({ ...tx, jumlah: 0 });
      }
    });

    const maxRows = Math.max(pemasukanList.length, pengeluaranList.length);
    const sideBySide = [];

    for (let i = 0; i < maxRows; i++) {
        sideBySide.push({
            id: i,
            inItem: pemasukanList[i] || null,
            outItem: pengeluaranList[i] || null,
        });
    }

    return sideBySide;
  };

  const combinedData = getSideBySideData();

  const handleExportExcel = async () => {
    const [year, month] = payAt.split("-");
    const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };

    const neracaData = {
      total_income: totalIncome,
      total_expense: totalExpense,
      // For export script, filter out the injected saldo-awal to let the script handle it natively
      transactions: reportData.filter(t => t.id !== `saldo-awal-neraca-${year}-${month}`),
    };

    await exportNeracaKas(neracaData, periode, undefined, saldoPettyCash, saldoRekening);
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
                      <th colSpan="3" className="text-center">PEMASUKAN</th>
                      <th colSpan="3" className="text-center">PENGELUARAN</th>
                    </tr>
                    <tr>
                      <th scope="col" className="text-center">TGL</th>
                      <th scope="col">KETERANGAN</th>
                      <th scope="col" className="text-end">JUMLAH</th>
                      <th scope="col" className="text-center">TGL</th>
                      <th scope="col">KETERANGAN</th>
                      <th scope="col" className="text-end">JUMLAH</th>
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
                      combinedData.map((row) => (
                        <tr key={row.id}>
                          {/* Pemasukan side */}
                          <td className="text-center">
                            {row.inItem ? new Date(row.inItem.tanggal || row.inItem.date).getDate() : ""}
                          </td>
                          <td>{row.inItem ? (row.inItem.description || row.inItem.deskripsi) : ""}</td>
                          <td className="text-end text-success">
                            {row.inItem && row.inItem.jumlah > 0 ? FormatCurrency(row.inItem.jumlah) : ""}
                          </td>

                          {/* Pengeluaran side */}
                          <td className="text-center">
                            {row.outItem ? new Date(row.outItem.tanggal || row.outItem.date).getDate() : ""}
                          </td>
                          <td>{row.outItem ? (row.outItem.description || row.outItem.deskripsi) : ""}</td>
                          <td className="text-end text-danger">
                            {row.outItem && row.outItem.jumlah > 0 ? FormatCurrency(row.outItem.jumlah) : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="table-light fw-bold">
                    <tr>
                      <td colSpan="2" className="text-end">TOTAL PEMASUKAN</td>
                      <td className="text-end text-success">{FormatCurrency(totalIncome + saldoPettyCash + saldoRekening)}</td>
                      <td colSpan="2" className="text-end">TOTAL PENGELUARAN</td>
                      <td className="text-end text-danger">{FormatCurrency(totalExpense)}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="text-end text-primary">SISA SALDO (NET BALANCE)</td>
                      <td className="text-end text-primary">{FormatCurrency((totalIncome + saldoPettyCash + saldoRekening) - totalExpense)}</td>
                    </tr>
                  </tfoot>
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

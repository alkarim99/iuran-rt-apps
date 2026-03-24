import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { exportLaporanKas } from "../../helpers/exportExcel/exportLaporanKas";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getKasRekeningReport } from "../../services/ReportService";
import FormatPeriod from "../../helpers/FormatPeriod";

function ReportTransfer() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Laporan Kas Rekening - Iuran RT";
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;
    setPayAt(formattedDate);
  }, []);

  const [payAt, setPayAt] = useState(() => {
    const saved = sessionStorage.getItem("rx_reportTransfer_payAt");
    // If saved value exists, use it. Otherwise, let the useEffect set the initial value.
    return saved !== null ? saved : "";
  });

  useEffect(() => {
    sessionStorage.setItem("rx_reportTransfer_payAt", payAt);
  }, [payAt]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [saldoAwal, setSaldoAwal] = useState(0);
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

    getKasRekeningReport(payload)
      .then((reportRes) => {
        const transactions = reportRes?.data?.data || [];
        const openingBal = reportRes?.data?.saldo_awal || 0;

        setSaldoAwal(openingBal);

        let inTotal = 0;
        let outTotal = 0;

        // Backend actually calculates t.saldo natively starting from carryOverBalance!
        // So we just need to assign totals and inject Saldo Awal row to the UI.
        transactions.forEach((t) => {
          inTotal += t.debit || 0;
          outTotal += t.kredit || 0;
        });

        // Backend's final balance and running totals are already correct
        setTotalIncome(inTotal);
        setTotalExpense(outTotal);

        // Inject Saldo Awal as the first row for UI table
        const combined = [
          {
            id: `saldo-awal-${year}-${month}`,
            date: startDate, // Day 1 of the month
            description: "Saldo Awal Bulan",
            debit: openingBal,
            kredit: 0,
            saldo: openingBal,
          },
          ...transactions,
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

  // Derive grouped similar to exportLaporanKas
  const getGroupedData = () => {
    if (!reportData || reportData.length === 0) return [];

    // We expect reportData to have the Saldo Awal at index 0. Let's separate it.
    const [year, month] = payAt.split("-");
    const saId = `saldo-awal-${year}-${month}`;
    const saldoRow = reportData.find((t) => t.id === saId);
    const rawTx = reportData.filter((t) => t.id !== saId);

    const listIuran = [];
    const listNonIuran = [];

    rawTx.forEach((tx) => {
      const isIuran =
        tx.type === "Iuran" ||
        (tx.debit > 0 &&
          String(tx.description || "")
            .toLowerCase()
            .includes("pembayaran iuran"));
      if (isIuran) listIuran.push(tx);
      else listNonIuran.push(tx);
    });

    const grouped = [];
    let rb = saldoRow ? saldoRow.debit : 0;

    if (saldoRow) {
      grouped.push({ ...saldoRow, isData: true });
    }

    if (listIuran.length > 0) {
      grouped.push({
        id: "header-iuran",
        date: "",
        description: "PENERIMAAN IURAN VIA TRANSFER",
        isHeaderGroup: true,
      });
      listIuran.forEach((tx, i) => {
        rb += (tx.debit || 0) - (tx.kredit || 0);
        grouped.push({
          ...tx,
          displayDesc: `    ${i + 1}. ${tx.description}`,
          displaySaldo: rb,
          isData: true,
        });
      });
    }

    listNonIuran.forEach((tx) => {
      rb += (tx.debit || 0) - (tx.kredit || 0);
      grouped.push({
        ...tx,
        displayDesc: tx.description,
        displaySaldo: rb,
        isData: true,
      });
    });

    return grouped;
  };

  const combinedData = getGroupedData();

  const handleExportExcel = async () => {
    const [year, month] = payAt.split("-");
    const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };

    // Extract original transactions without the injected row for export helper
    const originalTx = reportData.filter(
      (t) => t.id !== `saldo-awal-${year}-${month}`,
    );
    await exportLaporanKas(originalTx, "rekening", periode, saldoAwal);
  };

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <h1>
          Laporan Kas Rekening
          <Link className="btn btn-primary ms-1 me-1" to="/iuran">
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
          <h2>Laporan Penerimaan Transfer</h2>
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
                      {FormatCurrency(totalIncome + (saldoAwal || 0))}
                    </span>
                  </p>
                  <p className="mb-0">
                    Total Pengeluaran:{" "}
                    <span className="text-danger fw-bold">
                      {FormatCurrency(totalExpense)}
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
                        Debit
                      </th>
                      <th scope="col" className="text-end">
                        Kredit
                      </th>
                      <th scope="col" className="text-end">
                        Saldo
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
                            {index === 0 && item.id.startsWith("saldo-awal")
                              ? ""
                              : index}
                          </th>
                          <td>{item.date ? FormatDate(item.date) : ""}</td>
                          <td className={item.isHeaderGroup ? "fw-bold" : ""}>
                            <pre
                              className="mb-0"
                              style={{
                                fontFamily: "inherit",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item.isHeaderGroup
                                ? item.description
                                : item.displayDesc || item.description}
                            </pre>
                          </td>
                          <td className="text-end text-success">
                            {item.debit > 0 ? FormatCurrency(item.debit) : ""}
                          </td>
                          <td className="text-end text-danger">
                            {item.kredit > 0 ? FormatCurrency(item.kredit) : ""}
                          </td>
                          <td className="text-end fw-bold">
                            {item.isData
                              ? FormatCurrency(item.displaySaldo || item.saldo)
                              : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="table-light fw-bold">
                    <tr>
                      <td colSpan="3" className="text-end">
                        TOTAL
                      </td>
                      <td className="text-end text-success">
                        {FormatCurrency(totalIncome + (saldoAwal || 0))}
                      </td>
                      <td className="text-end text-danger">
                        {FormatCurrency(totalExpense)}
                      </td>
                      <td className="text-end">
                        {FormatCurrency(
                          (saldoAwal || 0) + totalIncome - totalExpense,
                        )}
                      </td>
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

export default ReportTransfer;

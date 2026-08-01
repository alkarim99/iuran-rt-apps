import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faMagnifyingGlass, faArrowUp, faArrowDown, faVault } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency, { toMoney } from "../../helpers/FormatCurrency";
import { exportLaporanKas } from "../../helpers/exportExcel/exportLaporanKas";
import { getPettyCashReport } from "../../services/ReportService";
import FormatPeriod from "../../helpers/FormatPeriod";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import SummaryStrip from "../../components/ui/SummaryStrip";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";

function ReportCash() {
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Laporan Petty Cash - Iuran RT";
  }, []);

  const todayDate = new Date();
  const getLocalMonthYear = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  const payAtMonth = getLocalMonthYear(todayDate);
  const [payAt, setPayAt] = useState(() => {
    const saved = sessionStorage.getItem("rx_reportCash_payAt");
    return saved !== null ? saved : payAtMonth;
  });

  useEffect(() => {
    sessionStorage.setItem("rx_reportCash_payAt", payAt);
  }, [payAt]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [state, payAt]); // Added payAt to auto-refresh on month change

  const handleSearch = () => {
    setIsLoading(true);
    const [year, month] = payAt.split("-");
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = `${payAt}-01`;
    const endDate = `${payAt}-${String(lastDay).padStart(2, "0")}`;

    const payload = { start_date: startDate, end_date: endDate };

    getPettyCashReport(payload)
      .then((reportRes) => {
        const transactions = reportRes?.data?.data || [];
        const openingBal = reportRes?.data?.saldo_awal || 0;

        setSaldoAwal(openingBal);

        let inTotal = 0;
        let outTotal = 0;

        transactions.forEach((t) => {
          inTotal = toMoney(inTotal + (t.debit || 0));
          outTotal = toMoney(outTotal + (t.kredit || 0));
        });

        setTotalIncome(inTotal);
        setTotalExpense(outTotal);

        const combined = [
          {
            id: `saldo-awal-${year}-${month}`,
            date: startDate,
            description: "Saldo Awal Bulan",
            debit: openingBal,
            kredit: 0,
            saldo: openingBal,
            isSaldoAwal: true
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

  const combinedData = useMemo(() => {
    if (!reportData || reportData.length === 0) return [];

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
        description: "PENERIMAAN IURAN CASH",
        isHeaderGroup: true,
      });
      listIuran.forEach((tx, i) => {
        rb = toMoney(rb + (tx.debit || 0) - (tx.kredit || 0));
        grouped.push({
          ...tx,
          displayDesc: `    ${i + 1}. ${tx.description}`,
          displaySaldo: rb,
          isData: true,
        });
      });
    }

    listNonIuran.forEach((tx) => {
      rb = toMoney(rb + (tx.debit || 0) - (tx.kredit || 0));
      grouped.push({
        ...tx,
        displayDesc: tx.description,
        displaySaldo: rb,
        isData: true,
      });
    });

    return grouped;
  }, [reportData, payAt]);

  const handleExportExcel = async () => {
    const [year, month] = payAt.split("-");
    const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };
    const originalTx = reportData.filter(
      (t) => t.id !== `saldo-awal-${year}-${month}`,
    );
    await exportLaporanKas(originalTx, "petty_cash", periode, saldoAwal);
  };

  const [year, month] = payAt.split("-");
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  return (
    <div className="report-cash-page">
      <PageHeader 
        title="Laporan Petty Cash"
        breadcrumb={["Laporan", "Petty Cash (Bu Agus)"]}
        actions={
          <Btn 
            variant="outline" 
            icon={<FontAwesomeIcon icon={faFileExcel} />} 
            onClick={handleExportExcel}
          >
            Export Excel
          </Btn>
        }
      />

      <FilterBar>
        <span className="filter-label">Periode</span>
        <input 
          type="month" 
          className="filter-select" 
          value={payAt} 
          onChange={(e) => setPayAt(e.target.value)} 
        />
        <div className="filter-sep" />
        <Btn 
          variant="primary" 
          size="sm" 
          icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} 
          onClick={handleSearch}
          loading={isLoading}
        >
          Cari
        </Btn>
      </FilterBar>

      <SummaryStrip items={[
        { 
          label: "Total Debit (Masuk)", 
          value: FormatCurrency(totalIncome + (saldoAwal || 0)), 
          icon: <FontAwesomeIcon icon={faArrowUp} />, 
          iconBg: "var(--green-50)", 
          iconColor: "var(--green-600)",
          valueColor: "var(--green-600)"
        },
        { 
          label: "Total Kredit (Keluar)", 
          value: FormatCurrency(totalExpense), 
          icon: <FontAwesomeIcon icon={faArrowDown} />, 
          iconBg: "var(--red-50)", 
          iconColor: "var(--red-600)",
          valueColor: "var(--red-500)"
        },
        { 
          label: "Saldo Akhir", 
          value: FormatCurrency(toMoney((saldoAwal || 0) + totalIncome - totalExpense)), 
          icon: <FontAwesomeIcon icon={faVault} />, 
          iconBg: "var(--blue-50)", 
          iconColor: "var(--blue-600)"
        }
      ]} />

      <TableCard
        title="Buku Kas — Petty Cash (Bu Agus)"
        subtitle={FormatPeriod(
          `${payAt}-01`,
          `${payAt}-${new Date(yearInt, monthInt, 0).getDate()}`
        ) + ` · ${reportData.length} transaksi`}
        monthPills
        selectedMonth={monthInt}
        selectedYear={yearInt}
        activeMonths={[1,2,3,4,5,6,7,8,9,10,11,12]} // Mocking active months for now
        onMonthChange={(m) => setPayAt(`${yearInt}-${String(m).padStart(2, '0')}`)}
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr>
                <th className="text-center" style={{ width: '40px' }}>#</th>
                <th style={{ width: '120px' }}>Tanggal</th>
                <th>Deskripsi</th>
                <th className="text-end" style={{ width: '140px' }}>Debit</th>
                <th className="text-end" style={{ width: '140px' }}>Kredit</th>
                <th className="text-end" style={{ width: '150px' }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    Tidak ada data transaksi untuk periode ini.
                  </td>
                </tr>
              ) : (
                combinedData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center text-muted">
                      {item.isSaldoAwal || item.isHeaderGroup ? "" : index}
                    </td>
                    <td>{item.date ? FormatDate(item.date) : ""}</td>
                    <td className={item.isHeaderGroup ? "fw-bold text-strong" : ""}>
                      <div className={item.isHeaderGroup ? "" : "cell-main"}>
                        {item.isHeaderGroup ? item.description : (item.displayDesc || item.description)}
                      </div>
                    </td>
                    <td className="text-end text-income amount">
                      {item.debit > 0 ? FormatCurrency(item.debit) : "—"}
                    </td>
                    <td className="text-end text-expense amount">
                      {item.kredit > 0 ? FormatCurrency(item.kredit) : "—"}
                    </td>
                    <td className="text-end fw-bold amount">
                      {item.isData ? FormatCurrency(item.displaySaldo || item.saldo) : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="fw-bold">
              <tr>
                <td colSpan="3" className="text-end">TOTAL</td>
                <td className="text-end text-income amount">
                  {FormatCurrency(totalIncome + (saldoAwal || 0))}
                </td>
                <td className="text-end text-expense amount">
                  {FormatCurrency(totalExpense)}
                </td>
                <td className="text-end amount">
                  {FormatCurrency(toMoney((saldoAwal || 0) + totalIncome - totalExpense))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </TableCard>
    </div>
  );
}

export default ReportCash;

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faMagnifyingGlass, faArrowUp, faArrowDown, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency, { toMoney } from "../../helpers/FormatCurrency";
import { exportNeracaKas } from "../../helpers/exportExcel/exportNeracaKas";
import { getNeracaKasReport } from "../../services/ReportService";
import { getOpeningBalances } from "../../services/OpeningBalanceService";
import FormatPeriod from "../../helpers/FormatPeriod";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import SummaryStrip from "../../components/ui/SummaryStrip";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";

function ReportNeraca() {
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Neraca Kas RT - Iuran RT";
  }, []);

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
    handleSearch();
  }, [state, payAt]);

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
        const trueOpeningBal = reportRes?.data?.data?.saldo_awal || 0;

        setSaldoPettyCash(openingPetty);
        setSaldoRekening(openingRekening);
        setTotalIncome(reportRes?.data?.data?.total_income || 0);
        setTotalExpense(reportRes?.data?.data?.total_expense || 0);

        const combined = [
          {
            id: `saldo-awal-neraca-${year}-${month}`,
            tanggal: startDate,
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

  const combinedData = useMemo(() => {
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
  }, [reportData]);

  const handleExportExcel = async () => {
    const [year, month] = payAt.split("-");
    const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };
    const neracaData = {
      total_income: totalIncome,
      total_expense: totalExpense,
      transactions: reportData.filter(t => t.id !== `saldo-awal-neraca-${year}-${month}`),
    };
    await exportNeracaKas(neracaData, periode, undefined, saldoPettyCash, saldoRekening);
  };

  const [year, month] = payAt.split("-");
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  return (
    <div className="report-neraca-page">
      <PageHeader 
        title="Neraca Kas RT"
        breadcrumb={["Laporan", "Neraca Kas RT"]}
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
          label: "Total Pemasukan", 
          value: FormatCurrency(totalIncome + saldoPettyCash + saldoRekening), 
          icon: <FontAwesomeIcon icon={faArrowUp} />, 
          iconBg: "var(--green-50)", 
          iconColor: "var(--green-600)",
          valueColor: "var(--green-600)"
        },
        { 
          label: "Total Pengeluaran", 
          value: FormatCurrency(totalExpense), 
          icon: <FontAwesomeIcon icon={faArrowDown} />, 
          iconBg: "var(--red-50)", 
          iconColor: "var(--red-600)",
          valueColor: "var(--red-500)"
        },
        { 
          label: "Sisa Saldo (Net)", 
          value: FormatCurrency((totalIncome + saldoPettyCash + saldoRekening) - totalExpense), 
          icon: <FontAwesomeIcon icon={faScaleBalanced} />, 
          iconBg: "var(--blue-50)", 
          iconColor: "var(--blue-600)"
        }
      ]} />

      <TableCard
        title="Neraca Kas — Gabungan Cash & Rekening"
        subtitle={FormatPeriod(
          `${payAt}-01`,
          `${payAt}-${new Date(yearInt, monthInt, 0).getDate()}`
        )}
        monthPills
        selectedMonth={monthInt}
        selectedYear={yearInt}
        activeMonths={[1,2,3,4,5,6,7,8,9,10,11,12]}
        onMonthChange={(m) => setPayAt(`${yearInt}-${String(m).padStart(2, '0')}`)}
      >
        <div className="table-responsive">
          <table className="table table-bordered mt-0">
            <thead>
              <tr className="bg-gray-50">
                <th colSpan="3" className="text-center py-2 text-income border-bottom-0">PEMASUKAN</th>
                <th colSpan="3" className="text-center py-2 text-expense border-bottom-0">PENGELUARAN</th>
              </tr>
              <tr>
                <th className="text-center" style={{ width: '40px' }}>Tgl</th>
                <th>Keterangan</th>
                <th className="text-end" style={{ width: '130px' }}>Jumlah</th>
                <th className="text-center" style={{ width: '40px' }}>Tgl</th>
                <th>Keterangan</th>
                <th className="text-end" style={{ width: '130px' }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    Tidak ada data neraca untuk periode ini.
                  </td>
                </tr>
              ) : (
                combinedData.map((row) => (
                  <tr key={row.id}>
                    <td className="text-center text-muted small">
                      {row.inItem ? new Date(row.inItem.tanggal || row.inItem.date).getDate() : ""}
                    </td>
                    <td className="small">
                      {row.inItem ? (row.inItem.description || row.inItem.deskripsi) : ""}
                    </td>
                    <td className="text-end text-income amount small font-bold">
                      {row.inItem && (row.inItem.jumlah > 0 || row.inItem.id?.includes('saldo-awal')) ? FormatCurrency(row.inItem.jumlah) : ""}
                    </td>

                    <td className="text-center text-muted small">
                      {row.outItem ? new Date(row.outItem.tanggal || row.outItem.date).getDate() : ""}
                    </td>
                    <td className="small">
                      {row.outItem ? (row.outItem.description || row.outItem.deskripsi) : ""}
                    </td>
                    <td className="text-end text-expense amount small font-bold">
                      {row.outItem && row.outItem.jumlah > 0 ? FormatCurrency(row.outItem.jumlah) : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="fw-bold">
              <tr className="bg-gray-50">
                <td colSpan="2" className="text-end">TOTAL PEMASUKAN</td>
                <td className="text-end text-income amount">{FormatCurrency(totalIncome + saldoPettyCash + saldoRekening)}</td>
                <td colSpan="2" className="text-end">TOTAL PENGELUARAN</td>
                <td className="text-end text-expense amount">{FormatCurrency(totalExpense)}</td>
              </tr>
              <tr className="bg-blue-50">
                <td colSpan="5" className="text-end text-blue-600">SISA SALDO (NET BALANCE)</td>
                <td className="text-end text-blue-600 amount">{FormatCurrency((totalIncome + saldoPettyCash + saldoRekening) - totalExpense)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </TableCard>
    </div>
  );
}

export default ReportNeraca;

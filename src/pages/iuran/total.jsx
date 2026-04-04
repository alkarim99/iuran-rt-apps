import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMagnifyingGlass,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";
import TableFooter from "../../components/TableFooter";
import { useTableState } from "../../hooks/useTableState";
import { totalPayment } from "../../services/IuranService";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";
import SummaryStrip from "../../components/ui/SummaryStrip";

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
    <div className="iuran-total-page">
      <PageHeader
        title="Kalkulasi Total Iuran"
        breadcrumb={["Laporan", "Total Iuran"]}
        actions={
          <Btn
            variant="outline"
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            onClick={() => navigate(location.state?.from || "/iuran")}
          >
            Kembali
          </Btn>
        }
      />

      <FilterBar>
        <form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <label className="small text-muted font-bold whitespace-nowrap">Pilih Bulan:</label>
            <input
              type="month"
              className="filter-select"
              value={payAt}
              onChange={(e) => setPayAt(e.target.value)}
            />
          </div>
          <Btn
            variant="primary"
            size="sm"
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            type="submit"
            loading={isLoading}
          >
            Hitung Total
          </Btn>
        </form>
      </FilterBar>

      <SummaryStrip
        items={[
          {
            label: "Total Transaksi",
            value: totalCount,
            icon: <FontAwesomeIcon icon={faCalendarCheck} />,
            trend: "Pembayaran Terverifikasi"
          },
          {
            label: "Total Pendapatan",
            value: FormatCurrency(total),
            variant: "income",
            trend: `Periode ${FormatDate(payAt).split(" ")[1]} ${FormatDate(payAt).split(" ")[2]}`
          }
        ]}
      />

      <TableCard
        title="Daftar Transaksi Terhitung"
        subtitle="Rincian pembayaran yang masuk dalam kalkulasi total periode ini"
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0 align-middle">
            <thead>
              <tr>
                <th className="text-center" style={{ width: '50px' }}>#</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("pay_at")}>
                  Tgl Bayar {sortBy === "pay_at" && (order === 1 ? "↑" : "↓")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("warga.address")}>
                  Warga {["warga.address", "address"].includes(sortBy) && (order === 1 ? "↑" : "↓")}
                </th>
                <th>Periode Iuran</th>
                <th className="text-end" style={{ cursor: "pointer" }} onClick={() => handleSort("nominal")}>
                  Nominal {sortBy === "nominal" && (order === 1 ? "↑" : "↓")}
                </th>
                <th className="text-center">Metode</th>
                <th className="text-center small text-muted">Input</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-5 text-muted">Mengkalkulasi data...</td></tr>
              ) : dataIuran.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-5 text-muted">Data tidak ditemukan untuk periode ini.</td></tr>
              ) : (
                dataIuran.map((iuran, index) => (
                  <tr key={iuran._id}>
                    <td className="text-center text-muted small">{(page - 1) * limit + index + 1}</td>
                    <td><div className="cell-main">{FormatDate(iuran.pay_at)}</div></td>
                    <td>
                      <div className="cell-main">{iuran.warga?.name}</div>
                      <div className="cell-sub">{iuran.warga?.address}</div>
                    </td>
                    <td>
                      <div className="small">{FormatPeriod(iuran.period_start, iuran.period_end)}</div>
                    </td>
                    <td className="text-end font-bold amount">{FormatCurrency(iuran.nominal)}</td>
                    <td className="text-center">
                      <StatusBadge type={iuran.payment_method || 'cash'} />
                    </td>
                    <td className="text-center small text-muted">
                      {FormatDate(iuran.created_at).split(" ")[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
      </TableCard>
    </div>
  );
}

export default TotalIuran;

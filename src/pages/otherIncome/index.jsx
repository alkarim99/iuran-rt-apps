import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPen, 
  faPlus, 
  faTrash, 
  faMagnifyingGlass, 
  faRotateRight,
  faHandHoldingDollar,
  faCoins
} from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import { getAllOtherIncomes, deleteOtherIncome } from "../../services/OtherIncomeService";
import { useTableState } from "../../hooks/useTableState";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import SummaryStrip from "../../components/ui/SummaryStrip";
import TableCard from "../../components/ui/TableCard";
import TableFooter from "../../components/TableFooter";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";

function IndexOtherIncome() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Pemasukan Lainnya - Iuran RT";
  }, []);

  const {
    page, setPage,
    limit, setLimit,
    keyword, setKeyword,
    sortBy, setSortBy,
    order, setOrder,
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
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    handleGet();
  }, [keyword, sortBy, order, page, limit, payAt]);

  const handleGet = () => {
    setIsLoading(true);
    const payload = { keyword, sort_by: sortBy, order, page, limit, payAt };
    getAllOtherIncomes(payload)
      .then((response) => {
        setDataOtherIncome(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);
        setTotalNominal(response?.data?.totalNominal || 0);
        setTotalCount(response?.data?.totalCount || 0);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleReset = () => {
    setPayAt("");
    setKeyword("");
    resetTable("transaction_at", -1);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus pemasukan lainnya?",
      text: "Data ini akan dihapus permanen dari laporan kas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--red-500)",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteOtherIncome(id)
          .then((response) => {
            Swal.fire({ title: "Berhasil!", text: response?.data?.message, icon: "success", timer: 1500, showConfirmButton: false });
            handleGet();
          })
          .catch((error) => {
            Swal.fire({ title: "Error!", text: error?.response?.data?.message ?? "Terjadi kesalahan.", icon: "error" });
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  return (
    <div className="other-income-index-page">
      <PageHeader 
        title="Pemasukan Lainnya"
        breadcrumb={["Transaksi", "Pemasukan Non-Iuran"]}
        actions={
          <Btn variant="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => navigate("/income/create", { state: { from: "/other-income" } })}>
            Catat Pemasukan
          </Btn>
        }
      />

      <FilterBar>
        <div className="d-flex align-items-center gap-2 flex-1">
          <input type="month" className="filter-select" value={payAt} onChange={(e) => setPayAt(e.target.value)} />
          <div className="search-input-group flex-1" style={{ maxWidth: '240px' }}>
            <input
              type="text"
              className="form-control-rt w-100"
              placeholder="Cari deskripsi..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="transaction_at">Tgl Transaksi</option>
            <option value="created_at">Tgl Input</option>
            <option value="nominal">Nominal</option>
          </select>
          <Btn variant="outline" size="sm" icon={<FontAwesomeIcon icon={faRotateRight} />} onClick={handleReset}>
            Reset
          </Btn>
        </div>
      </FilterBar>

      <SummaryStrip items={[
        { 
          label: "Total Periode Ini", 
          value: FormatCurrency(totalNominal), 
          icon: <FontAwesomeIcon icon={faCoins} />, 
          iconBg: "var(--blue-50)", iconColor: "var(--blue-600)", valueColor: "var(--blue-600)"
        },
        { 
          label: "Jumlah Catatan", 
          value: `${totalCount} Transaksi`, 
          icon: <FontAwesomeIcon icon={faHandHoldingDollar} />, 
          iconBg: "var(--gray-100)", iconColor: "var(--gray-600)"
        }
      ]} />

      <TableCard title="Riwayat Pemasukan Non-Iuran">
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr>
                <th style={{ width: '40px' }} className="text-center">#</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("transaction_at")}>
                  Tanggal {sortBy === "transaction_at" && (order === 1 ? "↑" : "↓")}
                </th>
                <th>Deskripsi / Sumber</th>
                <th className="text-end" style={{ cursor: "pointer" }} onClick={() => handleSort("nominal")}>
                  Nominal {sortBy === "nominal" && (order === 1 ? "↑" : "↓")}
                </th>
                <th className="text-center">Metode</th>
                <th style={{ width: '120px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">Memuat data...</td></tr>
              ) : dataOtherIncome.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">Tidak ada data pemasukan.</td></tr>
              ) : (
                dataOtherIncome.map((income, index) => (
                  <tr key={income._id}>
                    <td className="text-center text-muted small">{(page - 1) * limit + index + 1}</td>
                    <td>
                      <div className="cell-main">{FormatDate(income.transaction_at).split(' ')[0]}</div>
                      <div className="cell-sub">Input: {FormatDate(income.created_at).split(' ')[0]}</div>
                    </td>
                    <td>
                      <div className="cell-main">{income.description}</div>
                    </td>
                    <td className="text-end font-bold amount text-income">{FormatCurrency(income.nominal)}</td>
                    <td className="text-center">
                      <StatusBadge type={income.payment_method || 'cash'} />
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => navigate(`/other-income/edit/${income._id}`)} title="Edit" />
                        <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => handleDelete(income._id)} className="text-danger" title="Hapus" />
                      </div>
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
          onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        />
      </TableCard>
    </div>
  );
}

export default IndexOtherIncome;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faFileExcel,
  faMagnifyingGlass,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";
import { exportToExcel } from "../../helpers/exportToExcel";
import { usePayments } from "../../hooks/usePayments";
import { useTableState } from "../../hooks/useTableState";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import TableFooter from "../../components/TableFooter";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";

function IndexIuran() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Data Iuran - Iuran RT";
  }, []);

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
    resetTable,
    handleSort,
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
    <div className="iuran-index-page">
      <PageHeader
        title="Data Iuran Warga"
        breadcrumb={["Keuangan", "Iuran Warga"]}
        actions={
          <div className="d-flex gap-2">
            <Btn
              variant="outline"
              icon={<FontAwesomeIcon icon={faFileExcel} />}
              onClick={handleExportExcel}
            >
              Export Excel
            </Btn>
            <Btn
              variant="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => navigate("/income/create", { state: { from: location.pathname + location.search } })}
            >
              Catat Pemasukan
            </Btn>
          </div>
        }
      />

      <FilterBar>
        <form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-2 flex-1">
          <div className="search-input-group flex-1" style={{ maxWidth: '320px' }}>
            <input
              type="text"
              className="form-control-rt w-100"
              placeholder="Cari nama atau alamat..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="created_at">Pencatatan Terbaru</option>
            <option value="pay_at">Pembayaran Terbaru</option>
          </select>
          <Btn
            variant="primary"
            size="sm"
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            type="submit"
            loading={isLoading}
          >
            Cari
          </Btn>
          <Btn
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faRotateRight} />}
            onClick={handleReset}
          >
            Reset
          </Btn>
        </form>
      </FilterBar>

      <TableCard
        title="Riwayat Pembayaran Iuran"
        subtitle={`Menampilkan ${dataIuran.length} dari ${totalCount} transaksi`}
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr>
                <th style={{ width: '50px' }} className="text-center">#</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort("pay_at")}>
                  Tgl Bayar {sortBy === "pay_at" && (order === 1 ? "↑" : "↓")}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort("warga.name")}>
                  Warga {sortBy === "warga.name" && (order === 1 ? "↑" : "↓")}
                </th>
                <th>Periode</th>
                <th className="text-end">Nominal</th>
                <th className="text-center">Metode</th>
                <th style={{ width: '120px' }} className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">Memuat data...</td>
                </tr>
              ) : dataIuran.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">Data tidak ditemukan.</td>
                </tr>
              ) : (
                dataIuran.map((iuran, index) => (
                  <tr key={iuran._id}>
                    <td className="text-center text-muted small">{(page - 1) * limit + index + 1}</td>
                    <td>
                      <div className="cell-main">{FormatDate(iuran.pay_at)}</div>
                      <div className="cell-sub">Input: {FormatDate(iuran.created_at)}</div>
                    </td>
                    <td>
                      <div className="cell-main">{iuran.warga?.name}</div>
                      <div className="cell-sub">{iuran.warga?.address}</div>
                    </td>
                    <td>
                      <div className="cell-main">{FormatPeriod(iuran.period_start, iuran.period_end)}</div>
                    </td>
                    <td className="text-end font-bold amount">
                      {FormatCurrency(iuran.nominal)}
                    </td>
                    <td className="text-center">
                      <StatusBadge type={iuran.payment_method || 'cash'} />
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Btn
                          variant="ghost"
                          size="sm"
                          icon={<FontAwesomeIcon icon={faPen} />}
                          onClick={() => navigate(`/iuran/edit/${iuran._id}`)}
                          title="Edit"
                        />
                        <Btn
                          variant="ghost"
                          size="sm"
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          onClick={() => handleDelete(iuran._id)}
                          className="text-danger"
                          title="Hapus"
                        />
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
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </TableCard>
    </div>
  );
}

export default IndexIuran;

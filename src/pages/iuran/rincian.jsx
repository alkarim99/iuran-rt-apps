import { useEffect, useState } from "react";
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
import { exportRincianIuran } from "../../helpers/exportExcel/exportRincianIuran";
import {
  deletePayment,
  searchPaymentsRincian,
} from "../../services/IuranService";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import TableFooter from "../../components/TableFooter";
import Btn from "../../components/ui/Btn";
import { useTableState } from "../../hooks/useTableState";
import Swal from "sweetalert2";

function RincianIuran() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Rincian Iuran Warga - Iuran RT";
  }, []);

  const [dataIuran, setDataIuran] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
  } = useTableState("rincianIuran", 20, "warga.address", 1);

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  const payAtDate = `${currentYear}-${currentMonth}`;
  const [payAt, setPayAt] = useState(payAtDate);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleSearch();
  }, [state, page, limit, sortBy, order, payAt]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus transaksi ini?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deletePayment(id)
          .then((response) => {
            Swal.fire("Berhasil", "Data iuran telah dihapus.", "success");
            handleSearch();
          })
          .catch((error) => {
            Swal.fire("Gagal", error?.response?.data?.message ?? "Terjadi kesalahan.", "error");
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
      setPage(1);
    }
    setIsLoading(true);
    const payload = { keyword, sortBy, order, page, limit, payAt };
    searchPaymentsRincian(payload)
      .then((response) => {
        setDataIuran(response?.data?.data);
        setTotalPages(response?.data?.totalPages);
        setTotalCount(response?.data?.totalCount);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleReset = () => {
    setKeyword("");
    setSortBy("warga.address");
    setPayAt(payAtDate);
    setPage(1);
  };

  const handleExportExcel = async () => {
    if (totalCount === 0) {
      Swal.fire("Info", "Tidak ada data untuk diekspor pada periode ini.", "info");
      return;
    }
    setIsExporting(true);
    try {
      const payload = { keyword, sortBy, order, page: 1, limit: totalCount, payAt };
      const response = await searchPaymentsRincian(payload);
      const allData = response?.data?.data || [];
      const [year, month] = payAt.split("-");
      const periode = { bulan: parseInt(month, 10), tahun: parseInt(year, 10) };
      await exportRincianIuran(allData, periode);
    } catch (error) {
      Swal.fire("Error!", "Gagal mengekspor data.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="rincian-iuran-page">
      <PageHeader
        title="Rincian Alokasi Iuran"
        breadcrumb={["Laporan", "Rincian Iuran"]}
        actions={
          <div className="d-flex gap-2">
            <Btn
              variant="outline"
              icon={<FontAwesomeIcon icon={faRotateRight} />}
              onClick={() => navigate("/iuran/total")}
            >
              Lihat Total
            </Btn>
            <Btn
              variant="success"
              icon={<FontAwesomeIcon icon={faFileExcel} />}
              onClick={handleExportExcel}
              loading={isExporting}
            >
              Export Excel
            </Btn>
            <Btn
              variant="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => navigate("/income/create", { state: { from: location.pathname + location.search } })}
            >
              Catat Iuran
            </Btn>
          </div>
        }
      />

      <FilterBar>
        <form onSubmit={handleSearch} className="d-flex align-items-center gap-3 flex-1">
          <div className="search-input-group flex-1" style={{ maxWidth: '280px' }}>
            <input
              type="text"
              className="form-control-rt w-100"
              placeholder="Cari nama atau alamat..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="small text-muted font-bold whitespace-nowrap">Periode:</label>
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
            Filter
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            icon={<FontAwesomeIcon icon={faRotateRight} />}
            onClick={handleReset}
          >
            Reset
          </Btn>
        </form>
      </FilterBar>

      <TableCard
        title={`Rincian Iuran: ${FormatDate(payAt).split(" ")[1]} ${FormatDate(payAt).split(" ")[2]}`}
        subtitle={`Ditemukan ${totalCount} transaksi pembayaran`}
      >
        <div className="table-responsive overflow-visible">
          <table className="table table-hover mt-0 align-middle">
            <thead>
              <tr className="bg-light">
                <th className="text-center" style={{ width: '40px' }}>#</th>
                <th style={{ minWidth: '180px' }}>Warga & Alamat</th>
                <th className="text-center" style={{ minWidth: '100px' }}>Tgl Bayar</th>
                <th className="text-end" style={{ minWidth: '90px' }}>Total</th>
                <th className="text-center" style={{ width: '50px' }}>X</th>
                <th className="text-end text-blue-600" style={{ minWidth: '75px' }}>RT</th>
                <th className="text-end text-blue-600" style={{ minWidth: '75px' }}>PKK</th>
                <th className="text-end text-blue-600" style={{ minWidth: '75px' }}>Sosial</th>
                <th className="text-end text-blue-600" style={{ minWidth: '75px' }}>Mati</th>
                <th style={{ minWidth: '130px' }}>Periode Cakupan</th>
                <th className="text-center" style={{ width: '90px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="11" className="text-center py-5 text-muted">Memuat data rincian...</td></tr>
              ) : dataIuran.length === 0 ? (
                <tr><td colSpan="11" className="text-center py-5 text-muted">Tidak ada data untuk periode ini.</td></tr>
              ) : (
                dataIuran.map((iuran, index) => (
                  <tr key={iuran._id}>
                    <td className="text-center text-muted small">{(page - 1) * limit + index + 1}</td>
                    <td>
                      <div className="cell-main">{iuran.warga?.name}</div>
                      <div className="cell-sub">{iuran.warga?.address}</div>
                    </td>
                    <td className="text-center small">{FormatDate(iuran.pay_at).split(" ")[0]}</td>
                    <td className="text-end font-bold text-income">{FormatCurrency(iuran.nominal)}</td>
                    <td className="text-center">
                      <span className="badge bg-blue-50 text-blue-700 px-2 py-1" style={{ borderRadius: '4px' }}>
                        {iuran.number_of_period}
                      </span>
                    </td>
                    <td className="text-end small">{FormatCurrency(iuran.details_payment?.rt)}</td>
                    <td className="text-end small">{FormatCurrency(iuran.details_payment?.pkk)}</td>
                    <td className="text-end small">{FormatCurrency(iuran.details_payment?.sosial)}</td>
                    <td className="text-end small">{FormatCurrency(iuran.details_payment?.kematian)}</td>
                    <td>
                      <div className="small text-muted">{FormatPeriod(iuran.period_start, iuran.period_end, true)}</div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
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

export default RincianIuran;

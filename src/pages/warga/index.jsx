import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faCircleInfo,
  faMagnifyingGlass,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTableState } from "../../hooks/useTableState";
import { searchWarga, deleteWarga } from "../../services/WargaService";
import { useWargaPaymentStatus } from "../../hooks/useWargaPaymentStatus";
import FormatPeriod from "../../helpers/FormatPeriod";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import TableFooter from "../../components/TableFooter";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";

function IndexWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [dataWarga, setDataWarga] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setOrder,
    handleSort,
    resetTable,
  } = useTableState("warga", 20);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Lazy-load payment status after warga list is fetched
  const { statusMap, isLoadingStatus } = useWargaPaymentStatus(dataWarga);

  useEffect(() => {
    document.title = "Data Warga - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    } else {
      fetchWargaData();
    }
  }, [state, page, limit, sortBy, order]);

  const fetchWargaData = () => {
    setIsLoading(true);
    const payload = { keyword, sortBy, order, page, limit };
    searchWarga(payload)
      .then((response) => {
        setTotalPages(response?.data?.totalPages || 1);
        setTotalCount(response?.data?.totalCount || 0);
        setDataWarga(response?.data?.data || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus data warga?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--red-500)",
      cancelButtonColor: "var(--gray-400)",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteWarga(id)
          .then((response) => {
            Swal.fire({
              title: "Berhasil!",
              text: response?.data?.message || "Data warga telah dihapus.",
              icon: "success",
            }).then(() => {
              fetchWargaData();
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ??
                "Terjadi kesalahan saat menghapus data.",
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (page === 1) {
      fetchWargaData();
    } else {
      setPage(1);
    }
  };

  const handleReset = () => {
    resetTable("name", 1);
    setKeyword("");
    setTimeout(() => {
      fetchWargaData();
    }, 0);
  };

  const getStartingIndex = () => {
    return (page - 1) * limit + 1;
  };

  return (
    <div className="warga-index-page">
      <PageHeader
        title="Daftar Warga"
        breadcrumb={["Data Master", "Warga"]}
        actions={
          <Btn
            variant="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => navigate("/warga/create")}
          >
            Tambah Warga
          </Btn>
        }
      />

      <FilterBar>
        <form
          onSubmit={handleSearchSubmit}
          className="d-flex align-items-center gap-2 flex-1"
        >
          <div
            className="search-input-group flex-1"
            style={{ maxWidth: "320px" }}
          >
            <input
              type="text"
              className="form-control-rt w-100"
              placeholder="Cari nama atau alamat..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
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
        title="Data Penduduk RT 08"
        subtitle={`Total ${totalCount} warga terdaftar`}
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr>
                <th style={{ width: "50px" }} className="text-center">
                  #
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                >
                  Nama Lengkap {sortBy === "name" && (order === 1 ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("address")}
                >
                  Alamat Rumah{" "}
                  {sortBy === "address" && (order === 1 ? "↑" : "↓")}
                </th>
                <th style={{ width: "140px" }}>Terakhir Bayar</th>
                <th style={{ width: "100px" }} className="text-center">
                  Status
                </th>
                <th style={{ width: "160px" }} className="text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Memuat data...
                  </td>
                </tr>
              ) : dataWarga.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Pencarian tidak menemukan hasil.
                  </td>
                </tr>
              ) : (
                dataWarga.map((warga, index) => {
                  const payInfo = statusMap[warga._id];
                  const isStatusLoading = !payInfo && isLoadingStatus;
                  const status = payInfo?.status || null;
                  const latestPeriod = payInfo?.latest_period;

                  return (
                    <tr key={warga._id}>
                      <td className="text-center text-muted small">
                        {getStartingIndex() + index}
                      </td>
                      <td>
                        <div className="cell-main">{warga.name}</div>
                        <div className="cell-sub">Warga RT 08</div>
                      </td>
                      <td>
                        <div
                          className="cell-main text-truncate"
                          style={{ maxWidth: "300px" }}
                        >
                          {warga.address}
                        </div>
                      </td>
                      <td>
                        {isStatusLoading ? (
                          <span className="text-muted small">--</span>
                        ) : latestPeriod && latestPeriod !== "Tidak ada" ? (
                          <div
                            className="cell-main"
                            style={{ fontSize: "12px" }}
                          >
                            {(() => {
                              // latest_period is a single date, use it as both start and end
                              const d = new Date(latestPeriod);
                              // Build a month-year string
                              const months = [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "Mei",
                                "Jun",
                                "Jul",
                                "Agt",
                                "Sep",
                                "Okt",
                                "Nov",
                                "Des",
                              ];
                              return `${months[d.getMonth()]} ${d.getFullYear()}`;
                            })()}
                          </div>
                        ) : (
                          <span className="text-muted small">Belum ada</span>
                        )}
                      </td>
                      <td className="text-center">
                        {isStatusLoading ? (
                          <span className="text-muted small">--</span>
                        ) : status ? (
                          <StatusBadge type={status} />
                        ) : (
                          <StatusBadge type="belum" />
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center gap-1 flex-wrap">
                          {/* Quick Bayar — only for belum status */}
                          {status === "belum" && (
                            <Btn
                              variant="success"
                              size="sm"
                              icon={<FontAwesomeIcon icon={faPlus} />}
                              onClick={() =>
                                navigate(`/income/create/warga/${warga._id}`)
                              }
                              title="Catat Pembayaran"
                            >
                              Bayar
                            </Btn>
                          )}
                          <Btn
                            variant="ghost"
                            size="sm"
                            icon={<FontAwesomeIcon icon={faCircleInfo} />}
                            onClick={() => navigate(`/warga/${warga._id}`)}
                            title="Detail"
                          />
                          <Btn
                            variant="ghost"
                            size="sm"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => navigate(`/warga/edit/${warga._id}`)}
                            title="Edit"
                          />
                          <Btn
                            variant="ghost"
                            size="sm"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => handleDelete(warga._id)}
                            className="text-danger"
                            title="Hapus"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
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

export default IndexWarga;

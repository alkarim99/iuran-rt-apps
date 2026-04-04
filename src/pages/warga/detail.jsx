import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faPlus,
  faMagnifyingGlass,
  faRotateRight,
  faUser,
  faLocationDot,
  faCalendarCheck,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import TableFooter from "../../components/TableFooter";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";
import { getWargaByID } from "../../services/WargaService";
import {
  getPaymentByWargaId,
  deletePayment,
} from "../../services/IuranService";

function DetailWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const location = useLocation();
  const id = location?.pathname?.split("/")[2];

  const [dataWarga, setDataWarga] = useState({});
  const [dataIuran, setDataIuran] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState("created_at");
  const [pageIuran, setPageIuran] = useState(1);
  const [limitIuran, setLimitIuran] = useState(10);

  const [pageReport, setPageReport] = useState(1);
  const [limitReport, setLimitReport] = useState(10);

  // Pagination for local data
  const paginatedIuran = dataIuran.slice(
    (pageIuran - 1) * limitIuran,
    pageIuran * limitIuran,
  );

  const paginatedReport = dataIuran.slice(
    (pageReport - 1) * limitReport,
    pageReport * limitReport,
  );

  useEffect(() => {
    document.title = "Detail Warga - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGet();
    handleGetPayment(sortBy);
  }, [state, navigate, id]);

  const handleGet = () => {
    setIsLoading(true);
    getWargaByID(id)
      .then((response) => setDataWarga(response?.data?.data))
      .catch((error) => console.error(error));
  };

  const handleGetPayment = (currentSortBy = sortBy) => {
    setIsLoading(true);
    getPaymentByWargaId({ id, sortBy: currentSortBy })
      .then((response) => setDataIuran(response?.data?.data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (paymentId) => {
    Swal.fire({
      title: "Hapus data pembayaran?",
      text: "Data iuran yang dihapus akan mempengaruhi saldo laporan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--red-500)",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deletePayment(paymentId)
          .then((response) => {
            Swal.fire({
              title: "Berhasil!",
              text: response?.data?.message || "Data pembayaran telah dihapus.",
              icon: "success",
            }).then(() => {
              handleGet();
              handleGetPayment();
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ?? "Terjadi kesalahan sistem.",
              icon: "error",
            });
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    handleGetPayment(sortBy);
  };

  const handleReset = () => {
    setSortBy("created_at");
    handleGetPayment("created_at");
  };

  return (
    <div className="warga-detail-page">
      <PageHeader
        title="Profil Warga"
        breadcrumb={["Data Master", "Warga", dataWarga?.name || "Detail"]}
        actions={
          <div className="d-flex gap-2">
            <Btn
              variant="outline"
              icon={<FontAwesomeIcon icon={faPen} />}
              onClick={() => navigate(`/warga/edit/${id}`)}
            >
              Edit Profil
            </Btn>
            <Btn
              variant="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() =>
                navigate(`/iuran/create/warga/${id}`, {
                  state: { from: location.pathname },
                })
              }
            >
              Catat Iuran
            </Btn>
          </div>
        }
      />

      {/* Citizen Info Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div
            className="rt-card d-flex align-items-center gap-4 p-4"
            style={{
              height: "100%",
              background: "var(--surface)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div
              className="profile-avatar-lg"
              style={{
                width: "80px",
                height: "80px",
                background: "var(--blue-50)",
                color: "var(--blue-600)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyCenter: "center",
                fontSize: "32px",
              }}
            >
              <div className="mx-auto">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div>
              <h2
                className="mb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "var(--gray-900)",
                }}
              >
                {dataWarga?.name}
              </h2>
              <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{dataWarga?.address}</span>
              </div>
              <StatusBadge type="custom">
                Warga RT 08
              </StatusBadge>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="rt-card p-4"
            style={{
              height: "100%",
              background: "var(--surface)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "var(--gray-400)",
                marginBottom: "16px",
                letterSpacing: "0.5px",
              }}
            >
              Ringkasan Pembayaran
            </h4>
            <div className="row g-3">
              <div className="col-6">
                <div className="small text-muted mb-1">Total Kontribusi</div>
                <div
                  className="font-bold amount"
                  style={{ fontSize: "18px", color: "var(--green-600)" }}
                >
                  {FormatCurrency(
                    dataIuran.reduce(
                      (acc, curr) => acc + (curr.nominal || 0),
                      0,
                    ),
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="small text-muted mb-1">Terakhir Bayar</div>
                <div className="font-bold" style={{ fontSize: "16px" }}>
                  {dataIuran[0]
                    ? FormatPeriod(dataIuran[0].period_start, dataIuran[0].period_end)
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterBar>
        <form
          onSubmit={handleSearch}
          className="d-flex align-items-center gap-2 flex-1"
        >
          <span className="filter-label">Urutkan</span>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Pencatatan Terbaru</option>
            <option value="pay_at">Pembayaran Terbaru</option>
          </select>
          <div className="filter-sep" />
          <Btn
            variant="primary"
            size="sm"
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            type="submit"
            loading={isLoading}
          >
            Tampilkan
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
        title="Riwayat Iuran Rutin"
        subtitle={`${dataIuran.length} transaksi tercatat untuk warga ini`}
        className="mb-4"
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr>
                <th style={{ width: "40px" }} className="text-center">
                  #
                </th>
                <th>Tgl Bayar</th>
                <th>Periode Iuran</th>
                <th className="text-end">Nominal</th>
                <th className="text-center">Metode</th>
                <th className="text-center" style={{ width: "120px" }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedIuran.map((iuran, index) => (
                <tr key={iuran._id}>
                  <td className="text-center text-muted small">
                    {(pageIuran - 1) * limitIuran + index + 1}
                  </td>
                  <td>
                    <div className="cell-main">{FormatDate(iuran.pay_at)}</div>
                    <div className="cell-sub">
                      Input: {FormatDate(iuran.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className="cell-main">
                      {FormatPeriod(iuran.period_start, iuran.period_end)}
                    </div>
                  </td>
                  <td className="text-end font-bold amount">
                    {FormatCurrency(iuran.nominal)}
                  </td>
                  <td className="text-center">
                    <StatusBadge type={iuran.payment_method} />
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
              ))}
              {dataIuran.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Belum ada riwayat pembayaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TableFooter
          currentPage={pageIuran}
          totalPages={Math.ceil(dataIuran.length / limitIuran)}
          totalCount={dataIuran.length}
          itemsPerPage={limitIuran}
          onPageChange={setPageIuran}
          onLimitChange={(newLimit) => {
            setLimitIuran(newLimit);
            setPageIuran(1);
          }}
        />
      </TableCard>

      <TableCard
        title="Rincian Alokasi Dana"
        subtitle="Breakdown perolehan per kategori (RT, PKK, Sosial, Kematian)"
      >
        <div className="table-responsive">
          <table className="table table-hover mt-0">
            <thead>
              <tr className="bg-gray-50">
                <th style={{ width: "40px" }} className="text-center">
                  #
                </th>
                <th>Bulan</th>
                <th className="text-center">Bln</th>
                <th className="text-end">RT</th>
                <th className="text-end">PKK</th>
                <th className="text-end">Sosial</th>
                <th className="text-end">Kematian</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReport.map((iuran, index) => (
                <tr key={iuran._id}>
                  <td className="text-center text-muted small">
                    {(pageReport - 1) * limitReport + index + 1}
                  </td>
                  <td className="font-bold">
                    {FormatPeriod(iuran.period_start, iuran.period_end)}
                  </td>
                  <td className="text-center">{iuran.number_of_period}x</td>
                  <td className="text-end amount small">
                    {FormatCurrency(iuran.details_payment?.rt)}
                  </td>
                  <td className="text-end amount small">
                    {FormatCurrency(iuran.details_payment?.pkk)}
                  </td>
                  <td className="text-end amount small">
                    {FormatCurrency(iuran.details_payment?.sosial)}
                  </td>
                  <td className="text-end amount small">
                    {FormatCurrency(iuran.details_payment?.kematian)}
                  </td>
                  <td
                    className="text-end font-bold amount"
                    style={{ color: "var(--gray-900)" }}
                  >
                    {FormatCurrency(iuran.nominal)}
                  </td>
                </tr>
              ))}
              {dataIuran.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    Data rincian belum tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TableFooter
          currentPage={pageReport}
          totalPages={Math.ceil(dataIuran.length / limitReport)}
          totalCount={dataIuran.length}
          itemsPerPage={limitReport}
          onPageChange={setPageReport}
          onLimitChange={(newLimit) => {
            setLimitReport(newLimit);
            setPageReport(1);
          }}
        />
      </TableCard>
    </div>
  );
}

export default DetailWarga;

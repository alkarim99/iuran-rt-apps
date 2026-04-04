import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faXmark,
  faCheck,
  faCalendarDays,
  faWallet,
  faBuildingColumns,
  faNoteSticky
} from "@fortawesome/free-solid-svg-icons";
import FormatCurrency from "../../helpers/FormatCurrency";
import {
  getOpeningBalances,
  upsertOpeningBalance,
  deleteOpeningBalance,
} from "../../services/OpeningBalanceService";

import PageHeader from "../../components/ui/PageHeader";
import FilterBar from "../../components/ui/FilterBar";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";

function OpeningBalance() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Saldo Awal Tahun - Iuran RT";
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 2 }, (_, i) => 2020 + i);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: selectedYear,
    type: "petty_cash",
    nominal: "",
    note: "",
  });

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    fetchData();
  }, [state, selectedYear]);

  const fetchData = () => {
    setIsLoading(true);
    getOpeningBalances(selectedYear)
      .then((res) => setData(res?.data?.data || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    setFormData((prev) => ({ ...prev, year }));
  };

  const handleEdit = (item) => {
    setFormData({
      year: item.year,
      type: item.type,
      nominal: item.nominal,
      note: item.note || "",
    });
    setShowForm(true);
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Hapus Saldo Awal?",
      text: `Anda akan menghapus saldo awal ${getLabelType(item.type)} tahun ${item.year}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--red-500)",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: `Batal`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteOpeningBalance(item.year, item.type)
          .then((res) => {
            Swal.fire({ title: "Berhasil!", text: res?.data?.message, icon: "success", timer: 1500, showConfirmButton: false });
            fetchData();
          })
          .catch((err) => {
            Swal.fire("Error", err?.response?.data?.message || "Gagal menghapus data", "error");
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      year: Number(formData.year),
      nominal: Number(formData.nominal),
    };

    upsertOpeningBalance(payload)
      .then((res) => {
        Swal.fire({ title: "Berhasil!", text: res?.data?.message, icon: "success", timer: 1500, showConfirmButton: false });
        setShowForm(false);
        if (payload.year !== selectedYear) {
          setSelectedYear(payload.year);
        } else {
          fetchData();
        }
      })
      .catch((err) => {
        Swal.fire("Error", err?.response?.data?.message || "Gagal menyimpan data", "error");
      })
      .finally(() => setIsLoading(false));
  };

  const getLabelType = (typeStr) => {
    if (typeStr === "petty_cash") return "Petty Cash (Tunai)";
    if (typeStr === "rekening") return "Rekening BCA (Bank)";
    return typeStr;
  };

  return (
    <div className="opening-balance-page">
      <PageHeader 
        title="Saldo Awal Tahun"
        breadcrumb={["Pengaturan", "Saldo Awal"]}
        actions={
          !showForm && (
            <Btn variant="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => {
              setFormData({ year: selectedYear, type: "petty_cash", nominal: "", note: "" });
              setShowForm(true);
            }}>
              Set Saldo Baru
            </Btn>
          )
        }
      />

      <FilterBar>
        <div className="d-flex align-items-center gap-2">
          <span className="filter-label">Tahun Fiskal</span>
          <select className="filter-select" value={selectedYear} onChange={handleYearChange}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </FilterBar>

      {showForm && (
        <div className="rt-card p-4 mb-4" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--gray-900)' }}>Konfigurasi Saldo Awal</h3>
            <Btn variant="ghost" icon={<FontAwesomeIcon icon={faXmark} />} onClick={() => setShowForm(false)} />
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div className="row g-4">
              <div className="col-md-3">
                <label className="form-label font-bold small text-muted text-uppercase mb-2">Tahun</label>
                <select className="form-control-rt w-100" name="year" value={formData.year} onChange={handleFormChange} required style={{ appearance: 'auto' }}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label font-bold small text-muted text-uppercase mb-2">Tujuan Kas</label>
                <select className="form-control-rt w-100" name="type" value={formData.type} onChange={handleFormChange} required style={{ appearance: 'auto' }}>
                  <option value="petty_cash">Petty Cash (Tunai)</option>
                  <option value="rekening">Rekening BCA (Bank)</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label font-bold small text-muted text-uppercase mb-2">Nominal Saldo</label>
                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ps-3 font-bold text-muted small">Rp</span>
                  <input type="number" className="form-control-rt w-100 ps-5 font-bold" name="nominal" value={formData.nominal} onChange={handleFormChange} required />
                </div>
                {formData.nominal && <div className="mt-1 text-blue-600 font-bold small">{FormatCurrency(formData.nominal)}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label font-bold small text-muted text-uppercase mb-2">Catatan</label>
                <input type="text" className="form-control-rt w-100" name="note" value={formData.note} onChange={handleFormChange} placeholder="Memo singkat..." />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4 pt-2">
              <Btn variant="primary" type="submit" loading={isLoading} icon={<FontAwesomeIcon icon={faCheck} />}>Simpan Saldo</Btn>
              <Btn variant="outline" onClick={() => setShowForm(false)}>Batal</Btn>
            </div>
          </form>
        </div>
      )}

      <TableCard title={`Data Saldo Awal — Tahun ${selectedYear}`} subtitle="Saldo yang menjadi dasar perhitungan laporan kas bulanan">
        <div className="table-responsive">
          <table className="table table-hover mt-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: '200px' }}>Tujuan Kas</th>
                <th className="text-end" style={{ width: '180px' }}>Nominal</th>
                <th>Keterangan</th>
                <th>Terakhir Update</th>
                <th className="text-center" style={{ width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-5 text-muted">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-muted">Belum ada saldo awal tahun {selectedYear} yang dikonfigurasi.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                         <div className="p-2 bg-gray-50 rounded" style={{ color: item.type === 'petty_cash' ? 'var(--blue-600)' : 'var(--blue-600)' }}>
                            <FontAwesomeIcon icon={item.type === 'petty_cash' ? faWallet : faBuildingColumns} />
                         </div>
                         <div className="cell-main">{getLabelType(item.type)}</div>
                      </div>
                    </td>
                    <td className="text-end font-bold amount" style={{ fontSize: '15px' }}>{FormatCurrency(item.nominal)}</td>
                    <td><div className="small text-muted">{item.note || "-"}</div></td>
                    <td><div className="small text-muted">{new Date(item.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div></td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => handleEdit(item)} title="Edit" />
                        <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => handleDelete(item)} className="text-danger" title="Hapus" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableCard>

      {!showForm && data.length < 2 && (
        <div className="alert bg-blue-50 border-blue-100 p-4 mt-4" style={{ borderRadius: 'var(--radius-lg)' }}>
           <h5 className="font-bold text-blue-600 mb-2 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faNoteSticky} /> Informasi Saldo Awal
           </h5>
           <p className="small text-blue-600 mb-0">
             Saldo awal tahun sangat krusial untuk laporan Neraca. Pastikan Anda mencatat saldo awal baik untuk <b>Petty Cash (Tunai)</b> maupun <b>Rekening Bank</b> agar sisa saldo bulan Januari terhitung secara akurat.
           </p>
        </div>
      )}
    </div>
  );
}

export default OpeningBalance;

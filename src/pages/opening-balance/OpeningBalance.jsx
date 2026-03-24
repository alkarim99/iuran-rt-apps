import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FormatCurrency from "../../helpers/FormatCurrency";

import {
  getOpeningBalances,
  upsertOpeningBalance,
  deleteOpeningBalance,
} from "../../services/OpeningBalanceService";

function OpeningBalance() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [isLoading, setIsLoading] = useState(false);

  // Table Data State
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Years Dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 2 },
    (_, i) => 2020 + i,
  );

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: selectedYear,
    type: "petty_cash",
    nominal: "",
    note: "",
  });

  // Reference for formatted view
  const nominalViewRef = useRef(null);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
      return;
    }
    fetchData();
  }, [selectedYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    setIsLoading(true);
    getOpeningBalances(selectedYear)
      .then((res) => {
        setData(res?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
    setFormData((prev) => ({ ...prev, year: Number(e.target.value) }));
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
      confirmButtonText: "Ya, hapus",
      cancelButtonText: `Batal`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteOpeningBalance(item.year, item.type)
          .then((res) => {
            Swal.fire({
              title: "Dihapus!",
              text: res?.data?.message,
              icon: "success",
            }).then(() => fetchData());
          })
          .catch((err) => {
            Swal.fire(
              "Error",
              err?.response?.data?.message || "Gagal menghapus data",
              "error",
            );
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

    // Convert generic form string directly to payload
    const payload = {
      ...formData,
      year: Number(formData.year),
      nominal: Number(formData.nominal),
    };

    upsertOpeningBalance(payload)
      .then((res) => {
        Swal.fire({
          title: "Berhasil!",
          text: res?.data?.message,
          icon: "success",
        }).then(() => {
          setShowForm(false);
          // If the year changes due to edit, change table year to match
          if (payload.year !== selectedYear) {
            setSelectedYear(payload.year);
          } else {
            fetchData();
          }
        });
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Gagal menyimpan data",
          "error",
        );
      })
      .finally(() => setIsLoading(false));
  };

  const formatRupiahPreview = (val) => {
    if (!val) return "Rp 0,00";
    return FormatCurrency(Number(val));
  };

  const getLabelType = (typeStr) => {
    if (typeStr === "petty_cash") return "Petty Cash (Bu Agus)";
    if (typeStr === "rekening") return "Rekening BCA (Bu Harris)";
    return typeStr;
  };

  return (
    <>
      <div className="container d-flex p-3 mx-auto flex-column">
        <Navbar />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Saldo Awal Tahun</h1>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setFormData({
                  year: selectedYear,
                  type: "petty_cash",
                  nominal: "",
                  note: "",
                });
                setShowForm(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Tambah Saldo Awal
            </button>
          )}
        </div>

        {showForm ? (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tahun</label>
                    <select
                      className="form-select"
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      required
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      Tipe Rekening Kas
                    </label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="petty_cash">Petty Cash (Bu Agus)</option>
                      <option value="rekening">Rekening BCA (Bu Harris)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Nominal (Rp)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="nominal"
                      value={formData.nominal}
                      onChange={handleFormChange}
                      required
                      placeholder="Contoh: 15000000"
                    />
                    <small className="form-text text-primary fw-bold mt-1 d-block">
                      {formatRupiahPreview(formData.nominal)}
                    </small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      Keterangan (Opsional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="note"
                      value={formData.note}
                      onChange={handleFormChange}
                      placeholder="Masukkan catatan jika ada..."
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faSave} /> Simpan
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="card shadow-sm mb-4">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <label className="form-label fw-bold mb-0">
                      Lihat Tahun:
                    </label>
                  </div>
                  <div className="col-auto">
                    <select
                      className="form-select form-select-sm"
                      value={selectedYear}
                      onChange={handleYearChange}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tujuan Kas</th>
                    <th>Nominal</th>
                    <th>Terakhir Update</th>
                    <th>Keterangan</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Memuat data...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Belum ada data saldo awal di tahun {selectedYear}.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item._id}>
                        <td>{getLabelType(item.type)}</td>
                        <td className="fw-bold">
                          {FormatCurrency(item.nominal)}
                        </td>
                        <td>
                          {new Date(item.updated_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </td>
                        <td>{item.note || "-"}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item)}
                            title="Hapus"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
}

export default OpeningBalance;

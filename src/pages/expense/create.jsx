import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartPlus, faCoins, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { createExpense } from "../../services/ExpenseService";
import FormatCurrency from "../../helpers/FormatCurrency";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function CreateExpense() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Catat Pengeluaran - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
  }, [state, navigate]);

  const [transactionAt, setTransactionAt] = useState("");
  const [nominal, setNominal] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { transaction_at: transactionAt, nominal, description, payment_method: paymentMethod };
    
    createExpense(payload)
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          html: `Pengeluaran <b>${FormatCurrency(nominal)}</b> telah dicatat.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lihat Neraca",
          cancelButtonText: "Tutup",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/report/neraca");
          } else {
            navigate("/expense");
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="expense-create-page">
      <PageHeader 
        title="Catat Pengeluaran"
        breadcrumb={["Transaksi", "Tambah Pengeluaran"]}
      />

      <div className="row">
        <div className="col-md-6">
          <div className="rt-card p-4" style={{ background: 'var(--surface)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)' }}>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label htmlFor="transaction_at" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  className="form-control-rt w-100"
                  id="transaction_at"
                  value={transactionAt}
                  onChange={(e) => setTransactionAt(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="nominal" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Nominal Pengeluaran
                </label>
                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ps-3 font-bold text-muted">Rp</span>
                  <input
                    type="number"
                    className="form-control-rt w-100 ps-5 font-bold"
                    style={{ fontSize: '18px' }}
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    required
                  />
                </div>
                {nominal && (
                  <div className="mt-1 text-expense font-bold small">{FormatCurrency(nominal)}</div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Keterangan / Deskripsi
                </label>
                <textarea
                  className="form-control-rt w-100"
                  id="description"
                  rows="3"
                  placeholder="Contoh: Pembelian Sapu, Perbaikan Lampu, dll"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="payment_method" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Sumber Dana
                </label>
                <select
                  className="form-control-rt w-100"
                  id="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  style={{ appearance: 'auto' }}
                >
                  <option value="cash">Cash / Petty Cash</option>
                  <option value="transfer">Transfer / Kas Rekening</option>
                </select>
              </div>

              <div className="d-flex gap-2 pt-2">
                <Btn
                  variant="primary"
                  type="submit"
                  loading={isLoading}
                  icon={<FontAwesomeIcon icon={faCartPlus} />}
                >
                  Simpan Pengeluaran
                </Btn>
                <Btn
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/expense")}
                >
                  Batal
                </Btn>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-5 offset-md-1 d-none d-md-block">
          <div className="alert bg-blue-50 border-blue-100 p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h5 className="font-bold text-blue-600 mb-2">💡 Tips</h5>
            <p className="small text-blue-600 mb-0">
              Pastikan Anda mencatat pengeluaran segera setelah transaksi terjadi untuk menjaga akurasi laporan kas bulanan. Pilih sumber dana yang sesuai agar saldo Petty Cash atau Kas Rekening tetap sinkron.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateExpense;

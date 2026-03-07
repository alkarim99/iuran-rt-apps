import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FormatCurrency from "../../helpers/FormatCurrency";

import { createExpense } from "../../services/ExpenseService";

function CreateExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const state = useSelector((reducer) => reducer.auth);

  const [transactionAt, setTransactionAt] = useState("");
  const [nominal, setNominal] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }
  }, [state]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      transaction_at: transactionAt,
      nominal: nominal,
      description: description,
      payment_method: paymentMethod,
    };
    createExpense(payload)
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          html: `Pengeluaran <b>${FormatCurrency(nominal)}</b> berhasil dicatat.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lihat Neraca Kas",
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
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />

        <div className="mb-3">
          <Link className="btn btn-primary me-1" to="/expense">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>

        <h1>Add Data Pengeluaran</h1>

        <div className="row">
          <div className="col-6">
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label for="transaction_at" className="form-label">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="transaction_at"
                  value={transactionAt}
                  onChange={(e) => setTransactionAt(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="nominal" className="form-label">
                  Nominal
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  id="nominal"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  required
                />
                {nominal && (
                  <small className="text-muted">
                    {FormatCurrency(nominal)}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label for="description" className="form-label">
                  Deskripsi
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="payment_method" className="form-label">
                  Metode Pembayaran
                </label>
                <select
                  className="form-select"
                  id="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="cash">Cash / Petty Cash</option>
                  <option value="transfer">Transfer / Kas Rekening</option>
                </select>
              </div>
              <button className="btn btn-primary py-2" type="submit">
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default CreateExpense;

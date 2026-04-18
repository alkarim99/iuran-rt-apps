import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FormatCurrency from "../../helpers/FormatCurrency";

import {
  getOtherIncomeByID,
  updateOtherIncome,
} from "../../services/OtherIncomeService";

function EditOtherIncome() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Ubah Data Pemasukan Lainnya - Iuran RT";
  }, []);

  const location = useLocation();
  const id = location?.pathname?.split("/")[3];

  const [transactionAt, setTransactionAt] = useState(0);
  const [nominal, setNominal] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGet();
  }, [state]);

  const handleGet = async () => {
    getOtherIncomeByID(id)
      .then((response) => {
        setTransactionAt(response?.data?.data?.transaction_at);
        setNominal(response?.data?.data?.nominal);
        setDescription(response?.data?.data?.description);
        setPaymentMethod(response?.data?.data?.payment_method || "cash");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      id: id,
      transaction_at: transactionAt,
      nominal: nominal,
      description: description,
      payment_method: paymentMethod,
    };
    updateOtherIncome(payload)
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          html: `Pemasukan Lainnya <b>${FormatCurrency(nominal)}</b> berhasil diperbarui.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Lihat Neraca Kas",
          cancelButtonText: "Tutup",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/report/neraca");
          } else {
            navigate("/other-income");
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
          <Link className="btn btn-primary me-1" to="/other-income">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>

        <h1>Update Data Pemasukan Lainnya</h1>

        <div className="row">
          <div className="col-6">
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label for="transaction_at" className="form-label">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="transaction_at"
                  value={
                    transactionAt
                      ? new Date(transactionAt).toISOString().split("T")[0]
                      : ""
                  }
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
                  value={nominal || ""}
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
                  onChange={(e) => setDescription(e.target.value)}
                  value={description || ""}
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

export default EditOtherIncome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createWarga } from "../../services/WargaService";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function CreateWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Tambah Warga - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
  }, [state, navigate]);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { name, address };

    createWarga(payload)
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          text: response?.data?.message || "Data warga berhasil ditambahkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/warga");
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text:
            error?.response?.data?.message ??
            "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="warga-create-page">
      <PageHeader
        title="Tambah Warga Baru"
        breadcrumb={["Data Master", "Warga", "Tambah Baru"]}
      />

      <div className="row">
        <div className="col-md-6">
          <div
            className="rt-card p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="form-label font-bold small text-muted text-uppercase mb-2"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="form-control-rt w-100"
                  id="name"
                  placeholder="Masukkan nama sesuai KTP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="form-label font-bold small text-muted text-uppercase mb-2"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Alamat Rumah
                </label>
                <textarea
                  className="form-control-rt w-100"
                  id="address"
                  rows="3"
                  placeholder="Contoh: K1-10"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2 pt-2">
                <Btn
                  variant="primary"
                  type="submit"
                  loading={isLoading}
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                >
                  Simpan Data
                </Btn>
                <Btn
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/warga")}
                >
                  Batal
                </Btn>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-5 offset-md-1 d-none d-md-block">
          <div
            className="alert bg-blue-50 border-blue-100 p-4"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <h5 className="font-bold text-blue-600 mb-2">💡 Tips Pengisian</h5>
            <ul className="small text-blue-600 mb-0 ps-3">
              <li className="mb-2">
                Pastikan penulisan sesuai dengan identitas.
              </li>
              <li>
                Data ini akan muncul di daftar iuran bulanan secara otomatis.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWarga;

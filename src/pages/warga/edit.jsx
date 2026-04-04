import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { getWargaByID, updateWarga } from "../../services/WargaService";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function EditWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const location = useLocation();
  const id = location?.pathname?.split("/")[3];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Ubah Data Warga - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGet();
  }, [state, navigate, id]);

  const handleGet = () => {
    setIsLoading(true);
    getWargaByID(id)
      .then((response) => {
        setName(response?.data?.data?.name);
        setAddress(response?.data?.data?.address);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { id, name, address };

    updateWarga(payload)
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          text: response?.data?.message || "Data warga telah diperbarui.",
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
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="warga-edit-page">
      <PageHeader
        title="Ubah Profil Warga"
        breadcrumb={["Data Master", "Warga", name || "Edit Profil"]}
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
            <form onSubmit={handleEdit}>
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
                  icon={<FontAwesomeIcon icon={faPen} />}
                >
                  Simpan Perubahan
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
            <h5 className="font-bold text-blue-600 mb-2">💡 Tips</h5>
            <p className="small text-blue-600 mb-0">
              Perubahan pada nama atau alamat akan langsung terupdate di seluruh
              laporan riwayat transaksi iuran warga yang bersangkutan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditWarga;

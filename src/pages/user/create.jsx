import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { createUser } from "../../services/UserService";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function CreateUser() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Tambah Pengurus - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
  }, [state, navigate]);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    createUser({ name, email, password, role })
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          text: response?.data?.message || "User baru telah ditambahkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate("/user");
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
    <div className="user-create-page">
      <PageHeader 
        title="Tambah Pengurus Baru"
        breadcrumb={["Sistem", "Data User", "Tambah"]}
      />

      <div className="row">
        <div className="col-md-6">
          <div className="rt-card p-4" style={{ background: 'var(--surface)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)' }}>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="form-control-rt w-100"
                  id="name"
                  placeholder="Masukkan nama pengurus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Alamat Email (Login)
                </label>
                <input
                  type="email"
                  className="form-control-rt w-100"
                  id="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  className="form-control-rt w-100"
                  id="password"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Hak Akses / Peran
                </label>
                <select
                  id="role"
                  className="form-control-rt w-100"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{ appearance: 'auto' }}
                >
                  <option value="" disabled>Pilih Role User</option>
                  <option value="admin">Admin (Akses Penuh)</option>
                  <option value="user">User (Operator)</option>
                </select>
              </div>

              <div className="d-flex gap-2 pt-2">
                <Btn
                  variant="primary"
                  type="submit"
                  loading={isLoading}
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                >
                  Simpan User
                </Btn>
                <Btn
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/user")}
                >
                  Batal
                </Btn>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-5 offset-md-1 d-none d-md-block">
          <div className="alert bg-blue-50 border-blue-100 p-4" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h5 className="font-bold text-blue-600 mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faShieldHalved} />
              Keamanan Akun
            </h5>
            <div className="small text-blue-600">
              <p className="mb-3">Harap berikan akses <b>Admin</b> hanya kepada pengurus inti (Ketua/Sekretaris/Bendahara Utama) karena memiliki wewenang untuk mengubah data master dan menghapus transaksi.</p>
              <p className="mb-0">Pastikan email yang didaftarkan aktif guna keperluan pemulihan akun di masa mendatang.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;

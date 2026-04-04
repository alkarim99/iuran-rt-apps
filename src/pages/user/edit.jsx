import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faShieldHalved, faKey } from "@fortawesome/free-solid-svg-icons";
import { getUserByID, editUser } from "../../services/UserService";

import PageHeader from "../../components/ui/PageHeader";
import Btn from "../../components/ui/Btn";

function EditUser() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const location = useLocation();
  const id = location?.pathname?.split("/")[3];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Ubah Pengurus - Iuran RT";
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGet();
  }, [state, navigate, id]);

  const handleGet = () => {
    setIsLoading(true);
    getUserByID(id)
      .then((data) => {
        if (data) {
          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Gagal memuat data user.",
          icon: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { id, name, email, role };
    if (password !== "") {
      payload.password = password;
    }
    
    editUser(payload)
      .then((response) => {
        Swal.fire({
          title: "Berhasil!",
          text: response?.data?.message || "Data user telah diperbarui.",
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
    <div className="user-edit-page">
      <PageHeader 
        title="Ubah Profil Pengurus"
        breadcrumb={["Sistem", "Data User", name || "Edit"]}
      />

      <div className="row">
        <div className="col-md-6">
          <div className="rt-card p-4" style={{ background: 'var(--surface)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)' }}>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="form-control-rt w-100"
                  id="name"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label font-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                  Ubah Kata Sandi
                </label>
                <div className="position-relative">
                   <input
                    type="password"
                    className="form-control-rt w-100"
                    id="password"
                    placeholder="Kosongkan jika tidak ingin diubah"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="mt-1 small text-muted d-flex align-items-center gap-1">
                    <FontAwesomeIcon icon={faKey} style={{ fontSize: '10px' }} /> Biarkan kosong jika password tetap sama
                  </div>
                </div>
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
                  icon={<FontAwesomeIcon icon={faPen} />}
                >
                  Simpan Perubahan
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
              Update Informasi
            </h5>
            <div className="small text-blue-600">
              <p className="mb-3">Update profil pengurus dilakukan untuk memastikan kontak dan hak akses tetap relevan dengan struktur pengurus RT saat ini.</p>
              <p className="mb-0">Jika pengurus tersebut sudah tidak bertugas, disarankan untuk menghapus akunnya melalui halaman daftar user demi keamanan data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;

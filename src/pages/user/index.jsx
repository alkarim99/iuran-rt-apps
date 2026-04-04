import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPen, 
  faPlus, 
  faTrash, 
  faUserShield, 
  faUserGroup 
} from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../../hooks/useUsers";

import PageHeader from "../../components/ui/PageHeader";
import TableCard from "../../components/ui/TableCard";
import Btn from "../../components/ui/Btn";
import StatusBadge from "../../components/ui/StatusBadge";

function IndexUser() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Manajemen Pengurus - Iuran RT";
  }, []);

  const { dataUser, isLoading, handleDelete } = useUsers();
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      setSortField(field);
      setSortOrder(1);
    }
  };

  const displayData = [...dataUser].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String(a[sortField] || "").toLowerCase();
    const bVal = String(b[sortField] || "").toLowerCase();
    if (aVal < bVal) return -1 * sortOrder;
    if (aVal > bVal) return 1 * sortOrder;
    return 0;
  });

  return (
    <div className="user-index-page">
      <PageHeader 
        title="Manajemen Pengurus"
        breadcrumb={["Sistem", "Data User"]}
        actions={
          <Btn variant="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => navigate("/user/create")}>
            Tambah User
          </Btn>
        }
      />

      <div className="row">
        <div className="col-lg-9">
          <TableCard title="Daftar Pengguna Sistem" subtitle="Kelola hak akses bendahara dan pengurus RT">
            <div className="table-responsive">
              <table className="table table-hover mt-0 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">#</th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
                      Nama Lengkap {sortField === "name" && (sortOrder === 1 ? "↑" : "↓")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>
                      Email {sortField === "email" && (sortOrder === 1 ? "↑" : "↓")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("role")}>
                      Hak Akses {sortField === "role" && (sortOrder === 1 ? "↑" : "↓")}
                    </th>
                    <th style={{ width: '120px' }} className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">Memuat data...</td></tr>
                  ) : dataUser.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">Tidak ada data user.</td></tr>
                  ) : (
                    displayData.map((user, index) => (
                      <tr key={user?._id}>
                        <td className="text-center text-muted small">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                             <div className="avatar-sm bg-gray-100 flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold', color: 'var(--gray-600)' }}>
                                {user?.name?.substring(0, 1).toUpperCase()}
                             </div>
                             <div className="cell-main">{user?.name}</div>
                          </div>
                        </td>
                        <td><div className="cell-sub">{user?.email}</div></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                             <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUserGroup} className={`small ${user?.role === 'admin' ? 'text-blue-500' : 'text-gray-400'}`} />
                             <span className="text-capitalize small font-bold">{user?.role}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => navigate(`/user/edit/${user?._id}`)} title="Edit" />
                            <Btn variant="ghost" size="sm" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => handleDelete(user?._id)} className="text-danger" title="Hapus" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TableCard>
        </div>

        <div className="col-lg-3">
           <div className="alert bg-blue-50 border-blue-100 p-4" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h6 className="font-bold text-blue-600 mb-2">Informasi Peran</h6>
              <div className="small text-blue-600">
                <p className="mb-2"><b>Admin:</b> Memiliki akses penuh ke seluruh fitur termasuk pengaturan saldo awal dan manajemen user.</p>
                <p className="mb-0"><b>User:</b> Memiliki akses terbatas untuk pencatatan transaksi iuran dan pengeluaran harian.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default IndexUser;

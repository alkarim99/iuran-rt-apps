import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../../store/reducers/auth";
import { clearTableState } from "../../hooks/useTableState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faUsers,
  faWallet,
  faArrowRightFromBracket,
  faChevronDown,
  faChevronRight,
  faCircleArrowDown,
  faCircleArrowUp,
  faScaleBalanced,
  faUserGear,
  faReceipt,
  faSackDollar,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  const [expandedMenus, setExpandedMenus] = useState({
    pemasukan:
      location.pathname.includes("/iuran") ||
      location.pathname.includes("/income") ||
      location.pathname.includes("/other-income"),
    laporan: location.pathname.includes("/report"),
  });

  const toggleMenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (path) => location.pathname === path;
  const isChildActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    Swal.fire({
      title: "Sign Out?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--red-500)",
      cancelButtonColor: "var(--gray-400)",
      confirmButtonText: "Yes, Sign Out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        dispatch(addAuth({ auth: false, userData: {}, token: "" }));
        navigate("/sign-in");
      }
    });
  };

  const NavItem = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      className={`nav-item ${isActive(to) ? "active" : ""}`}
      onClick={() => {
        if (onClick) onClick();
        if (window.innerWidth <= 768) toggleSidebar(false);
      }}
    >
      <FontAwesomeIcon icon={icon} className="nav-icon" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">🏘</div>
        <div className="logo-text">
          <div className="logo-title">Iuran RT</div>
          <div className="logo-subtitle">RT 08 / RW 11</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Utama</div>
        <NavItem
          to="/dashboard"
          icon={faTableColumns}
          label="Dashboard"
          onClick={clearTableState}
        />
        <NavItem
          to="/warga"
          icon={faUsers}
          label="Data Warga"
          onClick={clearTableState}
        />

        <div className="nav-section-label">Keuangan</div>

        {/* Pemasukan Group */}
        <div
          className={`nav-group ${expandedMenus.pemasukan ? "expanded" : ""}`}
        >
          <div
            className="nav-item group-header"
            onClick={() => toggleMenu("pemasukan")}
          >
            <FontAwesomeIcon icon={faCircleArrowDown} className="nav-icon" />
            <span>Pemasukan</span>
            <FontAwesomeIcon
              icon={expandedMenus.pemasukan ? faChevronDown : faChevronRight}
              className="ms-auto me-0"
              size="xs"
            />
          </div>
          <div className="nav-children">
            <Link
              to="/income/create"
              className={`nav-child ${isActive("/income/create") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Catat Pemasukan
            </Link>
            <Link
              to="/iuran"
              className={`nav-child ${isActive("/iuran") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Data Iuran Warga
            </Link>
            <Link
              to="/iuran/rincian"
              className={`nav-child ${isActive("/iuran/rincian") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Rincian Iuran
            </Link>
            <Link
              to="/iuran/total"
              className={`nav-child ${isActive("/iuran/total") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Kalkulasi Total
            </Link>
            <Link
              to="/other-income"
              className={`nav-child ${isActive("/other-income") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Pemasukan Lainnya
            </Link>
          </div>
        </div>

        <NavItem
          to="/expense"
          icon={faCircleArrowUp}
          label="Pengeluaran"
          onClick={clearTableState}
        />
        <NavItem
          to="/opening-balance"
          icon={faWallet}
          label="Saldo Awal"
          onClick={clearTableState}
        />

        <div className="nav-section-label">Laporan</div>

        {/* Laporan Group */}
        <div className={`nav-group ${expandedMenus.laporan ? "expanded" : ""}`}>
          <div
            className="nav-item group-header"
            onClick={() => toggleMenu("laporan")}
          >
            <FontAwesomeIcon icon={faSackDollar} className="nav-icon" />
            <span>Laporan</span>
            <FontAwesomeIcon
              icon={expandedMenus.laporan ? faChevronDown : faChevronRight}
              className="ms-auto me-0"
              size="xs"
            />
          </div>
          <div className="nav-children">
            <Link
              to="/report/cash"
              className={`nav-child ${isActive("/report/cash") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Petty Cash (Bu Agus)
            </Link>
            <Link
              to="/report/transfer"
              className={`nav-child ${isActive("/report/transfer") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Kas Rekening (Bu Harris)
            </Link>
            <Link
              to="/report/neraca"
              className={`nav-child ${isActive("/report/neraca") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Neraca Kas RT
            </Link>
            <Link
              to="/report/pricing-tier"
              className={`nav-child ${isActive("/report/pricing-tier") ? "active" : ""}`}
              onClick={clearTableState}
            >
              Pricing Tier
            </Link>
          </div>
        </div>

        <div className="nav-section-label">Sistem</div>
        <NavItem
          to="/user"
          icon={faUserGear}
          label="Data User"
          onClick={clearTableState}
        />
      </nav>

      <div className="sidebar-footer" onClick={handleLogout}>
        <div className="user-avatar">
          {state?.userData?.name?.substring(0, 2).toUpperCase() || "U"}
        </div>
        <div className="user-info">
          <div className="user-name">{state?.userData?.name || "User"}</div>
          <div className="user-role">{state?.userData?.role || state?.userData?.position || 'Pengurus'}</div>
        </div>
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="logout-icon"
        />
      </div>
    </aside>
  );
};

export default Sidebar;

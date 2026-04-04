import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../store/reducers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clearTableState } from "../hooks/useTableState";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faWallet,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent mb-4 shadow-sm rounded-bottom border-bottom">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          <FontAwesomeIcon icon={faWallet} className="me-2 text-dark" />
          Iuran RT App{" "}
          <span className="badge bg-primary text-light ms-1">
            {process.env.REACT_APP_ENV?.toUpperCase()}
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {state?.auth && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark fw-bold ${isActive("/user")}`}
                    to="/user"
                    onClick={clearTableState}
                  >
                    User
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark fw-bold ${isActive("/warga")}`}
                    to="/warga"
                    onClick={clearTableState}
                  >
                    Warga
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark fw-bold ${isActive("/expense")}`}
                    to="/expense"
                    onClick={clearTableState}
                  >
                    Pengeluaran
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark fw-bold ${isActive("/opening-balance")}`}
                    to="/opening-balance"
                    onClick={clearTableState}
                  >
                    Saldo Awal
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle text-dark fw-bold ${
                      isActive("/income") ||
                      isActive("/iuran") ||
                      isActive("/other-income")
                        ? "active"
                        : ""
                    }`}
                    href="#"
                    id="iuranDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Pemasukan
                  </a>
                  <ul
                    className="dropdown-menu shadow"
                    aria-labelledby="iuranDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item fw-bold text-primary"
                        to="/income/create"
                        onClick={clearTableState}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="me-2 text-primary"
                        />
                        Catat Pemasukan
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/iuran"
                        onClick={clearTableState}
                      >
                        Data Iuran Warga
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/iuran/rincian"
                        onClick={clearTableState}
                      >
                        Rincian Iuran Warga
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/iuran/total"
                        onClick={clearTableState}
                      >
                        Kalkulasi Iuran Total
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/other-income"
                        onClick={clearTableState}
                      >
                        Data Pemasukan Lainnya
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle text-dark fw-bold ${isActive("/report") ? "active" : ""}`}
                    href="#"
                    id="laporanDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Laporan
                  </a>
                  <ul
                    className="dropdown-menu shadow"
                    aria-labelledby="laporanDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/report/cash"
                        onClick={clearTableState}
                      >
                        Laporan Petty Cash
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/report/transfer"
                        onClick={clearTableState}
                      >
                        Laporan Kas Rekening
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/report/neraca"
                        onClick={clearTableState}
                      >
                        Neraca Kas RT
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/report/pricing-tier"
                        onClick={clearTableState}
                      >
                        Laporan Pricing Tier
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {state?.auth ? (
              <button
                className="btn btn-outline-dark btn-sm fw-bold"
                onClick={() => {
                  localStorage.clear();
                  dispatch(addAuth({ auth: false, userData: {}, token: "" }));
                  navigate("/");
                }}
              >
                Sign Out{" "}
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="ms-1"
                />
              </button>
            ) : (
              <Link
                className="btn btn-dark btn-sm fw-bold text-light"
                to="/sign-in"
              >
                Sign In{" "}
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="ms-1"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

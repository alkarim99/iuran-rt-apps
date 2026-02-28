import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TableFooter from "../../components/TableFooter";
import { getWargaByID } from "../../services/WargaService";
import {
  getPaymentByWargaId,
  getPaymentReport,
  deletePayment,
} from "../../services/IuranService";

function DetailWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const location = useLocation();
  const id = location?.pathname?.split("/")[2];

  const [dataWarga, setDataWarga] = useState({});
  const [dataIuran, setDataIuran] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState("created_at");
  const [pageIuran, setPageIuran] = useState(1);
  const [limitIuran, setLimitIuran] = useState(10);

  const [pageReport, setPageReport] = useState(1);
  const [limitReport, setLimitReport] = useState(10);

  // Calcluate paginated data
  const paginatedIuran = dataIuran.slice(
    (pageIuran - 1) * limitIuran,
    pageIuran * limitIuran,
  );

  const paginatedReport = dataIuran.slice(
    (pageReport - 1) * limitReport,
    pageReport * limitReport,
  );

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleGet();
    handleGetPayment(sortBy);
  }, [state]);

  const handleGet = () => {
    setIsLoading(true);
    getWargaByID(id)
      .then((response) => {
        setDataWarga(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetPayment = (currentSortBy = sortBy) => {
    setIsLoading(true); // Set loading true for payment fetch
    getPaymentByWargaId({ id, sortBy: currentSortBy })
      .then((response) => {
        setDataIuran(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading false after payment fetch
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setIsLoading(true);
        deletePayment(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              handleGet();
              handleGetPayment();
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ?? "Something wrong in our App!",
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (result.isDenied) {
        Swal.fire("Payment are not deleted", "", "info");
      }
    });
  };

  const handleSearch = () => {
    setIsLoading(true);
    getPaymentByWargaId({ id, sortBy })
      .then((response) => {
        setDataIuran(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    setIsLoading(true);
    setSortBy("created_at"); // Reset sortBy to default
    handleGet();
    handleGetPayment("created_at"); // Pass default sortBy
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
      <>
        <div
          className="container d-flex p-3 mx-auto flex-column"
          style={{ height: "100vh" }}
        >
          <Navbar />

          <div className="mb-3">
            <Link className="btn btn-primary" to="/warga">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          <div className="mb-3">
            <h3>
              Detail Warga
              <Link
                className="btn btn-warning mx-1 no-print"
                to={`/warga/edit/${id}`}
              >
                <FontAwesomeIcon icon={faPen} />
              </Link>
            </h3>

            <div className="print-header">
              <h2>Detail Iuran Warga</h2>
              <p>
                {dataWarga?.name} — {dataWarga?.address}
              </p>
            </div>
            <div className="row">
              <div className="col-2">Name</div>
              <div className="col">: {dataWarga?.name}</div>
            </div>
            <div className="row">
              <div className="col-2">Address</div>
              <div className="col">: {dataWarga?.address}</div>
            </div>
          </div>

          <h3>
            Data Iuran
            <Link
              className="btn btn-primary ms-1"
              to={`/iuran/create/warga/${dataWarga?._id}`}
              state={{ from: location.pathname + location.search }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </h3>

          <div className="my-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row d-flex align-items-end">
                <div className="col-3">
                  <label htmlFor="sort_by" className="form-label">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort_by"
                    className="form-select"
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy} // Controlled component
                  >
                    <option value="created_at">Pencatatan Terbaru</option>
                    <option value="pay_at">Pembayaran Terbaru</option>
                  </select>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-primary py-2 me-2"
                    type="submit"
                    onClick={handleSearch}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                  <button
                    className="btn btn-primary py-2"
                    type="button"
                    onClick={handleReset}
                  >
                    {isLoading ? "Loading..." : "Reset"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tanggal Input</th>
                <th scope="col">Tanggal Bayar</th>
                <th scope="col">Periode</th>
                <th scope="col">Nominal</th>
                <th scope="col">Metode Pembayaran</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIuran.map((iuran, index) => {
                const globalIndex = (pageIuran - 1) * limitIuran + index + 1;
                return (
                  <tr key={iuran?._id || index}>
                    <th scope="row">{globalIndex}</th>
                    <td>{FormatDate(iuran?.created_at)}</td>
                    <td>{FormatDate(iuran?.pay_at)}</td>
                    <td>
                      {FormatDate(iuran?.period_start)} -{" "}
                      {FormatDate(iuran?.period_end)}
                    </td>
                    <td>{FormatCurrency(iuran?.nominal)}</td>
                    <td>{iuran?.payment_method?.toUpperCase()}</td>
                    <td>
                      <Link
                        className="btn btn-warning me-1"
                        to={`/iuran/edit/${iuran?._id}`}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Link>
                      <Link
                        className="btn btn-danger mx-1"
                        onClick={() => {
                          handleDelete(iuran?._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {paginatedIuran.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data iuran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <TableFooter
            currentPage={pageIuran}
            totalPages={Math.ceil(dataIuran.length / limitIuran)}
            totalCount={dataIuran.length}
            itemsPerPage={limitIuran}
            onPageChange={setPageIuran}
            onLimitChange={(newLimit) => {
              setLimitIuran(newLimit);
              setPageIuran(1);
            }}
          />

          <h3 className="mt-4">Data Rincian Iuran</h3>
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-light">
              <tr>
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col" className="text-center">
                  Tanggal Bayar
                </th>
                <th scope="col" className="text-end">
                  Nominal
                </th>
                <th scope="col" className="text-center">
                  Jml Bulan
                </th>
                <th scope="col" className="text-end">
                  RT
                </th>
                <th scope="col" className="text-end">
                  PKK
                </th>
                <th scope="col" className="text-end">
                  Sosial
                </th>
                <th scope="col" className="text-end">
                  Kematian
                </th>
                <th scope="col">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReport.map((iuran, index) => {
                const globalIndex = (pageReport - 1) * limitReport + index + 1;
                return (
                  <tr key={iuran?._id || index}>
                    <td className="text-center">{globalIndex}</td>
                    <td className="text-center">
                      {FormatDate(iuran?.pay_at).split(" ")[0]}
                    </td>
                    <td className="text-end fw-bold">
                      {FormatCurrency(iuran?.nominal)}
                    </td>
                    <td className="text-center">{iuran?.number_of_period}</td>
                    <td className="text-end">
                      {FormatCurrency(iuran?.details_payment?.rt)}
                    </td>
                    <td className="text-end">
                      {FormatCurrency(iuran?.details_payment?.pkk)}
                    </td>
                    <td className="text-end">
                      {FormatCurrency(iuran?.details_payment?.sosial)}
                    </td>
                    <td className="text-end">
                      {FormatCurrency(iuran?.details_payment?.kematian)}
                    </td>
                    <td>
                      {FormatPeriod(iuran?.period_start, iuran?.period_end)}
                    </td>
                  </tr>
                );
              })}
              {paginatedReport.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    Tidak ada data rincian iuran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <TableFooter
            currentPage={pageReport}
            totalPages={Math.ceil(dataIuran.length / limitReport)}
            totalCount={dataIuran.length}
            itemsPerPage={limitReport}
            onPageChange={setPageReport}
            onLimitChange={(newLimit) => {
              setLimitReport(newLimit);
              setPageReport(1);
            }}
          />

          <Footer />
        </div>
      </>
    );
  }
}

export default DetailWarga;

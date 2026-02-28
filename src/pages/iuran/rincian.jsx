import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import FormatDate from "../../helpers/FormatDate";
import FormatCurrency from "../../helpers/FormatCurrency";
import FormatPeriod from "../../helpers/FormatPeriod";
import { exportToExcel } from "../../helpers/exportToExcel";
import {
  getRincianPayment,
  deletePayment,
  searchPaymentsRincian,
} from "../../services/IuranService";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TableFooter from "../../components/TableFooter";
import { useTableState } from "../../hooks/useTableState";

function RincianIuran() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((reducer) => reducer.auth);

  const [dataIuran, setDataIuran] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    page,
    setPage,
    limit,
    setLimit,
    keyword,
    setKeyword,
    sortBy,
    setSortBy,
    order,
    setOrder,
  } = useTableState("rincianIuran", 20, "warga.address", 1);

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const todayDate = new Date();
  const firstDate = new Date(
    todayDate.getFullYear(),
    todayDate.getUTCMonth(),
    15,
  );
  const payAtDate = firstDate.toISOString().split("T")[0];
  const [payAt, setPayAt] = useState(payAtDate);

  useEffect(() => {
    setIsLoading(true);
    if (!state.auth) {
      navigate("/sign-in");
    }
    handleSearch();
  }, [state, page, limit, sortBy, order, payAt]);

  const handleGet = () => {
    handleSearch();
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

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
      setPage(1);
    }
    setIsLoading(true);
    const payload = { keyword, sortBy, order, page, limit, payAt };
    searchPaymentsRincian(payload)
      .then((response) => {
        setDataIuran(response?.data?.data);
        setTotalPages(response?.data?.totalPages);
        setTotalCount(response?.data?.totalCount);
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
    setKeyword("");
    setSortBy("warga.address");
    setOrder(1);
    setPage(1);
    handleGet();
  };

  const handleExportExcel = async () => {
    if (totalCount === 0) {
      Swal.fire(
        "Info",
        "Tidak ada data untuk diekspor pada periode ini.",
        "info",
      );
      return;
    }
    setIsExporting(true);
    try {
      // Fetch all data bounded by totalCount
      const payload = {
        keyword,
        sortBy,
        order,
        page: 1,
        limit: totalCount,
        payAt,
      };
      const response = await searchPaymentsRincian(payload);
      const allData = response?.data?.data || [];

      const dataToExport = allData.map((iuran, index) => ({
        No: index + 1,
        Blok: iuran?.warga?.address?.split("-")[0] || "",
        Nama: iuran?.warga?.name,
        Alamat: iuran?.warga?.address,
        "Tanggal Bayar": FormatDate(iuran?.pay_at).split(" ")[0],
        Jumlah: iuran?.nominal,
        "Periode Bulan": iuran?.number_of_period,
        RT: iuran?.details_payment?.rt,
        PKK: iuran?.details_payment?.pkk,
        Sosial: iuran?.details_payment?.sosial,
        Kematian: iuran?.details_payment?.kematian,
        Keterangan: FormatPeriod(iuran?.period_start, iuran?.period_end),
      }));

      const titleMonthYear =
        `${FormatDate(payAt).split(" ")[1] || ""} ${FormatDate(payAt).split(" ")[2] || ""}`
          .trim()
          .toUpperCase();

      const prefixRows = [
        ["LAPORAN KAS BENDAHARA"],
        ["RT 08 RW 11 LINGKUNGAN PONDOK BLIMBING INDAH"],
        ["KELURAHAN PURWODADI KECAMATAN BLIMBING KOTA MALANG"],
        [],
        ["PERINCIAN PEMBAGIAN UANG IURAN"],
        [],
        [`PERIODE : ${titleMonthYear}`],
        [],
      ];

      exportToExcel(
        dataToExport,
        `Rincian_Iuran_${FormatDate(payAt).split(" ").join("_")}`,
        { prefixRows },
      );
    } catch (error) {
      console.error("Export Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal mengekspor data.",
        icon: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStartingIndex = () => {
    return (page - 1) * limit + 1;
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
          // style={{ height: "100vh" }}
        >
          <Navbar />

          <h1>
            Rincian Iuran
            <Link
              className="btn btn-primary ms-1 no-print"
              to="/iuran/create"
              state={{ from: location.pathname + location.search }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>
            <Link className="btn btn-primary ms-1 no-print" to="/iuran/total">
              Total
            </Link>
            <button
              className="btn btn-success ms-1 no-print"
              onClick={handleExportExcel}
              disabled={isExporting}
              title="Export Excel"
            >
              <FontAwesomeIcon icon={faFileExcel} />{" "}
              {isExporting ? "Exporting..." : "Export Excel"}
            </button>
          </h1>

          <div className="print-header">
            <h2>Rincian Iuran RT</h2>
            <p>
              Periode:{" "}
              {FormatDate(payAt).split(" ")[1] +
                " " +
                FormatDate(payAt).split(" ")[2]}
            </p>
          </div>

          <div className="my-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row d-flex align-items-end">
                <div className="col-3">
                  <label for="keyword" className="form-label">
                    Cari
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="keyword"
                    placeholder="Nama atau Alamat"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <label for="sort_by" className="form-label">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort_by"
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setOrder(1);
                    }}
                  >
                    <option value="">Urutkan</option>
                    <option value="pay_at">Pembayaran Terbaru</option>
                    <option value="created_at">Pencatatan Terbaru</option>
                    <option value="warga.name">Nama Warga</option>
                    <option value="warga.address">Alamat Warga</option>
                  </select>
                </div>
                <div className="col-3">
                  <label for="payAtDate" className="form-label">
                    Periode
                  </label>
                  <input
                    type="date"
                    id="payAtDate"
                    className="form-control"
                    onChange={(e) => setPayAt(e.target.value)}
                  />
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
        </div>

        <div className="container">
          <h5>
            {FormatDate(payAt).split(" ")[1] +
              " " +
              FormatDate(payAt).split(" ")[2]}
          </h5>
        </div>

        <div className="container d-flex justify-content-center align-items-center flex-column">
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    #
                  </th>
                  <th scope="col">Blok</th>
                  <th scope="col">Nama</th>
                  <th scope="col">Alamat</th>
                  <th scope="col" className="text-center">
                    Tanggal Bayar
                  </th>
                  <th scope="col" className="text-end">
                    Jumlah
                  </th>
                  <th scope="col" className="text-center">
                    Periode Bulan
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
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataIuran.map((iuran, index) => {
                  const currentIndex = getStartingIndex() + index;
                  return (
                    <>
                      <tr>
                        <th scope="row" className="text-center">
                          {currentIndex}
                        </th>
                        <td>{iuran?.warga?.address?.split("-")[0] || ""}</td>
                        <td>{iuran?.warga?.name}</td>
                        <td>{iuran?.warga?.address}</td>
                        <td className="text-center">
                          {FormatDate(iuran?.pay_at).split(" ")[0]}
                        </td>
                        <td className="text-end fw-bold">
                          {FormatCurrency(iuran?.nominal)}
                        </td>
                        <td className="text-center">
                          {iuran?.number_of_period}
                        </td>
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
                        <td className="text-center">
                          <div class="btn-group">
                            <button
                              class="btn btn-primary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Menu
                            </button>
                            <ul
                              class="dropdown-menu dropdown-menu-end"
                              style={{ minWidth: 200 }}
                            >
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  to={`/iuran/create/warga/${iuran?.warga?._id}`}
                                  state={{
                                    from: location.pathname + location.search,
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPlus} /> Buat
                                  Pembayaran
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  to={`/iuran/edit/${iuran?._id}`}
                                >
                                  <FontAwesomeIcon icon={faPen} /> Edit
                                  Pembayaran
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="text-decoration-none text-black p-2"
                                  onClick={() => {
                                    handleDelete(iuran?._id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Hapus
                                  Pembayaran
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>

            <TableFooter
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              itemsPerPage={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>

        <div
          className="container d-flex p-3 mx-auto flex-column"
          // style={{ height: "100vh" }}
        >
          <Footer />
        </div>
      </>
    );
  }
}

export default RincianIuran;

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import PrintButton from "../../components/PrintButton"
import { getPaymentByMethod } from "../../services/IuranService"
import { getExpenseByTransactionAt } from "../../services/ExpenseService"

function ReportCash() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const todayDate = new Date()
  const firstDate = new Date(
    todayDate.getFullYear(),
    todayDate.getUTCMonth(),
    15
  )
  const payAtDate = firstDate.toISOString().split("T")[0]
  const [payAt, setPayAt] = useState(payAtDate)
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const [total, setTotal] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [dataIuran, setDataIuran] = useState([])
  const [dataExpense, setDataExpense] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }

    handleSearch()
  }, [state])

  const handleSearch = () => {
    setIsLoading(true)
    const payload = { pay_at: payAt, payment_method: paymentMethod }
    getPaymentByMethod(payload)
      .then((response) => {
        setTotal(response?.data?.totalNominal)
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
    getExpenseByTransactionAt(payAt)
      .then((response) => {
        setTotalExpense(response?.data?.totalNominal)
        setDataExpense(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <div className="mb-3 no-print">
          <Link className="btn btn-primary me-1" to="/iuran">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <PrintButton label="Cetak Laporan Cash" />
        </div>

        <div className="print-header">
          <h2>Laporan Penerimaan Cash</h2>
          <p>Periode: {FormatDate(payAt)}</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row d-flex align-items-end">
            <div className="col-3">
              <label for="start" className="form-label">
                Periode
              </label>
              <input
                type="date"
                className="form-control"
                id="start"
                onChange={(e) => {
                  setPayAt(e.target.value)
                }}
                required
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
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col">
            {total != 0 ? (
              <>
                <p className="my-3">
                  Periode {FormatDate(payAt)} <br /> Total Pemasukan ={" "}
                  {FormatCurrency(total)}
                </p>
              </>
            ) : (
              <></>
            )}

            <div className="container d-flex justify-content-center align-items-center flex-column">
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tanggal Input</th>
                      <th scope="col">Tanggal Bayar</th>
                      <th scope="col">Warga</th>
                      <th scope="col">Periode</th>
                      <th scope="col">Nominal</th>
                      <th scope="col">Metode Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataIuran.map((iuran, index) => {
                      return (
                        <>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{FormatDate(iuran?.created_at)}</td>
                            <td>{FormatDate(iuran?.pay_at)}</td>
                            <td>
                              {iuran?.warga?.address} | {iuran?.warga?.name}
                            </td>
                            <td>
                              {FormatDate(iuran?.period_start)} -{" "}
                              {FormatDate(iuran?.period_end)}
                            </td>
                            <td>{FormatCurrency(iuran?.nominal)}</td>
                            <td>{iuran?.payment_method?.toUpperCase()}</td>
                          </tr>
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col">
            {totalExpense != 0 ? (
              <>
                <br />
                <p className="my-3">
                  Total Pengeluaran = {FormatCurrency(totalExpense)}
                </p>
              </>
            ) : (
              <></>
            )}

            <div className="container d-flex justify-content-center align-items-center flex-column">
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tanggal Input</th>
                      <th scope="col">Tanggal Transaksi</th>
                      <th scope="col">Deskripsi</th>
                      <th scope="col">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataExpense.map((expense, index) => {
                      return (
                        <>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{FormatDate(expense?.created_at)}</td>
                            <td>{FormatDate(expense?.transaction_at)}</td>
                            <td>{expense?.description}</td>
                            <td>{FormatCurrency(expense?.nominal)}</td>
                          </tr>
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default ReportCash

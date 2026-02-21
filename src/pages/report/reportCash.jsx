import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faFileExcel } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import { exportToExcel } from "../../helpers/exportToExcel"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
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

  const combinedData = []
  dataIuran.forEach((iuran) => {
    combinedData.push({
      id: `iuran_${iuran._id}`,
      tanggal: iuran.pay_at,
      created_at: iuran.created_at,
      deskripsi: `Iuran Cash: ${iuran.warga?.address} | ${iuran.warga?.name} (${FormatDate(iuran.period_start)} - ${FormatDate(iuran.period_end)})`,
      debit: iuran.nominal || 0,
      credit: 0,
    })
  })

  dataExpense.forEach((expense) => {
    combinedData.push({
      id: `expense_${expense._id}`,
      tanggal: expense.transaction_at,
      created_at: expense.created_at,
      deskripsi: `Pengeluaran: ${expense.description}`,
      debit: 0,
      credit: expense.nominal || 0,
    })
  })

  combinedData.sort((a, b) => {
    const dateA = new Date(a.tanggal)
    const dateB = new Date(b.tanggal)
    if (dateA.getTime() === dateB.getTime()) {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    return dateA - dateB
  })

  let currentSaldo = 0
  combinedData.forEach((item) => {
    currentSaldo += item.debit - item.credit
    item.saldo = currentSaldo
  })

  const handleExportExcel = () => {
    const dataToExport = combinedData.map((item, index) => ({
      No: index + 1,
      Tanggal: FormatDate(item.tanggal),
      Deskripsi: item.deskripsi,
      "Pemasukan (Debit)": item.debit,
      "Pengeluaran (Kredit)": item.credit,
      Saldo: item.saldo,
    }))
    exportToExcel(dataToExport, `Laporan_Cash_${FormatDate(payAt).split(" ").join("_")}`)
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
          <button className="btn btn-success ms-1" onClick={handleExportExcel} title="Export Excel">
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>
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
          <div className="col-12">
            {(total != 0 || totalExpense != 0) && (
              <div className="d-flex justify-content-between my-3">
                <p>
                  Periode {FormatDate(payAt)}
                </p>
                <div className="text-end">
                  <p className="mb-0">Total Pemasukan: <span className="text-success fw-bold">{FormatCurrency(total)}</span></p>
                  <p className="mb-0">Total Pengeluaran: <span className="text-danger fw-bold">{FormatCurrency(totalExpense)}</span></p>
                </div>
              </div>
            )}

            <div className="container d-flex justify-content-center align-items-center flex-column px-0">
              <div className="w-100 table-responsive">
                <table className="table table-bordered table-striped mt-3">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="text-center">#</th>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Deskripsi</th>
                      <th scope="col" className="text-end">Pemasukan (Debit)</th>
                      <th scope="col" className="text-end">Pengeluaran (Kredit)</th>
                      <th scope="col" className="text-end">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">Tidak ada data transaksi.</td>
                      </tr>
                    ) : (
                      combinedData.map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row" className="text-center">{index + 1}</th>
                          <td>{FormatDate(item.tanggal)}</td>
                          <td>{item.deskripsi}</td>
                          <td className="text-end text-success">{item.debit > 0 ? FormatCurrency(item.debit) : "-"}</td>
                          <td className="text-end text-danger">{item.credit > 0 ? FormatCurrency(item.credit) : "-"}</td>
                          <td className="text-end fw-bold">{FormatCurrency(item.saldo)}</td>
                        </tr>
                      ))
                    )}
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

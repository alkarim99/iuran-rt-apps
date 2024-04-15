import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import FormatDate from "../../helpers/FormatDate"
import FormatCurrency from "../../helpers/FormatCurrency"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function TotalIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [start, setStart] = React.useState("")
  const [end, setEnd] = React.useState("")
  const [total, setTotal] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
  }, [state])

  const handleSearch = () => {
    setIsLoading(true)
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/payments/total?start=${start}&end=${end}`
      )
      .then((response) => {
        setTotal(response?.data?.total_income)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <div
        className="container d-flex p-3 mx-auto flex-column"
        style={{ height: "100vh" }}
      >
        <Navbar />
        <div className="mb-3">
          <Link className="btn btn-primary me-1" to="/iuran">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row d-flex align-items-end">
            <div className="col-3">
              <label for="start" className="form-label">
                Periode Mulai
              </label>
              <input
                type="date"
                className="form-control"
                id="start"
                onChange={(e) => {
                  setStart(e.target.value)
                  console.log(e.target.value)
                }}
                required
              />
            </div>
            <div className="col-3">
              <label for="end" className="form-label">
                Periode Akhir
              </label>
              <input
                type="date"
                className="form-control"
                id="end"
                onChange={(e) => {
                  setEnd(e.target.value)
                  console.log(e.target.value)
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
        {total != 0 ? (
          <>
            <p className="my-3">
              Periode {FormatDate(start)} s.d. {FormatDate(end)} <br /> Total
              Pendapatan = {FormatCurrency(total)}
            </p>
          </>
        ) : (
          <></>
        )}
        <Footer />
      </div>
    </>
  )
}

export default TotalIuran

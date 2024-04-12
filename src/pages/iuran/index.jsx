import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function IndexIuran() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataIuran, setDataIuran] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
  }, [state])

  const handleGet = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/payments`)
      .then((response) => {
        setDataIuran(response?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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
        setIsLoading(true)
        axios
          .delete(`${process.env.REACT_APP_BASE_URL}/payments/${id}`)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              handleGet()
            })
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ?? "Something wrong in our App!",
              icon: "error",
            })
          })
          .finally(() => {
            setIsLoading(false)
          })
      } else if (result.isDenied) {
        Swal.fire("Payment are not deleted", "", "info")
      }
    })
  }

  const formatDate = (inputDate) => {
    // Parse the input date string
    const date = new Date(inputDate)

    // Get day, month, and year
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "long" }) // Get month name
    const year = date.getFullYear()

    // Construct the formatted date string
    const formattedDate = `${day} ${month} ${year}`

    return formattedDate
  }

  const formatCurrency = (amount) => {
    // Convert the amount to string
    let formattedAmount = amount.toString()

    // Insert dots for thousands separator
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    // Prepend "Rp " to the formatted amount
    return "Rp " + formattedAmount
  }

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
    )
  } else {
    return (
      <>
        <div
          className="d-flex p-3 mx-auto flex-column"
          style={{ maxWidth: "60em", height: "100vh" }}
        >
          <Navbar />

          <h1>Data Iuran</h1>
          <div>
            <Link className="btn btn-primary" to="/iuran/create">
              Add Data
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tanggal</th>
                <th scope="col">Warga</th>
                <th scope="col">Periode</th>
                <th scope="col">Nominal</th>
                <th scope="col">Metode Pembayaran</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataIuran.map((iuran, index) => {
                return (
                  <>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{formatDate(iuran?.pay_at)}</td>
                      <td>{iuran?.warga_id}</td>
                      <td>
                        {formatDate(iuran?.period_start)} -{" "}
                        {formatDate(iuran?.period_end)}
                      </td>
                      <td>{formatCurrency(iuran?.nominal)}</td>
                      <td>{iuran?.payment_method?.toUpperCase()}</td>
                      <td>
                        <Link
                          className="btn btn-primary me-2"
                          to={`/iuran/edit/${iuran?._id}`}
                        >
                          Edit
                        </Link>
                        <Link
                          className="btn btn-primary mx-2"
                          onClick={() => {
                            handleDelete(iuran?._id)
                          }}
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>

          <Footer />
        </div>
      </>
    )
  }
}

export default IndexIuran

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function IndexWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataWarga, setDataWarga] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)
    if (!state.auth) {
      navigate("/sign-in")
    }
    handleGet()
  }, [state])

  const handleGet = () => {
    setIsLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/wargas`)
      .then((response) => {
        setDataWarga(response?.data?.data)
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
      title: "Do you want to delete this recipe?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setIsLoading(true)
        axios
          .delete(`${process.env.REACT_APP_BASE_URL}/wargas/${id}`)
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
        Swal.fire("Warga are not deleted", "", "info")
      }
    })
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
          style={{ maxWidth: "42em", height: "100vh" }}
        >
          <Navbar />

          <h1>Data Warga</h1>
          <div>
            <Link className="btn btn-primary" to="/warga/create">
              Add Data
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataWarga.map((warga, index) => {
                return (
                  <>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{warga?.name}</td>
                      <td>{warga?.address}</td>
                      <td>
                        <Link
                          className="btn btn-primary me-2"
                          to={`/warga/edit/${warga?._id}`}
                        >
                          Edit
                        </Link>
                        <Link
                          className="btn btn-primary mx-2"
                          onClick={() => {
                            handleDelete(warga?._id)
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

export default IndexWarga

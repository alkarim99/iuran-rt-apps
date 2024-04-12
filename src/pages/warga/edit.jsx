import React from "react"
import { useLocation } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function EditWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [name, setName] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/wargas/${id}`)
      .then((response) => {
        setName(response?.data?.data?.name)
        setAddress(response?.data?.data?.address)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [state])

  const handleEdit = () => {
    setIsLoading(true)
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/wargas`, {
        id: id,
        name: name,
        address: address,
      })
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/warga")
        })
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
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

          <h1>Edit Data Warga</h1>
          <div>
            <Link className="btn btn-primary" to="/warga">
              Back
            </Link>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label for="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label for="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                defaultValue={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary py-2"
              type="submit"
              onClick={handleEdit}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>

          <Footer />
        </div>
      </>
    )
  }
}

export default EditWarga

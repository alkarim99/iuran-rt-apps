import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function CreateWarga() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [name, setName] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
  }, [state])

  const handleCreate = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/wargas`, {
        name: name,
        address: address,
      })
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/warga")
        })
      })
      .catch((error) => {
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

  return (
    <>
      <div
        className="d-flex p-3 mx-auto flex-column"
        style={{ maxWidth: "42em", height: "100vh" }}
      >
        <Navbar />

        <h1>Add Data Warga</h1>
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
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary py-2"
            type="submit"
            onClick={handleCreate}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>

        <Footer />
      </div>
    </>
  )
}

export default CreateWarga

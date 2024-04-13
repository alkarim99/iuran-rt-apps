import React from "react"
import { useLocation } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function EditUser() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/users/${id}`)
      .then((response) => {
        setName(response?.data?.data?.name)
        setEmail(response?.data?.data?.email)
        setRole(response?.data?.data?.role)
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
    const payload = {
      id: id,
      name: name,
      email: email,
      role: role,
    }
    if (password != "") {
      payload.password = password
    }
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/users`, payload)
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/user")
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
          className="container d-flex p-3 mx-auto flex-column"
          style={{ height: "100vh" }}
        >
          <Navbar />

          <div className="mb-3">
            <Link className="btn btn-primary" to="/user">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          <h1>Edit Data User</h1>

          <div className="row">
            <div className="col-6">
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
                    defaultValue={name}
                  />
                </div>
                <div className="mb-3">
                  <label for="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    defaultValue={email}
                  />
                </div>
                <div className="mb-3">
                  <label for="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <small>Isi jika ingin mengubah password</small>
                </div>
                <div className="mb-3">
                  <label for="role" className="form-label">
                    Role
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option selected>Pilih Role User</option>
                    <option
                      value="admin"
                      selected={role == "admin" ? "selected" : ""}
                    >
                      Admin
                    </option>
                    <option
                      value="user"
                      selected={role == "user" ? "selected" : ""}
                    >
                      User
                    </option>
                  </select>
                </div>
                <button
                  className="btn btn-primary py-2"
                  type="submit"
                  onClick={handleEdit}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </form>
            </div>
          </div>

          <Footer />
        </div>
      </>
    )
  }
}

export default EditUser

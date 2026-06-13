import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { Link, useNavigate } from "react-router-dom"

import Swal from "sweetalert2"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { getUserByID, editUser } from "../../services/UserServices"

function EditUser() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)
  const location = useLocation()
  const id = location?.pathname?.split("/")[3]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    getUserByID(id)
      .then((response) => {
        setName(response?.name)
        setEmail(response?.email)
        setRole(response?.role)
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch user data.",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [state])

  const handleEdit = (e) => {
    e.preventDefault()
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
    editUser(payload)
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
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password || ""}
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
                  value={role || ""}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Pilih Role User
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button className="btn btn-primary py-2" type="submit">
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

export default EditUser

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"

function IndexUser() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataUser, setDataUser] = React.useState([])
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
      .get(`${process.env.REACT_APP_BASE_URL}/users`)
      .then((response) => {
        setDataUser(response?.data?.data)
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
          .delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`)
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
        Swal.fire("User are not deleted", "", "info")
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
          className="container d-flex p-3 mx-auto flex-column"
          style={{ height: "100vh" }}
        >
          <Navbar />

          <h1>
            Data User
            <Link className="btn btn-primary ms-1" to="/user/create">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </h1>

          <div className="row">
            <div className="col-6">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser.map((user, index) => {
                    return (
                      <>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{user?.name}</td>
                          <td>{user?.email}</td>
                          <td>{user?.role}</td>
                          <td>
                            <Link
                              className="btn btn-warning me-1"
                              to={`/user/edit/${user?._id}`}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </Link>
                            <Link
                              className="btn btn-danger mx-1"
                              onClick={() => {
                                handleDelete(user?._id)
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Link>
                          </td>
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Footer />
        </div>
      </>
    )
  }
}

export default IndexUser

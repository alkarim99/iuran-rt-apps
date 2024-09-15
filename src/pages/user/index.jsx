import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Swal from "sweetalert2"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { getAllUser, deleteUser } from "../../services/UserServices"

function IndexUser() {
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const [dataUser, setDataUser] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    setIsLoading(true)
    handleGetUser()
  }, [state])

  const handleGetUser = async () => {
    try {
      const data = await getAllUser()
      setDataUser(data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch user data.",
        icon: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this data?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        deleteUser(id)
          .then((response) => {
            Swal.fire({
              title: "Delete Success!",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              handleGetUser()
            })
          })
          .catch((error) => {
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
          {isLoading ? (
            <div className="col">
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-grow text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
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
                        <tr key={user?._id}>
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
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}

export default IndexUser

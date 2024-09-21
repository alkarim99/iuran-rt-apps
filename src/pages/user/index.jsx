import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useUsers } from "../../hooks/useUsers" // Import hook

function IndexUser() {
  const { dataUser, isLoading, handleDelete } = useUsers()

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
                  {dataUser.map((user, index) => (
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
                        <button
                          className="btn btn-danger mx-1"
                          onClick={() => handleDelete(user?._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
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

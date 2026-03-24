import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useUsers } from "../../hooks/useUsers"; // Import hook
import { useState, useEffect } from "react";

function IndexUser() {
  useEffect(() => {
    document.title = "Data Pengurus - Iuran RT";
  }, []);
  const { dataUser, isLoading, handleDelete } = useUsers();
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortOrder === 1) {
        setSortOrder(-1);
      } else {
        setSortField("");
        setSortOrder(1);
      }
    } else {
      setSortField(field);
      setSortOrder(1);
    }
  };

  const displayData = [...dataUser].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (aVal < bVal) return -1 * sortOrder;
    if (aVal > bVal) return 1 * sortOrder;
    return 0;
  });

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
                    <th
                      scope="col"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("name")}
                    >
                      Name{" "}
                      {sortField === "name" && (sortOrder === 1 ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("email")}
                    >
                      Email{" "}
                      {sortField === "email" && (sortOrder === 1 ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("role")}
                    >
                      Role{" "}
                      {sortField === "role" && (sortOrder === 1 ? "▲" : "▼")}
                    </th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((user, index) => (
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
  );
}

export default IndexUser;

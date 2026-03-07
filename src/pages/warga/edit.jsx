import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getWargaByID, updateWarga } from "../../services/WargaService";

function EditWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);
  const location = useLocation();
  const id = location?.pathname?.split("/")[3];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }
    setIsLoading(true);
    handleGet();
  }, [state]);

  const handleGet = () => {
    getWargaByID(id)
      .then((response) => {
        setName(response?.data?.data?.name);
        setAddress(response?.data?.data?.address);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      id: id,
      name: name,
      address: address,
    };
    updateWarga(payload)
      .then((response) => {
        Swal.fire({
          title: "Update Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/warga");
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
    );
  } else {
    return (
      <>
        <div
          className="container d-flex p-3 mx-auto flex-column"
          style={{ height: "100vh" }}
        >
          <Navbar />

          <div className="mb-3">
            <Link className="btn btn-primary" to="/warga">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          <h1>Edit Data Warga</h1>

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
                  <label for="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                  />
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
    );
  }
}

export default EditWarga;

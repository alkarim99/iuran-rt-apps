import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createWarga } from "../../services/WargaService";

function CreateWarga() {
  const navigate = useNavigate();
  const state = useSelector((reducer) => reducer.auth);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in");
    }
  }, [state]);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      name: name,
      address: address,
    };
    createWarga(payload)
      .then((response) => {
        Swal.fire({
          title: "Create Success!",
          text: response?.data?.message,
          icon: "success",
        }).then(() => {
          navigate("/warga");
        });
      })
      .catch((error) => {
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

        <h1>Add Data Warga</h1>

        <div className="row">
          <div className="col-6">
            <form onSubmit={handleCreate}>
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
                  required
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
                  required
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

export default CreateWarga;

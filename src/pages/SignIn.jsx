
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { addAuth } from "../store/reducers/auth";
import { login } from "../services/AuthService";
import Btn from "../components/ui/Btn";

import "../styles/SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((reducer) => reducer.auth);

  useEffect(() => {
    document.title = "Masuk - Iuran RT";
    if (state.auth) {
      navigate("/");
    }
  }, [state, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    login({
      email: email,
      password: password,
    })
      .then((response) => {
        const token = response?.data?.token;
        const userData = response?.data?.data;
        Swal.fire({
          title: "Login Berhasil!",
          text: "Mengalihkan ke aplikasi...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(addAuth({ auth: true, userData, token }));
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
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🏘</div>
          <h1 className="login-logo-title">Iuran RT</h1>
          <p className="login-logo-subtitle">RT 08 / RW 11</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              className="form-control-rt w-100"
              placeholder="name@example.com"
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="form-control-rt w-100"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Btn type="submit" className="w-100" size="lg" loading={isLoading}>
            Masuk ke Aplikasi
          </Btn>
        </form>

        <div className="login-footer">
          &copy; {new Date().getFullYear()} Iuran RT Apps
        </div>
      </div>
    </div>
  );
}

export default SignIn;

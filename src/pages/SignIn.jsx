import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

import "../styles/SignIn.css"

function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  React.useEffect(() => {
    if (state.auth) {
      navigate("/")
    }
  }, [state])

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        const token = response?.data?.token
        const userData = response?.data?.data
        Swal.fire({
          title: "Login Success!",
          text: "Login Success! Redirect to App...",
          icon: "success",
        }).then(() => {
          dispatch(addAuth({ auth: true, userData, token }))
        })
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <main
      className="form-signin w-100 d-flex p-3 mx-auto flex-column"
      style={{ height: "100vh" }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Link className="btn btn-primary" to="/">
          Back
        </Link>

        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label for="floatingPassword">Password</label>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          onClick={handleLogin}
        >
          {isLoading ? "Loading..." : "Sign in"}
        </button>
      </form>
    </main>
  )
}

export default SignIn

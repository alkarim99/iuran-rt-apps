import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Swal from "sweetalert2"
import { addAuth } from "../store/reducers/auth"
import { login } from "../services/AuthService"

import "../styles/SignIn.css"

function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  useEffect(() => {
    if (state.auth) {
      navigate("/")
    }
  }, [state])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    login({
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
      className="form-signin d-flex p-3 flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Link className="btn btn-primary mb-3" to="/">
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

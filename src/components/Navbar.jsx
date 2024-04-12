import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  return (
    <header className="mb-auto">
      <div>
        <h3 className="float-md-start mb-0">Iuran RT Apps</h3>
        <nav className="nav nav-masthead justify-content-center float-md-end">
          <Link
            className="nav-link fw-bold py-1 px-3"
            aria-current="page"
            to="/"
          >
            Home
          </Link>
          {state?.auth ? (
            <>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                onClick={() => {
                  localStorage.clear()
                  dispatch(addAuth({ auth: false, userData: {}, token: "" }))
                  navigate("/")
                }}
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                className="nav-link fw-bold py-1 px-0"
                aria-current="page"
                to="/sign-in"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

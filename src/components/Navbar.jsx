import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faHouse,
} from "@fortawesome/free-solid-svg-icons"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  return (
    <header className="mb-3 py-3">
      <div>
        <h3 className="float-md-start mb-0">Iuran RT Apps</h3>
        <nav className="nav nav-masthead justify-content-center float-md-end">
          {state?.auth ? (
            <>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                to="/user"
              >
                Data User
              </Link>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                to="/warga"
              >
                Data Warga
              </Link>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                to="/iuran"
              >
                Data Iuran
              </Link>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                to="/iuran/rincian"
              >
                Rincian Iuran
              </Link>
              <Link
                className="nav-link fw-bold py-1 px-3"
                aria-current="page"
                to="/"
              >
                <FontAwesomeIcon icon={faHouse} className="text-black" />
              </Link>
            </>
          ) : (
            <></>
          )}

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
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="text-black"
                />
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
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="text-black ms-2"
                />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

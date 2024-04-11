import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  const [text, setText] = React.useState(state?.auth)

  React.useEffect(() => {
    setText(state?.auth)
  }, [state])

  return (
    <div
      className="d-flex p-3 mx-auto flex-column"
      style={{ maxWidth: "42em", height: "100vh" }}
    >
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

      <main className="px-3 text-center">
        <h1>Catatan Iuran RT.</h1>
        <p className="lead">
          Aplikasi ini memudahkan pengelolaan iuran RT dengan fitur pencatatan
          iuran, manajemen anggota, dan laporan keuangan. Dengan aplikasi ini,
          pengurus RT dapat mengelola keuangan lebih efisien dan transparan,
          sementara anggota RT dapat membayar iuran dengan lebih nyaman dan
          terorganisir.
        </p>
      </main>

      <footer className="mt-auto text-black-50 text-end">
        <p>copyright @{new Date().getFullYear()}</p>
      </footer>
    </div>
    // <div>
    /* <div className="container">
        <h1>Hello World!</h1>
        <p>Status Login = {text}</p>
        <p>{state?.userData?.name}</p>
        
      </div> */
    // </div>
  )
}

export default Home

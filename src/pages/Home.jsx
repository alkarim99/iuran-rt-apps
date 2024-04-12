import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Home() {
  const state = useSelector((reducer) => reducer.auth)

  return (
    <div
      className="d-flex p-3 mx-auto flex-column"
      style={{ maxWidth: "42em", height: "100vh" }}
    >
      <Navbar />

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

      {state?.auth ? (
        <>
          <div className="text-center">
            <Link className="btn btn-primary mx-3" to="/user">
              Data User
            </Link>
            <Link className="btn btn-primary mx-3" to="/warga">
              Data Warga
            </Link>
            <Link className="btn btn-primary mx-3" to="/iuran">
              Data Iuran
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}

      <Footer />
    </div>
  )
}

export default Home

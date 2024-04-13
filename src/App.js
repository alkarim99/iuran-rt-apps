import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import store from "./store"
import { Provider, useSelector } from "react-redux"
import axios from "axios"
import React from "react"
import { store, persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react"

// import pages
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import IndexWarga from "./pages/warga"
import CreateWarga from "./pages/warga/create"
import EditWarga from "./pages/warga/edit"
import DetailWarga from "./pages/warga/detail"
import IndexIuran from "./pages/iuran"
import CreateIuran from "./pages/iuran/create"
import EditIuran from "./pages/iuran/edit"
import TotalIuran from "./pages/iuran/total"
import IndexUser from "./pages/user"
import CreateUser from "./pages/user/create"
import EditUser from "./pages/user/edit"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/warga",
    element: <IndexWarga />,
  },
  {
    path: "/warga/create",
    element: <CreateWarga />,
  },
  {
    path: "/warga/edit/:id",
    element: <EditWarga />,
  },
  {
    path: "/warga/:id",
    element: <DetailWarga />,
  },
  {
    path: "/iuran",
    element: <IndexIuran />,
  },
  {
    path: "/iuran/create",
    element: <CreateIuran />,
  },
  {
    path: "/iuran/edit/:id",
    element: <EditIuran />,
  },
  {
    path: "/iuran/total",
    element: <TotalIuran />,
  },
  {
    path: "/user",
    element: <IndexUser />,
  },
  {
    path: "/user/create",
    element: <CreateUser />,
  },
  {
    path: "/user/edit/:id",
    element: <EditUser />,
  },
])

function App() {
  return (
    <div>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RunApp RouterProvider={RouterProvider} router={router} />
        </Provider>
      </PersistGate>
    </div>
  )
}

function RunApp({ RouterProvider, router }) {
  const state = useSelector((reducer) => reducer.auth)
  React.useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        if (state?.token != "") {
          config.headers["Authorization"] = `Bearer ${state?.token}`
        }
        return config
      },
      (error) => {
        Promise.reject(error)
      }
    )
  }, [])
  return <RouterProvider router={router} />
}

export default App

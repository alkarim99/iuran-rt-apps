import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./styles/print.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { store, persistor } from "./store";

import PrivateRoute from "./components/PrivateRoute";

// import pages
import {
  Home,
  SignIn,
  IndexWarga,
  CreateWarga,
  EditWarga,
  DetailWarga,
  IndexIuran,
  RincianIuran,
  CreateIuran,
  EditIuran,
  TotalIuran,
  IndexUser,
  CreateUser,
  EditUser,
  IndexExpense,
  CreateExpense,
  EditExpense,
  ReportCash,
  ReportTransfer,
} from "./pages";

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
    element: (
      <PrivateRoute>
        <IndexWarga />
      </PrivateRoute>
    ),
  },
  {
    path: "/warga/create",
    element: (
      <PrivateRoute>
        <CreateWarga />
      </PrivateRoute>
    ),
  },
  {
    path: "/warga/edit/:id",
    element: (
      <PrivateRoute>
        <EditWarga />
      </PrivateRoute>
    ),
  },
  {
    path: "/warga/:id",
    element: (
      <PrivateRoute>
        <DetailWarga />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran",
    element: (
      <PrivateRoute>
        <IndexIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran/rincian",
    element: (
      <PrivateRoute>
        <RincianIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran/create/warga/:id",
    element: (
      <PrivateRoute>
        <CreateIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran/create",
    element: (
      <PrivateRoute>
        <CreateIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran/edit/:id",
    element: (
      <PrivateRoute>
        <EditIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/iuran/total",
    element: (
      <PrivateRoute>
        <TotalIuran />
      </PrivateRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <PrivateRoute>
        <IndexUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/user/create",
    element: (
      <PrivateRoute>
        <CreateUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/user/edit/:id",
    element: (
      <PrivateRoute>
        <EditUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/expense",
    element: (
      <PrivateRoute>
        <IndexExpense />
      </PrivateRoute>
    ),
  },
  {
    path: "/expense/create",
    element: (
      <PrivateRoute>
        <CreateExpense />
      </PrivateRoute>
    ),
  },
  {
    path: "/expense/edit/:id",
    element: (
      <PrivateRoute>
        <EditExpense />
      </PrivateRoute>
    ),
  },
  {
    path: "/report/cash",
    element: (
      <PrivateRoute>
        <ReportCash />
      </PrivateRoute>
    ),
  },
  {
    path: "/report/transfer",
    element: (
      <PrivateRoute>
        <ReportTransfer />
      </PrivateRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </div>
  );
}

// Register axios interceptor at module level — runs synchronously before any
// component renders, so the token is always attached even on page refresh.
// Reads directly from the Redux store (which is rehydrated by redux-persist).
axios.interceptors.request.use(
  (config) => {
    const state = store.getState()?.auth;
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default App;

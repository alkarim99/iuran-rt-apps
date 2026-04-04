import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./styles/print.css";
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { store, persistor } from "./store";
import { addAuth } from "./store/reducers/auth";

import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import AppShell from "./components/layout/AppShell";

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
  ReportPricingTier,
  CreateIncome,
  ReportNeraca,
  IndexOtherIncome,
  EditOtherIncome,
  OpeningBalance,
} from "./pages";
import Dashboard from "./pages/dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <AppShell />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "warga",
        element: <IndexWarga />,
      },
      {
        path: "warga/create",
        element: <CreateWarga />,
      },
      {
        path: "warga/edit/:id",
        element: <EditWarga />,
      },
      {
        path: "warga/:id",
        element: <DetailWarga />,
      },
      {
        path: "iuran",
        element: <IndexIuran />,
      },
      {
        path: "iuran/rincian",
        element: <RincianIuran />,
      },
      {
        path: "iuran/create",
        element: <CreateIncome />,
      },
      {
        path: "iuran/edit/:id",
        element: <EditIuran />,
      },
      {
        path: "iuran/total",
        element: <TotalIuran />,
      },
      {
        path: "income/create",
        element: <CreateIncome />,
      },
      {
        path: "income/create/warga/:id",
        element: <CreateIncome />,
      },
      {
        path: "other-income",
        element: <IndexOtherIncome />,
      },
      {
        path: "other-income/edit/:id",
        element: <EditOtherIncome />,
      },
      {
        path: "opening-balance",
        element: <OpeningBalance />,
      },
      {
        path: "user",
        element: <IndexUser />,
      },
      {
        path: "user/create",
        element: <CreateUser />,
      },
      {
        path: "user/edit/:id",
        element: <EditUser />,
      },
      {
        path: "expense",
        element: <IndexExpense />,
      },
      {
        path: "expense/create",
        element: <CreateExpense />,
      },
      {
        path: "expense/edit/:id",
        element: <EditExpense />,
      },
      {
        path: "report/cash",
        element: <ReportCash />,
      },
      {
        path: "report/transfer",
        element: <ReportTransfer />,
      },
      {
        path: "report/pricing-tier",
        element: <ReportPricingTier />,
      },
      {
        path: "report/neraca",
        element: <ReportNeraca />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ScrollToTop />
      </PersistGate>
    </Provider>
  );
}

// Register axios interceptor at module level
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      store.dispatch(addAuth({ auth: false, userData: {}, token: "" }));
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export default App;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { store, persistor } from "./store";

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
    path: "/iuran/rincian",
    element: <RincianIuran />,
  },
  {
    path: "/iuran/create/warga/:id",
    element: <CreateIuran />,
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
  {
    path: "/expense",
    element: <IndexExpense />,
  },
  {
    path: "/expense/create",
    element: <CreateExpense />,
  },
  {
    path: "/expense/edit/:id",
    element: <EditExpense />,
  },
  {
    path: "/report/cash",
    element: <ReportCash />,
  },
  {
    path: "/report/transfer",
    element: <ReportTransfer />,
  },
  {
    path: "/report/pricing-tier",
    element: <ReportPricingTier />,
  },
]);

function App() {
  return (
    <div>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RunApp router={router} />
        </Provider>
      </PersistGate>
    </div>
  );
}

function useAxiosAuth(state) {
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    return () => axios.interceptors.request.eject(requestInterceptor);
  }, [state]);
}

function RunApp({ router }) {
  const state = useSelector((reducer) => reducer.auth);
  useAxiosAuth(state);
  return <RouterProvider router={router} />;
}

export default App;

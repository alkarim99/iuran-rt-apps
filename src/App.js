import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { store, persistor } from "./store";
import { addAuth } from "./store/reducers/auth";

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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </div>
  );
}

// Register axios interceptors at module level so they run synchronously at import
// time — before any component renders. This guarantees the bearer token is
// attached even on a hard page refresh. Previously the request interceptor was
// registered inside a parent useEffect (RunApp), which runs AFTER child page
// effects: on refresh the first API call fired before the interceptor existed,
// so it went out without a token and got a 401. The token is read from the Redux
// store, which redux-persist rehydrates before PersistGate renders the app.
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
      store.dispatch(
        addAuth({ auth: false, userData: {}, token: "", recipes: {} }),
      );
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export default App;

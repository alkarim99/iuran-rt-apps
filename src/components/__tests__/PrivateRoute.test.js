import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/reducers/auth";
import PrivateRoute from "../PrivateRoute";

// Helper to render with custom auth state
const renderWithAuth = (authState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/sign-in" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe("PrivateRoute", () => {
  it("should render children when authenticated", () => {
    renderWithAuth({ auth: true, userData: {}, token: "abc" });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to sign-in when not authenticated", () => {
    renderWithAuth({ auth: false, userData: {}, token: "" });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});

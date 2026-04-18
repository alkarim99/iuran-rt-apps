import authReducer, { addAuth } from "../auth";

describe("Auth Reducer", () => {
  const initialState = {
    auth: false,
    userData: {},
    token: "",
  };

  it("should return initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle addAuth (login)", () => {
    const loginPayload = {
      auth: true,
      userData: { name: "Admin", email: "admin@test.com", role: "admin" },
      token: "jwt-token-123",
    };

    const state = authReducer(initialState, addAuth(loginPayload));

    expect(state.auth).toBe(true);
    expect(state.userData.name).toBe("Admin");
    expect(state.userData.email).toBe("admin@test.com");
    expect(state.token).toBe("jwt-token-123");
  });

  it("should handle addAuth (logout)", () => {
    const loggedInState = {
      auth: true,
      userData: { name: "Admin" },
      token: "jwt-token-123",
    };

    const logoutPayload = {
      auth: false,
      userData: {},
      token: "",
    };

    const state = authReducer(loggedInState, addAuth(logoutPayload));

    expect(state.auth).toBe(false);
    expect(state.userData).toEqual({});
    expect(state.token).toBe("");
  });

  it("should preserve state shape on update", () => {
    const state = authReducer(
      initialState,
      addAuth({
        auth: true,
        userData: { name: "Test" },
        token: "abc",
      }),
    );

    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("userData");
    expect(state).toHaveProperty("token");
    expect(Object.keys(state).length).toBe(3);
  });
});

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: false,
    userData: {},
    token: "",
  },
  reducers: {
    addAuth: (state, action) => {
      state.auth = action.payload.auth;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAuth } = authSlice.actions;

export default authSlice.reducer;

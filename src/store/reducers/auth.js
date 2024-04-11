import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    auth: false,
    userData: {},
    token: "",
    recipes: {},
  },
  reducers: {
    addAuth: (state, action) => {
      state.auth = action.payload.auth
      state.userData = action.payload.userData
      state.token = action.payload.token
      state.recipes = action.payload.recipes
    },
  },
})

// Action creators are generated for each case reducer function
export const { addAuth } = counterSlice.actions

export default counterSlice.reducer

import { combineReducers } from "redux"

import auth from "./auth"

// you can add your reducer in here
const rootReducer = combineReducers({
  auth,
})

export default rootReducer

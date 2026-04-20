import { thunk } from "redux-thunk"
import persistors from "./persistor"
import { persistReducer } from "redux-persist"
import { persistStore } from "redux-persist"
import { legacy_createStore as createStore, applyMiddleware } from "redux"
import rootReducer from "./reducers"

// const persistConfig = {
//   key: "root",
//   storage,
//   version: 1,
// }

// const reducers = combineReducers({
//   counterSlice,
//   authSlice,
// })

// const persistedReducer = persistReducer(persistConfig, reducers)

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// })

// combine reducers with persistors
const persistedReducer = persistReducer(persistors, rootReducer)

// export multiple
export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)

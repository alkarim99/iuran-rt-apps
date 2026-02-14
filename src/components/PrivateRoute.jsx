import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  const state = useSelector((reducer) => reducer.auth)

  if (!state?.auth) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}

export default PrivateRoute

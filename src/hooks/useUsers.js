import { useState, useEffect, useCallback } from "react"
import Swal from "sweetalert2"
import { getAllUser, deleteUser } from "../services/UserService"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export const useUsers = () => {
  const [dataUser, setDataUser] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const state = useSelector((reducer) => reducer.auth)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllUser()
      setDataUser(data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch user data.",
        icon: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!state.auth) {
      navigate("/sign-in")
    }
    fetchUsers()
  }, [state, fetchUsers, navigate])

  const handleDelete = useCallback(
    (id) => {
      Swal.fire({
        title: "Do you want to delete this data?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Don't Delete`,
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoading(true)
          deleteUser(id)
            .then((response) => {
              Swal.fire({
                title: "Delete Success!",
                text: response?.data?.message,
                icon: "success",
              }).then(() => {
                fetchUsers() // Refresh the user list after delete
              })
            })
            .catch((error) => {
              Swal.fire({
                title: "Error!",
                text:
                  error?.response?.data?.message ??
                  "Something wrong in our App!",
                icon: "error",
              })
            })
            .finally(() => {
              setIsLoading(false)
            })
        } else if (result.isDenied) {
          Swal.fire("User are not deleted", "", "info")
        }
      })
    },
    [fetchUsers]
  )

  return { dataUser, isLoading, handleDelete }
}

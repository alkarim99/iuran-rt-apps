import axios from "axios"
import { BASE_URL } from "./config"

export const getAllUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`)
    return response?.data?.data
  } catch (error) {
    console.error("Failed to fetch user data:", error)
    throw error
  }
}

export const getUserByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${id}`)
    return response?.data?.data
  } catch (error) {
    console.error("Failed to fetch user data:", error)
    throw error
  }
}

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, data)
    return response
  } catch (error) {
    console.error("Failed to create user data:", error)
    throw error
  }
}

export const editUser = async (data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users`, data)
    return response
  } catch (error) {
    console.error("Failed to edit user data:", error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${id}`)
    return response
  } catch (error) {
    console.error("Failed to delete user data:", error)
    throw error
  }
}

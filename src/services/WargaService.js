import axios from "axios"
import { BASE_URL } from "./config"

export const getAllWarga = async (currentPage) => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas?page=${currentPage}`)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

export const getWargaOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wargas/option`)
    return response
  } catch (error) {
    console.error("Failed to fetch warga data:", error)
    throw error
  }
}

import axios from "axios"
import { BASE_URL } from "./config"

export const getAllPayments = async (currentPage) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments?page=${currentPage}`)
    return response
  } catch (error) {
    console.error("Failed to fetch payments data:", error)
    throw error
  }
}

export const searchPayments = async (data) => {
  try {
    const { keyword, sortBy } = data
    let url = `${BASE_URL}/payments`
    if (keyword != "") {
      if (url.includes("?")) {
        url = url + `&keyword=${keyword}`
      } else {
        url = url + `?keyword=${keyword}`
      }
    }
    if (sortBy != "") {
      if (url.includes("?")) {
        url = url + `&sort_by=${sortBy}`
      } else {
        url = url + `?sort_by=${sortBy}`
      }
    }
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error("Failed to fetch payments data:", error)
    throw error
  }
}

export const deletePayment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/payments/${id}`)
    return response
  } catch (error) {
    console.error("Failed to delete payment data:", error)
    throw error
  }
}

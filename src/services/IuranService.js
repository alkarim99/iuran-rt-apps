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

export const getPaymentByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments/${id}`)
    return response
  } catch (error) {
    console.error("Failed to fetch payment data:", error)
    throw error
  }
}

export const getRincianPayment = async (data) => {
  try {
    const { currentPage, payAt } = data
    const response = await axios.get(
      `${BASE_URL}/payments/rincian?page=${currentPage}&pay_at=${payAt}`
    )
    return response
  } catch (error) {
    console.error("Failed to fetch payment data:", error)
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

export const searchPaymentsRincian = async (data) => {
  try {
    const { keyword, sortBy, payAt } = data
    console.log(keyword, sortBy, payAt)
    let url = `${BASE_URL}/payments/rincian`
    if (keyword) url += `?keyword=${keyword}`
    if (sortBy)
      url += url.includes("?") ? `&sort_by=${sortBy}` : `?sort_by=${sortBy}`
    if (payAt)
      url += url.includes("?") ? `&pay_at=${payAt}` : `?pay_at=${payAt}`

    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error("Failed to fetch payments data:", error)
    throw error
  }
}

export const getLatestPayment = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments/latest/${id}`)
    return response
  } catch (error) {
    console.error("Failed to fetch latest payment data:", error)
    throw error
  }
}

export const createPayment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/payments`, data)
    return response
  } catch (error) {
    console.error("Failed to create payment data:", error)
    throw error
  }
}

export const editPayment = async (data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/payments`, data)
    return response
  } catch (error) {
    console.error("Failed to edit payment data:", error)
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

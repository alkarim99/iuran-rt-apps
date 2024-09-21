import axios from "axios"
import { BASE_URL } from "./config"

export const getAllExpense = async (data) => {
  try {
    const { keyword, sortBy, page, limit } = data
    let url = `${BASE_URL}/expense`
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
    if (page != "") {
      if (url.includes("?")) {
        url = url + `&page=${page}`
      } else {
        url = url + `?page=${page}`
      }
    }
    if (limit != "") {
      if (url.includes("?")) {
        url = url + `&limit=${limit}`
      } else {
        url = url + `?limit=${limit}`
      }
    }
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error("Failed to fetch expenses data:", error)
    throw error
  }
}

export const getExpenseByID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/expense/${id}`)
    return response
  } catch (error) {
    console.error("Failed to fetch expense data:", error)
    throw error
  }
}

export const createExpense = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/expense`, data)
    return response
  } catch (error) {
    console.error("Failed to create expense data:", error)
    throw error
  }
}

export const editExpense = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}/expense`, data)
    return response
  } catch (error) {
    console.error("Failed to create expense data:", error)
    throw error
  }
}

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/expense/${id}`)
    return response
  } catch (error) {
    console.error("Failed to delete expense data:", error)
    throw error
  }
}
